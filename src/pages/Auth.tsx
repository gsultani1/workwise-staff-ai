
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import ForgotPasswordDialog from '@/components/auth/ForgotPasswordDialog';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const Auth = () => {
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkForPasswordReset = async () => {
      const hash = window.location.hash;
      
      if (hash && hash.includes('type=recovery')) {
        setIsResetMode(true);
        
        try {
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            const { data: { user } } = await supabase.auth.getUser(accessToken);
            if (user?.email) {
              setEmail(user.email);
            }
          }
        } catch (error) {
          console.error('Error parsing recovery token:', error);
        }
      }
    };
    
    checkForPasswordReset();
  }, []);

  if (isResetMode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <ResetPasswordForm email={email} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <SignInForm setForgotPasswordOpen={setForgotPasswordOpen} />
          </TabsContent>
          
          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </Card>

      <ForgotPasswordDialog 
        open={forgotPasswordOpen} 
        onOpenChange={setForgotPasswordOpen} 
      />
    </div>
  );
};

export default Auth;
