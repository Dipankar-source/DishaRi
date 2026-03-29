// TestSection.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Trophy } from 'lucide-react';
import api from '../../utils/api';
import PracticeTest from './PracticeTest';
import GrandTest from './GrandTest';

const SkeletonBox = ({ className = '' }) => (
  <div
    className={`animate-pulse bg-slate-700/50 rounded-lg ${className}`}
    style={{ animation: 'shimmer 1.6s infinite', backgroundSize: '200% 100%' }}
  />
);

const TestSectionSkeleton = () => (
  <div className="space-y-4">
    <div className="bg-slate-800 rounded-xl p-4">
      <SkeletonBox className="h-6 w-40 mb-2" />
      <SkeletonBox className="h-3 w-64" />
    </div>
    <div className="bg-slate-800 rounded-xl p-1.5 flex gap-1.5">
      <SkeletonBox className="h-9 w-28 rounded-lg" />
      <SkeletonBox className="h-9 w-28 rounded-lg" />
    </div>
    <div className="bg-slate-800 rounded-xl p-4 space-y-4">
      <SkeletonBox className="h-5 w-48" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-slate-700/30 rounded-lg p-4 space-y-2">
            <SkeletonBox className="h-4 w-24" />
            <SkeletonBox className="h-3 w-full" />
            <SkeletonBox className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TestSection = () => {
  const [testType, setTestType] = useState('practice');
  const [subjects, setSubjects] = useState([]);
  const [grandTestEligibility, setGrandTestEligibility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subjectsRes, eligibilityRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/tests/grand/eligibility'),
      ]);
      setSubjects(subjectsRes.data);
      setGrandTestEligibility(eligibilityRes.data);
    } catch (error) {
      console.error('Error fetching test data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <TestSectionSkeleton />;

  const tabs = [
    { key: 'practice', label: 'Practice', icon: BookOpen, locked: false, accent: 'bg-cyan-600' },
    { key: 'grand', label: 'Grand', icon: Trophy, locked: !grandTestEligibility?.eligible, accent: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-xl p-4 flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center">
          <BookOpen size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100">Test Center</h1>
          <p className="text-xs text-slate-400">Practice tests & comprehensive exams</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-slate-800 rounded-xl p-1.5 flex gap-1.5 max-w-[300px] mx-start"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = testType === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setTestType(tab.key)}
              className="relative flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all"
            >
              {active && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-lg ${tab.accent}`}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <Icon size={14} className={`relative z-10 ${active ? 'text-white' : 'text-slate-400'}`} />
              <span className={`relative z-10 ${active ? 'text-white' : 'text-slate-400'}`}>{tab.label}</span>
              {tab.locked && (
                <span className={`relative z-10 px-1.5 py-0.5 rounded text-[9px] font-bold ${active ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-500'}`}>
                  LOCKED
                </span>
              )}
            </button>
          );
        })}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={testType}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {testType === 'practice' ? (
            <PracticeTest subjects={subjects} />
          ) : (
            <GrandTest subjects={subjects} eligibility={grandTestEligibility} onEligibilityChange={fetchData} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TestSection;
