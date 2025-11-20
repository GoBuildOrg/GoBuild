import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from "@/integrations/supabase/client";

const updateSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type UpdateValues = z.infer<typeof updateSchema>;

const UpdatePassword = () => {
  const form = useForm<UpdateValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: { password: "" },
  });

  const onSubmit = async (data: UpdateValues) => {
    const { error } = await supabase.auth.updateUser({ 
      password: data.password 
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated! Please log in again.");
      window.location.href = "/auth/login";
    }
  };

  return (
    <>
      <h2 className="text-center text-2xl font-bold">Set New Password</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit">
            Update Password
          </Button>
        </form>
      </Form>
    </>
  );
};

export default UpdatePassword;
