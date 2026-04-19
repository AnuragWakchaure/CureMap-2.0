import React from "react";
import { Link } from "react-router-dom";
import { FaDna } from "react-icons/fa";
// Using cleaner 'Feather' icons for a more modern look
import {
  FiUpload,
  FiCpu,
  FiBarChart2,
  FiLock,
  FiGitMerge,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

export default function Landing() {
  return (
    // Use a clean white background for a modern SaaS feel
    <div className="min-h-screen bg-white text-slate-800">
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 shadow-lg flex items-center justify-center text-white text-lg">
              <FaDna />
            </div>
            <div className="text-lg font-semibold text-slate-900">CureMap</div>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium shadow-sm hover:bg-indigo-500 transition-all transform hover:scale-105"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Hero Content Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 items-center py-16 md:py-24">
          
          {/* Left: Hero Text Content */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
              Predict Cancer Drug Response with{" "}
              <span className="text-indigo-600">Machine Learning</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-xl">
              Upload gene expression or clinical data, run state-of-the-art models, and get SHAP-based explainability — all inside a clean, secure web app.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-md bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 font-medium"
              >
                Get started for free
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#features"
                className="px-6 py-3 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all inline-flex items-center gap-2 font-medium"
              >
                Learn more
              </a>
            </div>

            {/* Mini-features below hero text */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
                  <FiUpload className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-700">Easy Upload</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
                  <FiCpu className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-700">ML Predictions</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
                  <FiBarChart2 className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-slate-700">Explainability</span>
              </div>
            </div>
          </div>

          {/* Right: Redesigned Visual Card (Glassmorphism style) */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute w-72 h-72 bg-indigo-200 rounded-full opacity-20 -top-10 -right-10 blur-3xl"></div>
            <div className="absolute w-72 h-72 bg-purple-200 rounded-full opacity-20 -bottom-10 -left-10 blur-3xl"></div>
            
            <div className="w-full max-w-md bg-white/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 p-6 transform hover:-translate-y-1 hover:shadow-3xl transition-all duration-300 z-10">
              {/* This is where you put your demonstrative image */}
              <img
                // Using a placeholder that looks like the AI-generated image
                src="/Gemini_Generated_Image_ihjolnihjolnihjo.png"
                alt="Demonstrative UI of data analysis"
                className="w-full h-56 object-cover rounded-lg shadow-lg border border-slate-100"
                onError={(e) => { e.target.src = 'https://placehold.co/600x350/e0e7ff/4f46e5?text=Prediction+Dashboard' }}
              />
              <div className="mt-5">
                <h3 className="text-xl font-semibold text-slate-900">Run predictions in seconds</h3>
                <p className="text-sm text-slate-600 mt-2">
                  Try a demo dataset or sign up to upload your own. Results include probabilities and per-feature contributions.
                </p>
                <div className="mt-5 flex gap-3">
                  <Link
                    to="/login"
                    className="flex-1 text-center text-sm px-4 py-2 border border-slate-300 rounded-md font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 text-center text-sm px-4 py-2 rounded-md bg-indigo-600 font-medium text-white hover:bg-indigo-500 transition-colors"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </section>
      </main>

      {/* Redesigned Features Section */}
      <section id="features" className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything you need. All in one platform.
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              From secure data ingestion to clinician-ready reports, CureMap provides a complete, end-to-end workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Feature Card 1 */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transition-all transform hover:-translate-y-1 hover:shadow-2xl duration-300">
              <img
                src="https://placehold.co/500x250/eef2ff/4f46e5?text=Secure+Data+Vault"
                alt="Secure Data"
                className="w-full h-40 object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/500x250' }}
              />
              <div className="p-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  <FiLock className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-lg text-slate-900">Secure Data Handling</h4>
                <p className="text-sm text-slate-500 mt-2">
                  Encrypted storage & role-based access control to protect sensitive patient data.
                </p>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transition-all transform hover:-translate-y-1 hover:shadow-2xl duration-300">
              <img
                src="https://placehold.co/500x250/f0f9ff/0284c7?text=ML+Model+Pipeline"
                alt="Model Agnostic"
                className="w-full h-40 object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/500x250' }}
              />
              <div className="p-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-sky-100 text-sky-600 mb-4">
                  <FiGitMerge className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-lg text-slate-900">Model-Agnostic</h4>
                <p className="text-sm text-slate-500 mt-2">
                  Plug in PyTorch, scikit-learn, or remote model servers. We provide the pipelines.
                </p>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transition-all transform hover:-translate-y-1 hover:shadow-2xl duration-300">
              <img
                src="https://placehold.co/500x250/fefce8/ca8a04?text=SHAP+Value+Chart"
                alt="Explainable Outputs"
                className="w-full h-40 object-cover"
                onError={(e) => { e.target.src = 'https://placehold.co/500x250' }}
              />
              <div className="p-6">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600 mb-4">
                  <FiBarChart2 className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-lg text-slate-900">Explainable Outputs</h4>
                <p className="text-sm text-slate-500 mt-2">
                  Feature-level SHAP values and plain-language takeaways for clinicians.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-sm text-slate-500 flex justify-between items-center">
          <div>
            © {new Date().getFullYear()} CureMap — Built for research and prototyping.
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hover:text-indigo-600">Login</Link>
            <Link to="/register" className="hover:text-indigo-600">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}