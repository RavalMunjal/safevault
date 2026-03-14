import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { FileText, Plus, Edit2, Trash2, Calendar, CreditCard, Search, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: 'Aadhaar',
    documentNumber: '',
    issuer: '',
    expiryDate: '',
    notes: ''
  });

  const docTypes = ['Aadhaar', 'PAN', 'Passport', 'Driving License', 'Voter ID', 'Insurance', 'Other'];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (doc = null) => {
    if (doc) {
      setCurrentDoc(doc);
      setFormData({
        type: doc.type,
        documentNumber: doc.documentNumber,
        issuer: doc.issuer || '',
        expiryDate: doc.expiryDate ? doc.expiryDate.split('T')[0] : '', // Format for input type="date"
        notes: doc.notes || ''
      });
    } else {
      setCurrentDoc(null);
      setFormData({ type: 'Aadhaar', documentNumber: '', issuer: '', expiryDate: '', notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Format Empty dates payload to null for mongoose
    const payload = { ...formData };
    if (!payload.expiryDate) delete payload.expiryDate;

    try {
      if (currentDoc) {
        // Update
        const res = await api.put(`/documents/${currentDoc._id}`, payload);
        setDocuments(documents.map(d => d._id === currentDoc._id ? res.data : d));
      } else {
        // Create
        const res = await api.post('/documents', payload);
        setDocuments([res.data, ...documents]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Attempt failed', error);
      alert('Failed to save document info');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document record?')) {
      try {
        await api.delete(`/documents/${id}`);
        setDocuments(documents.filter(d => d._id !== id));
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.documentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            <FileText className="text-emerald-500" size={32} />
            Identity Documents
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Keep track of your document numbers for emergencies.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500 flex justify-center items-center gap-2">
          <Plus size={18} /> Add Document
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-slate-400" size={20} />
        </div>
        <input
          type="text"
          placeholder="Search by document type or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10 bg-white"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500" size={40} />
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-darkCard rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">No documents listed</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Store your critical identity numbers here.</p>
          <button onClick={() => openModal()} className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors inline-flex items-center gap-2">
            <Plus size={18} /> Add Document Info
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc, idx) => (
            <div 
              key={doc._id} 
              className="card relative group animate-in zoom-in-95 duration-300 delay-[50ms] border-t-4 border-t-emerald-500"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => openModal(doc)} className="p-1.5 text-slate-400 hover:text-emerald-500 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(doc._id)} className="p-1.5 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="mb-4">
                <span className="badge badge-success">{doc.type}</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Document Number</p>
                  <p className="font-mono text-lg font-bold text-slate-800 dark:text-white tracking-widest mt-1">
                    {doc.documentNumber}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {doc.issuer && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold flex items-center gap-1">
                        <CreditCard size={12} /> Issuer
                      </p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">{doc.issuer}</p>
                    </div>
                  )}
                  {doc.expiryDate && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold flex items-center gap-1">
                        <Calendar size={12} /> Expires
                      </p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">
                        {new Date(doc.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                {doc.notes && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{doc.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={currentDoc ? 'Edit Document Info' : 'Add Document Info'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Document Type *</label>
            <select 
              name="type" required value={formData.type} onChange={handleInputChange} 
              className="input-field"
            >
              {docTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-text">Document Number *</label>
            <input 
              type="text" name="documentNumber" required value={formData.documentNumber} onChange={handleInputChange} 
              className="input-field font-mono uppercase" placeholder="e.g. ABCDE1234F" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Issuer Authority</label>
              <input 
                type="text" name="issuer" value={formData.issuer} onChange={handleInputChange} 
                className="input-field" placeholder="e.g. Govt of India" 
              />
            </div>
            <div>
              <label className="label-text">Expiry Date</label>
              <input 
                type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} 
                className="input-field" 
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {currentDoc ? 'Update' : 'Save'} Info
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Documents;
