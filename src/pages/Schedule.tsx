import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PlusCircle, AlertCircle } from 'lucide-react';
import { ScheduleCalendar } from '@/components/ScheduleCalendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShiftForm, ShiftFormValues } from '@/components/ShiftForm';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddShiftOpen, setIsAddShiftOpen] = useState(false);
  const { isAdmin, isManager } = useAuth();
  
  const hasManagementPrivileges = isAdmin || isManager;
  
  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  
  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  
  const today = () => {
    setCurrentDate(new Date());
  };
  
  const getWeekRange = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    const startMonth = start.toLocaleString('default', { month: 'short' });
    const endMonth = end.toLocaleString('default', { month: 'short' });
    
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = start.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    }
    
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  };

  const handleAddShift = (data: ShiftFormValues) => {
    const employee = employees.find(emp => emp.id === data.employeeId);
    if (!employee) return;

    data.shifts.forEach(shift => {
      const newShift = {
        id: Date.now() + Math.random(),
        employee: `${employee.firstName} ${employee.lastName}`,
        role: employee.jobPosition,
        day: shift.day,
        startTime: formatTimeDisplay(shift.startTime),
        endTime: data.type === 'time-off' ? '' : formatTimeDisplay(shift.endTime),
        type: data.type
      };

      document.dispatchEvent(new CustomEvent('addShift', { detail: newShift }));
    });

    setIsAddShiftOpen(false);
    
    toast({
      title: "Shifts added",
      description: `Added ${data.shifts.length} ${data.type}(s) for ${employee.firstName} ${employee.lastName}.`,
    });
  };

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Schedule</h1>
          <p className="text-muted-foreground">Manage and organize your team's weekly schedule.</p>
        </div>
        {hasManagementPrivileges ? (
          <Button className="bg-workwise-blue hover:bg-workwise-blue/90" onClick={() => setIsAddShiftOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Shift
          </Button>
        ) : null}
      </div>
      
      {!hasManagementPrivileges && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Employee View</AlertTitle>
          <AlertDescription>
            As an employee, you can view the schedule but cannot make changes.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center justify-between bg-card p-4 rounded-lg border border-border">
        <Button variant="outline" size="icon" onClick={prevWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={today}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today
          </Button>
          <h2 className="text-lg font-semibold">{getWeekRange()}</h2>
        </div>
        
        <Button variant="outline" size="icon" onClick={nextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <ScheduleCalendar currentDate={currentDate} readOnly={!hasManagementPrivileges} />

      {hasManagementPrivileges && (
        <Dialog open={isAddShiftOpen} onOpenChange={setIsAddShiftOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Shift</DialogTitle>
            </DialogHeader>
            <ShiftForm 
              onSubmit={handleAddShift} 
              onCancel={() => setIsAddShiftOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Schedule;
