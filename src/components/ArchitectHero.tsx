import React from "react";
import { CheckCircle2, Smile } from "lucide-react";

interface HeroProps {
  search: string;
  setSearch: (value: string) => void;
  handleRegisterClick: () => void;
  isAlreadyRegistered: boolean;
  message: string;
}

const HeroSectionArchitect: React.FC<HeroProps> = ({
  search,
  setSearch,
  handleRegisterClick,
  isAlreadyRegistered,
  message,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 pb-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
          Hire <span className="text-blue-600">Top Architects</span> <br /> for
          Your Dream Project
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Design your ideal space with the best architects — experts in
          innovative planning, interior design, and modern construction
          solutions.
        </p>

        {/* Search Bar */}
        <div className="relative w-full max-w-md mb-6">
          <input
            type="text"
            placeholder="Search architects..."
            className="w-full py-3 px-5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Search →
          </button>
        </div>

        {/* Register */}
        <button
          onClick={handleRegisterClick}
          className={`${
            isAlreadyRegistered
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white px-6 py-2 rounded-lg font-semibold transition`}
          disabled={isAlreadyRegistered}
        >
          {isAlreadyRegistered ? "Already Registered" : "Register as Architect"}
        </button>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 font-medium ${
              message.includes("Successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Right Side Video */}
      <div className="relative">
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
          <iframe
            width="100%"
            height="320"
            src="https://www.youtube.com/embed/5aJjXXQPqpM"
            title="Architect Promo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full rounded-2xl"
          ></iframe>
        </div>

        {/* Floating Verified Experts */}
        <div className="absolute -top-6 -right-6 bg-white rounded-lg p-4 shadow-lg hidden md:block">
          <div className="flex items-center space-x-2">
            <div className="bg-green-100 rounded-full p-2">
              <CheckCircle2 className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">Verified Experts</p>
              <p className="text-xs text-gray-500">Background Checked</p>
            </div>
          </div>
        </div>

        {/* Floating Happy Clients */}
        <div className="absolute -bottom-6 -left-6 bg-white rounded-lg p-4 shadow-lg hidden md:block">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 rounded-full p-2">
              <Smile className="text-blue-600 w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500">Happy Clients</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionArchitect;
