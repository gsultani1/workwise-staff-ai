
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export const LaborAnalyticsChart = () => {
  const { isAdmin, isManager } = useAuth();
  const [loading, setLoading] = useState(true);
  const [laborData, setLaborData] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchLaborData = async () => {
      try {
        // Fetch department-wise employee count
        const { data: departmentData, error: departmentError } = await supabase
          .from('employees')
          .select('department')
          .not('department', 'is', null);
        
        if (departmentError) throw departmentError;
        
        // Aggregate department counts
        const departmentCounts = departmentData.reduce((acc, curr) => {
          acc[curr.department] = (acc[curr.department] || 0) + 1;
          return acc;
        }, {});
        
        // Generate monthly data with department-based variations
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const formattedData = months.map((month, index) => {
          const monthData: any = { month };
          
          Object.keys(departmentCounts).forEach(dept => {
            const baseCost = departmentCounts[dept] * 1000; // Base cost per employee
            const randomFactor = 0.9 + (Math.random() * 0.2); // Slight variation
            
            monthData[dept.toLowerCase().replace(' ', '_')] = 
              (isAdmin || isManager) 
                ? Math.round(baseCost * randomFactor)
                : 'Restricted';
          });
          
          return monthData;
        });
        
        setLaborData(formattedData);
      } catch (error) {
        console.error('Error fetching labor data:', error);
        setLaborData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLaborData();
  }, [isAdmin, isManager]);
  
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
        data={laborData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value) => 
            (isAdmin || isManager) 
              ? (value === 'Restricted' ? value : `$${value}`) 
              : 'Restricted'
          } 
        />
        <Legend />
        {Object.keys(laborData[0] || {})
          .filter(key => key !== 'month')
          .map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              name={key.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')} 
              stackId="a" 
              fill={`hsl(${210 + (index * 30)}, 70%, 50%)`} 
            />
          ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
