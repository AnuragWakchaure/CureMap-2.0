import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaDna } from "react-icons/fa";

// --- INLINE SVG ICON COMPONENTS ---
const IconHome = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const IconUpload = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);
const IconActivity = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);
const IconHistory = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const IconLogOut = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
);
const IconMenu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);
const IconSearch = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 mr-2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

const DEFAULT_IMG = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Load User safely
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  });

  // Sync user data if changed elsewhere
  useEffect(() => {
    const handler = () => {
      try {
        setUser(JSON.parse(localStorage.getItem("user") || "{}"));
      } catch {
        setUser({});
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          flex-shrink-0 h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out z-20 shadow-xl
          ${collapsed ? "w-20" : "w-72"}
        `}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 bg-white">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center text-white text-lg">
              <FaDna />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 tracking-tight leading-none">CureMap</span>
                <span className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase mt-1">Oncology AI</span>
              </div>
            )}
          </div>
          
          {!collapsed && (
            <button 
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition"
            >
              <IconMenu />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
            <NavItem to="dashboard" icon={<IconHome />} label="Dashboard" collapsed={collapsed} />
            <NavItem to="history" icon={<IconHistory />} label="Research History" collapsed={collapsed} />
            
            <div className="pt-8 pb-4">
                {!collapsed && <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Account</p>}
                <NavItem to="profile" icon={<IconUser />} label="Scientist Profile" collapsed={collapsed} />
            </div>
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <img 
              src={user?.avatar || DEFAULT_IMG} 
              className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm ring-1 ring-slate-200"
              alt="User"
              onError={(e) => e.target.src = DEFAULT_IMG}
            />
            
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.fullName || "Researcher"}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
            )}

            {!collapsed && (
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                title="Logout"
              >
                <IconLogOut />
              </button>
            )}
          </div>
          
          {collapsed && (
              <button 
                onClick={() => setCollapsed(false)}
                className="mt-4 w-full flex justify-center text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <IconMenu />
              </button>
          )}
        </div>
      </aside>


      {/* --- CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-white border-b border-slate-200 z-10 px-8 flex items-center justify-between">
           <div className="flex items-center bg-slate-50 px-4 py-2 rounded-xl w-96 border border-slate-200 focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
              <IconSearch />
              <input 
                type="text" 
                placeholder="Search patient genomic IDs..." 
                className="bg-transparent border-none outline-none text-sm w-full text-slate-800 placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Research Session</span>
                <span className="text-slate-800 font-bold">{user?.fullName || "Guest Scientist"}</span>
              </div>
            </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
              <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

// NavItem Component
function NavItem({ to, icon, label, collapsed }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
        ${isActive 
          ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" 
          : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-md"
        }
        ${collapsed ? "justify-center" : ""}
      `}
    >
      <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
      {!collapsed && <span className="font-bold text-sm tracking-tight">{label}</span>}
      
      {collapsed && (
        <div className="fixed left-24 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
          {label}
        </div>
      )}
    </NavLink>
  );
}