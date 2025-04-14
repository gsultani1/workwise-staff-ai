
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DateSelector } from './time-off/DateSelector';
import { TimeOffBalance } from './time-off/TimeOffBalance';
import { useTimeOffSubmission } from '@/hooks/useTimeOffSubmission';

export const TimeOffRequestForm = () => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [requestType, setRequestType] = useState('vacation');
  const [reason, setReason] = useState('');
  
  const { submitting, employeeData, handleSubmit } = useTimeOffSubmission();
  
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await handleSubmit({
      startDate,
      endDate,
      requestType,
      reason
    });
    
    if (success) {
      // Reset form
      setStartDate(undefined);
      setEndDate(undefined);
      setRequestType('vacation');
      setReason('');
    }
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <DateSelector
          id="start-date"
          label="Start Date"
          date={startDate}
          onSelect={setStartDate}
        />
        <DateSelector
          id="end-date"
          label="End Date"
          date={endDate}
          onSelect={setEndDate}
          minDate={startDate}
        />
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
      
      <TimeOffBalance />
      
      <Button 
        type="submit" 
        className="w-full bg-workwise-blue hover:bg-workwise-blue/90"
        disabled={submitting || !employeeData}
      >
        {submitting ? 'Submitting...' : 'Submit Request'}
      </Button>
    </form>
  );
};
