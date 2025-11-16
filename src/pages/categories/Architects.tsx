import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, CheckCircle2, Smile } from "lucide-react";
import BmodelArchitect from "@/components/BmodelArchitect";
import ImageSlider from "@/components/ImageSlider";
import { ArchitectForm } from "@/components/ArchitectForm";
import HeroSectionArchitect from "@/components/ArchitectHero";
import BestArchitectsSection from "@/components/BestArchitectsSection";   // ⭐ NEW COMPONENT ADDED

const ArchitectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const formRef = useRef<HTMLElement>(null);
  const [architects, setArchitects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    description: "",
    image_url: "",
  });
  const [message, setMessage] = useState("");
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);

  //  Fetch architects
  const fetchArchitects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("architects").select("*");
    if (error) console.error(error);
    setArchitects(data || []);
    setLoading(false);
  };

  //  Check if user already registered as architect
  const checkIfRegistered = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("architects")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setIsAlreadyRegistered(true);
    } else {
      setIsAlreadyRegistered(false);
    }
  };

  useEffect(() => {
    fetchArchitects();
  }, []);

  useEffect(() => {
    if (user) checkIfRegistered();
  }, [user]);

  useEffect(() => {
    const shouldShowForm = searchParams.get("showForm");

    if (shouldShowForm === "true" && user && !isAlreadyRegistered) {
      setShowForm(true);

      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("showForm");
      setSearchParams(newSearchParams, { replace: true });

      setTimeout(() => {
        formRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }, 300);
    }
  }, [user, isAlreadyRegistered]);

  //  Handle input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!user) {
        setMessage("Please log in to upload an image.");
        return;
      }

      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("Architects")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("Architects")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        setFormData((prev) => ({
          ...prev,
          image_url: publicUrlData.publicUrl,
        }));
        setMessage("Image uploaded successfully!");
      }
    } catch (error: any) {
      console.error(error);
      setMessage(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  //  Handle form submit with duplicate prevention + update role
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage("Please log in first.");
      return;
    }

    const { name, specialization, description, image_url } = formData;
    if (!name || !specialization || !description) {
      setMessage("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data: existingArchitect, error: checkError } = await supabase
        .from("architects")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingArchitect) {
        setMessage("You are already registered as an architect.");
        setLoading(false);
        setIsAlreadyRegistered(true);
        return;
      }

      const { error } = await supabase.from("architects").insert([
        {
          name,
          specialization,
          description,
          image_url,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      const { error: roleError } = await supabase
        .from("profiles")
        .update({ user_role: "architect" })
        .eq("id", user.id);

      if (roleError) throw roleError;

      setMessage("Successfully registered as architect!");
      setFormData({
        name: "",
        specialization: "",
        description: "",
        image_url: "",
      });
      setShowForm(false);
      setIsAlreadyRegistered(true);
      fetchArchitects();
    } catch (err: any) {
      console.error(err);
      setMessage(`Failed to register: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    if (!user) {
      navigate("/auth/login?redirect=/categories/architects&showForm=true");
    } else if (isAlreadyRegistered) {
      setMessage("You are already registered as an architect.");
    } else {
      setShowForm(true);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ 
          behavior: "smooth", 
          block: "start" 
        });
      }, 100);
    }
  };

  const filteredArchitects = architects.filter(
    (arch) =>
      arch.name?.toLowerCase().includes(search.toLowerCase()) ||
      arch.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen font-sans">
      <Navbar />
      <ImageSlider />

      <HeroSectionArchitect
        search={search}
        setSearch={setSearch}
        handleRegisterClick={handleRegisterClick}
        isAlreadyRegistered={isAlreadyRegistered}
        message={message}
      />

      {showForm && user && !isAlreadyRegistered && (
        <section 
          ref={formRef}
          className="max-w-4xl mx-auto mt-10 bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200 relative"
        >
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
            Register as an Architect
          </h2>

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
            <input
              type="text"
              name="specialization"
              placeholder="Specialization (e.g. Interior Design)"
              value={formData.specialization}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
            <textarea
              name="description"
              placeholder="Short Description about your work"
              value={formData.description}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              rows={4}
              required
            />

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-700 font-medium">
                Upload Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="p-2 border border-gray-300 rounded-lg"
              />
              {uploading && (
                <p className="text-blue-500 text-sm">Uploading...</p>
              )}
              {formData.image_url && (
                <img
                  src={formData.image_url}
                  alt="Preview"
                  className="w-40 h-40 rounded-lg object-cover mt-2 border border-gray-200"
                />
              )}
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              disabled={uploading}
            >
              {uploading ? "Please wait..." : "Register"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-3 text-center font-medium ${
                message.includes("Successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </section>
      )}
      <ArchitectForm />
      <BmodelArchitect />
      <BestArchitectsSection
        loading={loading}
        filteredArchitects={filteredArchitects}
      />

      <Footer />
    </div>
  );
};

export default ArchitectsPage;
