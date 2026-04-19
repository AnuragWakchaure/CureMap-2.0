import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaDna } from "react-icons/fa";
import { FiLayout, FiClock, FiUser, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Remove token and user data
    navigate('/');
    window.location.reload(); // Refresh to hide sidebar
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiLayout /> },
    { name: 'History', path: '/history', icon: <FiClock /> },
    { name: 'Profile', path: '/profile', icon: <FiUser /> },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen sticky top-0 flex flex-col text-white shadow-2xl z-50">
      {/* Sidebar Logo */}
      <div className="p-8 flex items-center gap-3 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
          <FaDna size={16} />
        </div>
        <span className="text-xl font-bold tracking-tight">CureMap</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-medium ${
              location.pathname === item.path 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-medium"
        >
          <FiLogOut className="text-xl" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;