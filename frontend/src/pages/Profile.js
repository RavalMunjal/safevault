import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { UserCircle, Save, CheckCircle, Loader2 } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({
    bloodGroup: '',
    allergies: '',
    medicalConditions: '',
    hospitalPreference: '',
    additionalNotes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      if (res.data) {
        setProfile({
          bloodGroup: res.data.bloodGroup || '',
          allergies: res.data.allergies?.join(', ') || '',
          medicalConditions: res.data.medicalConditions?.join(', ') || '',
          hospitalPreference: res.data.hospitalPreference || '',
          additionalNotes: res.data.additionalNotes || ''
        });
      }
    } catch (error) {
      console.log('No profile found, will create one on save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    
    try {
      // Convert comma strings to arrays for API
      const payload = {
        ...profile,
        allergies: profile.allergies ? profile.allergies.split(',').map(s => s.trim()) : [],
        medicalConditions: profile.medicalConditions ? profile.medicalConditions.split(',').map(s => s.trim()) : [],
      };
      
      await api.put('/profile', payload);
      setSuccessMsg('Profile saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
      
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <UserCircle className="text-primary" size={32} />
            Emergency Profile
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            This core information provides vital context to first responders.
          </p>
        </div>
      </div>

      <div className="card">
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 rounded-lg animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="text-emerald-500" size={20} />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-text">Blood Group</label>
              <select
                name="bloodGroup"
                value={profile.bloodGroup}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="label-text">Hospital Preference</label>
              <input
                type="text"
                name="hospitalPreference"
                value={profile.hospitalPreference}
                onChange={handleChange}
                placeholder="e.g. Apollo Hospital, City Center"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="label-text">Allergies (comma separated)</label>
            <textarea
              name="allergies"
              value={profile.allergies}
              onChange={handleChange}
              rows="2"
              placeholder="e.g. Peanuts, Penicillin, Dust"
              className="input-field"
            ></textarea>
          </div>

          <div>
            <label className="label-text">Pre-existing Medical Conditions (comma separated)</label>
            <textarea
              name="medicalConditions"
              value={profile.medicalConditions}
              onChange={handleChange}
              rows="2"
              placeholder="e.g. Diabetes Type 2, Asthma"
              className="input-field"
            ></textarea>
          </div>

          <div>
            <label className="label-text">Additional Notes for Responders</label>
            <textarea
              name="additionalNotes"
              value={profile.additionalNotes}
              onChange={handleChange}
              rows="4"
              placeholder="Any other critical instructions or information..."
              className="input-field"
            ></textarea>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              Save Profile
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Profile;
