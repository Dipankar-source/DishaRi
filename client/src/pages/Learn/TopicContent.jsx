import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiPlay,
  FiBookOpen,
  FiExternalLink,
  FiZap,
  FiStar,
  FiAlertCircle,
  FiFileText,
  FiCopy,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { FaRegLightbulb } from "react-icons/fa";

/* ── Skeleton ── */
export const TopicContentSkeleton = () => (
  <div className="animate-pulse h-full flex flex-col" style={{ background: "#0a0f1e", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
    <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="h-3 w-16 rounded-full bg-slate-800" />
      <div className="flex gap-2">
        <div className="h-7 w-20 rounded-lg bg-slate-800" />
        <div className="h-7 w-28 rounded-lg bg-slate-800" />
      </div>
    </div>
    <div className="flex-1 p-6 grid grid-cols-5 gap-6">
      <div className="col-span-3 space-y-4">
        <div className="h-8 w-3/4 rounded-lg bg-slate-800" />
        <div className="aspect-video rounded-2xl bg-slate-800" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-slate-800" />
          <div className="h-3 w-5/6 rounded bg-slate-800" />
          <div className="h-3 w-4/6 rounded bg-slate-800" />
        </div>
      </div>
      <div className="col-span-2 space-y-4">
        <div className="h-32 rounded-2xl bg-slate-800" />
        <div className="h-48 rounded-2xl bg-slate-800" />
      </div>
    </div>
  </div>
);

const TIPS = [
  "Watch the full video to build mental models first",
  "Read the reference docs for implementation depth",
  "Reproduce every code example by hand",
  "Write a 2-sentence summary in the notes panel",
  "Mark complete only when you can explain it aloud",
];

const TopicContent = ({ topic, onComplete, onBack, subjectId }) => {
  const [completed, setCompleted] = useState(topic.isCompleted);
  const [marking, setMarking] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [notes, setNotes] = useState("");
  const [watchPercentage, setWatchPercentage] = useState(0);
  const [videoStarted, setVideoStarted] = useState(false);
  const iframeRef = useRef(null);
  const playerRef = useRef(null);

  const getYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
      /[?&]v=([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url.startsWith("http") ? url : "http://" + url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    setCompleted(topic.isCompleted);
    setWatchPercentage(0);
    setVideoStarted(false);
  }, [topic._id, topic.isCompleted]);

  useEffect(() => {
    const videoId = getYouTubeId(topic.videoUrl);
    if (!videoId) return;

    const initPlayer = () => {
      if (window.YT && window.YT.Player && iframeRef.current) {
        playerRef.current = new window.YT.Player(iframeRef.current, {
          events: {
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setVideoStarted(true);
                startProgressTracking();
              } else if (event.data === window.YT.PlayerState.ENDED) {
                handleAutoComplete();
              }
            },
          },
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.getElementsByTagName("script")[0].parentNode.insertBefore(
        tag,
        document.getElementsByTagName("script")[0]
      );
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    let interval;
    const startProgressTracking = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        if (playerRef.current?.getDuration) {
          const duration = playerRef.current.getDuration();
          const currentTime = playerRef.current.getCurrentTime();
          if (duration > 0) {
            const pct = (currentTime / duration) * 100;
            setWatchPercentage(pct);
            if (pct >= 90 && !completed) {
              handleAutoComplete();
              clearInterval(interval);
            }
          }
        }
      }, 2000);
    };

    return () => { if (interval) clearInterval(interval); };
  }, [topic.videoUrl, completed]);

  const handleAutoComplete = async () => {
    if (completed || marking) return;
    setMarking(true);
    try {
      const response = await fetch(`/api/topics/${subjectId}/topics/${topic._id}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setCompleted(true);
      toast.success(`+${data.rewards?.ePoints || 10} ePoints earned 🎉`, { duration: 4, icon: "⭐" });
      if (onComplete) onComplete(topic._id, data.rewards?.ePoints);
    } catch (error) {
      console.error("Auto-complete error:", error);
    } finally {
      setMarking(false);
    }
  };

  const handleCompleteManual = async () => {
    if (completed || marking) return;
    setMarking(true);
    try {
      const response = await fetch(`/api/topics/${subjectId}/topics/${topic._id}/complete`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setCompleted(true);
      toast.success(`Topic Complete! +${data.rewards?.ePoints || 10} ePoints earned 🎉`, { duration: 4, icon: "⭐" });
      if (onComplete) onComplete(topic._id, data.rewards?.ePoints);
    } catch (error) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setMarking(false);
    }
  };

  const copyNoteContent = () => {
    if (notes) {
      navigator.clipboard.writeText(notes);
      toast.success("Notes copied!");
    }
  };

  const videoId = getYouTubeId(topic.videoUrl);
  const isValidVideo = videoId || (topic.videoUrl && isValidUrl(topic.videoUrl));
  const sourceLabel =
    {
      geeksforgeeks: "GeeksforGeeks",
      tutorialspoint: "TutorialsPoint",
      wikipedia: "Wikipedia",
      "official docs": "Official Docs",
      official: "Official Docs",
    }[topic.documentationSource?.toLowerCase()] || "GeeksforGeeks";

  const difficultyConfig = {
    beginner: { label: "Beginner", color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
    intermediate: { label: "Intermediate", color: "#fbbf24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.2)" },
    advanced: { label: "Advanced", color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.2)" },
  };
  const diff = difficultyConfig[topic.difficulty] || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col overflow-hidden"
      style={{
        height: "calc(100vh - 5rem)",
        background: "linear-gradient(160deg, #080e1d 0%, #060b17 100%)",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
      }}
    >
      {/* ── Top Bar ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-4 md:px-6 py-3 gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}
      >
        {/* Back */}
        <motion.button
          onClick={onBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-xs font-medium transition-colors"
          style={{ color: "rgba(148,163,184,1)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(148,163,184,1)")}
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Back</span>
        </motion.button>

        {/* Title (center, hidden on small) */}
        <p className="hidden md:block text-slate-400 text-xs font-medium truncate max-w-xs">{topic.title}</p>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {diff && (
            <span
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ color: diff.color, background: diff.bg, border: `1px solid ${diff.border}` }}
            >
              {diff.label}
            </span>
          )}

          <motion.button
            onClick={() => setBookmarked(!bookmarked)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{
              background: bookmarked ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.04)",
              border: bookmarked ? "1px solid rgba(251,191,36,0.3)" : "1px solid rgba(255,255,255,0.07)",
              color: bookmarked ? "#fbbf24" : "rgba(100,116,139,1)",
            }}
          >
            <FiStar className="w-3.5 h-3.5" fill={bookmarked ? "currentColor" : "none"} />
          </motion.button>

          {completed ? (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399" }}
            >
              <FiCheckCircle className="w-3.5 h-3.5" />
              <span>Completed</span>
            </div>
          ) : (
            <motion.button
              onClick={handleCompleteManual}
              disabled={marking}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#0a0f1e",
                boxShadow: "0 4px 14px rgba(245,158,11,0.25)",
              }}
            >
              {marking ? (
                <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <FiCheckCircle className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Mark Complete</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Watch progress strip ── */}
      <div className="flex-shrink-0 h-0.5" style={{ background: "rgba(255,255,255,0.04)" }}>
        <motion.div
          animate={{ width: completed ? "100%" : `${watchPercentage}%` }}
          transition={{ duration: 0.4 }}
          className="h-full"
          style={{
            background: completed
              ? "linear-gradient(90deg, #34d399, #10b981)"
              : "linear-gradient(90deg, #ef4444, #f97316)",
          }}
        />
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(100,116,139,0.3) transparent" }}>
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 space-y-10">
          
          {/* ── VIDEO HERO SECTION ── */}
          {topic.videoUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                    style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}
                  >
                    {sourceLabel}
                  </span>
                  {videoStarted && !completed && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-2"
                      style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
                    >
                      <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      {Math.round(watchPercentage)}% watched
                    </span>
                  )}
                  {completed && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-2"
                      style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7" }}
                    >
                      <FiCheckCircle className="w-3 h-3" />
                      Topic Mastered
                    </span>
                  )}
                </div>
                <h1
                  className="text-white font-extrabold leading-tight tracking-tight"
                  style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}
                >
                  {topic.title}
                </h1>
              </div>

              {/* Enhanced Video Container */}
              <div className="relative group">
                {/* Background Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-[22px] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                
                <div 
                  className="relative overflow-hidden"
                  style={{
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                    aspectRatio: "16/9",
                    minHeight: "350px",
                    background: "#000",
                  }}
                >
                  {isValidVideo ? (
                    videoId ? (
                      <iframe
                        ref={iframeRef}
                        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&autoplay=0`}
                        title={topic.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-6 p-12 text-center bg-slate-900/40">
                        <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                          <FiExternalLink className="w-10 h-10 text-red-400" />
                        </div>
                        <div className="max-w-md">
                          <h3 className="text-white text-xl font-bold mb-2">External Video Resource</h3>
                          <p className="text-slate-400 text-sm mb-8">This video cannot be embedded here due to platform restrictions. Please view it directly on YouTube.</p>
                          <motion.a
                            href={topic.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl text-white font-bold transition-all shadow-lg shadow-red-500/20"
                            style={{ background: "linear-gradient(135deg, #ef4444, #dc2626)" }}
                          >
                            <FiPlay className="w-5 h-5" />
                            Watch on YouTube
                          </motion.a>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-slate-900/20">
                      <FiAlertCircle className="w-12 h-12 text-slate-700" />
                      <p className="text-slate-500 font-medium">No video tutorial available for this topic</p>
                    </div>
                  )}
                </div>

                {/* Mastery Bar under video */}
                <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
                      <FiZap className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Target Mastery</h4>
                      <p className="text-slate-500 text-xs">Complete 90% of the video to earn rewards</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-1 min-w-[200px] justify-end">
                    <div className="flex-1 max-w-[300px]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Progress</span>
                        <span className="text-amber-400 text-xs font-bold">{Math.round(watchPercentage)}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          animate={{ width: `${watchPercentage}%` }}
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                        />
                      </div>
                    </div>
                    {!completed && (
                      <motion.button
                        onClick={handleCompleteManual}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-400/20 whitespace-nowrap"
                      >
                        Mark Complete
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── CONTENT GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            
            {/* Main Content Area (3/5) */}
            <div className="lg:col-span-3 space-y-10">
              
              {/* Theory / Concepts */}
              {topic.content && (
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <FiBookOpen className="w-4 h-4 text-blue-400" />
                    </div>
                    <h2 className="text-white text-lg font-bold">Comprehensive Overview</h2>
                  </div>
                  <div 
                    className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] leading-relaxed relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/30" />
                    <p className="text-slate-300 text-base whitespace-pre-line" style={{ fontFamily: "Inter, sans-serif" }}>
                      {topic.content}
                    </p>
                  </div>
                </section>
              )}

              {/* Notes Area */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <FiFileText className="w-4 h-4 text-purple-400" />
                    </div>
                    <h2 className="text-white text-lg font-bold">Study Notes</h2>
                  </div>
                  {notes && (
                    <motion.button
                      onClick={copyNoteContent}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold"
                    >
                      <FiCopy className="w-3.5 h-3.5" />
                      Copy to Clipboard
                    </motion.button>
                  )}
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record your findings, key snippets, or questions here..."
                  className="w-full min-h-[250px] p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-purple-500/40 focus:ring-4 focus:ring-purple-500/5 transition-all resize-y"
                  style={{ lineHeight: "1.8" }}
                />
              </section>
            </div>

            {/* Sidebar Resources (2/5) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Reference Docs Card */}
              {topic.documentationUrl && (
                <section className="space-y-4">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">Reference Material</h3>
                  <motion.a
                    href={topic.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="block group"
                  >
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-all shadow-xl shadow-blue-500/5">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">{sourceLabel}</p>
                        <FiExternalLink className="text-blue-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                      <h4 className="text-white text-lg font-bold mb-2">Deep Dive Documentation</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">Access full technical specifications, expert deep-dives, and implementation examples from {sourceLabel}.</p>
                    </div>
                  </motion.a>
                </section>
              )}
              {/* Additional Resources */}
              {topic.additionalResources && topic.additionalResources.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">Additional Resources</h3>
                  <div className="space-y-3">
                    {topic.additionalResources.map((res, idx) => (
                      <motion.a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <FiExternalLink className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-bold truncate">{res.title}</p>
                          <p className="text-slate-500 text-[10px] uppercase tracking-tighter">{res.type || 'article'}</p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </section>
              )}

              {/* Practice Problems */}
              {topic.practiceProblems && topic.practiceProblems.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">Practice Problems</h3>
                  <div className="space-y-3">
                    {topic.practiceProblems.map((prob, idx) => (
                      <motion.a
                        key={idx}
                        href={prob.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.05)" }}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] transition-all group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                            <FiZap className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-xs font-bold truncate">{prob.title}</p>
                            <p className="text-slate-500 text-[10px] uppercase tracking-tighter">Solved by 5k+ students</p>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                          prob.difficulty === 'easy' ? 'text-emerald-400 bg-emerald-400/10' :
                          prob.difficulty === 'hard' ? 'text-rose-400 bg-rose-400/10' :
                          'text-amber-400 bg-amber-400/10'
                        }`}>
                          {prob.difficulty || 'medium'}
                        </span>
                      </motion.a>
                    ))}
                  </div>
                </section>
              )}

              {/* Study Checklist / Tips */}
              <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-6">
                <div className="flex items-center gap-3">
                  <FaRegLightbulb className="text-amber-400 text-xl" />
                  <h3 className="text-white text-sm font-bold tracking-tight">Success Checklist</h3>
                </div>
                <div className="space-y-4">
                  {TIPS.map((tip, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (idx * 0.1) }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-5 h-5 rounded-full bg-slate-800 border border-white/5 flex items-center justify-center text-[10px] font-bold text-slate-500 flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-slate-400 text-xs leading-relaxed">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Quick Actions */}
              <section className="space-y-3">
                {!completed ? (
                  <button 
                    onClick={handleCompleteManual}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  >
                    <FiCheckCircle className="w-5 h-5" />
                    Complete Module
                  </button>
                ) : (
                  <div className="w-full py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-sm flex items-center justify-center gap-3">
                    <FiCheckCircle className="w-5 h-5" />
                    Module Mastered
                  </div>
                )}
                <button 
                  onClick={() => setBookmarked(!bookmarked)}
                  className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                >
                  <FiStar className={bookmarked ? "fill-amber-400 text-amber-400" : ""} />
                  {bookmarked ? "Bookmarked" : "Save for Later"}
                </button>
              </section>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TopicContent;