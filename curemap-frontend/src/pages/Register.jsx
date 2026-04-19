import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiUser, FiMail, FiLock, FiHome, FiArrowLeft, FiCheck } from "react-icons/fi";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Connects to your Express backend on Port 5000
      await axios.post("http://localhost:5000/api/auth/register", { 
        fullName, 
        email, 
        password, 
        institution 
      });
      
      // After registration, we usually send them to login
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data || "Registration failed. Email might already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center relative p-4">
      
      {/* Back to Home Arrow */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-all"
      >
        <FiArrowLeft /> Back to Home
      </Link>

      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden border border-white">
        
        {/* Left Side: Marketing (Indigo) */}
        <div className="bg-indigo-600 p-10 text-white flex flex-col justify-center">
          <h2 className="text-4xl font-black leading-tight">Join the CureMap Research Network</h2>
          <p className="mt-4 text-indigo-100 text-lg">
            Create an account to start mapping drug responses and managing patient datasets.
          </p>

          <div className="mt-10 space-y-5">
            <RegisterBenefit text="Secure Multi-Omics Data Storage" />
            <RegisterBenefit text="Advanced VAE Latent Space Mapping" />
            <RegisterBenefit text="Collaborative Prediction History" />
            <RegisterBenefit text="Explainable AI Results (SHAP)" />
          </div>

          <div className="mt-12 pt-8 border-t border-indigo-500/50">
            <p className="text-sm text-indigo-200">Already a member?</p>
            <Link to="/login" className="text-white font-bold hover:underline">Sign in to your portal</Link>
          </div>
        </div>

        {/* Right Side: Form (White) */}
        <div className="bg-white p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-slate-900">Create Account</h3>
            <p className="text-slate-500 mt-2">Start your 14-day research trial today.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
              <div className="relative mt-2">
                <FiUser className="absolute left-4 top-3.5 text-slate-400" />
                <input 
                  required 
                  type="text" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Anurag Wakchaure"
                  className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all bg-slate-50" 
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative mt-2">
                <FiMail className="absolute left-4 top-3.5 text-slate-400" />
                <input 
                  required 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="researcher@avcoe.org"
                  className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all bg-slate-50" 
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <div className="relative mt-2">
                <FiLock className="absolute left-4 top-3.5 text-slate-400" />
                <input 
                  required 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all bg-slate-50" 
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Institution</label>
              <div className="relative mt-2">
                <FiHome className="absolute left-4 top-3.5 text-slate-400" />
                <input 
                  type="text" 
                  value={institution} 
                  onChange={e => setInstitution(e.target.value)}
                  placeholder="AVCOE Sangamner"
                  className="w-full border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all bg-slate-50" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 py-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-200"
            >
              {loading ? "Creating Account..." : "Register Now"}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-400 text-center leading-relaxed">
            By registering, you agree to the CureMap <span className="text-indigo-600 cursor-pointer">Data Privacy Agreement</span> and <span className="text-indigo-600 cursor-pointer">Terms of Service</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

// Benefit Checkmark component
const RegisterBenefit = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="w-6 h-6 rounded-full bg-indigo-500/30 flex items-center justify-center">
      <FiCheck size={14} className="text-white" />
    </div>
    <span className="text-indigo-50 font-medium">{text}</span>
  </div>
);