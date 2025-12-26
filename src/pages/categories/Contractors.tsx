import React, { useEffect, useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContractorForm from "@/components/ContractorForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const accentColor = "text-yellow-600";

const Contractors: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const formRef = useRef<HTMLElement>(null);

  const [contractors, setContractors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch contractors
  const fetchContractors = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("contractors_register").select("*");
    if (error) console.error(error);
    setContractors(data || []);
    setLoading(false);
  };

  // Check if user already registered
  const checkIfRegistered = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("contractors_register")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) setIsAlreadyRegistered(true);
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  useEffect(() => {
    if (user) checkIfRegistered();
  }, [user]);

  // Auto open form after login redirect
  useEffect(() => {
    const shouldShowForm = searchParams.get("showForm");

    if (shouldShowForm === "true" && user && !isAlreadyRegistered) {
      setShowForm(true);

      const params = new URLSearchParams(searchParams);
      params.delete("showForm");
      setSearchParams(params, { replace: true });

      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [user]);

  // Register button click
  const handleRegisterClick = () => {
    if (!user) {
      navigate("/auth/login?redirect=/categories/contractors&showForm=true");
    } else if (isAlreadyRegistered) {
      setMessage("You are already registered as a contractor.");
    } else {
      setShowForm(true);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    }
  };

  // Filter contractors by search
  const filteredContractors = contractors.filter((c) =>
    (c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.specialization?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-white min-h-screen font-sans relative">
      <Navbar />

      {/* HERO SECTION */}
      <div
  className="relative w-full h-[420px] md:h-[480px] bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
  style={{
    // Contractor / construction site image
    backgroundImage:
      'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop")',
  }}
>
  <div className="absolute inset-0 bg-black bg-opacity-50"></div>

  <div className="relative z-10 max-w-3xl mx-auto mt-10">
    <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-4">
      Hire Professional Contractors
    </h1>

    <p className="text-gray-200 text-lg mb-6">
      Connect with verified contractors for construction, renovation, interiors, and repairs.
      Get reliable experts who deliver quality work on time.
    </p>

    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
      <button
        onClick={handleRegisterClick}
        className="px-6 py-3 bg-white text-gray-900 font-bold rounded-lg shadow-md hover:bg-gray-100 transition"
      >
        Register as Contractor
      </button>
    </div>
  </div>
</div>

<div className="w-full py-16 bg-white">
  <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
    Popular Contractor Service Categories
  </h2>

  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

  {/* General Contracting */}
  <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
    <div className="text-3xl mb-3">🏗️</div>
    <h3 className="text-lg font-semibold text-gray-800">General Contracting</h3>
    <p className="hidden sm:block text-sm text-gray-500 mt-2">
      Construction, structure & site management.
    </p>
  </div>

  {/* Design & Build */}
  <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
    <div className="text-3xl mb-3">🧭</div>
    <h3 className="text-lg font-semibold text-gray-800">Design & Build</h3>
    <p className="hidden sm:block text-sm text-gray-500 mt-2">
      Design, engineering & execution.
    </p>
  </div>

  {/* Renovation & Remodeling */}
  <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
    <div className="text-3xl mb-3">🔨</div>
    <h3 className="text-lg font-semibold text-gray-800">Renovation & Remodeling</h3>
    <p className="hidden sm:block text-sm text-gray-500 mt-2">
      Refurbishments, extensions, interiors & retrofit works.
    </p>
  </div>

  {/* Project Management & Consultancy */}
  <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
    <div className="text-3xl mb-3">📋</div>
    <h3 className="text-lg font-semibold text-gray-800">
      Project Management & Consultancy
    </h3>
    <p className="hidden sm:block text-sm text-gray-500 mt-2">
      Estimation, scheduling, quality control & permits.
    </p>
  </div>

</div>

</div>



      {/* FORM SECTION */}
      {showForm && user && !isAlreadyRegistered && (
        <section
          ref={formRef}
          className="max-w-3xl mx-auto mt-16 mb-20 p-6 bg-gray-50 rounded-2xl shadow-md border relative"
        >
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 text-gray-600 text-3xl font-bold"
          >
            ×
          </button>

          <h2 className="text-3xl font-bold mb-6 text-center text-yellow-700">
            Contractor Registration Form
          </h2>

          <ContractorForm onSuccess={() => setShowForm(false)} />
        </section>
      )}

      {/* CONTRACTORS LIST */}
      <section className="max-w-6xl mx-auto px-4 md:px-0 mt-16 mb-20">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Available Contractors
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-8 h-8 text-yellow-600" />
          </div>
        ) : filteredContractors.length === 0 ? (
          <p className="text-center text-gray-500">No contractors found.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredContractors.map((contractor) => (
              <div
                key={contractor.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 overflow-hidden"
              >
                <img
                  src={
                    contractor.image_url ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={contractor.name}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold mb-1 text-gray-900">{contractor.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{contractor.specialization}</p>
                  <p className="text-gray-700 text-sm line-clamp-3 mb-4">{contractor.description}</p>

                  <button
                    onClick={() => navigate(`/categories/contractor-detail/${contractor.id}`)}
                    className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Contractors;
