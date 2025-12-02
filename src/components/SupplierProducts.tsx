import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Type for your table
type SupplierProduct = {
  id: number;
  productName: string | null;
  productCost: number | null;
  brandName: string | null;
  proID: string | null;
  image: string | null;
  created_at: string;
};

const SupplierProducts: React.FC = () => {
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal States
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SupplierProduct | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    quantity: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase.from("supplierProduct").select("*");

    if (error) {
      console.error("Error fetching supplier products:", error);
    } else {
      setProducts(data as SupplierProduct[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openForm = (product: SupplierProduct) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  //  Submit Booking Request
  const handleSubmit = async () => {
    if (!formData.name || !formData.mobile || !formData.quantity) {
      alert("Please fill all fields.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("supplierPorductRequest").insert([
      {
        name: formData.name,
        phone_No: formData.mobile,
        productName: selectedProduct?.productName,
        Quantity: formData.quantity,
      },
    ]);

    setSubmitting(false);

    if (error) {
      console.error("Error inserting:", error);
      alert("Error while booking.");
    } else {
      // clear form
      setShowForm(false);
      setFormData({ name: "", mobile: "", quantity: "" });

      // show success popup
      setShowSuccessPopup(true);

      // auto-hide in 2.5 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2500);
    }
  };

  return (
    <div>
      {/* Page Heading */}
      <section className="max-w-6xl mx-auto px-4 md:px-0 mt-16 mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Different Material Available
        </h2>
        <p className="text-gray-600 mt-2 text-lg">
          Explore Different type of Material
        </p>
      </section>

      {/* Product List */}
      <section className="max-w-6xl mx-auto px-4 md:px-0 mt-6 mb-20">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105 overflow-hidden flex flex-col"
              >
                <img
                  src={item.image || "/placeholder.jpg"}
                  alt={item.productName || "Product Image"}
                  className="w-full h-56 sm:h-64 object-cover"
                />

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-900 line-clamp-2">
                      {item.productName}
                    </h3>

                    <p className="text-gray-700 text-sm mb-2">
                      Brand: <span className="font-semibold">{item.brandName}</span>
                    </p>

                    <p className="text-gray-900 font-bold text-lg mb-4">
                      ₹ {item.productCost}
                    </p>
                  </div>

                  <button
                    onClick={() => openForm(item)}
                    className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Book a Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Form Popup */}
      {showForm && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-xl font-bold mb-4">Book a Service</h2>

            <form className="space-y-3">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full border rounded-lg p-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Mobile Number"
                className="w-full border rounded-lg p-2"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
              />

              <input
                type="text"
                value={selectedProduct.productName || ""}
                className="w-full border rounded-lg p-2 bg-gray-100"
                disabled
              />

              <input
                type="number"
                placeholder="Quantity"
                className="w-full border rounded-lg p-2"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full bg-gray-300 text-black py-2 rounded-lg"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white py-4 px-6 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in z-50">
          <CheckCircle className="w-6 h-6" />
          <span className="text-lg font-medium">
            Request submitted successfully! We will contact you soon.
          </span>
        </div>
      )}

      {/* Fade animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SupplierProducts;
