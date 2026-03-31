import React, { useState, useRef, useEffect } from "react";
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
  FiEdit3,
  FiChevronDown,
  FiCoffee,
  FiMoon,
  FiSun,
} from "react-icons/fi";
import api from "../../utils/api";
import { uploadToImageKit } from "../../utils/imagekit";

const STEPS = ["Profile", "Lifestyle", "Documents", "Review", "Finalize"];

const GOALS = [
  "Campus Placement",
  "GATE Exam",
  "Internship",
  "Personal Growth",
  "Higher Studies",
  "Others",
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const STUDY_HOURS = ["1–2 hrs", "2–3 hrs", "3–4 hrs", "4–5 hrs", "5+ hrs"];

const PREFERRED_TIMES = [
  { id: "morning", label: "Morning", icon: FiSun, color: "text-amber-400" },
  { id: "afternoon", label: "Afternoon", icon: FiCoffee, color: "text-orange-400" },
  { id: "evening", label: "Evening", icon: FiMoon, color: "text-indigo-400" },
];

/* ── Step Indicator ── */
const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-center gap-0 mb-8 px-4">
    {STEPS.map((step, i) => (
      <React.Fragment key={step}>
        <div className="flex flex-col items-center">
          <motion.div
            animate={i === current ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.4 }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
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
            className={`text-[10px] mt-1.5 font-bold uppercase tracking-tight transition-colors ${
              i <= current ? "text-amber-400" : "text-slate-600"
            }`}
          >
            {step}
          </span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            className={`h-[1px] w-6 mx-1 mb-5 transition-all duration-500 ${
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

/* ── Step 0: Profile ── */
const StepProfile = ({ data, setData }) => (
  <div className="space-y-6">
    <div>
      <label className="text-slate-200 text-sm font-bold block mb-3 flex items-center gap-2">
        <FiTarget className="w-4 h-4 text-amber-400" />
        What's your primary goal?
      </label>
      <div className="grid grid-cols-2 gap-2">
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
            {g}
          </button>
        ))}
      </div>
      {data.goal === "Others" && (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3"
        >
          <input
            type="text"
            placeholder="Please specify your goal..."
            value={data.otherGoal || ""}
            onChange={(e) => setData((d) => ({ ...d, otherGoal: e.target.value }))}
            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-all"
          />
        </motion.div>
      )}
    </div>

    <div>
      <label className="text-slate-200 text-sm font-bold block mb-3 flex items-center gap-2">
        <FiAward className="w-4 h-4 text-amber-400" />
        Knowledge Level
      </label>
      <div className="flex gap-3">
        {LEVELS.map((l) => (
          <button
            key={l}
            onClick={() => setData((d) => ({ ...d, level: l }))}
            className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all duration-200 ${
              data.level === l
                ? "border-amber-400 bg-amber-400/10 text-amber-400"
                : "border-slate-700 bg-slate-800/40 text-slate-400 hover:border-slate-600"
            }`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ── Step 1: Lifestyle ── */
const StepLifestyle = ({ data, setData }) => (
  <div className="space-y-6">
    <div>
      <label className="text-slate-200 text-sm font-bold block mb-3 flex items-center gap-2">
        <FiEdit3 className="w-4 h-4 text-amber-400" />
        Describe your daily life
        <span className="text-amber-400/40 text-[10px] font-normal uppercase ml-auto">Recommended</span>
      </label>
      <textarea
        value={data.dailyLife || ""}
        onChange={(e) => setData((d) => ({ ...d, dailyLife: e.target.value }))}
        placeholder="e.g. I work 9-5 as a dev, have a toddler, usually free after 9pm. I want to spend weekends more intensely..."
        rows={4}
        className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all resize-none"
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <label className="text-slate-200 text-sm font-bold block mb-3 flex items-center gap-2">
          <FiClock className="w-4 h-4 text-amber-400" />
          Daily Study Goal
        </label>
        <select
          value={data.studyHours || ""}
          onChange={(e) => setData((d) => ({ ...d, studyHours: e.target.value }))}
          className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none focus:border-amber-400 transition-all appearance-none"
        >
          <option value="">Select hours...</option>
          {STUDY_HOURS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      <div>
        <label className="text-slate-200 text-sm font-bold block mb-3 flex items-center gap-2">
          <FiZap className="w-4 h-4 text-amber-400" />
          Preferred Time
        </label>
        <div className="flex gap-2">
          {PREFERRED_TIMES.map(({ id, label, icon: Icon, color }) => (
            <button
              key={id}
              onClick={() => setData((d) => ({ ...d, preferredTimes: id }))}
              className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-xl border transition-all duration-200 ${
                data.preferredTimes === id
                  ? "border-amber-400 bg-amber-400/10"
                  : "border-slate-700 bg-slate-800/40 grayscale opacity-60 hover:grayscale-0 hover:opacity-100"
              }`}
            >
              <Icon className={`w-4 h-4 ${data.preferredTimes === id ? color : "text-slate-500"}`} />
              <span className={`text-[10px] font-bold ${data.preferredTimes === id ? "text-white" : "text-slate-500"}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ── Step 2: Documents ── */
const StepDocuments = ({ data, setData, uploading }) => {
  const fileRef = useRef(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    toast.loading(`Uploading document...`);
    try {
      for (const file of files) {
        const result = await uploadToImageKit(file, "routines");
        setData((d) => ({
          ...d,
          uploadedDocuments: [...(d.uploadedDocuments || []), { name: file.name, url: result.url }],
          files: [...(d.files || []), { name: file.name, size: file.size }],
        }));
      }
      toast.success("Uploaded successfully");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="space-y-5">
      <div
        onClick={() => fileRef.current?.click()}
        className="w-full border-2 border-dashed border-slate-700 hover:border-amber-400/50 rounded-2xl p-8 flex flex-col items-center gap-3 transition-all cursor-pointer bg-slate-800/20 hover:bg-amber-400/3 group"
      >
        <div className="w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-amber-400/10 flex items-center justify-center border border-slate-700 group-hover:border-amber-400/20 transition-all">
          <FiUpload className="w-5 h-5 text-slate-500 group-hover:text-amber-400" />
        </div>
        <div className="text-center">
          <p className="text-slate-200 text-sm font-semibold">Upload Syllabus or Timetable</p>
          <p className="text-slate-500 text-[11px] mt-1">PDF, DOCX, TXT (Optional)</p>
        </div>
      </div>
      <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />

      {data.files?.length > 0 && (
        <div className="space-y-2">
          {data.files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-slate-800/40 border border-slate-700/50 rounded-xl">
              <FiFileText className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 text-xs flex-1 truncate">{file.name}</span>
              <button 
                onClick={() => setData(d => ({
                  ...d, 
                  files: d.files.filter((_, idx) => idx !== i),
                  uploadedDocuments: d.uploadedDocuments.filter((_, idx) => idx !== i)
                }))}
                className="text-slate-600 hover:text-rose-400"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Step 3: AI Review ── */
const StepReview = ({ routine, setRoutine, loading }) => (
  <div className="space-y-4">
    {loading ? (
      <div className="py-12 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm animate-pulse">Gemini is analyzing your life...</p>
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between">
          <label className="text-slate-200 text-sm font-bold flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4 text-emerald-400" />
            AI Suggested Routine
          </label>
          <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-slate-800 rounded-md">Draft Mode</span>
        </div>
        <div className="relative group">
          <textarea
            value={routine}
            onChange={(e) => setRoutine(e.target.value)}
            className="w-full h-64 bg-slate-800/80 border border-slate-700 rounded-2xl px-5 py-4 text-slate-300 text-sm font-mono leading-relaxed focus:outline-none focus:border-amber-400/50 transition-all resize-none shadow-inner custom-scrollbar"
          />
          <div className="absolute top-4 right-4 text-slate-700 group-focus-within:text-amber-400/30 transition-colors">
            <FiEdit3 className="w-5 h-5" />
          </div>
        </div>
        <p className="text-slate-500 text-[11px] leading-relaxed italic">
          Tip: You can change the routine above. When you are happy, click continue to generate the final roadmap and guidelines.
        </p>
      </>
    )}
  </div>
);

/* ── Step 4: Finalize ── */
const StepFinalize = ({ success, loading, onFinalize }) => (
    <div className="text-center py-6 space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-4 relative">
             <motion.div 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-amber-400/5 rounded-3xl"
             />
             <FiZap className="w-10 h-10 text-amber-400" />
        </div>
        <div>
            <h3 className="text-white font-bold text-xl">Crafting your Journey</h3>
            <p className="text-slate-400 text-sm mt-2 px-8">
                Based on your approved routine, Gemini is now building a complete roadmap with specific study guidelines.
            </p>
        </div>

        {!success && (
            <button
                onClick={onFinalize}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-amber-400 text-slate-900 font-bold text-sm shadow-xl shadow-amber-400/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
                {loading ? "Generating Roadmap..." : "Confirm & Generate Roadmap"}
            </button>
        )}

        {success && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-400/10 border border-emerald-400/20 rounded-2xl text-emerald-400 text-sm font-bold"
            >
                Roadmap Generated Successfully! Redirecting...
            </motion.div>
        )}
    </div>
);

/* ── Main Modal ── */
const RoutineModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    goal: "",
    otherGoal: "",
    level: "Intermediate",
    dailyLife: "",
    studyHours: "",
    preferredTimes: "morning",
    files: [],
    uploadedDocuments: [],
  });
  const [routineId, setRoutineId] = useState(null);
  const [suggestedRoutine, setSuggestedRoutine] = useState("");
  const [success, setSuccess] = useState(false);

  const handleNext = async () => {
    if (step === 2) {
      // Step: Documents -> Generate Routine
      setStep(3);
      setLoading(true);
      try {
        const payload = {
            ...formData,
            goal: formData.goal === "Others" ? formData.otherGoal : formData.goal,
            documents: formData.uploadedDocuments
        };
        const res = await api.post("/routine/suggest", payload);
        setRoutineId(res.data.routineId);
        setSuggestedRoutine(res.data.suggestedRoutine);
      } catch (err) {
        toast.error("Failed to generate routine. Try again.");
        setStep(2);
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      setStep(4);
    } else {
      setStep(s => s + 1);
    }
  };

  const handleFinalize = async () => {
    setLoading(true);
    try {
      const res = await api.post("/routine/confirm", {
        routineId,
        finalRoutine: suggestedRoutine
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.href = `/learn/roadmap/${res.data.subjectId}`;
      }, 2000);
    } catch (err) {
      toast.error("Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const canNext = () => {
    if (step === 0) return (formData.goal && (formData.goal !== "Others" || formData.otherGoal));
    if (step === 1) return formData.dailyLife && formData.studyHours;
    return true;
  };

  const stepComponents = [
    <StepProfile data={formData} setData={setFormData} />,
    <StepLifestyle data={formData} setData={setFormData} />,
    <StepDocuments data={formData} setData={setFormData} />,
    <StepReview routine={suggestedRoutine} setRoutine={setSuggestedRoutine} loading={loading} />,
    <StepFinalize success={success} loading={loading} onFinalize={handleFinalize} />,
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 32 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 32 }}
          className="w-full max-w-xl bg-slate-900 border border-slate-700/60 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="px-8 pt-7 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-amber-400/10 rounded-lg">
                    <FiCalendar className="w-5 h-5 text-amber-400" />
                </div>
                <h2 className="text-white font-bold text-xl tracking-tight">Create My Routine</h2>
              </div>
              <p className="text-slate-500 text-[11px] font-medium tracking-wide">
                AI POWERED · PERSONALIZED SYNC · 2 PHASE GENERATION
              </p>
            </div>
            <button onClick={onClose} className="p-2.5 rounded-2xl bg-slate-800 text-slate-400 hover:text-white transition-all">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="px-8 flex-1 overflow-y-auto custom-scrollbar pb-8">
            <StepIndicator current={step} />

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {stepComponents[step]}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {step < 4 && !loading && (
              <div className="flex gap-4 mt-10">
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="px-6 py-3.5 rounded-2xl border border-slate-700 text-slate-300 text-sm font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!canNext()}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 text-sm font-bold shadow-lg shadow-amber-400/10 hover:opacity-90 disabled:opacity-40 transition-all"
                >
                  {step === 3 ? "Generate Final Roadmap" : "Continue"}
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

export default RoutineModal;
