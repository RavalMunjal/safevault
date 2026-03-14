import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  Users, 
  FileText, 
  HeartPulse, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  PlusCircle,
  AlertTriangle
} from 'lucide-react';

const DashboardCard = ({ title, count, icon: Icon, colorClass, linkTo, delay }) => (
  <div className={`card relative overflow-hidden group animate-in slide-in-from-bottom-8 fade-in duration-700 ${delay}`}>
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-500 ${colorClass}`}></div>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
          {title}
        </p>
        <h3 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-2">
          {count}
        </h3>
      </div>
      <div className={`p-3 rounded-2xl ${colorClass} bg-opacity-20 dark:bg-opacity-20`}>
        <Icon size={28} className={colorClass.replace('bg-', 'text-')} />
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
      <Link 
        to={linkTo} 
        className={`flex items-center text-sm font-medium hover:underline transition-colors ${colorClass.replace('bg-', 'text-')}`}
      >
        Manage {title}
        <ArrowRight size={16} className="ml-1" />
      </Link>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ contacts: 0, documents: 0, medical: 0 });
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [contactsRes, docsRes, medRes, profileRes] = await Promise.all([
          api.get('/contacts').catch(() => ({ data: [] })),
          api.get('/documents').catch(() => ({ data: [] })),
          api.get('/medical').catch(() => ({ data: [] })),
          api.get('/profile').catch(() => ({ data: null }))
        ]);

        setStats({
          contacts: contactsRes.data.length,
          documents: docsRes.data.length,
          medical: medRes.data.length,
        });

        // Check if profile exists and has blood group
        if (profileRes.data && profileRes.data.bloodGroup) {
          setProfileComplete(true);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Hero / Welcome Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-900 dark:to-slate-800 p-8 sm:p-12 shadow-xl animate-in slide-in-from-top-8 fade-in duration-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2 blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400 opacity-20 rounded-full transform -translate-x-1/2 translate-y-1/2 blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-white text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-indigo-100 text-lg max-w-xl">
              Your emergency security locker is active. Keep your critical information updated to ensure it's available when needed most.
            </p>
          </div>
          <div className="shrink-0 p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-inner hidden sm:block">
            <ShieldCheck size={64} className="text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Profile Alert */}
      {!loading && !profileComplete && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm animate-in fade-in duration-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Action Recommended: Your emergency profile is incomplete.
              </p>
              <p className="text-sm border-t border-amber-200 dark:border-amber-800/50 mt-2 pt-2 text-amber-700 dark:text-amber-300">
                Please add your blood group and medical conditions.{' '}
                <Link to="/profile" className="font-bold hover:underline">
                  Update Profile Now &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Emergency Contacts" 
          count={stats.contacts} 
          icon={Users} 
          colorClass="bg-blue-500" 
          linkTo="/contacts"
          delay="delay-100"
        />
        <DashboardCard 
          title="Identity Documents" 
          count={stats.documents} 
          icon={FileText} 
          colorClass="bg-emerald-500" 
          linkTo="/documents"
          delay="delay-200"
        />
        <DashboardCard 
          title="Medical Records" 
          count={stats.medical} 
          icon={HeartPulse} 
          colorClass="bg-rose-500" 
          linkTo="/medical"
          delay="delay-300"
        />
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white pt-4 animate-in fade-in duration-700 delay-500">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in slide-in-from-bottom-8 fade-in duration-700 delay-500">
        <Link to="/contacts" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-darkCard border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md hover:border-primary dark:hover:border-indigo-400 transition-all group">
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full text-primary dark:text-primary group-hover:scale-110 transition-transform shadow-inner mb-3">
            <PlusCircle size={24} />
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Add Contact</span>
        </Link>
        <Link to="/documents" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-darkCard border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-400 transition-all group">
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-inner mb-3">
            <FileText size={24} />
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Upload Doc</span>
        </Link>
        <Link to="/medical" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-darkCard border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md hover:border-rose-500 dark:hover:border-rose-400 transition-all group">
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform shadow-inner mb-3">
            <Activity size={24} />
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Add Condition</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center p-4 bg-white dark:bg-darkCard border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-md hover:border-amber-500 dark:hover:border-amber-400 transition-all group">
          <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-full text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform shadow-inner mb-3">
            <HeartPulse size={24} />
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Blood Group</span>
        </Link>
      </div>

    </div>
  );
};

export default Dashboard;
