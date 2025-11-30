import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Developer {
  id: number;
  name: string | null;
  specialization: string | null;
  description: string | null;
  image_url: string | null;
}

const BestDevelopersSection: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [developers, setDevelopers] = useState<Developer[]>([]);

  // FETCH FROM SUPABASE
  useEffect(() => {
    const fetchDevelopers = async () => {
      const { data, error } = await supabase
        .from("Developer_Registered")
        .select("id, name, specialization, description, image_url");

      if (error) {
        console.error("Supabase Fetch Error:", error);
        alert("Error: " + error.message);
        setLoading(false);
        return;
      }

      console.log("Developers Loaded:", data);
      setDevelopers(data || []);
      setLoading(false);
    };

    fetchDevelopers();
  }, []);

  const filteredDevelopers = developers.filter((dev) => {
    if (!dev.name) return false;

    return (
      dev.name.toLowerCase().includes(search.toLowerCase()) ||
      (dev.specialization ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  return (
    <>
      {/* Heading */}
      <section className="max-w-6xl mx-auto px-4 mt-16 mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
          Find Trusted <span className="text-blue-600">Real Estate Developers</span>
        </h2>
      </section>

      {/* Search */}
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <input
          type="text"
          placeholder="Search developers or builders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-4 py-3 border border-blue-400 rounded-xl text-lg"
        />
      </div>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 mt-10 mb-20">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
          </div>
        ) : filteredDevelopers.length === 0 ? (
          <p className="text-center text-gray-500">No developers found.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDevelopers.map((dev) => (
              <div
                key={dev.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all hover:scale-[1.02] overflow-hidden"
              >
                <img
                  src={dev.image_url || "https://placehold.co/600x400?text=No+Image"}
                  alt={dev.name || "Developer"}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {dev.name}
                  </h3>

                  <p className="text-blue-600 text-sm mb-2">
                    {dev.specialization || "Specialization not provided"}
                  </p>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {dev.description || "No description available"}
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/categories/builder-detail/${dev.id}`)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700"
                  >
                    View Company Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default BestDevelopersSection;
