import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
import {
  FiX,
  FiUpload,
  FiZap,
  FiChevronRight,
  FiChevronLeft,
  FiCheckCircle,
  FiClock,
  FiTarget,
  FiFileText,
  FiTrash2,
  FiAlertCircle,
  FiLoader,
  FiBook,
  FiAward,
  FiCalendar,
} from "react-icons/fi";
import api from "../../utils/api";
import { uploadToImageKit } from "../../utils/imagekit";

const STEPS = ["Goal", "Schedule", "Documents", "Generate"];

const SUBJECTS = [
  "Web Development (MERN/Next.js)",
  "Data Structures & Algorithms",
  "App Development (React Native/Flutter)",
  "Machine Learning & AI",
  "Database Management (SQL/NoSQL)",
  "System Design",
  "Cyber Security",
  "Cloud Computing (AWS/Azure)",
  "Operating Systems",
  "Computer Networks",
  "Object Oriented Programming",
];

const DAILY_HOURS = ["1–2 hrs", "2–3 hrs", "3–4 hrs", "4–5 hrs", "5+ hrs"];
const GOALS = [
  "Campus Placement",
  "GATE Exam",
  "Internship",
  "Personal Growth",
  "Higher Studies",
];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const LEVEL_COLORS = {
  Beginner: "border-emerald-400 bg-emerald-400/10 text-emerald-400",
  Intermediate: "border-amber-400 bg-amber-400/10 text-amber-400",
  Advanced: "border-rose-400 bg-rose-400/10 text-rose-400",
};

