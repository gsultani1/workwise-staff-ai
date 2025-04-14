
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ResetPasswordFormProps {
  email: string | null;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ email }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      window.location.hash = '';
      
      toast({
        title: "Password updated successfully",
        description: "You can now sign in with your new password",
      });
      
    } catch (error: any) {
      toast({
        title: "Failed to update password",
        description: error.message || "An error occurred while updating your password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handlePasswordReset}>
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Please enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {email && (
            <div className="text-sm text-muted-foreground">
              Resetting password for: <span className="font-medium">{email}</span>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input 
                id="new-password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input 
                id="confirm-password" 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-workwise-blue hover:bg-workwise-blue/90" disabled={loading}>
            {loading ? 'Updating Password...' : 'Update Password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ResetPasswordForm;
