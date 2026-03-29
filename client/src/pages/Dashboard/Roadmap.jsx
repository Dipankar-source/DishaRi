import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiDownload,
  FiClock,
  FiTarget,
  FiCheckCircle,
  FiLoader,
  FiMap,
  FiChevronRight,
  FiAward,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";
import RoadmapVisualNew from "../Learn/RoadmapVisualNew";

const Roadmap = () => {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    fetchUserRoadmaps();
  }, []);

  const fetchUserRoadmaps = async () => {
    try {
      setLoading(true);
      const res = await api.get("/roadmap/user/roadmaps");
      
      if (res.data && res.data.length > 0) {
        setRoadmaps(res.data);
        // Expand the first one by default
        setExpandedId(res.data[0]._id);
        
        // Load progress for all roadmaps
        const progressMap = {};
        res.data.forEach(rm => {
          const saved = localStorage.getItem(`roadmap-progress-${rm._id}`);
          if (saved) {
            progressMap[rm._id] = JSON.parse(saved);
          } else {
            progressMap[rm._id] = {};
          }
        });
        setProgressData(progressMap);
      }
    } catch (err) {
      console.error("Error fetching roadmaps:", err);
      toast.error("Failed to load roadmaps");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTopic = async (roadmapId, sectionId, topicId) => {
    const key = `${sectionId}-${topicId}`;
    const newStatus = !(progressData[roadmapId]?.[key]);

    // Optimistic update
    setProgressData(prev => {
      const roadmapProgress = { ...(prev[roadmapId] || {}) };
      roadmapProgress[key] = newStatus;
      return { ...prev, [roadmapId]: roadmapProgress };
    });

    try {
      await api.post("/roadmap/topic-progress", {
        roadmapId,
        sectionId,
        topicId,
        isCompleted: newStatus
      });
      toast.success(newStatus ? "Topic completed!" : "Topic uncompleted");
    } catch (err) {
      console.error("Failed to sync progress:", err);
      toast.error("Sync failed. Progress saved locally.");
      localStorage.setItem(`roadmap-progress-${roadmapId}`, JSON.stringify({ ...progressData[roadmapId], [key]: newStatus }));
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const res = await api.get(`/roadmap/download/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", `${title || "roadmap"}.pdf`);
      document.body.appendChild(a);
      a.click();
      a.parentNode.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Download started");
    } catch (err) {
      toast.error("Failed to download roadmap");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 bg-[#09090f] overflow-auto">
        <div className="animate-pulse space-y-6 max-w-5xl mx-auto mt-10">
          <div className="h-24 bg-slate-800/40 rounded-[2rem]" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-slate-800/20 rounded-[2rem]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <div className="flex-1 p-6 bg-[#09090f] overflow-auto flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <FiMap className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">No Roadmaps Yet</h2>
          <p className="text-slate-400 mb-8 leading-relaxed text-sm">
            Generate your first AI-powered learning path in the Learn section to see it here.
          </p>
          <button
            onClick={() => navigate("/learn")}
            className="px-8 py-3.5 bg-amber-400 text-slate-900 rounded-2xl font-bold hover:bg-amber-300 transition-all shadow-xl shadow-amber-400/20 active:scale-95"
          >
            Generate My First Roadmap
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-[#09090f] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#09090f]/80 backdrop-blur-xl border-b border-white/5 px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
              <span className="w-1.5 h-8 bg-amber-400 rounded-full" />
              Roadmap Workspace
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">
              History & Active Paths · {roadmaps.length} Total
            </p>
          </div>
          <button
            onClick={fetchUserRoadmaps}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        {roadmaps.map((rm, idx) => {
          const isExpanded = expandedId === rm._id;
          const progress = progressData[rm._id] || {};
          const totalTopics = rm.sections?.reduce((a, s) => a + (s.topics?.length || 0), 0) || 0;
          const doneTopics = Object.values(progress).filter(Boolean).length;
          const pct = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0;
          const dateStr = new Date(rm.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });

          return (
            <motion.div
              key={rm._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`group border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${
                isExpanded 
                ? "bg-slate-900/40 border-amber-400/30 shadow-2xl shadow-amber-400/5" 
                : "bg-slate-900/10 border-white/5 hover:border-white/10"
              }`}
            >
              <div 
                onClick={() => setExpandedId(isExpanded ? null : rm._id)}
                className="p-6 cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-5 flex-1 min-w-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isExpanded ? "bg-amber-400 text-slate-900 rotate-12" : "bg-slate-800 text-slate-400"
                  }`}>
                    <FiMap className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-lg truncate leading-tight">
                      {rm.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded">
                        {rm.level}
                      </span>
                      <span className="text-slate-500 text-[11px] flex items-center gap-1.5 font-medium">
                        <FiClock className="w-3 h-3" />
                        {dateStr}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-2">
                       <span className="text-[11px] font-black text-slate-300">{pct}%</span>
                       <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            className="h-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                          />
                       </div>
                    </div>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                      {doneTopics}/{totalTopics} Topics Complete
                    </p>
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isExpanded ? "bg-amber-400/10 text-amber-400" : "bg-white/5 text-slate-500"
                    }`}
                  >
                    <FiChevronRight className="w-5 h-5 rotate-90" />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/5 bg-slate-900/20"
                  >
                    <div className="p-8 space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="md:col-span-3">
                           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4">Roadmap Strategy</h4>
                           <p className="text-slate-300 text-sm leading-relaxed max-w-3xl font-medium">
                             {rm.description || "A personalized learning path crafted to help you master these subjects efficiently."}
                           </p>
                        </div>
                        <div className="flex flex-col gap-3">
                           <button 
                             onClick={(e) => { e.stopPropagation(); handleDownload(rm._id, rm.title); }}
                             className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[11px] font-black text-slate-300 flex items-center justify-center gap-2.5 transition-all active:scale-95"
                           >
                             <FiDownload className="w-4 h-4" /> DOWNLOAD PDF
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); navigate(`/learn/roadmap/${rm._id}`); }}
                             className="w-full py-3.5 bg-amber-400 text-slate-900 rounded-2xl text-[11px] font-black flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-amber-400/10 active:scale-95"
                           >
                             FULL WORKSPACE
                           </button>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-400/[0.03] to-transparent pointer-events-none rounded-[3rem]" />
                        <div className="bg-[#05050a] border border-white/5 rounded-[3rem] p-4 sm:p-12 overflow-x-auto shadow-inner">
                           <div className="min-w-[600px]">
                              <RoadmapVisualNew 
                                roadmap={rm} 
                                progress={progress} 
                                onToggle={(secId, topId) => handleToggleTopic(rm._id, secId, topId)} 
                                roadmapId={rm._id}
                                isInternal={true}
                              />
                           </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                         {[
                           { label: "Completion Time", value: rm.metadata?.totalDuration || "12-16 weeks", icon: FiClock, color: "text-blue-400", bg: "bg-blue-400/10" },
                           { label: "Study Intensity", value: rm.metadata?.dailyHours || "2-3 hrs/day", icon: FiTarget, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                           { label: "Track Purpose", value: rm.category || "Skill Mastery", icon: FiAward, color: "text-amber-400", bg: "bg-amber-400/10" }
                         ].map((item, i) => (
                           <div key={i} className="p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center gap-5 group hover:bg-white/[0.04] transition-all">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${item.bg} ${item.color}`}>
                                 <item.icon className="w-6 h-6" />
                              </div>
                              <div>
                                 <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{item.label}</p>
                                 <p className="text-white text-sm font-bold tracking-tight">{item.value}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
