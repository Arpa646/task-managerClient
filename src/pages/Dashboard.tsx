"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAuthUser } from '../utils/auth';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [birthday, setBirthday] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }
      const u = getAuthUser();
      setUser(u);
      setFirstName(u?.firstName || u?.name?.split(' ')[0] || '');
      setLastName(u?.lastName || u?.name?.split(' ').slice(1).join(' ') || '');
      setEmail(u?.email || '');
      setAddress(u?.address || '');
      setContactNumber(u?.contactNumber || '');
      setBirthday(u?.birthday || '');
      setPhotoPreview(u?.photoURL || null);
      setLoading(false);
    };

    init();
  }, []);

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(String(reader.result));
    reader.readAsDataURL(file);
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // TODO: call API to update account info. For now, log and update local state.
      console.log('Saving account', { firstName, lastName, email, address, contactNumber, birthday });
      // Simulate save delay
      await new Promise(res => setTimeout(res, 700));
      setSaving(false);
      alert('Account information saved (client-side only)');
    } catch (err) {
      console.error('Save account error', err);
      setSaving(false);
      alert('Failed to save account information');
    }
  };

  if (loading) return <div className="p-6">Loading account...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-slate-800">Account Information</h1>
              <div className="text-sm text-slate-500">Friday 07/11/2025</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-1 bg-slate-50 p-6 rounded-lg border border-slate-100">
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden border-2 border-slate-200 mb-4">
                    {photoPreview ? (
                      <img src={photoPreview} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">No Photo</div>
                    )}
                  </div>
                  <label className="inline-flex items-center space-x-2">
                    <input type="file" accept="image/*" onChange={onPhotoChange} />
                  </label>
                </div>
              </div>

              <form onSubmit={onSave} className="col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">First Name</label>
                    <input value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Last Name</label>
                    <input value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Contact Number</label>
                    <input value={contactNumber} onChange={e => setContactNumber(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-slate-600 mb-1">Address</label>
                  <input value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-slate-600 mb-1">Birthday</label>
                  <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                </div>

                <div className="flex items-center space-x-3">
                  <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => router.back()} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
