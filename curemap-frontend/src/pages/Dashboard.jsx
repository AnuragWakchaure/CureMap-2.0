import React, { useState } from 'react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

// --- ICONS ---
const IconBeaker = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15"></path><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"></path><path d="M6 14h12"></path></svg>
);
const IconActivity = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [fileStatus, setFileStatus] = useState("No file selected");
  const [formData, setFormData] = useState({ 
    patientName: '', 
    drug: 'Cisplatin', 
    features: [] 
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileStatus(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const featureArray = text.split(/[,\n\r]+/).map(val => val.trim()).filter(val => val !== "").map(Number);
      setFormData({ ...formData, features: featureArray });
    };
    reader.readAsText(file);
  };

  const runAnalysis = async () => {
    if (!formData.patientName || formData.features.length === 0) {
      alert("Please enter Patient ID and upload CSV.");
      return;
    }
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await axios.post('http://localhost:5000/api/records/predict', {
        ...formData,
        userId: user._id || user.id
      });
      setResult(response.data);
    } catch (error) {
      alert("Error contacting AI Engine.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to format the bar chart data (using top 10 genomic features)
  const getBarData = () => {
    if (!formData.features || formData.features.length === 0) return [];
    return formData.features.slice(0, 10).map((val, i) => ({
      name: `Marker ${i + 1}`,
      expression: val,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
      <header>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">CureMap Analysis</h2>
        <p className="text-slate-500 font-medium">Predicting drug sensitivity via high-dimensional multi-omics integration.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* --- COLUMN 1: CONFIGURATION --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><IconBeaker /></span>
              Input Parameters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Patient Identifier</label>
                <input type="text" placeholder="ID" className="w-full p-3 bg-slate-50 border rounded-xl" onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Compound Selection</label>
                <select className="w-full p-3 bg-slate-50 border rounded-xl font-medium text-slate-700" onChange={(e) => setFormData({...formData, drug: e.target.value})}>
                  <option value="Cisplatin">Cisplatin</option>
                  <option value="Lapatinib">Lapatinib</option>
                  <option value="Docetaxel">Docetaxel</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Genomic Data (.csv)</label>
                <input type="file" id="file" className="hidden" onChange={handleFileUpload} />
                <label htmlFor="file" className="block w-full p-3 border-2 border-dashed rounded-xl text-center text-sm text-slate-500 cursor-pointer hover:bg-slate-50">
                  {fileStatus}
                </label>
              </div>
              <button onClick={runAnalysis} disabled={loading} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                {loading ? "Processing..." : "Run Analysis"}
              </button>
            </div>
          </div>

          {/* EXPLANATORY CARD */}
          <div className="bg-indigo-900 p-6 rounded-3xl text-indigo-100">
            <h4 className="font-bold mb-2">What is IC50?</h4>
            <p className="text-xs leading-relaxed text-indigo-200/80">
              The half maximal inhibitory concentration (IC50) measures a drug's potency. 
              A <b>Lower Score</b> indicates high sensitivity, meaning the drug is effective at smaller doses.
            </p>
          </div>
        </div>

        {/* --- COLUMN 2 & 3: VISUALIZATIONS --- */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Score Gauge */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-500 uppercase mb-4 text-center">Potency Score</h4>
                  <div className="h-48 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[{ value: result.ic50Score }, { value: Math.max(0, 10 - result.ic50Score) }]} innerRadius={60} outerRadius={80} startAngle={180} endAngle={0} dataKey="value" stroke="none">
                          <Cell fill={result.interpretation === 'Sensitive' ? '#10b981' : '#f43f5e'} />
                          <Cell fill="#f1f5f9" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
                      <span className="text-4xl font-black text-slate-900">{result.ic50Score?.toFixed(2)}</span>
                      <span className={`text-xs font-bold uppercase ${result.interpretation === 'Sensitive' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {result.interpretation}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Summary */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2">
                    <IconActivity /> Patient Insight
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-400 text-sm">Status</span>
                      <span className="font-bold text-slate-800">{result.interpretation}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-slate-400 text-sm">Drug</span>
                      <span className="font-bold text-slate-800">{result.drugName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm">Patient ID</span>
                      <span className="font-bold text-slate-800 truncate max-w-[100px]">{result.patientName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BAR GRAPH: GENOMIC DISTRIBUTION */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Genomic Marker Profile</h3>
                  <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500">Top 10 Biomarkers</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getBarData()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                        cursor={{fill: '#f8fafc'}}
                      />
                      <Bar dataKey="expression" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-4 text-xs text-slate-400 italic">
                  * Visualizing the expression levels of the primary genomic features processed by the random forest engine.
                </p>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
              <IconBeaker />
              <p className="mt-2 font-medium">No active analysis. Please upload data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;