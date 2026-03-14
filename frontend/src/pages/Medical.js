import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { HeartPulse, Plus, Edit2, Trash2, Pill, Stethoscope, Building2, List, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';

const Medical = () => {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRec, setCurrentRec] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    condition: '',
    medication: '',
    doctor: '',
    hospital: '',
    notes: ''
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await api.get('/medical');
      setRecords(res.data);
    } catch (error) {
      console.error('Failed to fetch medical records', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (rec = null) => {
    if (rec) {
      setCurrentRec(rec);
      setFormData({
        condition: rec.condition,
        medication: rec.medication || '',
        doctor: rec.doctor || '',
        hospital: rec.hospital || '',
        notes: rec.notes || ''
      });
    } else {
      setCurrentRec(null);
      setFormData({ condition: '', medication: '', doctor: '', hospital: '', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (currentRec) {
        // Update
        const res = await api.put(`/medical/${currentRec._id}`, formData);
        setRecords(records.map(r => r._id === currentRec._id ? res.data : r));
      } else {
        // Create
        const res = await api.post('/medical', formData);
        setRecords([res.data, ...records]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Attempt failed', error);
      alert('Failed to save medical record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medical record?')) {
      try {
        await api.delete(`/medical/${id}`);
        setRecords(records.filter(r => r._id !== id));
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const filteredRecords = records.filter(rec => 
    rec.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            <HeartPulse className="text-rose-500" size={32} />
            Medical History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Log ongoing conditions, treatments, and doctors.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary bg-rose-500 hover:bg-rose-600 focus:ring-rose-500 flex justify-center items-center gap-2">
          <Plus size={18} /> Add Condition
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <List className="text-slate-400" size={20} />
        </div>
        <input
          type="text"
          placeholder="Search by diagnosis or condition name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10 bg-white"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-rose-500" size={40} />
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-darkCard rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <HeartPulse size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">No medical records found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Document important health details for critical care.</p>
          <button onClick={() => openModal()} className="mt-4 px-4 py-2 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 font-medium rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors inline-flex items-center gap-2">
            <Plus size={18} /> Add New Record
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((rec, idx) => (
            <div 
              key={rec._id} 
              className="card !p-0 overflow-hidden relative group animate-in slide-in-from-left-4 fade-in duration-300"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex flex-col md:flex-row">
                
                {/* Condition Name block */}
                <div className="bg-rose-50 dark:bg-rose-900/20 p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{rec.condition}</h3>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => openModal(rec)} className="text-sm px-3 py-1 bg-white dark:bg-darkCard rounded shadow-sm text-slate-600 dark:text-slate-300 hover:text-rose-500 flex items-center gap-1 transition-colors">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(rec._id)} className="text-sm px-3 py-1 bg-white dark:bg-darkCard rounded shadow-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-1 transition-colors">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>

                {/* Details Block */}
                <div className="p-6 md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rec.medication && (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-rose-400"><Pill size={18} /></div>
                      <div>
                        <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Current Medication</span>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{rec.medication}</p>
                      </div>
                    </div>
                  )}
                  {rec.doctor && (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-rose-400"><Stethoscope size={18} /></div>
                      <div>
                        <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Treating Doctor</span>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{rec.doctor}</p>
                      </div>
                    </div>
                  )}
                  {rec.hospital && (
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-rose-400"><Building2 size={18} /></div>
                      <div>
                        <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Hospital</span>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{rec.hospital}</p>
                      </div>
                    </div>
                  )}
                  {rec.notes && (
                    <div className="sm:col-span-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                      <p className="text-sm italic text-slate-600 dark:text-slate-400">"{rec.notes}"</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={currentRec ? 'Edit Medical Record' : 'Log New Condition'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Condition / Diagnosis *</label>
            <input 
              type="text" name="condition" required value={formData.condition} onChange={handleInputChange} 
              className="input-field border-rose-200 focus:border-rose-500 focus:ring-rose-500" placeholder="e.g. Asthma, High Blood Pressure" 
            />
          </div>
          <div>
            <label className="label-text">Current Medication & Dosage</label>
            <textarea 
              name="medication" value={formData.medication} onChange={handleInputChange} 
              className="input-field focus:border-rose-500 focus:ring-rose-500" placeholder="e.g. Inhaler twice daily" rows="2"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Treating Doctor</label>
              <input 
                type="text" name="doctor" value={formData.doctor} onChange={handleInputChange} 
                className="input-field focus:border-rose-500 focus:ring-rose-500" placeholder="Dr. Smith" 
              />
            </div>
            <div>
              <label className="label-text">Associated Hospital</label>
              <input 
                type="text" name="hospital" value={formData.hospital} onChange={handleInputChange} 
                className="input-field focus:border-rose-500 focus:ring-rose-500" placeholder="City General" 
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary bg-rose-500 hover:bg-rose-600 flex items-center gap-2">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {currentRec ? 'Update' : 'Save'} Record
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Medical;
