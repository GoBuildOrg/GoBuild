import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, CheckCircle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar"; //  USE YOUR NAVBAR HERE

type SupplierProduct = {
  id: number;
  productName: string | null;
  productCost: number | null;
  brandName: string | null;
  proID: string | null;
  image: string | null;
  created_at: string;
  category?: string | null;
};

const MaterialDetails: React.FC = () => {
  const { type } = useParams();

  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<SupplierProduct | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    quantity: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("supplierProduct")
      .select("*")
      .eq("category", type);

    if (!error) setProducts(data as SupplierProduct[]);
    setLoading(false);
  };

  useEffect(() => {
    if (type) fetchProducts();
  }, [type]);

  const openForm = (product: SupplierProduct) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.mobile || !formData.quantity) return;

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

    if (!error) {
      setShowForm(false);
      setFormData({ name: "", mobile: "", quantity: "" });
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">

      {/*  YOUR NAVBAR COMPONENT */}
      <Navbar />
    <div className="h-8"></div>
      {/*  CATEGORY HERO */}
      <section className="max-w-7xl mx-auto px-6 mt-16 mb-10 text-center">
        <h2 className="text-4xl font-bold text-blue-700 capitalize">
          Buy Best {type}
        </h2>
        <p className="mt-3 text-gray-600">
          Trusted suppliers • Best pricing • Fast delivery
        </p>
      </section>

      {/*  LOADER */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
        </div>
      ) : (
        <section className="max-w-6xl mx-auto px-6 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-24">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition hover:-translate-y-1 overflow-hidden"
            >
              <img
                src={item.image || "/placeholder.jpg"}
                className="w-full h-56 object-cover"
              />

              <div className="p-5">
                <h3 className="font-bold text-xl text-gray-800">
                  {item.productName}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Brand: {item.brandName}
                </p>

                <p className="font-bold text-2xl mt-3 text-blue-600">
                  ₹ {item.productCost}
                </p>

                <button
                  onClick={() => openForm(item)}
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-xl hover:opacity-90 transition font-semibold"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/*  CHECKOUT MODAL */}
      {showForm && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-[360px] shadow-2xl relative">

            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold text-blue-700 mb-4">
              Checkout
            </h2>

            <input
              placeholder="Full Name"
              className="w-full border border-blue-200 p-3 rounded-xl mb-3"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <input
              placeholder="Mobile Number"
              className="w-full border border-blue-200 p-3 rounded-xl mb-3"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
            />

            <input
              disabled
              value={selectedProduct.productName || ""}
              className="w-full bg-gray-100 p-3 rounded-xl mb-3"
            />

            <input
              placeholder="Quantity"
              type="number"
              className="w-full border border-blue-200 p-3 rounded-xl mb-4"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
            />

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition"
            >
              {submitting ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      )}

      {/*  SUCCESS TOAST */}
      {showSuccessPopup && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white py-4 px-6 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle />
          Order placed successfully!
        </div>
      )}
    </div>
  );
};

export default MaterialDetails;
