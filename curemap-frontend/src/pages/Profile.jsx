import React from 'react';
import { User, Building, Mail, Calendar } from 'lucide-react';

const Profile = () => {
  // Assuming user data is stored in localStorage after login
  const user = JSON.parse(localStorage.getItem('user')) || {
    fullName: "Anurag Wakchaure",
    email: "anurag@example.com",
    institution: "Amrutvahini College of Engineering (AVCOE)",
    joinedAt: "2026-01-15"
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-32 bg-indigo-600"></div>
          <div className="px-8 pb-8">
            <div className="relative -top-12 flex items-end gap-6">
              <div className="h-24 w-24 bg-slate-200 rounded-2xl border-4 border-white flex items-center justify-center text-indigo-600 shadow-sm">
                <User size={48} />
              </div>
              <div className="mb-4">
                <h2 className="text-3xl font-bold text-slate-800">{user.fullName}</h2>
                <p className="text-slate-500">Principal Investigator | Precision Oncology</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <InfoTile icon={<Building size={20}/>} label="Institution" value={user.institution} />
              <InfoTile icon={<Mail size={20}/>} label="Email Address" value={user.email} />
              <InfoTile icon={<Calendar size={20}/>} label="Joined Platform" value={new Date(user.joinedAt).toDateString()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoTile = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
    <div className="text-indigo-500">{icon}</div>
    <div>
      <p className="text-xs text-slate-400 uppercase font-bold">{label}</p>
      <p className="text-slate-700 font-medium">{value}</p>
    </div>
  </div>
);

export default Profile;