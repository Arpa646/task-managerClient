"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Your utilities
import { isAuthenticated } from "../utils/auth";
import { taskService } from "../services/taskService";

const Account = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Profile fields
  const [profileId, setProfileId] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState("");

  // Image fields
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  const [saving, setSaving] = useState(false);

  // ==========================
  // LOAD PROFILE
  // ==========================
  useEffect(() => {
    const loadProfile = async () => {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }

      try {
        const profile = await taskService.getUserProfile();

        if (profile) {
          const p = profile;

          setProfileId(p.id || p._id || null);
          setFirstName(p.first_name || p.firstName || "");
          setLastName(p.last_name || p.lastName || "");
          setEmail(p.email || "");
          setAddress(p.address || p.location || "");
          setContactNumber(p.contact_number || p.phone || "");
          setBirthday(p.birthday || "");
          setBio(p.bio || "");
          setPhotoPreview(p.profile_image || null);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ==========================
  // HANDLE PHOTO CHANGE
  // ==========================
  const onPhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);

    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ==========================
  // SAVE PROFILE
  // ==========================
  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        address: address,
        contact_number: contactNumber,
        birthday: birthday,
        bio: bio,
      };

      console.log("Sending:", payload, photoFile);

      const updated = await taskService.updateUserProfile(payload, photoFile);

      if (updated) {
        const p = updated;
        setPhotoPreview(p.profile_image || photoPreview);
      }

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-semibold mb-6">Account Information</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PROFILE IMAGE */}
            <div className="bg-slate-50 p-6 rounded-lg text-center border">
              <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Photo
                  </div>
                )}
              </div>

              <input type="file" accept="image/*" onChange={onPhotoChange} />
            </div>

            {/* FORM */}
            <form onSubmit={onSave} className="lg:col-span-2 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-black">First Name</label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-black border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="text-sm text-black">Last Name</label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-black border p-2 rounded"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-black">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-black border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="text-sm text-black">Contact Number</label>
                  <input
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full text-black border p-2 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-black">Address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-black border p-2 rounded"
                />
              </div>

              <div>
                <label className="text-sm text-black">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-black border p-2 rounded"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm text-black">Birthday</label>
                <input
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className="w-full text-black border p-2 rounded"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {profileId && (
            <div className="mt-6 text-sm">
              Profile ID: <span className="font-medium">{profileId}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
