// ExamInterface.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import {
  AlertTriangle, CheckCircle2, XCircle, ShieldAlert,
  ChevronLeft, ChevronRight, Send, BarChart2, BookOpen,
  Home, Layers, Timer, Eye, ArrowLeft, CircleDot, Video, VideoOff, Mic
} from 'lucide-react';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

/* ── Analysis Screen ── */
const AnalysisScreen = ({ questions, answers, score, accuracy, timeTaken, tabSwitches, warnings, navigate }) => {
  const xpAwarded = warnings === 0;
  const pct = Math.round((score / questions.length) * 100);
  const ringColor = pct >= 75 ? '#22d3ee' : pct >= 50 ? '#818cf8' : '#f87171';
  const circumference = 2 * Math.PI * 40;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[#080b10] text-[#e2e8f0]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Mono:wght@500&display=swap');
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d1117}::-webkit-scrollbar-thumb{background:#1e2535;border-radius:4px}
      `}</style>

      {/* Header bar */}
      <div className="border-b max-w-5xl mx-auto border-[#1a2030] bg-[#0d1117] px-4 sm:px-8 py-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-[#334155] uppercase tracking-widest">Session Complete</p>
          <h1 className="text-lg sm:text-xl font-black text-[#e2e8f0]">Result Analysis</h1>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#22d3ee] text-[#080b10] rounded-lg font-black text-xs sm:text-sm hover:bg-[#67e8f9] transition-all"
        >
          <Home size={13} /> Dashboard
        </button>
      </div>

      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4">

        {/* Summary grid */}
        <div className="border border-[#1a2030] rounded-2xl overflow-hidden bg-[#0d1117]">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#1a2030]">
            {/* Score ring */}
            <div className="flex items-center gap-6 p-6 sm:p-8">
              <div className="relative flex-shrink-0">
                <svg width="88" height="88" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="#1a2030" strokeWidth="8" />
                  <motion.circle
                    cx="48" cy="48" r="40" fill="none"
                    stroke={ringColor} strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference}
                    transform="rotate(-90 48 48)"
                    animate={{ strokeDashoffset: circumference * (1 - pct / 100) }}
                    transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black leading-none" style={{ color: ringColor }}>{pct}%</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Score</p>
                <h2 className="text-3xl sm:text-4xl font-black text-[#e2e8f0] leading-none mb-2">
                  {score}<span className="text-white text-xl font-bold">/{questions.length}</span>
                </h2>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold"
                  style={{ background: xpAwarded ? '#0a2020' : '#1a0a0a', color: xpAwarded ? '#22d3ee' : '#f87171' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: xpAwarded ? '#22d3ee' : '#f87171' }} />
                  {xpAwarded ? 'XP Awarded' : 'No XP'}
                </div>
              </div>
            </div>

            {/* Stat cells */}
            <div className="grid grid-cols-3 divide-x divide-[#1a2030]">
              {[
                { label: 'Accuracy', value: `${accuracy}%` },
                { label: 'Time Taken', value: formatTime(timeTaken) },
                { label: 'Tab Switches', value: tabSwitches, danger: tabSwitches > 0 },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center justify-center py-6 px-2">
                  <span className="text-2xl sm:text-3xl font-black leading-none mb-1"
                    style={{ color: s.danger ? '#f87171' : '#ffffffff' }}>{s.value}</span>
                  <span className="text-[9px] font-bold text-white uppercase tracking-widest text-center">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {tabSwitches > 0 && (
            <div className="border-t border-[#1a2030] px-6 py-3 flex items-center gap-3 bg-[#100808]">
              <ShieldAlert size={13} className="text-[#f87171] flex-shrink-0" />
              <p className="text-[11px] text-[#f87171]">
                <span className="font-bold">Integrity Violation:</span> {tabSwitches} tab switch{tabSwitches !== 1 ? 'es' : ''} — {warnings}/3 warnings{warnings >= 3 ? ' — auto-submitted' : ''}
              </p>
            </div>
          )}
        </div>

        {/* Question Review Table */}
        <div className="border border-[#1a2030] rounded-2xl overflow-hidden bg-[#0d1117]">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#1a2030] bg-[#0a0d13]">
            <BarChart2 size={13} className="text-[#334155]" />
            <h3 className="text-sm font-bold text-[#94a3b8]">Question Review</h3>
            <span className="ml-auto text-[11px] font-mono text-white">{score}/{questions.length} correct</span>
          </div>

          {/* Table header — desktop */}
          <div className="hidden sm:grid border-b border-[#1a2030] bg-[#080b10]"
            style={{ gridTemplateColumns: '2.5rem 1fr 1fr 1fr 3rem' }}>
            {['#', 'Question', 'Your Answer', 'Correct Answer', '±'].map(h => (
              <div key={h} className="px-4 text-white py-2.5 text-[9px] font-bold text-[#334155] uppercase tracking-widest border-r border-[#1a2030] last:border-r-0">{h}</div>
            ))}
          </div>

          <div className="divide-y divide-[#1a2030] max-h-[480px] overflow-y-auto">
            {questions.map((question, idx) => {
              const correct = answers[idx] === question.correctAnswer;
              const unanswered = answers[idx] === null;
              const rowBg = correct ? '#080f0f' : '#0f0808';
              return (
                <div key={idx}>
                  {/* Desktop row */}
                  <div className="hidden sm:grid hover:brightness-110 transition-all"
                    style={{ gridTemplateColumns: '2.5rem 1fr 1fr 1fr 3rem', background: rowBg }}>
                    <div className="px-3 py-4 flex items-start justify-center border-r border-[#1a2030]">
                      <span className="text-[11px] font-mono text-white">{idx + 1}</span>
                    </div>
                    <div className="px-4 py-4 border-r border-[#1a2030]">
                      <p className="text-[12px] text-[#cbd5e1] leading-snug mb-2">{question.question}</p>
                      {question.explanation && (
                        <div className="border-l-2 border-[#818cf8] pl-2">
                          <p className="text-[10px] text-[#64748b]">
                            <span className="text-[#818cf8] font-bold">Note: </span>{question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-4 border-r border-[#1a2030] flex items-start">
                      <p className="text-[12px] font-semibold"
                        style={{ color: unanswered ? '#334155' : correct ? '#22d3ee' : '#f87171' }}>
                        {unanswered ? '—' : question.options[answers[idx]]}
                      </p>
                    </div>
                    <div className="px-4 py-4 border-r border-[#1a2030] flex items-start">
                      <p className="text-[12px] font-semibold text-[#22d3ee]">{question.options[question.correctAnswer]}</p>
                    </div>
                    <div className="flex items-start justify-center pt-4">
                      {correct ? <CheckCircle2 size={14} className="text-[#22d3ee]" /> : <XCircle size={14} className="text-[#f87171]" />}
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="sm:hidden p-4" style={{ background: rowBg }}>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: correct ? '#0a2020' : '#1a0a0a' }}>
                        {correct ? <CheckCircle2 size={11} className="text-[#22d3ee]" /> : <XCircle size={11} className="text-[#f87171]" />}
                      </div>
                      <p className="text-[12px] text-[#cbd5e1] font-medium flex-1">Q{idx + 1}. {question.question}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 ml-8">
                      <div className="bg-[#080b10] rounded-lg px-3 py-2 border border-[#1a2030]">
                        <p className="text-[9px] font-bold text-[#334155] uppercase tracking-widest mb-1">Your Answer</p>
                        <p className="text-[11px] font-semibold"
                          style={{ color: unanswered ? '#334155' : correct ? '#22d3ee' : '#f87171' }}>
                          {unanswered ? '—' : question.options[answers[idx]]}
                        </p>
                      </div>
                      <div className="bg-[#080b10] rounded-lg px-3 py-2 border border-[#1a2030]">
                        <p className="text-[9px] font-bold text-[#334155] uppercase tracking-widest mb-1">Correct</p>
                        <p className="text-[11px] font-semibold text-[#22d3ee]">{question.options[question.correctAnswer]}</p>
                      </div>
                    </div>
                    {question.explanation && (
                      <div className="ml-8 mt-2 border-l-2 border-[#818cf8] pl-2">
                        <p className="text-[10px] text-[#64748b]">
                          <span className="text-[#818cf8] font-bold">Note: </span>{question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Summary / Confirm Submit Screen ── */
const SummaryScreen = ({ questions, answers, timeLeft, duration, tabSwitches, warnings, onConfirm, onBack, submitting }) => {
  const answeredCount = answers.filter(a => a !== null).length;
  const unansweredCount = questions.length - answeredCount;
  const timeTaken = duration * 60 - timeLeft;
  const completionPct = Math.round((answeredCount / questions.length) * 100);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="fixed inset-0 bg-[#080b10] text-[#e2e8f0] flex flex-col overflow-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Mono:wght@500&display=swap');
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0d1117}::-webkit-scrollbar-thumb{background:#1e2535;border-radius:4px}
      `}</style>

      {/* Header */}
      <div className="flex-shrink-0 border-b border-[#1a2030] bg-[#0d1117] px-4 sm:px-8 h-12 sm:h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CircleDot size={14} className="text-[#f59e0b]" />
          <div>
            <p className="text-[9px] font-bold text-[#334155] uppercase tracking-widest leading-none">Review Before Submitting</p>
            <p className="text-sm font-black text-[#e2e8f0] leading-tight">Submission Summary</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a0d13] border border-[#1a2030]">
          <Timer size={11} className="text-[#22d3ee]" />
          <span className="font-mono text-[12px] font-black text-[#22d3ee]">{formatTime(timeLeft)}</span>
          <span className="text-[9px] text-[#334155] ml-1">remaining</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4">

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
            className="border border-[#1a2030] rounded-2xl overflow-hidden bg-[#0d1117]"
          >
            <div className="grid grid-cols-3 divide-x divide-[#1a2030]">
              {[
                { label: 'Answered', value: answeredCount, color: '#22d3ee', bg: '#082020' },
                { label: 'Unanswered', value: unansweredCount, color: unansweredCount > 0 ? '#f87171' : '#334155', bg: unansweredCount > 0 ? '#100808' : '#0d1117' },
                { label: 'Time Spent', value: formatTime(timeTaken), color: '#818cf8', bg: '#0d1117' },
              ].map(s => (
                <div key={s.label} className="flex flex-col items-center justify-center py-5 px-3" style={{ background: s.bg }}>
                  <span className="text-2xl sm:text-3xl font-black leading-none mb-1" style={{ color: s.color }}>{s.value}</span>
                  <span className="text-[9px] font-bold text-[#334155] uppercase tracking-widest text-center">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="border-t border-[#1a2030] px-5 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-bold text-[#334155] uppercase tracking-widest">Completion</span>
                <span className="text-[10px] font-mono font-bold text-[#22d3ee]">{completionPct}%</span>
              </div>
              <div className="h-[3px] bg-[#1a2030] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: completionPct === 100 ? '#22d3ee' : '#818cf8' }}
                />
              </div>
            </div>

            {/* Warnings banner */}
            {tabSwitches > 0 && (
              <div className="border-t border-[#1a2030] px-5 py-3 flex items-center gap-2 bg-[#100808]">
                <ShieldAlert size={12} className="text-[#f87171] flex-shrink-0" />
                <p className="text-[11px] text-[#f87171]">
                  <span className="font-bold">Integrity Warning:</span> {tabSwitches} tab switch{tabSwitches !== 1 ? 'es' : ''} detected — {warnings}/3 warnings
                </p>
              </div>
            )}

            {/* Unanswered warning */}
            {unansweredCount > 0 && (
              <div className="border-t border-[#1a2030] px-5 py-3 flex items-center gap-2 bg-[#0e0900]">
                <AlertTriangle size={12} className="text-[#f59e0b] flex-shrink-0" />
                <p className="text-[11px] text-[#f59e0b]">
                  <span className="font-bold">{unansweredCount} question{unansweredCount !== 1 ? 's' : ''} unanswered</span> — unanswered questions will be marked incorrect.
                </p>
              </div>
            )}
          </motion.div>

          {/* Question grid overview */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.05 }}
            className="border border-[#1a2030] rounded-2xl overflow-hidden bg-[#0d1117]"
          >
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1a2030] bg-[#0a0d13]">
              <BarChart2 size={12} className="text-[#334155]" />
              <span className="text-[11px] font-bold text-[#94a3b8]">Answer Overview</span>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1.5">
                {questions.map((_, idx) => {
                  const answered = answers[idx] !== null;
                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded-md flex items-center justify-center text-[10px] font-black"
                      style={{
                        background: answered ? '#082020' : '#100808',
                        color: answered ? '#22d3ee' : '#f87171',
                        border: `1px solid ${answered ? '#22d3ee22' : '#f8717122'}`,
                      }}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#1a2030]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-[#082020] border border-[#22d3ee22]" />
                  <span className="text-[10px] text-[#4a5568]">Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-[#100808] border border-[#f8717122]" />
                  <span className="text-[10px] text-[#4a5568]">Unanswered ({unansweredCount})</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer action bar */}
      <div className="flex-shrink-0 border-t border-[#1a2030] bg-[#0d1117] flex items-stretch h-14 sm:h-16">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex items-center gap-2 px-5 sm:px-8 font-bold text-[13px] border-r border-[#1a2030] transition-colors hover:bg-[#111827] text-[#64748b] disabled:opacity-40"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back to Exam</span>
          <span className="sm:hidden">Back</span>
        </button>

        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-[10px] text-[#334155] text-center">
            {unansweredCount > 0
              ? `${unansweredCount} question${unansweredCount !== 1 ? 's' : ''} left unanswered`
              : 'All questions answered — ready to submit!'}
          </p>
        </div>

        <button
          onClick={onConfirm}
          disabled={submitting}
          className="flex items-center gap-2 px-5 sm:px-10 font-black text-[13px] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: '#22d3ee', color: '#080b10' }}
        >
          {submitting ? (
            <>
              <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              <span>Submitting…</span>
            </>
          ) : (
            <>
              <Send size={13} />
              <span>Confirm Submit</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};


/* ── Ready Screen ── */
const ReadyScreen = ({ testType, complexity, duration, questions, onStart }) => {
  return (
    <div className="fixed inset-0 bg-[#080b10] flex items-center justify-center p-4 z-[100] font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-[#0d1117] border border-[#1a2030] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldAlert size={120} className="text-[#22d3ee]" />
        </div>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#141428] border border-[#1a2030] flex items-center justify-center">
            {testType === 'grand' ? <Layers size={24} className="text-[#818cf8]" /> : <BookOpen size={24} className="text-[#22d3ee]" />}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#e2e8f0]">{testType === 'grand' ? 'Grand Test' : 'Practice Test'}</h2>
            <p className="text-[10px] text-[#334155] uppercase tracking-widest font-bold">Technical Compliance Required</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-[#0a0d13] p-4 rounded-2xl border border-[#1a2030] flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-[#334155] uppercase tracking-widest mb-1">Questions</span>
            <span className="text-xl font-black text-[#e2e8f0]">{questions?.length || 0}</span>
          </div>
          <div className="bg-[#0a0d13] p-4 rounded-2xl border border-[#1a2030] flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-[#334155] uppercase tracking-widest mb-1">Time Limit</span>
            <span className="text-xl font-black text-[#e2e8f0]">{duration}m</span>
          </div>
        </div>

        <div className="mb-8 space-y-2.5">
          <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-widest pl-1">Compliance Checklist</p>
          <div className="space-y-2">
            {[
              { icon: Eye, text: 'Auto Full-screen enforced', color: '#818cf8', highlight: testType === 'grand' },
              { icon: Video, text: 'Active camera monitoring', color: '#22d3ee', highlight: testType === 'grand' },
              { icon: Timer, text: 'Fixed session clock', color: '#f59e0b', highlight: true }
            ].map((req, i) => (
              <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${req.highlight ? 'bg-[#111827] border-[#1a2030]' : 'opacity-40 border-transparent grayscale'}`}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: `${req.color}11` }}>
                  <req.icon size={14} style={{ color: req.color }} />
                </div>
                <span className="text-[12px] font-medium text-[#94a3b8]">{req.text}</span>
                {req.highlight && <div className="ml-auto w-1 h-4 rounded-full" style={{ background: req.color }} />}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl bg-[#22d3ee] text-[#080b10] font-black text-sm uppercase tracking-widest hover:bg-[#67e8f9] transition-all active:scale-[0.98] shadow-lg shadow-[#22d3ee]/10"
        >
          Begin Session
        </button>
        
        <p className="text-center text-[9px] text-[#334155] mt-5 uppercase tracking-widest font-bold">
          Permissions will be requested upon clicking begin
        </p>
      </motion.div>
    </div>
  );
};

/* ── Main Exam Interface ── */

const ExamInterface = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateXP } = useAuth();
  const { questions, testType, subjects, topics, complexity, duration } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(new Array(questions?.length || 0).fill(null));
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [submitted, setSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [warnings, setWarnings] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaError, setMediaError] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const timerRef = useRef(null);
  const warningRef = useRef(null);
  const warningCountRef = useRef(0);
  const timeLeftRef = useRef(duration * 60);
  const tabSwitchAutoSubmitRef = useRef(false);
  const handleSubmitRef = useRef(null);
  const submittedRef = useRef(false);
  const videoRef = useRef(null);

  const stopMedia = useCallback(() => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  }, [mediaStream]);

  useEffect(() => {
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, examStarted]);

  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  // The actual submit logic — called only after confirmation (or auto-submit)
  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (submittedRef.current) return;
    
    console.log('--- EXAM SUBMIT INITIATED ---', { autoSubmit });
    submittedRef.current = true;
    setSubmitted(true);
    setSubmitting(true);
    clearInterval(timerRef.current);
    clearTimeout(warningRef.current);
    stopMedia();
    
    // Ensure duration exists before calculation
    const currentDuration = duration || 60;
    const timeTaken = Math.max(0, Math.round((currentDuration * 60 - timeLeftRef.current) / 60));
    try {
      const payload = {
        type: testType,
        subjects: Array.isArray(subjects) ? subjects : [subjects],
        topics: Array.isArray(topics) ? topics : [topics],
        complexity, questions,
        userAnswers: answers,
        timeTaken,
        tabSwitchAttempts: tabSwitches,
        tabSwitchWarnings: warningCountRef.current,
      };
      console.log('Submitting test payload:', payload);
      const response = await api.post('/tests/save', payload);
      console.log('Submission response:', response.data);
      
      const xpGain = response.data.xpGain || 0;
      const xpTotal = response.data.xpTotal || (user?.xp || 0);
      if (xpGain > 0) { toast.success(`+${xpGain} XP earned!`); updateXP(xpTotal); }
      else if (warningCountRef.current > 0) toast.error('No XP — tab switching detected');
      else toast.success('Test submitted!');
      setShowSummary(false);
      setShowAnalysis(true);
    } catch (error) {
      console.error('--- SUBMISSION FAILED ---', error);
      const msg = error.response?.data?.error ? `Error: ${error.response.data.error}` : `Network error: ${error.message}`;
      toast.error(msg);
      submittedRef.current = false;
      tabSwitchAutoSubmitRef.current = false; // Allow retrying auto-submit
      setSubmitted(false);
      setSubmitting(false);
    }
  }, [answers, testType, subjects, topics, complexity, questions, duration, tabSwitches, updateXP, user]);

  useEffect(() => { handleSubmitRef.current = handleSubmit; }, [handleSubmit]);

  // Called by "Finish Test" / "Submit" buttons — shows summary screen first
  const requestSubmit = useCallback(() => {
    setShowSummary(true);
  }, []);

  const triggerIntegrityWarning = useCallback((reason) => {
    if (submittedRef.current) {
      console.log('Skipping integrity warning - already submitted');
      return;
    }
    
    warningCountRef.current += 1;
    const n = warningCountRef.current;
    setTabSwitches(p => p + 1);
    setWarnings(n);
    
    const isGrand = testType === 'grand';
    const maxWarnings = isGrand ? 1 : 3;
    
    console.log(`Integrity violation: ${reason} (Warning ${n}/${maxWarnings})`);
    toast.error(`Warning ${n}/${maxWarnings}: ${reason}`, { duration: 5000 });
    
    if (n >= maxWarnings) {
      setIsLocked(true);
      clearInterval(timerRef.current);
      stopMedia();
      toast.error('SESSION LOCKED: Integrity violations detected. Please submit your test now.', { duration: 10000 });
    }
  }, [testType]);

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      triggerIntegrityWarning('Tab switch detected!');
    }
  }, [triggerIntegrityWarning]);

  useEffect(() => {
    if (!questions) { navigate('/tests'); return; }
    if (submitted || !examStarted) return;
    
    timerRef.current = setInterval(() => {
      if (isLocked) return;
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (!submittedRef.current) { submittedRef.current = true; setSubmitted(true); handleSubmitRef.current?.(true); }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    const onCtxMenu = e => { e.preventDefault(); toast.error('Right-click disabled'); };
    const onCopyPaste = e => { e.preventDefault(); toast.error('Copy/paste disabled'); };
    const onKeyDown = e => {
      // Block common dev shortcuts
      if (
        e.key === 'F12' || 
        ((e.ctrlKey || e.metaKey) && (e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase()))) ||
        ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === 'U')
      ) {
        e.preventDefault();
        toast.error('Developer tools disabled');
        return;
      }
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 's', 'p'].includes(e.key.toLowerCase())) { 
        e.preventDefault(); 
        toast.error('Shortcuts disabled'); 
      }
    };

    const handleFullScreenChange = () => {
      if (testType === 'grand' && !document.fullscreenElement && !submittedRef.current && examStarted) {
        triggerIntegrityWarning('Full-screen exit detected!');
      }
    };

    if (examStarted) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('contextmenu', onCtxMenu);
      document.addEventListener('copy', onCopyPaste);
      document.addEventListener('paste', onCopyPaste);
      document.addEventListener('cut', onCopyPaste);
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('fullscreenchange', handleFullScreenChange);
    }
    
    return () => {
      clearInterval(timerRef.current);
      // Removed clearTimeout(warningRef.current) to prevent premature cancellation on re-render
      stopMedia();
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', onCtxMenu);
      document.removeEventListener('copy', onCopyPaste);
      document.removeEventListener('paste', onCopyPaste);
      document.removeEventListener('cut', onCopyPaste);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [questions, handleVisibilityChange, navigate, submitted, testType, stopMedia, examStarted]);

  // Dedicated cleanup for the integrity timeout only on actual component unmount
  useEffect(() => {
    return () => {
      if (warningRef.current) {
        console.log('Final cleanup - clearing integrity timeout');
        clearTimeout(warningRef.current);
      }
    };
  }, []);

  const handleStartExam = async () => {
    if (testType === 'grand') {
      try {
        // Request full screen
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        // Request media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMediaStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
        setExamStarted(true);
      } catch (err) {
        console.error('Media/Fullscreen error:', err);
        setMediaError(err.message);
        toast.error('Camera/Mic and Full-screen are required for Grand Test');
        // If it's just a permission denial, maybe navigate away
        if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
          navigate('/tests');
        }
      }
    } else {
      setExamStarted(true);
    }
  };

  if (!questions) return null;

  // Show ready screen before exam starts
  if (!examStarted) {
    return (
      <ReadyScreen 
        testType={testType} 
        complexity={complexity} 
        duration={duration} 
        questions={questions} 
        onStart={handleStartExam} 
      />
    );
  }

  // Show summary confirmation screen
  if (showSummary && !showAnalysis) {
    return (
      <SummaryScreen
        questions={questions}
        answers={answers}
        timeLeft={timeLeft}
        duration={duration}
        tabSwitches={tabSwitches}
        warnings={warnings}
        submitting={submitting}
        onConfirm={() => handleSubmit(false)}
        onBack={() => setShowSummary(false)}
      />
    );
  }

  // Show final analysis after submission
  if (showAnalysis) {
    const score = answers.filter((a, i) => a === questions[i].correctAnswer).length;
    const accuracy = Math.round((score / questions.length) * 100);
    const timeTaken = duration * 60 - timeLeft;
    return <AnalysisScreen questions={questions} answers={answers} score={score} accuracy={accuracy} timeTaken={timeTaken} tabSwitches={tabSwitches} warnings={warnings} navigate={navigate} />;
  }

  const answeredCount = answers.filter(a => a !== null).length;
  const timerCritical = timeLeft < 300;
  const timerWarn = timeLeft < 600;
  const timerColor = timerCritical ? '#f87171' : timerWarn ? '#a78bfa' : '#22d3ee';
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className=" fixed inset-0 bg-[#080b10] text-[#e2e8f0] flex flex-col overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Mono:wght@500&display=swap');
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:#0d1117}
        ::-webkit-scrollbar-thumb{background:#1e2535;border-radius:4px}
      `}</style>

      {/* ── Top Bar ── */}
      <div className="flex-shrink-0 bg-[#0d1117] border-b border-[#1a2030] flex items-stretch h-12 sm:h-14">

        {/* Brand cell */}
        <div className="flex items-center gap-3 px-4 sm:px-5 border-r border-[#1a2030]">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: testType === 'grand' ? '#141428' : '#0a1520' }}>
            {testType === 'grand'
              ? <Layers size={13} className="text-[#818cf8]" />
              : <BookOpen size={13} className="text-[#22d3ee]" />}
          </div>
          <div className="hidden sm:block">
            <p className="text-[11px] font-black text-[#e2e8f0] leading-none">{testType === 'grand' ? 'Grand Test' : 'Practice Test'}</p>
            <p className="text-[9px] text-[#334155] capitalize mt-0.5">{complexity}</p>
          </div>
        </div>

        {/* Progress cell */}
        <div className="flex-1 flex items-center gap-3 px-4 sm:px-6">
          <span className="hidden sm:block text-[9px] font-bold text-[#334155] uppercase tracking-widest whitespace-nowrap">Progress</span>
          <div className="flex-1 h-[3px] bg-[#1a2030] rounded-full overflow-hidden">
            <motion.div animate={{ width: `${progress}%` }} className="h-full bg-[#22d3ee] rounded-full" transition={{ duration: 0.3 }} />
          </div>
          <span className="text-[10px] font-mono text-[#334155] whitespace-nowrap">{answeredCount}/{questions.length}</span>
        </div>

        {/* Warning + Timer cell */}
        <div className="flex items-stretch border-l border-[#1a2030]">
          {warnings > 0 && (
            <div className="flex items-center gap-1.5 px-3 border-r border-[#1a2030] bg-[#100808]">
              <AlertTriangle size={10} className="text-[#f87171]" />
              <span className="text-[10px] font-black text-[#f87171] font-mono">{warnings}/3</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-4 sm:px-5" style={{ background: `${timerColor}08` }}>
            <Timer size={12} style={{ color: timerColor }} />
            <span className="font-mono text-sm font-black" style={{ color: timerColor }}>{formatTime(timeLeft)}</span>
          </div>
          {testType === 'grand' && (
            <div className="flex items-center gap-3 px-4 border-l border-[#1a2030] bg-[#0a1018]">
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${mediaStream ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                <Video size={12} className={mediaStream ? 'text-emerald-500' : 'text-red-500'} />
              </div>
              <Mic size={12} className={mediaStream ? 'text-emerald-500' : 'text-red-500'} />
            </div>
          )}
        </div>

        {/* Mobile nav toggle */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="lg:hidden flex items-center justify-center w-12 border-l border-[#1a2030] text-white hover:bg-[#111827] transition-colors"
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Lockdown Banner */}
        {isLocked && (
          <div className="absolute top-0 left-0 right-0 z-[100] bg-red-600 text-white px-6 py-3 flex items-center justify-between shadow-2xl animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-4">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
              <div>
                <p className="font-black text-sm uppercase tracking-wider">Session Locked</p>
                <p className="text-[11px] font-medium opacity-90">Multiple integrity violations detected. Navigation and answering are disabled.</p>
              </div>
            </div>
            <button 
              onClick={requestSubmit}
              className="bg-white text-red-600 px-5 py-1.5 rounded-lg font-black text-xs uppercase hover:bg-red-50 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              Finish & Submit
            </button>
          </div>
        )}

        {/* Mobile overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/70"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ── Sidebar ── */}
        <div className={`
          flex-shrink-0 bg-[#0d1117] border-r border-[#1a2030] flex flex-col overflow-hidden
          fixed top-12 sm:top-14 bottom-0 left-0 z-50 w-60 sm:w-64
          transition-transform duration-200 ease-out
          lg:relative lg:top-0 lg:translate-x-0 lg:w-56 xl:w-64
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>

          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a2030] bg-[#0a0d13] flex-shrink-0">
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Question Navigator</span>
            <span className="text-[9px] font-mono text-[#22d3ee]">{answeredCount}/{questions.length}</span>
          </div>

          {/* Grid + legend */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-1.5 mb-5">
              {questions.map((_, idx) => {
                const answered = answers[idx] !== null;
                const current = currentQuestion === idx;
                return (
                  <button key={idx}
                    onClick={() => { if (!isLocked) { setCurrentQuestion(idx); setSidebarOpen(false); } }}
                    disabled={isLocked}
                    style={{
                      background: answered ? '#082020' : current ? '#080f1a' : '#111827',
                      color: answered ? '#22d3ee' : current ? '#818cf8' : '#334155',
                      border: `1px solid ${answered ? '#22d3ee22' : current ? '#818cf833' : '#1a2030'}`,
                      boxShadow: current ? '0 0 0 1.5px #818cf8' : 'none',
                    }}
                  >{idx + 1}</button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="border border-[#1a2030] rounded-xl overflow-hidden divide-y divide-[#1a2030]">
              {[
                { label: 'Answered', color: '#22d3ee', count: answeredCount, bg: '#082020' },
                { label: 'Remaining', color: '#334155', count: questions.length - answeredCount, bg: '#111827' },
                { label: 'Current', color: '#818cf8', count: null, bg: '#080f1a' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="w-4 h-4 rounded-[4px] flex-shrink-0" style={{ background: l.bg, border: `1px solid ${l.color}33` }} />
                  <span className="text-[10px] text-[#4a5568] flex-1">{l.label}</span>
                  {l.count !== null && <span className="text-[10px] font-mono font-bold" style={{ color: l.color }}>{l.count}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Progress + Finish button — bottom of sidebar */}
          <div className="flex-shrink-0 border-t border-[#1a2030] p-4 space-y-3">
            <div>
              <div className="w-full h-[3px] bg-[#1a2030] rounded-full overflow-hidden mb-1.5">
                <motion.div animate={{ width: `${progress}%` }} className="h-full bg-[#22d3ee] rounded-full" transition={{ duration: 0.3 }} />
              </div>
              <p className="text-[9px] font-mono text-[#334155] text-center">{Math.round(progress)}% complete</p>
            </div>

              <button
                onClick={requestSubmit}
                disabled={submitted}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-[13px] transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
              style={{ background: '#22d3ee', color: '#080b10' }}
            >
              <Send size={13} /> Finish Test
            </button>
          </div>
        </div>

        {/* ── Proctoring Preview ── */}
        {testType === 'grand' && mediaStream && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-20 right-6 z-[60] w-40 sm:w-48 aspect-video rounded-xl overflow-hidden border-2 border-[#1a2030] bg-black shadow-2xl group"
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest bg-black/40 px-1.5 py-0.5 rounded">Live Recording</span>
            </div>
          </motion.div>
        )}

        {/* ── Question Panel ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* Question label row */}
          <div className="flex-shrink-0 flex items-center justify-between px-5 sm:px-8 py-3 border-b border-[#1a2030] bg-[#0a0d13]">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-[#334155] uppercase tracking-widest font-mono">
                Q{currentQuestion + 1}
              </span>
              <span className="text-[10px] text-[#1e2535] font-mono">/ {questions.length}</span>
            </div>
            <AnimatePresence>
              {answers[currentQuestion] !== null && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-[#22d3ee] bg-[#082020] px-2.5 py-1 rounded-full border border-[#22d3ee22]"
                >
                  <CheckCircle2 size={10} /> Answered
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div key={currentQuestion}
                initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.16 }}
                className="p-5 sm:p-8 lg:p-10 xl:p-12 pb-4 max-w-4xl w-full mx-auto"
              >
                {/* Question text */}
                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-[#e2e8f0] leading-relaxed mb-6 sm:mb-8">
                  {questions[currentQuestion].question}
                </h2>

                {/* Options — table grid layout */}
                <div className="border border-[#1a2030] rounded-xl overflow-hidden divide-y divide-[#1a2030]">
                  {questions[currentQuestion].options.map((option, idx) => {
                    const selected = answers[currentQuestion] === idx;
                    return (
                      <button key={idx}
                        onClick={() => {
                          if (isLocked) return;
                          const newAnswers = [...answers];
                          newAnswers[currentQuestion] = idx;
                          setAnswers(newAnswers);
                        }}
                        disabled={isLocked}
                        className={`w-full text-left flex items-stretch transition-all ${isLocked ? 'cursor-not-allowed grayscale-[0.5] opacity-50' : ''}`}
                        style={{ background: selected ? '#080f1a' : 'transparent' }}
                      >
                        {/* Letter column */}
                        <div
                          className="flex-shrink-0 w-12 sm:w-14 xl:w-16 flex items-center justify-center border-r border-[#1a2030] transition-colors"
                          style={{ background: selected ? '#22d3ee' : '#0a0d13' }}
                        >
                          <span className="text-[11px] font-black" style={{ color: selected ? '#080b10' : '#334155' }}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                        </div>

                        {/* Text column */}
                        <div className="flex-1 px-4 sm:px-6 py-4">
                          <span className="text-sm sm:text-[15px] font-medium leading-snug transition-colors"
                            style={{ color: selected ? '#e2e8f0' : '#94a3b8' }}>
                            {option}
                          </span>
                        </div>

                        {/* Check column */}
                        <div className="flex-shrink-0 w-10 sm:w-12 flex items-center justify-center border-l border-[#1a2030]">
                          <AnimatePresence>
                            {selected && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <CheckCircle2 size={14} className="text-[#22d3ee]" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Bottom Nav Bar ── */}
          <div className="flex-shrink-0 border-t border-[#1a2030] bg-[#0d1117] flex items-stretch h-12 sm:h-14">

            {/* Prev */}
            <button
              onClick={() => setCurrentQuestion(p => Math.max(0, p - 1))}
              disabled={currentQuestion === 0 || isLocked}
              className="flex items-center gap-2 px-4 sm:px-7 font-bold text-sm border-r border-[#1a2030] transition-colors disabled:opacity-25 disabled:cursor-not-allowed hover:bg-[#111827] text-[#64748b]"
            >
              <ChevronLeft size={15} /> <span className="hidden sm:inline text-[13px]">Prev</span>
            </button>

            {/* Center dots */}
            <div className="flex-1 flex items-center justify-center gap-2 px-4">
              <div className="hidden md:flex items-center gap-1">
                {questions.slice(0, Math.min(questions.length, 30)).map((_, i) => (
                  <div key={i}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: i === currentQuestion ? '16px' : '6px',
                      height: '6px',
                      background: answers[i] !== null ? '#22d3ee' : i === currentQuestion ? '#818cf8' : '#1a2030',
                    }}
                  />
                ))}
                {questions.length > 30 && <span className="text-[9px] text-[#334155] ml-1">+{questions.length - 30}</span>}
              </div>
              <div className="md:hidden flex items-center gap-1.5 text-[10px] text-[#334155]">
                <Eye size={10} />
                <span>Proctored</span>
              </div>
            </div>

            {/* Next or Submit */}
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={requestSubmit}
                className="flex items-center gap-2 px-5 sm:px-8 font-black text-[13px] transition-all disabled:opacity-50 border-l border-[#1a2030] hover:brightness-110"
                style={{ background: '#22d3ee', color: '#080b10' }}
              >
                <Send size={13} /> <span className="hidden sm:inline">Submit</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(p => Math.min(questions.length - 1, p + 1))}
                disabled={isLocked}
                className="flex items-center gap-2 px-4 sm:px-7 font-bold text-[13px] border-l border-[#1a2030] transition-colors hover:bg-[#080f1a] text-[#22d3ee] disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span> <ChevronRight size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;