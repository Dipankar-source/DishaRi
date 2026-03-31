import React, { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiMap,
  FiZap,
  FiBookOpen,
  FiPlay,
  FiCheckCircle,
  FiArrowRight,
  FiLayers,
  FiTarget,
  FiCalendar,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../utils/api";
import CoinsDisplay from "../../components/CoinsDisplay";
import { SubjectListSkeleton } from "./SubjectList";
import { TopicContentSkeleton } from "./TopicContent";
import AddSubjectModal from "./AddSubjectModal";

/* Lazy load heavy components */
const SubjectList = lazy(() => import("./SubjectList"));
const TopicContent = lazy(() => import("./TopicContent"));
const RoadmapModal = lazy(() => import("./RoadmapModal"));
const RoutineModal = lazy(() => import("./RoutineModal"));

/* ─── Welcome panel (no topic selected) ─────────────────────────────────── */
const WelcomePanel = ({ onOpenRoadmap, onOpenRoutine }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    className="bg-slate-900 border border-slate-800/70 rounded-2xl overflow-hidden h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)] flex flex-col"
  >
    {/* Hero section */}
    <div className="relative p-8 md:p-10 flex-1 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/3 rounded-full blur-3xl" />
        {/* Grid dots */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dots"
              x="0"
              y="0"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="#475569" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-6">
          <FiBookOpen className="w-7 h-7 text-amber-400" />
        </div>

        <h3 className="text-white text-2xl font-bold tracking-tight mb-3">
          Ready to learn?
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Select a subject from the panel to begin. Each topic includes video
          lectures, documentation, and structured notes to help you master CSE.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            {
              icon: FiPlay,
              label: "Video Lectures",
              color: "text-rose-400 bg-rose-400/10 border-rose-400/20",
            },
            {
              icon: FiBookOpen,
              label: "Documentation",
              color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
            },
            {
              icon: FiCheckCircle,
              label: "Progress Tracking",
              color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
            },
          ].map(({ icon: Icon, label, color }) => (
            <span
              key={label}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${color}`}
            >
              <Icon className="w-3 h-3" />
              {label}
            </span>
          ))}
        </div>

        {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            onClick={onOpenRoadmap}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white border border-slate-600 rounded-lg font-bold text-sm shadow-xl transition-colors cursor-pointer"
          >
            Generate Roadmap
          </motion.button>
          
          <motion.button
            onClick={onOpenRoutine}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-3 px-6 py-3.5 bg-amber-400 text-slate-900 rounded-lg font-bold text-sm shadow-xl shadow-amber-400/20 transition-all cursor-pointer"
          >
            <FiCalendar className="w-4 h-4" />
            Create a Routine
          </motion.button>
        </div>
        <p className="text-slate-600 text-xs mt-3">
          Powered by Gemini AI · Personalized for you
        </p> */}
      </div>
    </div>

    {/* Stats strip */}
    <div className="border-t border-slate-800/60 grid grid-cols-3 divide-x divide-slate-800/60">
      {[
        { icon: FiLayers, label: "Subjects", value: "10+" },
        { icon: FiTarget, label: "Topics", value: "100+" },
        { icon: FiZap, label: "Resources", value: "200+" },
      ].map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex flex-col items-center py-4 gap-1">
          <Icon className="w-4 h-4 text-slate-500" />
          <p className="text-white text-lg font-bold">{value}</p>
          <p className="text-slate-500 text-xs">{label}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

/* ─── Page skeleton ─────────────────────────────────────────────────────── */
const LearnSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header */}
    <div className="h-28 bg-slate-900 border border-slate-800/70 rounded-2xl" />
    {/* Body */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <SubjectListSkeleton />
      <div className="lg:col-span-2">
        <TopicContentSkeleton />
      </div>
    </div>
  </div>
);

/* ─── Main Learn page ───────────────────────────────────────────────────── */
const Learn = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [routineModalOpen, setRoutineModalOpen] = useState(false);
  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);

  useEffect(() => {
    console.log("🎓 Learn component mounted, fetching initial data");
    fetchSubjects();
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      const res = await api.get("/topics/coins/me");
      setCoins(res.data.ePoints || 0);
    } catch (err) {
      console.error("Error fetching coins:", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/subjects');
      setSubjects(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching subjects:", err);
      toast.error("Failed to load subjects. Please check your connection or try again.");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    if (!window.confirm("Are you sure you want to delete this subject? All progress will be lost.")) {
      return;
    }

    try {
      await api.delete(`/subjects/${subjectId}`);
      toast.success("Subject deleted successfully");
      
      // Update local state instead of full refetch
      setSubjects(prev => prev.filter(s => s._id !== subjectId));
      if (selectedSubject?._id === subjectId) {
        setSelectedSubject(null);
      }
    } catch (err) {
      console.error("❌ Error deleting subject:", err);
      toast.error(err.response?.data?.error || "Failed to delete subject");
    }
  };

  const handleDeleteTopic = async (subjectId, topicId) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) {
      return;
    }

    try {
      await api.delete(`/subjects/${subjectId}/topics/${topicId}`);
      toast.success("Topic deleted successfully");
      
      // Update local state: remove topic from the subject
      setSubjects(prev => prev.map(s => {
        if (s._id === subjectId) {
          const updatedTopics = s.topics?.filter(t => t._id !== topicId) || [];
          return { ...s, topics: updatedTopics, totalTopics: updatedTopics.length };
        }
        return s;
      }));

      // Update selected subject if currently viewed
      if (selectedSubject?._id === subjectId) {
        setSelectedSubject(prev => ({
          ...prev,
          topics: prev.topics.filter(t => t._id !== topicId)
        }));
      }
    } catch (err) {
      console.error("❌ Error deleting topic:", err);
      toast.error(err.response?.data?.error || "Failed to delete topic");
    }
  };

  const handleTopicComplete = async (topicId, earnedPoints = 0) => {
    if (selectedSubject) {
      await fetchCoins(); // Refresh coins after completion
      await fetchSubjects(); // Refresh subjects list
      const res = await api.get(`/subjects/${selectedSubject._id}/topics`);
      setSelectedSubject((s) => ({ ...s, topics: res.data.topics }));
    }
  };

  const handleSubjectSelect = async (subject) => {
    if (!subject) {
      setSelectedSubject(null);
      setSelectedTopic(null);
      return;
    }
    setSelectedSubject(subject);
    setSelectedTopic(null);
    try {
      const res = await api.get(`/subjects/${subject._id}/topics`);
      setSelectedSubject((s) => ({ ...s, topics: res.data.topics }));
    } catch (err) {
      console.error("Error fetching topics:", err);
    }
  };

  if (loading && subjects.length === 0) return <LearnSkeleton />;

  /* Overall progress calculation */
  let totalTopicCount = 0;
  let completedTopicCount = 0;
  
  if (subjects && subjects.length > 0) {
    for (let i = 0; i < subjects.length; i++) {
      const s = subjects[i];
      const t = Number(s.totalTopics) || (s.topics ? s.topics.length : 0);
      const c = Number(s.userProgress?.completedTopics) || 0;
      totalTopicCount += t;
      completedTopicCount += c;
    }
  }

  const overallPct = totalTopicCount > 0
    ? Math.round((completedTopicCount / totalTopicCount) * 100)
    : 0;

  console.log(`📊 Progress Summary: ${completedTopicCount}/${totalTopicCount} (${overallPct}%)`);

  const totals = {
    total: totalTopicCount,
    completed: completedTopicCount,
    percentage: overallPct,
  };

  return (
    <>
      <div className="space-y-5">
        {/* ── Header card ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-slate-900 border border-slate-800/70 rounded-2xl overflow-hidden"
        >
          <div className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1">
                  Learning Center
                </p>
                <h2 className="text-white text-xl font-bold tracking-tight">
                  Master CSE concepts
                </h2>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                  Structured paths · Video lectures · Comprehensive resources
                </p>
              </div>

              {/* Right side: Coins and Roadmap button */}
              <div className="flex items-center gap-3 flex-wrap">
                <CoinsDisplay coins={coins} />
                
                <motion.button
                  onClick={() => setRoutineModalOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 text-slate-900 rounded-lg font-bold text-sm cursor-pointer shadow-lg shadow-amber-400/20 transition-all"
                >
                  <FiCalendar className="w-4 h-4" />
                  <span className="hidden md:inline">Routine</span>
                </motion.button>
{/* 
                <motion.button
                  onClick={() => setRoadmapOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-600 text-white rounded-lg font-bold text-sm cursor-pointer hover:bg-slate-800 transition-colors flex-shrink-0"
                >
                  <span className="hidden sm:inline">Roadmap</span>
                  <span className="sm:hidden">Roadmap</span>
                </motion.button> */}
              </div>
            </div>

            {/* Overall progress bar */}
            <div className="mt-5 pt-5 border-t border-slate-800/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs font-medium">
                  Overall Progress
                </span>
                <span className="text-amber-400 text-xs font-bold">
                  {totals.percentage}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${totals.percentage}%` }}
                  transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                />
              </div>
              <p className="text-slate-600 text-xs mt-1.5">
                {totals.completed} of {totals.total} topics completed
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Main responsive grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:min-h-[calc(100vh-18rem)]">
          {/* Subject list - Full height on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Suspense fallback={<SubjectListSkeleton />}>
              <SubjectList
                subjects={subjects}
                selectedSubject={selectedSubject}
                onSelectSubject={handleSubjectSelect}
                onSelectTopic={setSelectedTopic}
                loading={loading}
                onDeleteSubject={handleDeleteSubject}
                onDeleteTopic={handleDeleteTopic}
                onAddSubject={() => setAddSubjectModalOpen(true)}
              />
            </Suspense>
          </motion.div>

          {/* Content area - Responsive layout */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selectedTopic ? (
                <Suspense key={selectedTopic._id} fallback={<TopicContentSkeleton />}>
                  <TopicContent
                    topic={selectedTopic}
                    subjectId={selectedSubject?._id}
                    onComplete={handleTopicComplete}
                    onBack={() => setSelectedTopic(null)}
                  />
                </Suspense>
              ) : (
                <WelcomePanel
                  key="welcome"
                  onOpenRoadmap={() => setRoadmapOpen(true)}
                  onOpenRoutine={() => setRoutineModalOpen(true)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Add Subject Modal ── */}
      <AddSubjectModal
        isOpen={addSubjectModalOpen}
        onClose={() => setAddSubjectModalOpen(false)}
        onSubjectCreated={(newSubject) => {
          console.log("✅ New subject created:", newSubject);
          console.log("   ID:", newSubject._id);
          console.log("   Name:", newSubject.name);
          console.log("   Topics:", newSubject.totalTopics || newSubject.topics?.length);
          
          // Immediately add to UI state - subject response now includes userProgress
          setSubjects(prevSubjects => {
            const updated = [newSubject, ...prevSubjects];
            console.log(`📝 Subject list updated: ${updated.length} total subjects`);
            return updated;
          });
          
          toast.success(`Subject "${newSubject.name}" added successfully!`);
          
          // Also fetch from server to ensure consistency
          setTimeout(() => {
            console.log("🔄 Refreshing subjects list from server...");
            fetchSubjects();
          }, 1500);
        }}
      />

      {/* ── Roadmap modal ── */}
      <AnimatePresence>
        {roadmapOpen && (
          <Suspense fallback={null}>
            <RoadmapModal onClose={() => setRoadmapOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>
      {/* ── Routine modal ── */}
      <AnimatePresence>
        {routineModalOpen && (
          <Suspense fallback={null}>
            <RoutineModal onClose={() => setRoutineModalOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
};

export default Learn;
