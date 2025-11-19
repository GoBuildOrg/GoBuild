import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Upload, X } from "lucide-react";
import { motion } from "framer-motion";

export default function ContractorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [contractor, setContractor] = useState<any>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [canUpload, setCanUpload] = useState(false);

  // Request modal states
  const [showForm, setShowForm] = useState(false);
  const [requesting, setRequesting] = useState(false);

  // Form fields
  const [clientName, setClientName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");

  // Load logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  // Fetch contractor data
  useEffect(() => {
    const fetchContractor = async () => {
      const { data } = await supabase
        .from("contractors_register")
        .select("*")
        .eq("id", id)
        .single();

      setContractor(data);
      setLoading(false);
    };

    fetchContractor();
  }, [id]);

  // Permission to upload images if owner
  useEffect(() => {
    if (currentUser && contractor) {
      setCanUpload(currentUser.id === contractor.user_id);
    }
  }, [currentUser, contractor]);

  // Fetch gallery photos
  const fetchPhotos = async () => {
    const folder = `contractor_${id}`;
    const { data } = await supabase.storage.from("contractor").list(folder);

    const urls =
      data?.map((file) => {
        return supabase.storage.from("contractor").getPublicUrl(`${folder}/${file.name}`)
          .data.publicUrl;
      }) || [];

    setPhotos(urls);
  };

  useEffect(() => {
    fetchPhotos();
  }, [id]);

  // Upload photo
  const handleUpload = async (e: any) => {
  if (!canUpload) return alert("Only the contractor can upload images.");

  const file = e.target.files?.[0];
  if (!file) return;

  setUploading(true);

  try {
    const folder = `contractor_${id}`;
    const filePath = `${folder}/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("contractor")  // your bucket name
      .upload(filePath, file);

    if (error) {
      console.error(error);
      alert("Upload failed. Check console.");
      return;
    }

    // Get public URL
    const { data: publicData } = supabase.storage ``
      .from("contractor")
      .getPublicUrl(filePath);

    setPhotos((prev) => [...prev, publicData.publicUrl]); // update UI immediately
    alert("Photo uploaded successfully!");
  } finally {
    setUploading(false);
  }
};

  // 📌 New insert logic using `contractor_request`
  const handleRequest = async () => {
    if (!clientName || !phone || !projectType || !location) {
      alert("Please fill all required fields!");
      return;
    }

    setRequesting(true);

    const { error } = await supabase.from("contractor_request").insert([
      {
        name: clientName,
        phone_No: phone ? Number(phone) : null,
        location,
        project_Type: projectType,
        message: message || null,
        date: date || new Date().toISOString(),
        cont_id: Number(id),
      },
    ]);

    if (error) {
      alert("Failed to send request. Try again.");
    } else {
      alert("Request sent successfully!");
      setShowForm(false);

      // reset form
      setClientName("");
      setPhone("");
      setLocation("");
      setProjectType("");
      setMessage("");
      setDate("");
    }

    setRequesting(false);
  };

  // ---------------- UI ----------------

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-yellow-600" size={40} />
      </div>
    );

  if (!contractor)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-lg">contractor not found ❌</p>
        <button className="mt-4 bg-yellow-600 text-white px-6 py-2 rounded-lg" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Banner */}
      <div className="w-full h-72 md:h-96 bg-gray-200 relative overflow-hidden">
        <img
          src={contractor.image_url || photos[0] || "/placeholder.jpg"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Profile Card */}
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-2xl -mt-32 md:-mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={contractor.image_url || "/placeholder-user.jpg"}
            className="w-40 h-40 rounded-xl object-cover border-4 border-white shadow-lg"
          />

          <div>
            <h1 className="text-3xl font-bold text-yellow-700">{contractor.name}</h1>
            <p className="text-gray-600">{contractor.specialization}</p>
            <p className="text-gray-700 mt-3">{contractor.description}</p>

            {canUpload ? (
              <label className="mt-5 bg-yellow-600 text-white px-4 py-2 rounded-lg flex gap-2 cursor-pointer">
                <Upload size={18} /> {uploading ? "Uploading..." : "Upload Photo"}
                <input type="file" className="hidden" onChange={handleUpload} />
              </label>
            ) : (
              <button className="mt-5 bg-yellow-600 text-white px-5 py-2 rounded-lg" onClick={() => setShowForm(true)}>
                Request Service
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-xl">
            <button className="absolute right-3 top-3" onClick={() => setShowForm(false)}>
              <X />
            </button>

            <h2 className="text-xl font-semibold text-yellow-700 text-center mb-4">
              Request Contractor Service
            </h2>

            <input className="border p-2 w-full mb-2" placeholder="Your Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            <input className="border p-2 w-full mb-2" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="border p-2 w-full mb-2" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            <input className="border p-2 w-full mb-2" placeholder="Project Type" value={projectType} onChange={(e) => setProjectType(e.target.value)} />
            <textarea className="border p-2 w-full mb-2" placeholder="Message (optional)" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            <input type="date" className="border p-2 w-full mb-4" value={date} onChange={(e) => setDate(e.target.value)} />

            <button className="bg-yellow-600 text-white w-full py-2 rounded-lg" onClick={handleRequest} disabled={requesting}>
              {requesting ? "Sending..." : "Submit Request"}
            </button>
          </div>
        </div>
      )}

      {/* Gallery */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Work Gallery</h2>

        {photos.length === 0 ? (
          <p className="text-gray-500">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((url, i) => (
              <motion.img key={i} src={url} className="rounded-lg object-cover h-40 w-full" whileHover={{ scale: 1.05 }} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
