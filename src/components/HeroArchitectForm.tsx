import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar as CalendarIcon, Phone, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function HeroArchitectForm() {
    const [preferredDate, setPreferredDate] = useState<Date | undefined>();
    const [dateOpen, setDateOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [projectType, setProjectType] = useState('');
    const [location, setLocation] = useState('');
    const [budget, setBudget] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const validate = () => {
        if (!name.trim()) return 'Please enter your name';
        if (!phone.trim() || phone.replace(/\D/g, '').length < 10) return 'Please enter a valid 10-digit phone number';
        if (!projectType) return 'Please select a project type';
        return null;
    };

    const handleSubmit = async () => {
        const errorMsg = validate();
        if (errorMsg) {
            toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const payload: any = {
                client_name: name.trim(),
                phone: phone.trim(),
                project_type: projectType,
                preferred_date: preferredDate ? format(preferredDate, 'yyyy-MM-dd') : null,
                location: location.trim() || null,
                budget: budget ? Number(budget) : null,
                message: message.trim() || null,
                status: 'pending',
                created_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('ArchitectRequest').insert([payload]);

            if (error) throw error;

            toast({ title: 'Request sent', description: 'We will contact you soon.', });

            // reset
            setPreferredDate(undefined);
            setName('');
            setPhone('');
            setProjectType('');
            setLocation('');
            setBudget('');
            setMessage('');
        } catch (err: any) {
            console.error('Architect request error', err);
            toast({ title: 'Error', description: err?.message || 'Failed to submit request', variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="hero-form" className="hero-pattern from-primary/5 to-background py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-center">Book Architect/Designer Services</h1>

                <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-sky-900">Full name</label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-sky-900">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input className="pl-10" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="Phone number" />
                                </div>
                                {phone && phone.length < 10 && <p className="text-sm text-red-500">Enter 10 digits</p>}
                            </div>

                            <div>
                                <label className="text-sm font-medium text-sky-900">Project type</label>
                                <Select value={projectType} onValueChange={setProjectType}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select project type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="residential">Residential</SelectItem>
                                        <SelectItem value="commercial">Commercial</SelectItem>
                                        <SelectItem value="interior">Interior Design</SelectItem>
                                        <SelectItem value="landscape">Landscape</SelectItem>
                                        <SelectItem value="renovation">Renovation/Remodel</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-sky-900">Preferred date</label>
                                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={`w-full justify-start text-left font-normal bg-white ${!preferredDate ? 'text-muted-foreground' : ''}`} onClick={() => setDateOpen(!dateOpen)}>
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {preferredDate ? format(preferredDate, 'PPP') : <span>Select date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={preferredDate}
                                            onSelect={(d) => { setPreferredDate(d); setDateOpen(false); }}
                                            initialFocus
                                            className="p-3"
                                            disabled={(d) => d <= new Date(new Date().setHours(0, 0, 0, 0))}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-sky-900">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input className="pl-10" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter your address" />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-sky-900">Estimated budget (optional)</label>
                                <Input value={budget} onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Budget" />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-sky-900">Message (optional)</label>
                                <Textarea className="h-32" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Brief project details" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button onClick={handleSubmit} className="w-full animate-pulse-shadow" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Request Architect'}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroArchitectForm;
