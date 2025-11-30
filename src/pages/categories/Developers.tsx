import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BmodelDeveloper from "@/components/BmodelDeveloper";
import BestDevelopersSection from "@/components/BestDeveloperSection";
import { supabase } from "@/integrations/supabase/client";
import { DeveloperForm } from "@/components/DeveloperForm";

const DevelopersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const formRef = useRef<HTMLElement>(null);

  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);

  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    phone: "",
    specialization: "",
    description: "",
    image: null as File | null,
  });

  useEffect(() => {
    const checkLogin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };

    checkLogin();

    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      checkLogin();
    });

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);


  useEffect(() => {
    const checkIfRegistered = async () => {
      setCheckingRegistration(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCheckingRegistration(false);
        return;
      }

      const { data } = await supabase
        .from("Developer_Registered")
        .select("id")
        .eq("developer_id", user.id)
        .maybeSingle();

      if (data) setIsRegistered(true);

      setCheckingRegistration(false);
    };

    checkIfRegistered();
  }, [isLoggedIn]);

  
  useEffect(() => {
    const shouldOpen = searchParams.get("showForm");

    if (!checkingRegistration && shouldOpen === "true" && isLoggedIn && !isRegistered) {
      setShowForm(true);

      const params = new URLSearchParams(searchParams);
      params.delete("showForm");
      setSearchParams(params, { replace: true });

      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [isLoggedIn, checkingRegistration, isRegistered]);

 
  const handleRegisterClick = async () => {
    if (!isLoggedIn) {
      navigate("/auth/login?redirect=/categories/developers&showForm=true");
      return;
    }

    if (isRegistered) {
      alert("You are already registered as a developer.");
      return;
    }

    setShowForm(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };


  const handleChange = (e: any) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login first.");
      return;
    }

    let image_url = null;

    try {
      // Upload image
      if (formData.image) {
        const fileName = `developer_${user.id}_${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
          .from("developer-images")
          .upload(fileName, formData.image);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("developer-images")
          .getPublicUrl(fileName);

        image_url = publicUrlData.publicUrl;
      }

      const { error } = await supabase.from("Developer_Registered").insert([
        {
          developer_id: user.id,
          name: formData.company_name,
          email: formData.email,
          phone_number: formData.phone,
          specialization: formData.specialization,
          description: formData.description,
          image_url,
        },
      ]);

      if (error) throw error;

      alert("Developer registered successfully!");
      setIsRegistered(true);
      setShowForm(false);
    } catch (error) {
      alert("Registration failed.");
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />

      {/* HERO BANNER */}
      <section
        className="relative h-[520px] w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-photo/real-estate-developers-architects-businessmen-team-working-new-business-buildings-project-office_148840-47769.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/55"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Hire <span className="text-blue-400">Large-Scale Builders</span>
            <br />
            for Your Development Projects
          </h1>

          <p className="text-gray-200 text-lg mt-4 max-w-2xl">
            Connect with trusted developers specializing in premium commercial and residential projects.
          </p>

          <button
            onClick={handleRegisterClick}
            disabled={isRegistered}
            className={`mt-6 font-semibold px-6 py-3 rounded-lg shadow-md transition 
              ${
                isRegistered
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-700 hover:bg-gray-200"
              }`}
          >
            {isRegistered ? "Already Registered" : "Register as a Builder"}
          </button>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      {!checkingRegistration && showForm && !isRegistered && (
        <section
          ref={formRef}
          className="max-w-4xl mx-auto mt-16 bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200 relative"
        >
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl font-bold"
          >
            ×
          </button>

          <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
            Register as a Real Estate Developer / Builder
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="company_name"
              placeholder="Company / Developer Name"
              className="p-3 border rounded-lg"
              required
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Business Email"
              className="p-3 border rounded-lg"
              required
              onChange={handleChange}
            />

            <input
              type="tel"
              name="phone"
              placeholder="Contact Phone Number"
              className="p-3 border rounded-lg"
              required
              onChange={handleChange}
            />

            <input
              type="text"
              name="specialization"
              placeholder="Specialization (Commercial, Residential, Township, etc.)"
              className="p-3 border rounded-lg"
              required
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Short description about your development expertise"
              rows={4}
              className="p-3 border rounded-lg"
              required
              onChange={handleChange}
            />

            <input
              type="file"
              name="image"
              accept="image/*"
              className="p-2 border rounded-lg"
              onChange={handleChange}
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Submit Registration
            </button>
          </form>
        </section>
      )}

      <DeveloperForm />
      <BmodelDeveloper />
      <BestDevelopersSection />

      <Footer />
    </div>
  );
};

export default DevelopersPage;
