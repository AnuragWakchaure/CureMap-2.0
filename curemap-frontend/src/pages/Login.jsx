import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMail, FiArrowLeft, FiActivity, FiUnlock, FiCpu } from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Connects to your Node.js backend on Port 5000
      // Inside your Login.jsx submit function
        const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));

        // Use the full nested path
        navigate("/app/dashboard"); 
        window.location.reload(); // Refresh to trigger sidebar appearance
    } catch (err) {
      alert(err.response?.data || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center relative p-4">
      
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-all"
      >
        <FiArrowLeft /> Back to Home
      </Link>

      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden border border-white">
        
        {/* Left Side: Marketing (Indigo) */}
        <div className="bg-indigo-600 p-10 text-white flex flex-col justify-center">
          <h2 className="text-4xl font-black leading-tight">Welcome back to CureMap</h2>
          <p className="mt-4 text-indigo-100 text-lg">
            Access your precision oncology dashboard and run high-fidelity drug response models.
          </p>

          <div className="mt-10 space-y-6">
            <FeatureItem icon={<FiActivity />} text="Real-time IC50 Predictions" />
            <FeatureItem icon={<FiCpu />} text="VAE Latent Space Analysis" />
            <FeatureItem icon={<FiUnlock />} text="Secure Clinical Records" />
          </div>

          <div className="mt-12 pt-8 border-t border-indigo-500/50">
            <p className="text-sm text-indigo-200">New to the platform?</p>
            <Link to="/register" className="text-white font-bold hover:underline">Create a research account</Link>
          </div>
        </div>

        {/* Right Side: Login Form (White) */}
        <div className="bg-white p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-slate-900">Sign in</h3>
            <p className="text-slate-500 mt-2">Enter your credentials to access the engine.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <input 
                required 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="researcher@avcoe.org"
                className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all bg-slate-50" 
              />
            </div>

            <div>
              <div className="flex justify-between">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-semibold text-indigo-600 hover:underline">Forgot?</a>
              </div>
              <input 
                required 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all bg-slate-50" 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-xl bg-indigo-600 text-white flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-200"
            >
              {loading ? "Verifying..." : <><FiMail size={18} /> Sign in to CureMap</>}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-semibold">Or continue with</span></div>
            </div>

            <button 
              type="button" 
              className="w-full py-3.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 font-semibold"
            >
              <FaGoogle className="text-red-500" />
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Small Sub-component for the Indigo side
const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
      {icon}
    </div>
    <span className="font-medium text-indigo-50">{text}</span>
  </div>
);