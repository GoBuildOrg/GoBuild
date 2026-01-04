
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";



const formSchema = z.object({
  Name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  Age: z.number().min(18, { message: "You must be at least 18 years old." }).max(100),
  Experience: z.number().min(0, { message: "Experience must be 0 or more years." }),
  MobileNo: z.number().min(1000000000, { message: "Please enter a valid mobile number." }),
  Area: z.string().min(2, { message: "Area must be at least 2 characters." }),
  Skill: z.string().min(2, { message: "Skill must be at least 2 characters." }),
  Description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function ApplyAsProfessionalForm() {
  const { toast } = useToast();
  const [baseLat, setBaseLat] = React.useState<number | null>(null);
  const [baseLng, setBaseLng] = React.useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      Age: undefined,
      Experience: undefined,
      MobileNo: undefined,
      Area: "",
      Skill: "",
      Description: "",
    },
  });

  const onSubmit = async (data: FormValues) => {

    if (!baseLat || !baseLng) {
      toast({
        title: "Location required",
        description: "Please click 'Use Current Location'",
        variant: "destructive",
      });
      return;
    }


    try {
      // Make sure MobileNo is present before submitting
      if (!data.MobileNo) {
        toast({
          title: "Error",
          description: "Mobile number is required",
          variant: "destructive",
        });
        return;
      }

      // Insert a single object, not an array
      const { error } = await supabase
        .from("GoBuild")
        .insert({
          ...data,
          base_lat: baseLat,
          base_lng: baseLng,
        });

      toast({
        title: "Application Submitted",
        description: "Thank you for applying to be a professional on GoBuild!",
      });

      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation not supported",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setBaseLat(pos.coords.latitude);
        setBaseLng(pos.coords.longitude);
      },
      (err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true }
    );
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        <FormField
          control={form.control}
          name="Name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="Age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="25"
                    {...field}
                    onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="Experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="5"
                    {...field}
                    onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="MobileNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1234567890"
                  {...field}
                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
{/* Area / Location */}
{/* Area / Location */}
<div className="space-y-2">
  <label className="text-sm font-medium text-black">
    Area / Location
  </label>

  <div className="flex items-center gap-3">
    {/* ✅ Blinking Pin */}
    <span
      className="relative flex items-center justify-center w-10 h-10 rounded-full 
      bg-gradient-to-tr from-emerald-400 to-sky-500 shadow-md"
    >
      <MapPin className="w-4 h-4 text-white z-10" />
      <span
        className="absolute inline-flex w-10 h-10 rounded-full 
        bg-emerald-300 opacity-30 animate-ping"
      />
    </span>

    {/* Current Location Button */}
    <Button
      type="button"
      onClick={handleUseCurrentLocation}
      variant="outline"
      className="h-10 px-4 rounded-lg text-sm"
    >
      Current location
    </Button>

    {/* Enter Location Input */}
    <FormField
      control={form.control}
      name="Area"
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <Input
              placeholder="Enter location"
              className="h-10 rounded-lg"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>

  {baseLat && baseLng && (
    <p className="text-xs text-green-600">
      Location saved ✔
    </p>
  )}
</div>




        <FormField
          control={form.control}
          name="Skill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Skill</FormLabel>
              <FormControl>
                <Input placeholder="Plumbing, Electrical, Carpentry" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="Description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full animate-pulse-shadow">Submit</Button>
      </form>
    </Form>



  );
}
