// GrandTest.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Lock, CheckCircle2, Circle, Target, Clock, Zap, Flame, Skull, Star, ChevronRight, BookMarked, ShieldAlert } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const StepBadge = ({ number, label, done }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
      {done ? <CheckCircle2 size={12} /> : number}
    </div>
    <span className="text-sm font-semibold text-slate-200">{label}</span>
  </div>
);

const COMPLEXITY_LEVELS = [
  { level: 'easy', label: 'Easy', Icon: Zap, questions: 30, bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-400', iconColor: 'text-emerald-400' },
  { level: 'moderate', label: 'Moderate', Icon: Target, questions: 30, bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', badge: 'bg-cyan-500/20 text-cyan-400', iconColor: 'text-cyan-400' },
  { level: 'hard', label: 'Hard', Icon: Flame, questions: 30, bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-400', iconColor: 'text-amber-400' },
  { level: 'extreme', label: 'Extreme', Icon: Skull, questions: 30, bg: 'bg-red-500/10', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-400', iconColor: 'text-red-400' },
];

const GrandTest = ({ subjects, eligibility, onEligibilityChange }) => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [complexity, setComplexity] = useState('mixed');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const completedSubjects = subjects.filter(s => s.userProgress?.isCompleted);

  const handleSubjectToggle = (subject) => {
    setSelectedSubjects(prev => prev.includes(subject._id) ? prev.filter(id => id !== subject._id) : [...prev, subject._id]);
    setComplexity('mixed');
  };

  const handleStartTest = async () => {
    if (selectedSubjects.length === 0) return toast.error('Please select at least one subject');

    setLoading(true);
    try {
      const allTopics = [];
      for (const subjectId of selectedSubjects) {
        const res = await api.get(`/subjects/${subjectId}/topics`);
        allTopics.push(...res.data.topics.map(t => t._id));
      }

      if (allTopics.length === 0) {
        toast.error('No topics available');
        setLoading(false);
        return;
      }

      const response = await api.post('/gemini/generate-questions', { subjects: selectedSubjects, topics: allTopics, complexity });
      toast.success(`Generated ${response.data.count} questions!`);
      navigate('/exam', { state: { questions: response.data.questions, testType: 'grand', subjects: selectedSubjects, topics: allTopics, complexity, duration: 60 } });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const selectedLevel = COMPLEXITY_LEVELS.find(l => l.level === complexity);

  if (!eligibility?.eligible) {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-900 p-6 text-center">
            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }} className="w-12 h-12 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center mx-auto mb-3">
              <Lock size={20} className="text-slate-400" />
            </motion.div>
            <h3 className="text-lg font-bold text-slate-200 mb-1">Grand Test Locked</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">Complete at least one subject to unlock</p>
          </div>

          <div className="p-4">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">Subject Progress</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {subjects.map((subject, i) => {
                const done = subject.userProgress?.isCompleted;
                const pct = Math.round((subject.userProgress?.completedTopics || 0) / subject.totalTopics * 100);
                return (
                  <motion.div
                    key={subject._id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-3 rounded-lg border ${done ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-slate-700 bg-slate-700/30'}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-medium text-slate-300 text-xs">{subject.name}</h4>
                      {done ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Lock size={10} className="text-slate-500" />}
                    </div>
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mb-1">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: i * 0.05 }} className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-cyan-500'}`} />
                    </div>
                    <p className="text-[10px] text-slate-500">{subject.userProgress?.completedTopics || 0}/{subject.totalTopics} topics</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-xl overflow-hidden">
        <div className=" p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Trophy size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Grand Test</h2>
            <p className="text-amber-100 text-[11px]">{completedSubjects.length} subject{completedSubjects.length > 1 ? 's' : ''} available</p>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-slate-800 rounded-xl p-4">
        <StepBadge number="1" label="Choose Subjects" done={selectedSubjects.length > 0} />

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
          {completedSubjects.map((subject, i) => {
            const active = selectedSubjects.includes(subject._id);
            return (
              <motion.button
                key={subject._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleSubjectToggle(subject)}
                className={`p-3 rounded-lg border text-left transition-all ${active ? 'border-amber-500/50 bg-amber-500/10' : 'border-slate-700 hover:border-slate-600 bg-slate-700/30'}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-medium text-slate-200 text-sm leading-tight">{subject.name}</h3>
                  {active ? <CheckCircle2 size={14} className="text-amber-400 flex-shrink-0" /> : <Circle size={14} className="text-slate-600 flex-shrink-0" />}
                </div>
                <div className="flex items-center gap-1">
                  <Star size={10} className="text-emerald-400" />
                  <span className="text-[10px] text-emerald-400">Completed</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {selectedSubjects.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 mb-2 text-red-400">
              <ShieldAlert size={16} />
              <h4 className="text-sm font-bold uppercase tracking-wider">Security Protocol</h4>
            </div>
            <ul className="space-y-1.5">
              {[
                'The test will automatically enter Full-Screen mode.',
                'Right-click, developer tools, and shortcuts are disabled.',
                'Camera and Microphone access is required for monitoring.',
                'Exiting full-screen or switching tabs will void the test.'
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-slate-400">
                  <div className="w-1 h-1 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedSubjects.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4 text-amber-100 text-xs">
                <span className="flex items-center gap-1"><BookMarked size={12} /> {selectedSubjects.length} subject{selectedSubjects.length > 1 ? 's' : ''} · 30Q</span>
                <span className="flex items-center gap-1"><Clock size={12} /> 60 min</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400`}>Mixed Complexity</span>
              </div>
              <button
                onClick={handleStartTest}
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2 bg-white text-amber-700 rounded-lg font-bold text-sm hover:bg-amber-50 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Target size={14} /></motion.div> Generating…</>
                ) : (
                  <><Trophy size={13} /> Start Grand Test <ChevronRight size={13} /></>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GrandTest;
