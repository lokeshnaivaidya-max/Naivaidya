import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import naivaidyaLogo from "@assets/naivaidya_logo.jpg";

type Status = "Pending" | "Contacted" | "Interested" | "Follow Up Required" | "Not Interested";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  status: Status;
  contacted: boolean;
}

const STATUS_COLORS: Record<Status, string> = {
  "Pending": "bg-gray-100 text-gray-600",
  "Contacted": "bg-blue-100 text-blue-700",
  "Interested": "bg-green-100 text-green-700",
  "Follow Up Required": "bg-amber-100 text-amber-700",
  "Not Interested": "bg-red-100 text-red-600",
};

const STATUS_DOT: Record<Status, string> = {
  "Pending": "bg-gray-400",
  "Contacted": "bg-blue-500",
  "Interested": "bg-green-500",
  "Follow Up Required": "bg-amber-500",
  "Not Interested": "bg-red-500",
};

const STATUSES: Status[] = ["Pending", "Contacted", "Interested", "Follow Up Required", "Not Interested"];

const INITIAL_LEADS: Lead[] = [];

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-5">
        <svg className="w-10 h-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No waitlist users yet</h3>
      <p className="text-gray-500 text-sm max-w-xs">New registrations from the website will appear here. Share the waitlist link to start collecting leads.</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "All">("All");

  const filtered = useMemo(() =>
    leads.filter(l =>
      (filterStatus === "All" || l.status === filterStatus) &&
      (l.name.toLowerCase().includes(search.toLowerCase()) ||
       l.email.toLowerCase().includes(search.toLowerCase()) ||
       l.phone.includes(search))
    ), [leads, search, filterStatus]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: leads.length };
    STATUSES.forEach(s => { c[s] = leads.filter(l => l.status === s).length; });
    return c;
  }, [leads]);

  const updateStatus = (id: number, status: Status) =>
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));

  const toggleContacted = (id: number) =>
    setLeads(prev => prev.map(l => l.id === id
      ? { ...l, contacted: !l.contacted, status: (!l.contacted ? "Contacted" : l.status) as Status }
      : l));

  const logout = () => setLocation("/admin");

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #F5F0FF 0%, #F8F6FF 100%)" }}>
      {/* Sticky header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Back to website */}
            <button
              onClick={() => setLocation("/")}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#7C3AED] transition-colors mr-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Website
            </button>
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-[0_0_14px_rgba(124,58,237,0.22)] flex-shrink-0">
              <img src={naivaidyaLogo} alt="NAIVAIDYA" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm leading-tight">NAIVAIDYA</div>
              <div className="text-gray-400 text-xs">Waitlist CRM</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live
            </div>
            <button
              onClick={logout}
              className="text-xs font-semibold text-gray-500 hover:text-red-500 transition-colors border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Waitlist</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage all registered users.</p>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { label: "Total", key: "All", color: "text-gray-900" },
            ...STATUSES.map(s => ({ label: s, key: s, color: "text-gray-700" }))
          ].map(({ label, key, color }) => (
            <motion.button
              key={key}
              onClick={() => setFilterStatus(key as Status | "All")}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.15 }}
              className={`rounded-xl p-3.5 text-left border transition-all ${
                filterStatus === key
                  ? "border-[#7C3AED] bg-purple-50 shadow-[0_4px_16px_rgba(124,58,237,0.12)]"
                  : "border-purple-100/60 bg-white hover:border-purple-200"
              }`}
            >
              <div className={`text-2xl font-bold ${filterStatus === key ? "text-[#7C3AED]" : color}`}>
                {counts[key] ?? 0}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5 truncate leading-tight">{label}</div>
            </motion.button>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-purple-100/60 shadow-[0_4px_24px_rgba(124,58,237,0.07)] overflow-hidden">
          {/* Search bar */}
          <div className="p-4 border-b border-purple-50 flex items-center gap-3">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone…"
              className="flex-1 text-sm text-gray-700 outline-none placeholder-gray-400 bg-transparent"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 text-xs font-medium">
                Clear
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="bg-purple-50/50 text-left border-b border-purple-50">
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400 w-10">✓</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Name</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Email</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Phone</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Registered</th>
                  <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState />
                    </td>
                  </tr>
                ) : (
                  filtered.map(lead => (
                    <tr key={lead.id} className="border-b border-purple-50/60 hover:bg-purple-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={lead.contacted}
                          onChange={() => toggleContacted(lead.id)}
                          className="w-4 h-4 accent-[#7C3AED] rounded cursor-pointer"
                          title="Mark as contacted"
                        />
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900">{lead.name}</td>
                      <td className="px-5 py-4 text-gray-500">{lead.email}</td>
                      <td className="px-5 py-4 text-gray-500">{lead.phone}</td>
                      <td className="px-5 py-4 text-gray-400 text-xs">{lead.date}</td>
                      <td className="px-5 py-4">
                        <div className="relative inline-flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[lead.status]}`} />
                          <select
                            value={lead.status}
                            onChange={e => updateStatus(lead.id, e.target.value as Status)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer appearance-none ${STATUS_COLORS[lead.status]}`}
                          >
                            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 text-xs text-gray-400 border-t border-purple-50 flex items-center justify-between">
            <span>{filtered.length} of {leads.length} registrations</span>
            {filterStatus !== "All" && (
              <button onClick={() => setFilterStatus("All")} className="text-[#7C3AED] font-semibold hover:underline">
                Clear filter
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
