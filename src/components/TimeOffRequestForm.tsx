
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { TimeOffRequest } from './TimeOffRequests';

export const TimeOffRequestForm = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [requestType, setRequestType] = useState('vacation');
  const [reason, setReason] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast({
        title: 'Missing dates',
        description: 'Please select both start and end dates.',
        variant: 'destructive',
      });
      return;
    }
    
    // Format dates in MM/DD/YYYY format
    const formatDate = (date: Date) => {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    };
    
    // Create new request object
    const newRequest: TimeOffRequest = {
      id: Date.now(), // Use timestamp as a unique ID
      employee: 'John Doe', // Would come from user context in a real app
      type: requestType.charAt(0).toUpperCase() + requestType.slice(1),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      dateSubmitted: formatDate(new Date()),
      status: 'pending'
    };
    
    // Dispatch event to add the new request
    document.dispatchEvent(
      new CustomEvent('newTimeOffRequest', { detail: newRequest })
    );
    
    toast({
      title: 'Request Submitted',
      description: 'Your time off request has been submitted for approval.',
    });
    
    // Reset form
    setStartDate(undefined);
    setEndDate(undefined);
    setRequestType('vacation');
    setReason('');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className="pointer-events-auto p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                disabled={(date) => startDate ? date < startDate : false}
                className="pointer-events-auto p-3"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="request-type">Request Type</Label>
        <Select
          value={requestType}
          onValueChange={setRequestType}
        >
          <SelectTrigger id="request-type">
            <SelectValue placeholder="Select request type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vacation">Vacation</SelectItem>
            <SelectItem value="sick">Sick Leave</SelectItem>
            <SelectItem value="personal">Personal Leave</SelectItem>
            <SelectItem value="bereavement">Bereavement</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reason">Reason (Optional)</Label>
        <Textarea
          id="reason"
          placeholder="Briefly describe the reason for your request"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="min-h-[100px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Time Off Balance</Label>
        <div className="grid grid-cols-3 gap-4 rounded-lg border border-border p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-workwise-blue">12</div>
            <div className="text-xs text-muted-foreground">Vacation Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-workwise-blue">5</div>
            <div className="text-xs text-muted-foreground">Sick Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-workwise-blue">3</div>
            <div className="text-xs text-muted-foreground">Personal Days</div>
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-workwise-blue hover:bg-workwise-blue/90">
        Submit Request
      </Button>
    </form>
  );
};
