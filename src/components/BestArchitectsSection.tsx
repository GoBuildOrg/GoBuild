import React from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Architect {
  id: string;
  name: string;
  image_url: string;
  specialization: string;
  description: string;
}

interface Props {
  loading: boolean;
  filteredArchitects: Architect[];
}

const BestArchitectsSection: React.FC<Props> = ({ loading, filteredArchitects }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Heading Section */}
      <section className="max-w-6xl mx-auto px-4 md:px-0 mt-16 mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Our Best Architects
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          Explore profiles of talented architects ready to design your dream space.
        </p>
      </section>

      {/* Architects Grid */}
      <section className="max-w-6xl mx-auto px-4 md:px-0 mt-6 mb-20">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          </div>
        ) : filteredArchitects.length === 0 ? (
          <p className="text-center text-gray-500">No architects found.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArchitects.map((arch) => (
              <div
                key={arch.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 overflow-hidden flex flex-col"
              >
                <img
                  src={arch.image_url || "/placeholder-architect.jpg"}
                  alt={arch.name}
                  className="w-full h-56 sm:h-64 object-cover"
                  loading="lazy"
                />
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-900 line-clamp-2">
                      {arch.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {arch.specialization || "Specialization not specified"}
                    </p>
                    <p className="text-gray-700 mb-5 text-sm line-clamp-3">
                      {arch.description ||
                        "Expert in architectural design and planning."}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/categories/architect-detail/${arch.id}`)
                    }
                    className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Details
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

export default BestArchitectsSection;
