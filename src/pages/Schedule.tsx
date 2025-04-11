
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { ScheduleCalendar } from '@/components/ScheduleCalendar';

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
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
  
  // Format the current week range for display
  const getWeekRange = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay()); // Go to the first day of week (Sunday)
    
    const end = new Date(start);
    end.setDate(end.getDate() + 6); // Go to the last day of week (Saturday)
    
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Staff Schedule</h1>
          <p className="text-muted-foreground">Manage and organize your team's weekly schedule.</p>
        </div>
        <Button className="bg-workwise-blue hover:bg-workwise-blue/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Shift
        </Button>
      </div>
      
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
      
      <ScheduleCalendar currentDate={currentDate} />
    </div>
  );
};

export default Schedule;
