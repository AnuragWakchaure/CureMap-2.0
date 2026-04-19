import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, FileText, ChevronRight } from 'lucide-react';

const History = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const res = await axios.get(`http://localhost:5000/api/records/history/${userId}`);
        setRecords(res.data);
      } catch (err) {
        console.error("Error fetching history");
      }
    };
    fetchHistory();
  }, []);

  const filteredRecords = records.filter(r => 
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.drugName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Prediction History</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search patient or drug..." 
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-sm">
            <tr>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Drug Tested</th>
              <th className="px-6 py-4">IC50 Score</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredRecords.map((record) => (
              <tr key={record._id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 font-medium text-slate-800">{record.patientName}</td>
                <td className="px-6 py-4 text-slate-600">{record.drugName}</td>
                <td className="px-6 py-4 font-mono">{record.ic50Score.toFixed(4)}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    record.interpretation === 'Sensitive' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {record.interpretation}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{new Date(record.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-semibold">
                    View Report <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
