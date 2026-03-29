// PracticeTest.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Target, Clock, CheckCircle2, Circle, ChevronRight, BookOpen, Zap, Flame, Skull, LayoutGrid } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const Shimmer = ({ className = '' }) => (
  <div className={`rounded-lg bg-slate-700/50 ${className}`} style={{ animation: 'shimmer 1.6s infinite', backgroundSize: '200% 100%' }} />
);

const TopicsSkeleton = () => (
  <div className="grid grid-cols-2 gap-2">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-slate-700/30">
        <Shimmer className="w-4 h-4 rounded" />
        <Shimmer className="h-3 w-24 flex-1" />
      </div>
    ))}
  </div>
);

const StepBadge = ({ number, label, done }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-emerald-500 text-white' : 'bg-cyan-600 text-white'}`}>
      {done ? <CheckCircle2 size={12} /> : number}
    </div>
    <span className="text-sm font-semibold text-slate-200">{label}</span>
  </div>
);

const COMPLEXITY_LEVELS = [
  { level: 'easy', label: 'Easy', Icon: Zap, questions: 10, bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-400', iconColor: 'text-emerald-400' },
  { level: 'moderate', label: 'Moderate', Icon: Target, questions: 10, bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', badge: 'bg-cyan-500/20 text-cyan-400', iconColor: 'text-cyan-400' },
  { level: 'hard', label: 'Hard', Icon: Flame, questions: 10, bg: 'bg-amber-500/10', border: 'border-amber-500/30', badge: 'bg-amber-500/20 text-amber-400', iconColor: 'text-amber-400' },
  { level: 'extreme', label: 'Extreme', Icon: Skull, questions: 15, bg: 'bg-red-500/10', border: 'border-red-500/30', badge: 'bg-red-500/20 text-red-400', iconColor: 'text-red-400' },
];

const PracticeTest = ({ subjects }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [complexity, setComplexity] = useState('');
  const [loading, setLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTopics = useCallback(async () => {
    if (!selectedSubject) return;
    setTopicsLoading(true);
    try {
      const response = await api.get(`/subjects/${selectedSubject._id}/topics`);
      setTopics(response.data.topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to load topics');
    } finally {
      setTopicsLoading(false);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedSubject) fetchTopics();
  }, [selectedSubject, fetchTopics]);

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedTopics([]);
    setComplexity('');
    setTopics([]);
  };

  const handleTopicToggle = (topic) => {
    setSelectedTopics(prev => prev.includes(topic._id) ? prev.filter(id => id !== topic._id) : [...prev, topic._id]);
  };

  const handleSelectAll = () => {
    setSelectedTopics(selectedTopics.length === selectableTopics.length ? [] : selectableTopics.map(t => t._id));
  };

  const handleStartTest = async () => {
    if (!selectedSubject) return toast.error('Please select a subject');
    if (selectedTopics.length === 0) return toast.error('Please select at least one topic');
    if (!complexity) return toast.error('Please select a difficulty level');

    setLoading(true);
    try {
      const response = await api.post('/gemini/generate-questions', {
        subjects: [selectedSubject._id],
        topics: selectedTopics,
        complexity,
      });
      navigate('/exam', {
        state: { questions: response.data.questions, testType: 'practice', subjects: [selectedSubject._id], topics: selectedTopics, complexity, duration: 60 },
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error(error.response?.data?.error || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const availableSubjects = subjects;
  const selectableTopics = topics;
  const selectedLevel = COMPLEXITY_LEVELS.find(l => l.level === complexity);

  return (
    <div className="space-y-4">
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center">
            <Play size={12} className="text-white ml-0.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Practice Test</h2>
            <p className="text-[11px] text-slate-500">Focus on specific topics</p>
          </div>
        </div>

        <StepBadge number="1" label="Choose Subject" done={!!selectedSubject} />

        {availableSubjects.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {availableSubjects.map((subject, i) => {
              const pct = Math.round((subject.userProgress?.completedTopics / subject.totalTopics) * 100) || 0;
              const active = selectedSubject?._id === subject._id;
              return (
                <motion.button
                  key={subject._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => handleSubjectSelect(subject)}
                  className={`p-3 rounded-lg border text-left transition-all ${active ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-700 hover:border-slate-600 bg-slate-700/30'}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-slate-200 text-sm leading-tight">{subject.name}</h3>
                    {active ? <CheckCircle2 size={14} className="text-cyan-400 flex-shrink-0" /> : <Circle size={14} className="text-slate-600 flex-shrink-0" />}
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{subject.userProgress?.completedTopics}/{subject.totalTopics}</span>
                    </div>
                    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, delay: i * 0.04 }} className="h-full rounded-full bg-cyan-500" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 bg-slate-700/30 rounded-lg border border-dashed border-slate-600">
            <BookOpen size={28} className="text-slate-500 mb-2" />
            <p className="text-slate-400 text-sm">No subjects available</p>
            <p className="text-slate-500 text-xs">Complete topics in Learn first</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {selectedSubject && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="bg-slate-800 rounded-xl p-4">
            <StepBadge number="2" label="Select Topics" done={selectedTopics.length > 0} />

            {topicsLoading ? (
              <TopicsSkeleton />
            ) : selectableTopics.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-slate-500"><span className="text-slate-300 font-medium">{selectedTopics.length}</span> of {selectableTopics.length} selected</p>
                  <button onClick={handleSelectAll} className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                    <LayoutGrid size={10} />
                    {selectedTopics.length === selectableTopics.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {selectableTopics.map((topic, i) => {
                    const checked = selectedTopics.includes(topic._id);
                    const completed = topic.isCompleted;
                    return (
                      <motion.button
                        key={topic._id}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        onClick={() => handleTopicToggle(topic)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${checked ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-slate-700 hover:border-slate-600 bg-slate-700/30'}`}
                      >
                        <div className={`w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-all ${checked ? 'bg-cyan-500 border-cyan-500' : 'border-slate-600'}`}>
                          {checked && <CheckCircle2 size={10} className="text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block text-xs font-medium text-slate-300 leading-tight truncate">{topic.title}</span>
                          {completed && <span className="text-[9px] text-emerald-400/80 font-bold uppercase tracking-wider">Mastered</span>}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 bg-slate-700/30 rounded-lg border border-dashed border-slate-600">
                <BookOpen size={24} className="text-slate-500 mb-1" />
                <p className="text-slate-400 text-sm">No topics found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedTopics.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="bg-slate-800 rounded-xl p-4">
            <StepBadge number="3" label="Choose Difficulty" done={!!complexity} />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {COMPLEXITY_LEVELS.map((lvl, i) => {
                const active = complexity === lvl.level;
                const { Icon } = lvl;
                return (
                  <motion.button
                    key={lvl.level}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setComplexity(lvl.level)}
                    className={`p-3 rounded-lg border text-left transition-all ${active ? `${lvl.border} ${lvl.bg}` : 'border-slate-700 hover:border-slate-600 bg-slate-700/30'}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon size={16} className={active ? lvl.iconColor : 'text-slate-500'} />
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${active ? lvl.badge : 'bg-slate-700 text-slate-500'}`}>{lvl.questions}Q</span>
                    </div>
                    <p className={`font-semibold text-xs capitalize ${active ? 'text-slate-200' : 'text-slate-400'}`}>{lvl.label}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {complexity && (
          <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="bg-cyan-600 rounded-xl p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4 text-cyan-100 text-xs">
                <span>{selectedLevel?.questions} questions · {selectedTopics.length} topic{selectedTopics.length > 1 ? 's' : ''}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> 60 min</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedLevel?.badge || 'bg-white/20'}`}>{selectedLevel?.label}</span>
              </div>
              <button
                onClick={handleStartTest}
                disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2 bg-white text-cyan-700 rounded-lg font-bold text-sm hover:bg-cyan-50 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Target size={14} /></motion.div> Generating…</>
                ) : (
                  <><Play size={13} className="fill-current" /> Start Test <ChevronRight size={13} /></>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PracticeTest;
