
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';

export const LaborAnalyticsChart = () => {
  const { isAdmin, isManager } = useAuth();
  
  // Sample data - full financial data for managers and admins
  const fullData = [
    { month: 'Jan', sales: 15000, cashiers: 3800, sales_associates: 4200, managers: 6000, customer_service: 2400 },
    { month: 'Feb', sales: 16200, cashiers: 3900, sales_associates: 4400, managers: 6000, customer_service: 2500 },
    { month: 'Mar', sales: 17500, cashiers: 4200, sales_associates: 4600, managers: 6000, customer_service: 2700 },
    { month: 'Apr', sales: 18420, cashiers: 4500, sales_associates: 4700, managers: 6000, customer_service: 3220 },
    { month: 'May', sales: 17800, cashiers: 4300, sales_associates: 4500, managers: 6000, customer_service: 3000 },
    { month: 'Jun', sales: 19000, cashiers: 4600, sales_associates: 4800, managers: 6000, customer_service: 3600 },
  ];

  // Limited data for employees - without financial information
  const limitedData = fullData.map(item => ({
    month: item.month,
    cashiers: 'Restricted',
    sales_associates: 'Restricted',
    managers: 'Restricted',
    customer_service: 'Restricted'
  }));

  // Use appropriate data based on role
  const data = (isAdmin || isManager) ? fullData : limitedData;

  // For employee view, use a different formatter that doesn't show dollar values
  const employeeTooltipFormatter = (value: any) => {
    return value === 'Restricted' ? 'Restricted' : `$${value}`;
  };

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
        <Bar dataKey="cashiers" name="Cashiers" stackId="a" fill="#4B9CD3" />
        <Bar dataKey="sales_associates" name="Sales Associates" stackId="a" fill="#36A2EB" />
        <Bar dataKey="managers" name="Managers" stackId="a" fill="#4E79A7" />
        <Bar dataKey="customer_service" name="Customer Service" stackId="a" fill="#83BFFF" />
      </BarChart>
    </ResponsiveContainer>
  );
};
