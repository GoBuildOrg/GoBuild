import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, CheckCircle, Trash2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function DeveloperDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [canEdit, setCanEdit] = useState(false);

  // Modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    budget: "",
    project_type: "",
    message: "",
    requested_date: "",
  });

  // Load logged user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setCurrentUser(data.user));
  }, []);

  // Fetch Developer Data
  useEffect(() => {
    const loadDeveloper = async () => {
      const { data } = await supabase
        .from("Developer_Registered")
        .select("*")
        .eq("id", id)
        .single();

      setDeveloper(data);
      setLoading(false);
    };

    loadDeveloper();
  }, [id]);

  // Check Owner
  useEffect(() => {
    if (developer && currentUser) {
      setCanEdit(currentUser.id === developer.developer_id);
    }
  }, [developer, currentUser]);

  // Load Photos
  const loadPhotos = async () => {
    const folder = `developer_${id}`;
    const { data } = await supabase.storage.from("developer-images").list(folder);

    const urls =
      data?.map((file) => ({
        name: file.name,
        path: `${folder}/${file.name}`,
        url: supabase.storage
          .from("developer-images")
          .getPublicUrl(`${folder}/${file.name}`).data.publicUrl,
      })) || [];

    setPhotos(urls);
  };

  useEffect(() => {
    loadPhotos();
  }, [id]);

  // Upload Image
  const handleUpload = async (e: any) => {
    if (!canEdit) return;

    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const folder = `developer_${id}`;
    const filePath = `${folder}/${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("developer-images")
      .upload(filePath, file);

    if (error) {
      console.error(error);
      alert("Upload failed.");
      setUploading(false);
      return;
    }

    await loadPhotos();
    setUploading(false);
    alert("Photo uploaded!");
  };

  // Delete Image
  const deletePhoto = async (path: string) => {
    if (!canEdit) return;

    const confirmDelete = confirm("Are you sure you want to delete this photo?");
    if (!confirmDelete) return;

    const { error } = await supabase.storage
      .from("developer-images")
      .remove([path]);

    if (error) {
      console.error(error);
      alert("Failed to delete photo.");
      return;
    }

    setPhotos((prev) => prev.filter((p) => p.path !== path));
    alert("Photo deleted!");
  };

  // Edit Description
  const editDescription = async () => {
    if (!canEdit) return;

    const newDesc = prompt("Enter new description:", developer.description || "");
    if (!newDesc) return;

    const { error } = await supabase
      .from("Developer_Registered")
      .update({ description: newDesc })
      .eq("id", developer.id);

    if (error) {
      alert("Update failed");
    } else {
      setDeveloper((prev) => ({ ...prev, description: newDesc }));
      alert("Description updated!");
    }
  };


const submitRequest = async () => {
  if (!currentUser) {
    alert("Please login first!");
    return;
  }

  const { error } = await supabase.from("Developer_Request").insert([
    {
      name: formData.name,
      email: currentUser.email,             
      phone_number: formData.phone,
      company: "-",                         
      project_type: formData.project_type,
      location: formData.location,
      estimated_budget: formData.budget,
      details: formData.message,
      const_id: developer.id,               
    },
  ]);

  if (error) {
    console.log(error);
    alert("Request failed!");
    return;
  }

  alert("Request sent successfully!");
  setShowRequestModal(false);
};


  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* DONE BUTTON */}
      {canEdit && (
        <div className="w-full flex justify-end px-6 mt-3">
          <button
            onClick={() => navigate("/developers")}
            className="bg-green-600 text-white px-5 py-2 rounded-lg flex gap-2 shadow"
          >
            <CheckCircle size={18} /> Done
          </button>
        </div>
      )}

      {/* Banner */}
      <div className="w-full h-72 md:h-96 bg-gray-200 relative">
        <img
          src={developer.image_url || photos[0]?.url || "/placeholder.jpg"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Card */}
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-xl rounded-2xl -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={developer.image_url || "/placeholder-user.jpg"}
            className="w-40 h-40 rounded-xl object-cover border-4 border-white shadow-lg"
          />

          <div>
            <h1 className="text-3xl font-bold text-blue-700">{developer.name}</h1>
            <p className="text-gray-600">{developer.specialization}</p>
            <p className="text-gray-700 mt-3">{developer.description}</p>

            {/* REQUEST SERVICE — visible only for other users */}
            {!canEdit && (
              <button
                onClick={() => setShowRequestModal(true)}
                className="mt-4 bg-purple-600 text-white px-5 py-2 rounded-lg shadow-md"
              >
                Request Service
              </button>
            )}

            {/* Owner Buttons */}
            {canEdit && (
              <div className="mt-6 flex flex-col gap-3 w-64">
                {/* Upload */}
                <label className="bg-blue-500 text-white px-5 py-2 rounded-lg flex gap-2 cursor-pointer justify-center">
                  <Upload size={18} />
                  {uploading ? "Uploading..." : "Upload Photo"}
                  <input type="file" className="hidden" onChange={handleUpload} />
                </label>

                {/* Edit description */}
                <button
                  onClick={editDescription}
                  className="bg-green-500 text-white px-5 py-2 rounded-lg"
                >
                  Edit Description
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Work Gallery</h2>

        {photos.length === 0 ? (
          <p className="text-gray-500">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.path} className="relative group">
                <motion.img
                  src={photo.url}
                  className="rounded-lg object-cover h-40 w-full"
                  whileHover={{ scale: 1.05 }}
                />

                {canEdit && (
                  <button
                    onClick={() => deletePhoto(photo.path)}
                    className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {showRequestModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg relative">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute right-3 top-3 text-gray-600"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-center text-purple-600 mb-4">
              Request Service
            </h2>

            <div className="flex flex-col gap-3">
              {Object.keys(formData).map((key) => (
                <input
                  key={key}
                  name={key}
                  type={key === "requested_date" ? "date" : "text"}
                  placeholder={
                    key === "project_type"
                      ? "Project Type (Home, Office)"
                      : key === "message"
                      ? "Message (optional)"
                      : key
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())
                  }
                  className="border p-2 rounded"
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                />
              ))}
            </div>

            <button
              onClick={submitRequest}
              className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg"
            >
              Submit Request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
