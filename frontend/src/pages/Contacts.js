import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Plus, Edit2, Trash2, Phone, Mail, UserCheck, Search, Loader2 } from 'lucide-react';
import Modal from '../components/Modal';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    phone: '',
    email: '',
    isTrusted: false,
    notes: ''
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data);
    } catch (error) {
      console.error('Failed to fetch contacts', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (contact = null) => {
    if (contact) {
      setCurrentContact(contact);
      setFormData({
        name: contact.name,
        relation: contact.relation || '',
        phone: contact.phone,
        email: contact.email || '',
        isTrusted: contact.isTrusted || false,
        notes: contact.notes || ''
      });
    } else {
      setCurrentContact(null);
      setFormData({ name: '', relation: '', phone: '', email: '', isTrusted: false, notes: '' });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (currentContact) {
        // Update
        const res = await api.put(`/contacts/${currentContact._id}`, formData);
        setContacts(contacts.map(c => c._id === currentContact._id ? res.data : c));
      } else {
        // Create
        const res = await api.post('/contacts', formData);
        setContacts([res.data, ...contacts]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Attempt failed', error);
      alert('Failed to save contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await api.delete(`/contacts/${id}`);
        setContacts(contacts.filter(c => c._id !== id));
      } catch (error) {
        console.error('Delete failed', error);
      }
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (contact.relation && contact.relation.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-8 fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            <Users className="text-blue-500" size={32} />
            Emergency Contacts
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage people to alert during an emergency.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex justify-center items-center gap-2">
          <Plus size={18} /> Add Contact
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-slate-400" size={20} />
        </div>
        <input
          type="text"
          placeholder="Search contacts by name or relation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10 bg-white"
        />
      </div>

      {/* List / Grid content */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-darkCard rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <Users size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white">No contacts found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Add your trusted emergency contacts here.</p>
          <button onClick={() => openModal()} className="mt-4 btn-primary inline-flex items-center gap-2">
            <Plus size={18} /> Add First Contact
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact, idx) => (
            <div 
              key={contact._id} 
              className="card relative group animate-in zoom-in-95 duration-300 delay-[50ms]"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              
              {/* Top actions hover */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => openModal(contact)} className="p-1.5 text-slate-400 hover:text-blue-500 bg-white dark:bg-slate-700 rounded-full shadow-sm" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(contact._id)} className="p-1.5 text-slate-400 hover:text-red-500 bg-white dark:bg-slate-700 rounded-full shadow-sm" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Card Body */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white pr-12">{contact.name}</h3>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{contact.relation || 'Friend'}</p>
                </div>
              </div>
              
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Phone size={16} className="text-slate-400" />
                  <span>{contact.phone}</span>
                </div>
                {contact.email && (
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Mail size={16} className="text-slate-400" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                )}
              </div>

              {contact.isTrusted && (
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <UserCheck size={14} />
                  Primary Trusted Contact
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title={currentContact ? 'Edit Contact' : 'Add New Contact'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Contact Name *</label>
            <input 
              type="text" name="name" required value={formData.name} onChange={handleInputChange} 
              className="input-field" placeholder="Jane Doe" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-text">Relation</label>
              <input 
                type="text" name="relation" value={formData.relation} onChange={handleInputChange} 
                className="input-field" placeholder="e.g. Spouse, Brother" 
              />
            </div>
            <div>
              <label className="label-text">Phone *</label>
              <input 
                type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} 
                className="input-field" placeholder="+91 9876543210" 
              />
            </div>
          </div>
          <div>
            <label className="label-text">Email</label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleInputChange} 
              className="input-field" placeholder="jane@example.com" 
            />
          </div>
          
          <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-lightBase dark:hover:bg-slate-700/50 transition-colors">
            <input 
              type="checkbox" name="isTrusted" checked={formData.isTrusted} onChange={handleInputChange} 
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500" 
            />
            <div>
              <p className="font-semibold text-sm text-slate-800 dark:text-white">Mark as Trusted Contact</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Trusted contacts take priority in emergencies</p>
            </div>
          </label>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {currentContact ? 'Update' : 'Save'} Contact
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default Contacts;
