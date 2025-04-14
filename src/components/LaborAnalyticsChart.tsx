
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export const LaborAnalyticsChart = () => {
  const { isAdmin, isManager } = useAuth();
  const [loading, setLoading] = useState(true);
  const [laborData, setLaborData] = useState([]);
  
  useEffect(() => {
    const fetchLaborData = async () => {
      try {
        // In a real application, you would query from a labor_costs or similar table
        // For this demo, we'll simulate with existing employees table to get department data
        const { data, error } = await supabase
          .from('employees')
          .select('department, job_position')
          .order('department');
        
        if (error) throw error;
        
        // Transform employee data into labor cost format
        // In a real scenario, this would come from actual labor cost records
        const departments = {};
        data.forEach(employee => {
          if (!departments[employee.department]) {
            departments[employee.department] = 0;
          }
          departments[employee.department]++;
        });
        
        // Generate labor cost data for 6 months (using department data as base multiplier)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const formattedData = months.map((month, index) => {
          const monthData = { month };
          // Generate simulated labor costs based on department employee counts
          Object.keys(departments).forEach(dept => {
            const baseCost = departments[dept] * 1000; // Simulate: each employee costs $1000 base
            const randomFactor = 0.9 + (Math.random() * 0.2); // Random fluctuation
            monthData[dept.toLowerCase().replace(' ', '_')] = Math.round(baseCost * randomFactor);
          });
          return monthData;
        });
        
        setLaborData(formattedData);
      } catch (error) {
        console.error('Error fetching labor data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLaborData();
  }, []);
  
  // Limited data for employees - without financial information
  const limitedData = laborData.map(item => {
    const restrictedItem = { month: item.month };
    Object.keys(item).forEach(key => {
      if (key !== 'month') {
        restrictedItem[key] = 'Restricted';
      }
    });
    return restrictedItem;
  });

  // Use appropriate data based on role
  const data = (isAdmin || isManager) ? laborData : limitedData;

  // For employee view, use a different formatter that doesn't show dollar values
  const employeeTooltipFormatter = (value: any) => {
    return value === 'Restricted' ? 'Restricted' : `$${value}`;
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(isAdmin || isManager) ? 
            ((value) => `$${value}`) : 
            employeeTooltipFormatter} 
        />
        <Legend />
        {Object.keys(data[0] || {}).filter(key => key !== 'month').map((key, index) => (
          <Bar 
            key={key} 
            dataKey={key} 
            name={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
            stackId="a" 
            fill={`hsl(${210 + (index * 30)}, 70%, 50%)`} 
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
