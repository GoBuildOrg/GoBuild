import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ContractorFormProps {
  onSuccess: () => void;
}

const ContractorForm: React.FC<ContractorFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    Phone_No: "",
    description: "",
    specialization: "",
    location: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Upload image to Supabase storage (bucket: contractor)
   */
  const uploadImage = async () => {
    if (!imageFile) return null;

    const fileName = `contractor_${Date.now()}_${imageFile.name}`;

    const { error } = await supabase.storage.from("contractor").upload(fileName, imageFile);

    if (error) {
      alert("Image upload failed!");
      console.log(error);
      return null;
    }

    return supabase.storage.from("contractor").getPublicUrl(fileName).data.publicUrl;
  };

  /**
   * Save contractor to Supabase
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const uploadedImageUrl = await uploadImage();

    const user = (await supabase.auth.getUser()).data.user;

    const { error } = await supabase.from("contractors_register").insert([
      {
        name: formData.name,
        Phone_No: formData.Phone_No,
        description: formData.description,
        specialization: formData.specialization,
        location: formData.location,
        image_url: uploadedImageUrl,
        user_id: user?.id,
      },
    ]);

    setLoading(false);

    if (error) {
      console.log(error);
      alert("❌ Failed to register contractor!");
    } else {
      alert("🎉 Contractor Registered Successfully!");

      // reset form
      setFormData({
        name: "",
        Phone_No: "",
        description: "",
        specialization: "",
        location: "",
      });
      setImageFile(null);

      onSuccess(); // callback
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-lg font-semibold">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          placeholder="Full Name"
          required
        />
      </div>

      <div>
        <label className="block text-lg font-semibold">Phone Number</label>
        <input
          name="Phone_No"
          value={formData.Phone_No}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          placeholder="Enter Phone Number"
          required
        />
      </div>

      <div>
        <label className="block text-lg font-semibold">Specialization</label>
        <input
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          placeholder="Mason, Electrician, Painter..."
          required
        />
      </div>

      <div>
        <label className="block text-lg font-semibold">Location</label>
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          placeholder="City / Area"
        />
      </div>

      <div>
        <label className="block text-lg font-semibold">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg h-28"
          placeholder="Describe your work experience..."
        />
      </div>

      <div>
        <label className="block text-lg font-semibold">Upload Profile Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full border p-3 rounded-lg bg-gray-50"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-600 text-white py-3 rounded-lg font-bold hover:bg-yellow-700 transition"
      >
        {loading ? "Submitting..." : "Register Contractor"}
      </button>
    </form>
  );
};

export default ContractorForm;
