import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroForm from '@/components/HeroForm';
import { ApplyAsProfessionalForm } from '@/components/ApplyAsProfessionalForm';
import WorkerCategories from '@/components/WorkerCategories';


const Workers: React.FC = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const formRef = useRef(null); 

  const handleRegisterClick = () => {
    setShowForm(true);

    // ⭐ scroll after slight delay so form becomes visible first
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    
    <div className="bg-white min-h-screen font-sans relative">
      

      {/* HERO SECTION */}
      <div
        className="relative w-full h-[420px] md:h-[480px] bg-cover bg-center flex flex-col items-center justify-center text-center px-4"
        style={{
          backgroundImage:
            'url("https://static-cdn.toi-media.com/www/uploads/2024/12/AFP__20241229__36RC6BC__v1__HighRes__IsraelPalestinianConflictEconomyIndia.jpg")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        <div className="relative z-10 max-w-3xl mx-auto mt-10">
          <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-4">
            Book Expert Construction Workers
          </h1>

          <p className="text-gray-200 text-lg mb-6">
            Connect with verified, skilled construction professionals.
            From carpenters to electricians, find the perfect match for your construction needs.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <button
              onClick={handleRegisterClick} 
              className="px-6 py-3 bg-white text-gray-900 font-bold rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              Register as Worker
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORIES SECTION */}
<div className="w-full py-16 bg-white">
  <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
    Popular Worker Categories
  </h2>

  <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-center">

    {/* Plumber */}
    <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
      <div className="text-orange-500 text-4xl mb-3">🔧</div>
      <h3 className="text-lg font-semibold text-gray-800">Plumber</h3>
    </div>

    {/* Carpenter */}
    <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
      <div className="text-blue-500 text-4xl mb-3">🪚</div>
      <h3 className="text-lg font-semibold text-gray-800">Carpenter</h3>
    </div>

    {/* Mason */}
    <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
      <div className="text-green-500 text-4xl mb-3">⚒️</div>
      <h3 className="text-lg font-semibold text-gray-800">Mason</h3>
    </div>

    {/* Electrician */}
    <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
      <div className="text-purple-500 text-4xl mb-3">💡</div>
      <h3 className="text-lg font-semibold text-gray-800">Electrician</h3>
    </div>

    {/* Painter */}
    <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
      <div className="text-red-500 text-4xl mb-3">🎨</div>
      <h3 className="text-lg font-semibold text-gray-800">Painter</h3>
    </div>

    {/* Tiles & Floor Work */}
    <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
      <div className="text-indigo-500 text-4xl mb-3">🧱</div>
      <h3 className="text-lg font-semibold text-gray-800">Tiles & Floor Work</h3>
    </div>

    {/* Steel Cutter */}
    <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
      <div className="text-gray-800 text-4xl mb-3">🔩</div>
      <h3 className="text-lg font-semibold text-gray-800">Steel Cutter</h3>
    </div>

    {/* Labour */}
    <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
      <div className="text-yellow-500 text-4xl mb-3">👷</div>
      <h3 className="text-lg font-semibold text-gray-800">Labour</h3>
    </div>

    {/* Welder */}
    <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
      <div className="text-teal-600 text-4xl mb-3">🔥</div>
      <h3 className="text-lg font-semibold text-gray-800">Welder</h3>
    </div>

    {/* Steel Fixer */}
    <div className="cursor-pointer p-6 rounded-2xl border hover:shadow-xl transition bg-gray-50">
      <div className="text-amber-700 text-4xl mb-3">🛠️</div>
      <h3 className="text-lg font-semibold text-gray-800">Steel Fixer</h3>
    </div>

  </div>
</div>

      {/* FORM SECTION */}
      {showForm && (
        <div ref={formRef} className="w-full flex justify-center py-10 relative"> 
          <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 border border-gray-200 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-black text-xl"
            >
              x
            </button>

            <h2 className="text-center text-3xl font-bold mb-6">
              Register as Worker
            </h2>

            <ApplyAsProfessionalForm />
          </div>
        </div>
      )}

      <HeroForm />
      <WorkerCategories />
      <Footer />
    </div>
  );
};

export default Workers;
