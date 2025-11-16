
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { user, signIn, signInWithGoogle } = useAuth();
  const [searchParams] = useSearchParams();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const { isSubmitting } = form.formState;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signIn(data.email, data.password);
    } catch (error) {
      // Error is handled in the auth context
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  if (user) {
    const redirect = searchParams.get('redirect');
    const showForm = searchParams.get('showForm');
        
    if (redirect) {
      const redirectUrl = showForm ? `${redirect}?showForm=${showForm}` : redirect;
      return <Navigate to={redirectUrl} replace />;
    }
    
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
        Sign in to your account
      </h2>
      
      <div className="mt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      autoComplete="email" 
                      placeholder="you@example.com" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      autoComplete="current-password" 
                      placeholder="••••••••" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-4 flex flex-col items-center gap-4">
          <Button
            onClick={handleGoogleSignIn}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 max-w-md w-full justify-center"
            aria-label="Sign in with Google"
            title="Sign in with Google"
          >
            <img src="/google-logo.svg" alt="Google" className="h-6 w-6" />
            <span className="text-sm font-medium text-gray-900">Sign in with Google</span>
          </Button>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link 
            to={`/auth/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
            className="font-medium text-primary hover:text-accent"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
