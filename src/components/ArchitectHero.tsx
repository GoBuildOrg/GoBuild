import React, { useEffect, useState } from "react";

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
  const images = [
    "https://plus.unsplash.com/premium_photo-1661335257817-4552acab9656?fm=jpg&q=60&w=3000",
    "https://modernsteeldoors.com/wp-content/uploads/stock-photo-modern-house-1-scaled.jpg",
    "https://blog.novatr.com/hubfs/An%20architect%20creating%20a%20building%20model.webp",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
  <section className="relative w-full h-[440px] md:h-[500px] overflow-hidden">
    {/* Image Slider */}
    <div
  className="absolute inset-0 flex transition-transform duration-[1500ms] ease-in-out"
  style={{
    transform: `translateX(-${index * 100}%)`,
  }}
>
  {images.map((img, i) => (
    <div key={i} className="min-w-full h-full">
      <img
        src={img}
        className="w-full h-full object-cover"
        alt="bg"
      />
    </div>
  ))}
</div>

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-60"></div>

    {/* Hero Content */}
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 h-full">
      <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-4">
        Hire <span className="text-blue-400">Expert Architects</span>
        <br /> For Your Dream Project
      </h1>

      <p className="text-gray-200 text-lg mb-6">
        Connect with skilled and verified architects for interior design,
        renovation, planning and modern construction solutions.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
        <button
          onClick={handleRegisterClick}
          className={`px-6 py-3 rounded-lg font-bold shadow-md transition ${
            isAlreadyRegistered
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-white text-gray-900 hover:bg-gray-100"
          }`}
          disabled={isAlreadyRegistered}
        >
          {isAlreadyRegistered ? "Already Registered" : "Register as Architect"}
        </button>
      </div>

      {message && (
        <p
          className={`mt-4 font-medium ${
            message.includes("Successfully")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  </section>
);

};

export default HeroSectionArchitect;
