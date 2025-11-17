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
      <div className="max-w-6xl mx-auto pt-20 px-4 flex flex-col items-center">
        <div className="flex flex-col-reverse md:flex-row md:gap-16 items-center w-full">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6">
              <span className="text-black">Hire Reliable </span>
              <span className={accentColor}>Contractors</span>
              <span className="text-black"> for Your Needs</span>
            </h1>
            <p className="text-gray-700 text-lg mb-6">
              Find skilled contractors for construction, renovation, and repair projects.
            </p>

            <div className="flex gap-2 mb-4">
  <input
    type="text"
    placeholder="Search Contractors..."
    className="w-full p-3 border rounded-lg focus:ring focus:ring-yellow-500"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <button
    onClick={() => setSearch(search)}
    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition font-semibold"
  >
    Search
  </button>
</div>

            <button
              onClick={handleRegisterClick}
              className={`${
                isAlreadyRegistered ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"
              } text-white px-6 py-2 rounded-lg font-semibold transition`}
              disabled={isAlreadyRegistered}
            >
              {isAlreadyRegistered ? "Already Registered" : "Register as Contractor"}
            </button>

            {message && <p className="mt-3 text-red-600 font-medium">{message}</p>}
          </div>

          <img
            src="https://mccoymart.com/post/wp-content/webp-express/webp-images/uploads/Centring-Shuttering-Contractors.jpg.webp"
            alt="Contractor working"
            className="rounded-2xl shadow-xl object-cover w-full md:w-1/2 h-[340px]"
          />
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