const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-8">
    {STEPS.map((step, i) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center">
          <motion.div
            animate={i === current ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.4 }}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              i < current
                ? "bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30"
                : i === current
                  ? "bg-amber-400/20 border-2 border-amber-400 text-amber-400"
                  : "bg-slate-800 border border-slate-700 text-slate-500"
            }`}
          >
            {i < current ? <FiCheckCircle className="w-4 h-4" /> : i + 1}
          </motion.div>
          <span
            className={`text-xs mt-1.5 font-semibold transition-colors ${
              i <= current ? "text-amber-400" : "text-slate-600"
            }`}
          >
            {step}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            className={`h-px w-10 mx-1 mb-5 transition-all duration-500 ${
              i < current
                ? "bg-gradient-to-r from-amber-400 to-amber-400"
                : "bg-slate-700"
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

/* ── Step 0: Goal ── */
const StepGoal = ({ data, setData }) => (
  <div className="space-y-6">
    <div>
      <label className="text-slate-200 text-sm font-bold block mb-3 flex items-center gap-2">
        <FiTarget className="w-4 h-4 text-amber-400" />
        What's your primary goal?
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {GOALS.map((g) => (
          <button
            key={g}
            onClick={() => setData((d) => ({ ...d, goal: g }))}
            className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
              data.goal === g
                ? "border-amber-400 bg-amber-400/10 text-amber-400 shadow-md shadow-amber-400/10"
                : "border-slate-700 bg-slate-800/40 text-slate-300 hover:border-slate-600 hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${data.goal === g ? "bg-amber-400" : "bg-slate-600"}`}
              />
              {g}
            </div>
          </button>
        ))}
      </div>
    </div>

    <div>
      <label className="text-slate-200 text-sm font-bold block mb-3 flex items-center gap-2">
        <FiAward className="w-4 h-4 text-amber-400" />
        Current knowledge level
      </label>
      <div className="flex gap-3">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setData((d) => ({ ...d, level: l }))}
            className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              data.level === l
                ? LEVEL_COLORS[l]
                : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>

    <div>
      <label className="text-slate-200 text-sm font-bold block mb-3 flex items-center gap-2">
        <FiBook className="w-4 h-4 text-amber-400" />
        Select subjects to include
        <span className="text-slate-500 font-normal text-xs ml-1">
          ({data.subjects?.length || 0} selected)
        </span>
      </label>
      <div className="flex flex-wrap gap-2">
        {SUBJECTS.map((s) => {
          const selected = data.subjects?.includes(s);
          return (
            <button
              key={s}
              onClick={() =>
                setData((d) => ({
                  ...d,
                  subjects: selected
                    ? d.subjects.filter((x) => x !== s)
                    : [...(d.subjects || []), s],
                }))
              }
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 ${
                selected
                  ? "border-amber-400 bg-amber-400/10 text-amber-400 shadow-sm shadow-amber-400/20"
                  : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600 hover:text-slate-300"
              }`}
            >
              {selected && <span className="mr-1">✓</span>}
              {s}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

/* ── Step 1: Schedule ── */
const StepSchedule = ({ data, setData }) => (
  <div className="space-y-6">
    <div>
      <label className="text-slate-200 text-sm font-bold block mb-3 flex items-center gap-2">
        <FiClock className="w-4 h-4 text-amber-400" />
        Daily study hours
      </label>
      <div className="grid grid-cols-5 gap-2">
        {DAILY_HOURS.map((h) => (
          <button
            key={h}
            onClick={() => setData((d) => ({ ...d, dailyHours: h }))}
            className={`py-3.5 rounded-xl border text-xs font-bold text-center transition-all duration-200 ${
              data.dailyHours === h
                ? "border-amber-400 bg-amber-400/10 text-amber-400 shadow-md shadow-amber-400/10"
                : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600"
            }`}
          >
            {h}
          </button>
        ))}
      </div>
    </div>

    <div>
      <label className="text-slate-200 text-sm font-bold block mb-2 flex items-center gap-2">
        <FiCalendar className="w-4 h-4 text-amber-400" />
        Target completion date
      </label>
      <input
        type="date"
        value={data.deadline || ""}
        onChange={(e) => setData((d) => ({ ...d, deadline: e.target.value }))}
        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all"
      />
    </div>

    <div>
      <label className="text-slate-200 text-sm font-bold block mb-2">
        Schedule notes
        <span className="text-slate-500 font-normal ml-2 text-xs">
          (optional)
        </span>
      </label>
      <textarea
        value={data.scheduleNotes || ""}
        onChange={(e) =>
          setData((d) => ({ ...d, scheduleNotes: e.target.value }))
        }
        placeholder="e.g. Classes Mon–Fri 9am–3pm, weekends free, exams in March..."
        rows={4}
        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all resize-none"
      />
    </div>
  </div>
);

/* ── Step 2: Documents ── */
const StepDocuments = ({ data, setData, uploading }) => {
  const fileRef = useRef(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    toast.loading(`Uploading ${files.length} file(s)...`);
    try {
      for (const file of files) {
        try {
          const result = await uploadToImageKit(file, "roadmaps");
          setData((d) => ({
            ...d,
            uploadedDocuments: [...(d.uploadedDocuments || []), result],
            files: [...(d.files || []), { name: file.name, size: file.size }],
          }));
          toast.success(`✓ ${file.name} uploaded`);
        } catch (error) {
          toast.error(`Failed to upload ${file.name}`);
        }
      }
    } catch (error) {
      toast.error("Error processing files");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeFile = (index) => {
    setData((d) => ({
      ...d,
      uploadedDocuments: d.uploadedDocuments.filter((_, i) => i !== index),
      files: d.files.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-5">
      <p className="text-slate-400 text-sm leading-relaxed">
        Upload your college syllabus, timetable, or study plans. Gemini will
        analyze them to craft a roadmap tailored to your exact schedule.
      </p>

      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full border-2 border-dashed border-slate-700 hover:border-amber-400/50 disabled:opacity-60 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all duration-300 group bg-slate-800/20 hover:bg-amber-400/3"
      >
        <div className="w-14 h-14 rounded-2xl bg-slate-800 group-hover:bg-amber-400/10 flex items-center justify-center transition-colors border border-slate-700 group-hover:border-amber-400/30">
          {uploading ? (
            <FiLoader className="w-6 h-6 text-amber-400 animate-spin" />
          ) : (
            <FiUpload className="w-6 h-6 text-slate-500 group-hover:text-amber-400 transition-colors" />
          )}
        </div>
        <div className="text-center">
          <p className="text-slate-200 text-sm font-semibold">
            Click to upload documents
          </p>
          <p className="text-slate-500 text-xs mt-1">
            PDF, DOCX, TXT · Max 10MB each
          </p>
        </div>
      </button>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept=".pdf,.docx,.txt"
        className="hidden"
        onChange={handleFiles}
        disabled={uploading}
      />

      {data.files?.length > 0 && (
        <div className="space-y-2">
          <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">
            {data.files.length} document(s) ready
          </p>
          {data.files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-3 bg-emerald-500/8 border border-emerald-500/25 rounded-xl"
            >
              <FiFileText className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <p className="text-slate-300 text-sm flex-1 truncate">
                {file.name}
              </p>
              <p className="text-slate-500 text-xs">
                {(file.size / 1024).toFixed(0)} KB
              </p>
              <button
                onClick={() => removeFile(index)}
                className="text-slate-600 hover:text-rose-400 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-3 p-4 bg-blue-400/5 border border-blue-400/15 rounded-xl">
        <FiAlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-blue-300/80 text-xs leading-relaxed">
          Documents are processed securely via ImageKit. You can skip this step
          — Gemini will generate a roadmap from your preferences alone.
        </p>
      </div>
    </div>
  );
};

/* ── Step 3: Generate ── */
const StepGenerate = ({ data, onGenerate, generating }) => (
  <div className="space-y-6">
    <div className="text-center">
      <motion.div
        animate={{ rotate: generating ? 360 : 0 }}
        transition={{
          duration: 2,
          repeat: generating ? Infinity : 0,
          ease: "linear",
        }}
        className="w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center mx-auto mb-4"
      >
        <FiZap className="w-9 h-9 text-amber-400" />
      </motion.div>
      <h3 className="text-white font-bold text-xl">Ready to generate!</h3>
      <p className="text-slate-400 text-sm mt-2 leading-relaxed">
        Gemini will craft a visual, roadmap.sh-style learning path based on your
        selections.
      </p>
    </div>

    {/* Summary card */}
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 space-y-3">
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
        Your Roadmap Configuration
      </p>
      {[
        { icon: FiTarget, label: "Goal", value: data.goal || "—" },
        { icon: FiAward, label: "Level", value: data.level || "—" },
        { icon: FiClock, label: "Daily study", value: data.dailyHours || "—" },
        {
          icon: FiBook,
          label: "Subjects",
          value: data.subjects?.length
            ? `${data.subjects.length} selected`
            : "All subjects",
        },
        {
          icon: FiFileText,
          label: "Documents",
          value: data.files?.length ? `${data.files.length} uploaded` : "None",
        },
      ].map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-center gap-3 py-1.5 border-b border-slate-700/30 last:border-0"
        >
          <div className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
            <Icon className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-slate-500 text-sm w-24">{label}</span>
          <span className="text-slate-200 text-sm font-semibold">{value}</span>
        </div>
      ))}
    </div>

    {data.subjects?.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {data.subjects.map((s) => (
          <span
            key={s}
            className="px-2.5 py-1 bg-amber-400/8 border border-amber-400/20 text-amber-300 text-xs rounded-full font-medium"
          >
            {s}
          </span>
        ))}
      </div>
    )}

    <motion.button
      onClick={onGenerate}
      disabled={generating}
      whileHover={!generating ? { scale: 1.02 } : {}}
      whileTap={!generating ? { scale: 0.98 } : {}}
      className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold text-sm flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-amber-400/25 hover:from-amber-300 hover:to-amber-400 transition-all"
    >
      {generating ? (
        <>
          <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
          Generating your roadmap...
        </>
      ) : (
        <>
          <FiZap className="w-4 h-4" />
          Generate My Roadmap
        </>
      )}
    </motion.button>

    {generating && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <p className="text-slate-500 text-xs">
          This may take 15–30 seconds while Gemini analyzes your preferences...
        </p>
      </motion.div>
    )}
  </div>
);

/* ── Main Modal ── */
const RoadmapModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [formData, setFormData] = useState({
    goal: "",
    level: "",
    subjects: [],
    dailyHours: "",
    deadline: "",
    scheduleNotes: "",
    files: [],
    uploadedDocuments: [],
  });

  const handleGenerate = async () => {
    if (!formData.goal || !formData.level || !formData.dailyHours) {
      toast.error("Please fill in all required fields");
      return;
    }

    setGenerating(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("goal", formData.goal);
      uploadFormData.append("level", formData.level);
      uploadFormData.append("dailyHours", formData.dailyHours);
      uploadFormData.append("deadline", formData.deadline || "");
      uploadFormData.append("scheduleNotes", formData.scheduleNotes || "");
      uploadFormData.append(
        "subjects",
        JSON.stringify(formData.subjects || []),
      );

      if (formData.uploadedDocuments?.length > 0) {
        uploadFormData.append(
          "documentUrls",
          JSON.stringify(formData.uploadedDocuments),
        );
      }

      const response = await api.post("/roadmap/generate", uploadFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.roadmap) {
        localStorage.setItem(
          "generatedRoadmap",
          JSON.stringify(response.data.roadmap),
        );
        localStorage.setItem(
          "generatedRoadmapId",
          response.data.roadmap.dbId || response.data.roadmap._id || "",
        );
        toast.success("Roadmap generated successfully!");
        setTimeout(() => {
          onClose();
          window.location.href = "/learn/roadmap-view";
        }, 1200);
      }
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to generate roadmap. Please try again.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const canNext = () => {
    if (step === 0) return !!formData.goal && !!formData.level;
    if (step === 1) return !!formData.dailyHours;
    return true;
  };

  const stepComponents = [
    <StepGoal data={formData} setData={setFormData} />,
    <StepSchedule data={formData} setData={setFormData} />,
    <StepDocuments
      data={formData}
      setData={setFormData}
      uploading={uploadingFiles}
    />,
    <StepGenerate
      data={formData}
      onGenerate={handleGenerate}
      generating={generating}
    />,
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 32 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="w-full max-w-lg bg-slate-900 border border-slate-700/60 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Amber top accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

          {/* Header */}
          <div className="px-6 pt-5 pb-0 flex items-start justify-between flex-shrink-0">
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">
                Generate AI Roadmap
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Powered by Gemini · Step {step + 1} of {STEPS.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="px-6 pt-6 pb-6 overflow-y-auto flex-1">
            <StepIndicator current={step} />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
              >
                {stepComponents[step]}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {step < 3 && (
              <div className="flex gap-3 mt-8">
                {step > 0 && (
                  <button
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition-colors"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext()}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-400 text-slate-900 text-sm font-bold hover:bg-amber-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-400/20"
                >
                  Continue
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RoadmapModal;
