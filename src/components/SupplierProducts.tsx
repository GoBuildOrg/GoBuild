import React from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    name: "Cement",
    image:
      "https://irp.cdn-website.com/bc4439fa/dms3rep/multi/Portland+Cement.jpg",
    slug: "cement",
    buttonText: "Buy Cement",
  },
  {
    name: "Pipes",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp82muPRQitzqC-jd0Dm0hPH6bD27JSNz5hw&s",
    slug: "pipes",
    buttonText: "Buy Pipes",
  },
  {
    name: "Wood",
    image:
      "https://5.imimg.com/data5/WQ/NK/MY-27922504/wood-raw-material-500x500.jpeg",
    slug: "wood",
    buttonText: "Buy Wood",
  },
];

const MaterialCategories: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Heading */}
      <section className="max-w-6xl mx-auto px-4 mt-16 mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900">
          Select Material Category
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          Choose what you want to explore
        </p>
      </section>

      {/* Category Cards */}
      <section className="max-w-6xl mx-auto px-4 mb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((item) => (
          <div
            key={item.slug}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:scale-105 overflow-hidden flex flex-col"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-60 object-cover"
            />

            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {item.name}
              </h3>
              <button
                onClick={() => navigate(`/materials/${item.slug}`)}
                className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {item.buttonText}
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default MaterialCategories;
