import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  client_name: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().regex(/^[0-9]{10}$/),
  company: z.string().optional(),
  projectType: z.string().min(2),
  location: z.string().min(2),
  budget: z.number().min(0),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function DeveloperForm() {
  const { toast } = useToast();
  const [showPopup, setShowPopup] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_name: "",
      email: "",
      phoneNumber: "",
      company: "",
      projectType: "",
      location: "",
      budget: undefined,
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const { error } = await supabase.from("Developer_Request").insert([
      {
        name: data.client_name,
        email: data.email,
        phone_number: data.phoneNumber,
        company: data.company || null,
        project_type: data.projectType,
        location: data.location,
        estimated_budget: data.budget,
        details: data.message || null,
        const_id: null,
      },
    ]);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Request Submitted", description: "Your inquiry has been recorded." });
    setShowPopup(true);
    form.reset();
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl border border-gray-100">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">
          Book Developer Consultation
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@mail.com" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
                        placeholder="9876543210"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Company name" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Residential, Commercial, Township..."
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="City or project site" className="h-11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Budget (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="h-11"
                      placeholder="5000000"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your requirements..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-11 text-lg bg-blue-600 hover:bg-blue-700">
              Submit Request
            </Button>
          </form>
        </Form>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-[90%] max-w-md text-center relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPopup(false)}
            >
              <XCircle size={24} />
            </button>
            <h3 className="text-2xl font-semibold text-green-600 mb-3">Request Submitted!</h3>
            <p className="text-gray-600 text-lg">
              Your inquiry has been received.
              <span className="block mt-2 text-blue-600 font-medium">We will contact you soon!</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
