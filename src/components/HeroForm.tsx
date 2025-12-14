import React, { useState, useEffect } from 'react'; // 👈 useEffect is now imported
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { MapPin, Calendar as CalendarIcon, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserLocationMap from '@/components/UserLocationMap';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

const HeroForm: React.FC = () => {
    const [startDate, setStartDate] = useState<Date>();
    const [location, setLocation] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState(false); 
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [serviceType, setServiceType] = useState<string>('');
    const [referralCode, setReferralCode] = useState<string>('');
    const [hdfu, setHdfu] = useState<string>('');
    const [mapCenter, setMapCenter] = useState({ lat: 32.7266, lng: 74.8570 });
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const { toast } = useToast();
    const [dateOpen, setDateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const HERO_FORM_STORAGE_KEY = "hero_form_data";

    // ---  START SCROLL LOGIC IMPLEMENTATION (The Fix)  ---
    useEffect(() => {
        // 1. Get the hash/fragment from the URL (e.g., '#hero-form' -> 'hero-form')
        const hash = window.location.hash.substring(1); 
        // 2. Check if the hash matches the form's ID
        if (hash === 'hero-form') { 
            // 3. Add a small delay (100ms) to ensure the DOM is fully rendered before scrolling
            const timer = setTimeout(() => {
                const targetElement = document.getElementById('hero-form');
                if (targetElement) {
                    // 4. Manually trigger the scroll
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'      
                    }); 
                    // Optional: Clean up the URL hash after scrolling
                    // window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
                }
            }, 100); 

            // Cleanup function runs when component unmounts
            return () => clearTimeout(timer); 
        }
    }, []); // Run only once after initial render
    // ---  END SCROLL LOGIC IMPLEMENTATION  ---
    useEffect(() => {
    const savedData = localStorage.getItem(HERO_FORM_STORAGE_KEY);

    if (savedData) {
        const parsed = JSON.parse(savedData);

        setStartDate(parsed.startDate ? new Date(parsed.startDate) : undefined);
        setLocation(parsed.location || "");
        setPhoneNumber(parsed.phoneNumber || "");
        setServiceType(parsed.serviceType || "");
        setReferralCode(parsed.referralCode || "");
        setHdfu(parsed.hdfu || "");
        setMapCenter(parsed.mapCenter || { lat: 32.7266, lng: 74.8570 });
    }
}, []);
    const locationList = [
        'Katra, Jammu',
        'Janipur, Jammu',
        'Satwari Chowk, Jammu',
        'Gandhinagar, Jammu',
        'Gangyal Industrial Area, Jammu',
        'Bahu Plaza, Jammu',
        'Residency Road, Jammu',
        'Bari Brahmana, Jammu',
        'Sainik Colony, Jammu',
        'Trikuta Nagar, jammu',
        'Bhagwati Nagar, jammu',
        'Shastri Nagar, jammu',
        'Rehari, jammu',
        'Talab Tillo, jammu',
        'Muthi, jammu',
        'Channi Himmat, jammu',
    ];

    const locationCoords: any = {
        'katra, jammu': { lat: 32.9917, lng: 74.9319 },
        'janipur, jammu': { lat: 32.7496, lng: 74.8373 },
        'satwari chowk, jammu': { lat: 32.6923199, lng: 74.8462223 },
        'gandhinagar, jammu': { lat: 32.7043905, lng: 74.8518208 },
        'gangyal industrial area, jammu': { lat: 32.6722807, lng: 74.866613 },
        'bahu plaza, jammu': { lat: 32.7038042, lng: 74.8698721 },
        'residency road, jammu': { lat: 32.7293127, lng: 74.8654757 },
        'bari brahmana, jammu': { lat: 32.636539, lng: 74.9038354 },
        'sainik colony, jammu': { lat: 32.6738936, lng: 74.8723597 },
        'trikuta nagar, jammu': { lat: 32.6927306, lng: 74.8565729 },
        'bhagwati nagar, jammu': { lat: 32.7277661, lng: 74.826981 },
        'shastri nagar, jammu': { lat: 32.6931782, lng: 74.8514339 },
        'rehari, jammu': { lat: 32.7478515, lng: 74.8463835 },
        'talab tillo, jammu': { lat: 32.724354, lng: 74.8406902 },
        'muthi, jammu': { lat: 32.7585189, lng: 74.8114887 },
        'channi himmat, jammu': { lat: 32.6934058, lng: 74.873381 },
    };

    const handleLocationSelect = (value: string) => {
        setLocation(value);
        setShowSuggestions(false);

        const key = value.toLowerCase();
        if (locationCoords[key]) {
            setMapCenter(locationCoords[key]);
        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast({ title: 'Error', description: 'Geolocation is not supported by your browser', variant: 'destructive' });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setMapCenter({ lat: latitude, lng: longitude });
                setLocation(`lat:${latitude.toFixed(5)} , lon:${longitude.toFixed(5)}`);
                setShowSuggestions(false);
            },
            (err) => {
                toast({ title: 'Error', description: err.message || 'Unable to retrieve your location', variant: 'destructive' });
            },
            { enableHighAccuracy: true }
        );
    };


    const filteredLocations = locationList.filter((loc) =>
        loc.toLowerCase().includes(location.toLowerCase())
    );

    const handleSubmit = async () => {
        if (!startDate || !location || !phoneNumber || !serviceType) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        // ---  AUTHENTICATION CHECK (Redirect part)  ---
        if (!user) {
    // SAVE FORM DATA
    const formData = {
        startDate,
        location,
        phoneNumber,
        serviceType,
        referralCode,
        hdfu,
        mapCenter,
    };

    localStorage.setItem(
        HERO_FORM_STORAGE_KEY,
        JSON.stringify(formData)
    );

    toast({
        title: "Login Required",
        description: "Please log in to submit a service request.",
    });

    const loc = encodeURIComponent("/#hero-form");
    window.location.href = `/auth/login?redirect=${loc}`;
    return;
}

        // ------------------------------------

        // Prevent multiple submissions
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('User Request')
                .insert({
                    Name: 'User', 
                    DateOfService: format(startDate, 'yyyy-MM-dd'),
                    Location: location,
                    Phone: phoneNumber,
                    ServiceType: serviceType,
                    hdfu: hdfu,
                    ReferalCode: referralCode?.trim() || null,
                });

            if (error) {
                toast({ title: 'Error', description: error.message, variant: 'destructive' });
            } else {
                localStorage.removeItem(HERO_FORM_STORAGE_KEY);
                setShowSuccessDialog(true);
            }
            
        } catch (error: any) {
             toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        //The element that needs scrolling MUST have this ID 
        <section id="hero-form" className="hero-pattern from-primary/5 to-background py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold mb-8 text-center">Find Professional Services</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* FORM */}
                    <div className="bg-white p-8 rounded-2xl shadow-2xl">
                        <h2 className="text-2xl font-semibold mb-6 text-primary">Book a Service</h2>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-sky-900">Start Date</label>
                                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                onClick={() => setDateOpen(!dateOpen)}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal bg-white",
                                                    !startDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "PPP") : <span>Select date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={(date) => {
                                                    setStartDate(date);
                                                    setDateOpen(false);
                                                }}
                                                initialFocus
                                                className="p-3 pointer-events-auto"
                                                disabled={(date) => date <= new Date(new Date().setHours(0, 0, 0, 0))}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* <div className="space-y-2">
                                    <label className="text-sm font-medium text-sky-900">Referral Code</label>
                                    <Input
                                        type="text"
                                        placeholder="Enter referral code (Optional)"
                                        className="bg-white"
                                        value={referralCode}
                                        onChange={(e) => setReferralCode(e.target.value)}
                                    />
                                </div> */}
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-sm font-medium text-sky-900">Location</label>

                                <div className="flex gap-2 items-center">
                                    <span className="relative flex items-center justify-center w-14 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-500 shadow-md">
                                        <MapPin className="w-4 h-4 text-white" />
                                        <span className="absolute inline-flex w-9 h-9 rounded-full bg-emerald-300 opacity-30 animate-ping" />
                                    </span>
                                    <Button
                                        variant="outline"
                                        className="whitespace-nowrap flex items-center gap-3"
                                        onClick={handleUseCurrentLocation}
                                    >
                                        <span className="font-normal">Current location</span>
                                    </Button>
                                    <Input
                                        placeholder="Enter location"
                                        className="bg-white"
                                        value={location}
                                        onChange={(e) => {
                                            setLocation(e.target.value);
                                            setShowSuggestions(true);
                                        }}
                                    />
                                </div>

                                {showSuggestions && location && filteredLocations.length > 0 && (
                                    <div className="absolute left-0 right-0 top-full mt-1 border rounded-md bg-white max-h-60 overflow-auto shadow-lg z-50">
                                        {filteredLocations.map((loc) => (
                                            <div
                                                key={loc}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleLocationSelect(loc)}
                                            >
                                                {loc}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-sky-900">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        className="pl-10 bg-white"
                                        value={phoneNumber}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 10) {
                                                setPhoneNumber(value);
                                            }
                                        }}
                                    />
                                </div>
                                {phoneNumber && phoneNumber.length < 10 && (
                                    <p className="text-sm text-red-500">Please enter a valid 10-digit phone number</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-sky-900">Service Type</label>
                                <Select onValueChange={setServiceType} value={serviceType}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select service type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="carpenter">Carpenter</SelectItem>
                                        <SelectItem value="mason">Mason</SelectItem>
                                        <SelectItem value="helper">Helper</SelectItem>
                                        <SelectItem value="painter">Painter</SelectItem>
                                        <SelectItem value="welder">Welder</SelectItem>
                                        <SelectItem value="labour">Labour</SelectItem>
                                        <SelectItem value="steelcutter">Steel Cutter</SelectItem>
                                        <SelectItem value="tiles">Tiles and Floor Work</SelectItem>
                                        <SelectItem value="plumber">Plumber</SelectItem>
                                        <SelectItem value="electrician">Electrician</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-sky-900">How did you find Gobuild?</label>
                                <Select onValueChange={setHdfu} value={hdfu}>
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="social media">Social Media</SelectItem>
                                        <SelectItem value="ads">Ads and Billboards</SelectItem>
                                        <SelectItem value="newspaper">Newspaper</SelectItem>
                                        <SelectItem value="pamphlets">Pamphlets</SelectItem>
                                        <SelectItem value="friends">Friends</SelectItem>
                                        <SelectItem value="others">Others</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button 
                                className="w-full animate-pulse-shadow text-white font-semibold text-lg"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting..." : "Book Now"}
                            </Button>
                        </div>
                    </div>

                    {/* MAP */}
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-[625px]">
                        <UserLocationMap center={mapCenter} />
                    </div>
                </div>
            </div>

            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Booking Successful!</DialogTitle>
                        <DialogDescription>
                            We will contact you in 15 minutes through phone or sms.
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </section>
    )
}

export default HeroForm;