import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiX,
  FiPlus,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiBook,
  FiZap,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../utils/api";

const AddSubjectModal = ({ isOpen, onClose, onSubjectCreated }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    subjectName: "",
    description: "",
    level: "intermediate",
  });
  const [createdSubject, setCreatedSubject] = useState(null);
  const [error, setError] = useState("");

  const LEVELS = ["Beginner", "Intermediate", "Advanced"];

  const levelConfig = {
    Beginner: {
      active: "border-emerald-400/80 bg-emerald-400/10 text-emerald-300 shadow-emerald-500/20",
      dot: "bg-emerald-400",
    },
    Intermediate: {
      active: "border-amber-400/80 bg-amber-400/10 text-amber-300 shadow-amber-500/20",
      dot: "bg-amber-400",
    },
    Advanced: {
      active: "border-rose-400/80 bg-rose-400/10 text-rose-300 shadow-rose-500/20",
      dot: "bg-rose-400",
    },
  };

  const handleCreate = async () => {
    if (!formData.subjectName.trim()) {
      setError("Subject name is required");
      return;
    }

    setError("");
    setStep(1);

    try {
      const response = await api.post("/subjects/create-with-ai", {
        subjectName: formData.subjectName.trim(),
        description: formData.description.trim(),
        level: formData.level.toLowerCase(),
      });

      if (response.data?.subject) {
        setCreatedSubject(response.data.subject);
        setStep(2);
        toast.success(`Subject "${formData.subjectName}" created with AI topics!`);

        setTimeout(() => {
          if (onSubjectCreated) {
            onSubjectCreated(response.data.subject);
          }
          handleClose();
        }, 2500);
      } else {
        throw new Error("No subject returned from API");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create subject");
      setStep(0);
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleClose = () => {
    setStep(0);
    setFormData({ subjectName: "", description: "", level: "intermediate" });
    setCreatedSubject(null);
    setError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #0f1729 0%, #0d1420 100%)",
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Subtle top gradient glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(99,179,237,0.4), transparent)" }}
            />
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)" }}
            />

            {/* Header */}
            <div
              className="relative px-6 pt-5 pb-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.15))",
                    border: "1px solid rgba(99,179,237,0.2)",
                    boxShadow: "0 0 16px rgba(59,130,246,0.15)",
                  }}
                >
                  <FiBook className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-base tracking-tight">Add Custom Subject</h2>
                  <p className="text-slate-500 text-xs mt-0.5">AI-powered curriculum generation</p>
                </div>
              </div>
              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <FiX className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">

                {/* Step 0: Form */}
                {step === 0 && (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22 }}
                    className="space-y-5"
                  >
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Enter a subject name and our AI will generate a complete curriculum — topics, videos, and resources tailored to your level.
                    </p>

                    {/* Subject Name */}
                    <div className="space-y-1.5">
                      <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider block">
                        Subject Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Web Development, Machine Learning…"
                        value={formData.subjectName}
                        onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        className="w-full text-sm text-slate-200 placeholder-slate-600 px-4 py-3 rounded-xl outline-none transition-all"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
                        }}
                        onFocus={(e) => {
                          e.target.style.border = "1px solid rgba(99,179,237,0.35)";
                          e.target.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 3px rgba(59,130,246,0.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.border = "1px solid rgba(255,255,255,0.08)";
                          e.target.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.3)";
                        }}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                        Description
                        <span className="text-slate-600 font-normal normal-case tracking-normal text-xs">optional</span>
                      </label>
                      <textarea
                        placeholder="Any specific goals, focus areas, or context for the AI…"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full text-sm text-slate-200 placeholder-slate-600 px-4 py-3 rounded-xl outline-none transition-all resize-none"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
                        }}
                        onFocus={(e) => {
                          e.target.style.border = "1px solid rgba(99,179,237,0.35)";
                          e.target.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 3px rgba(59,130,246,0.08)";
                        }}
                        onBlur={(e) => {
                          e.target.style.border = "1px solid rgba(255,255,255,0.08)";
                          e.target.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.3)";
                        }}
                      />
                    </div>

                    {/* Level */}
                    <div className="space-y-2.5">
                      <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider block">
                        Starting Level
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {LEVELS.map((level) => {
                          const cfg = levelConfig[level];
                          const isActive = formData.level === level;
                          return (
                            <motion.button
                              key={level}
                              onClick={() => setFormData({ ...formData, level })}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.97 }}
                              className={`py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                                isActive
                                  ? `${cfg.active} shadow-lg`
                                  : "border-white/6 text-slate-500 hover:text-slate-300 hover:border-white/10"
                              }`}
                              style={isActive ? {} : { background: "rgba(255,255,255,0.03)" }}
                            >
                              {level}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -6, height: 0 }}
                          className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
                          style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}
                        >
                          <FiAlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                          <p className="text-rose-300 text-sm">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* CTA */}
                    <motion.button
                      onClick={handleCreate}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
                        boxShadow: "0 4px 20px rgba(59,130,246,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                      }}
                    >
                      <FiZap className="w-4 h-4" />
                      Generate with AI
                    </motion.button>

                    <p className="text-slate-600 text-xs text-center">
                      Generates 8–12 topics with videos &amp; resources
                    </p>
                  </motion.div>
                )}

                {/* Step 1: Generating */}
                {step === 1 && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-center justify-center py-10 space-y-5"
                  >
                    {/* Animated ring */}
                    <div className="relative w-16 h-16">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full"
                        style={{ border: "2px solid transparent", borderTopColor: "#3b82f6", borderRightColor: "rgba(59,130,246,0.3)" }}
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-2 rounded-full"
                        style={{ border: "2px solid transparent", borderTopColor: "#6366f1", borderLeftColor: "rgba(99,102,241,0.3)" }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FiZap className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>

                    <div className="text-center space-y-1.5">
                      <h3 className="text-white font-semibold text-base">
                        Building "{formData.subjectName}"
                      </h3>
                      <p className="text-slate-400 text-sm">
                        AI is crafting your curriculum…
                      </p>
                    </div>

                    {/* Animated steps */}
                    <div className="w-full space-y-2 pt-2">
                      {["Structuring topics", "Finding video resources", "Finalizing curriculum"].map((txt, i) => (
                        <motion.div
                          key={txt}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.5 }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                        >
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                            className="w-1.5 h-1.5 rounded-full bg-blue-400"
                          />
                          <span className="text-slate-400 text-xs">{txt}</span>
                        </motion.div>
                      ))}
                    </div>

                    <p className="text-slate-600 text-xs">Usually takes 15–30 seconds</p>
                  </motion.div>
                )}

                {/* Step 2: Success */}
                {step === 2 && createdSubject && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 280, damping: 24 }}
                    className="flex flex-col items-center justify-center py-8 space-y-5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 18, delay: 0.1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.05) 70%)",
                        border: "1px solid rgba(16,185,129,0.3)",
                        boxShadow: "0 0 32px rgba(16,185,129,0.2)",
                      }}
                    >
                      <FiCheckCircle className="w-7 h-7 text-emerald-400" />
                    </motion.div>

                    <div className="text-center">
                      <h3 className="text-white font-semibold text-base">Subject Created!</h3>
                      <p className="text-slate-500 text-xs mt-1">Your curriculum is ready to explore</p>
                    </div>

                    <div className="w-full rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                      {[
                        { label: "Subject", value: createdSubject.name, valueClass: "text-white font-semibold" },
                        { label: "Topics Generated", value: createdSubject.totalTopics, valueClass: "text-emerald-400 font-bold" },
                        { label: "Level", value: createdSubject.level, valueClass: "text-amber-400 font-semibold capitalize" },
                      ].map((row, i) => (
                        <motion.div
                          key={row.label}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.08 }}
                          className="flex items-center justify-between px-4 py-3"
                          style={{
                            background: i % 2 === 0 ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.015)",
                            borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                          }}
                        >
                          <span className="text-slate-500 text-sm">{row.label}</span>
                          <span className={`text-sm ${row.valueClass}`}>{row.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddSubjectModal;