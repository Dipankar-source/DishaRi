import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Mail, Phone, MapPin, Calendar, Edit3, Save, X,
  Trophy, Zap, Target, BookOpen, Clock, TrendingUp,
  Star, Award, Shield, Flame, CheckCircle2, Lock,
  BarChart2, ChevronRight, Camera, Loader2, AlertCircle,
  BookMarked, Medal, Crown, Sparkles, Brain,
} from 'lucide-react';
import api from '../../utils/api';

/* ─────────────────────────────────────────────────────────────────────────────
   STYLES & CONFIG
 ───────────────────────────────────────────────────────────────────────────── */
const RANK_CONFIG = {
  Novice:  { color: 'text-slate-400',   bg: 'bg-slate-800/50',   gradient: 'from-slate-700 to-slate-900', border: 'border-slate-700' },
  Learner: { color: 'text-blue-400',    bg: 'bg-blue-900/20',    gradient: 'from-blue-600/40 to-indigo-900/40', border: 'border-blue-800/50' },
  Scholar: { color: 'text-indigo-400',  bg: 'bg-indigo-900/20',  gradient: 'from-indigo-600/40 to-purple-900/40', border: 'border-indigo-800/50' },
  Expert:  { color: 'text-amber-400',   bg: 'bg-amber-900/20',   gradient: 'from-amber-600/40 to-orange-900/40', border: 'border-amber-800/50' },
  Master:  { color: 'text-rose-400',    bg: 'bg-rose-900/20',    gradient: 'from-rose-600/40 to-red-900/40', border: 'border-rose-800/50' },
  Legend:  { color: 'text-violet-400',  bg: 'bg-violet-900/20',  gradient: 'from-violet-600/40 to-fuchsia-900/40', border: 'border-violet-800/50' },
};

const COMPLEXITY_STYLES = {
  easy:     'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50',
  moderate: 'bg-blue-900/30 text-blue-400 border border-blue-800/50',
  hard:     'bg-amber-900/30 text-amber-400 border border-amber-800/50',
  extreme:  'bg-red-900/30 text-red-400 border border-red-800/50',
};

const ACHIEVEMENTS_LIST = [
  { id: 1,  icon: Flame,      label: 'First Blood',       desc: 'Complete your first test',       goal: 1,   color: 'text-orange-400', bg: 'bg-orange-900/20',  border: 'border-orange-800/50' },
  { id: 2,  icon: Star,       label: 'Perfect Score',     desc: 'Score 100% on any test',         goal: 1,   color: 'text-amber-400',  bg: 'bg-amber-900/20',   border: 'border-amber-800/50'  },
  { id: 3,  icon: Zap,        label: 'Speed Demon',       desc: 'Finish a test in under 20 min',  goal: 1,   color: 'text-yellow-400', bg: 'bg-yellow-900/20',  border: 'border-yellow-800/50' },
  { id: 4,  icon: BookOpen,   label: 'Bookworm',          desc: 'Complete 3 subjects',            goal: 3,   color: 'text-blue-400',   bg: 'bg-blue-900/20',    border: 'border-blue-800/50'   },
  { id: 5,  icon: Trophy,     label: 'Grand Champion',    desc: 'Pass 5 Grand Tests',             goal: 5,   color: 'text-indigo-400', bg: 'bg-indigo-900/20',  border: 'border-indigo-800/50' },
  { id: 6,  icon: Shield,     label: 'Integrity Star',    desc: '10 tests with zero tab switch',  goal: 10,  color: 'text-emerald-400',bg: 'bg-emerald-900/20', border: 'border-emerald-800/50'},
  { id: 7,  icon: Brain,      label: 'Big Brain',         desc: 'Score 90%+ on an Extreme test',  goal: 1,   color: 'text-violet-400', bg: 'bg-violet-900/20',  border: 'border-violet-800/50'  },
  { id: 8,  icon: Crown,      label: 'Legend',            desc: 'Reach Level 10',                 goal: 10,  color: 'text-rose-400',   bg: 'bg-rose-900/20',    border: 'border-rose-800/50'  },
  { id: 9,  icon: Sparkles,   label: 'Streak Master',     desc: 'Maintain a 30-day streak',       goal: 30,  color: 'text-pink-400',   bg: 'bg-pink-900/20',    border: 'border-pink-800/50'  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
 ───────────────────────────────────────────────────────────────────────────── */
const formatDate = (iso) => 
  iso ? new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';

const formatMinutes = (m) => 
  m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;

const AccuracyRing = ({ pct, size = 64, stroke = 6 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENTS
 ───────────────────────────────────────────────────────────────────────────── */
const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-slate-900 rounded-3xl h-64 border border-slate-800 shadow-xl" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <div key={i} className="bg-slate-900 rounded-2xl h-24 border border-slate-800" />)}
    </div>
    <div className="bg-slate-900 rounded-3xl h-80 border border-slate-800 shadow-xl" />
  </div>
);

const EditProfileModal = ({ user, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    location: user.location || '',
    bio: user.bio || '',
    avatar: user.avatar || ''
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (form.bio.length > 500) e.bio = 'Max 500 characters';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      await api.patch('/profile/update', form);
      onSave(form);
    } catch (err) {
      console.error(err);
      setErrors({ global: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, name, type = 'text', icon: Icon, placeholder, rows }) => (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
        <Icon size={12} className="text-blue-500" /> {label}
      </label>
      {rows ? (
        <textarea
          rows={rows}
          value={form[name]}
          onChange={e => { setForm(p => ({ ...p, [name]: e.target.value })); setErrors(p => ({ ...p, [name]: '' })); }}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border bg-slate-800/50 text-slate-200 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none ${errors[name] ? 'border-red-500/50' : 'border-slate-700/50 focus:border-blue-500/50'}`}
        />
      ) : (
        <input
          type={type}
          value={form[name]}
          onChange={e => { setForm(p => ({ ...p, [name]: e.target.value })); setErrors(p => ({ ...p, [name]: '' })); }}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border bg-slate-800/50 text-slate-200 focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${errors[name] ? 'border-red-500/50' : 'border-slate-700/50 focus:border-blue-500/50'}`}
        />
      )}
      {errors[name] && <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-medium"><AlertCircle size={10} /> {errors[name]}</p>}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Edit3 size={18} className="text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">Edit Profile</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-slate-800 flex items-center justify-center transition-colors">
            <X size={20} className="text-slate-500 hover:text-slate-300" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          <Field label="Full Name"    name="name"     icon={User}    placeholder="Your full name" />
          <Field label="Phone"        name="phone"    icon={Phone}   placeholder="+91 00000 00000" />
          <Field label="Location"     name="location" icon={MapPin}  placeholder="City, State" />
          <Field label="Bio"          name="bio"      icon={BookOpen} placeholder="Tell us about yourself…" rows={4} />
          {form.bio.length > 0 && (
            <p className={`text-[10px] text-right -mt-3 font-mono ${form.bio.length > 500 ? 'text-red-400' : 'text-slate-500'}`}>
              {form.bio.length}/500
            </p>
          )}
        </div>

        <div className="p-6 border-t border-slate-800 flex gap-4">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-slate-700 text-slate-400 font-bold text-sm hover:bg-slate-800 hover:text-slate-200 transition-all">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save Profile</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
 ───────────────────────────────────────────────────────────────────────────── */
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editOpen, setEditOpen] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/profile/me');
      setUser(res.data.user);
      setStats(res.data.stats);
      setTests(res.data.dashboard?.testsSeries?.reverse() || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      const base64 = ev.target.result;
      try {
        await api.patch('/profile/update', { avatar: base64 });
        setUser(p => ({ ...p, avatar: base64 }));
      } catch (err) { console.error(err); }
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><ProfileSkeleton /></div>;
  if (!user) return <div className="text-center py-20 text-slate-400">User profile not found.</div>;

  const rank = RANK_CONFIG[user.rank] || RANK_CONFIG.Novice;
  const xpPct = Math.min(100, Math.round((user.xp / user.xpToNext) * 100));

  const TABS = [
    { key: 'overview',      label: 'Stats',      icon: BarChart2  },
    { key: 'tests',         label: 'History',    icon: BookMarked },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* ── Hero Profile Card ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden relative group"
        >
          {/* Neon Glow Banner */}
          <div className={`h-32 bg-gradient-to-br ${rank.gradient} relative overflow-hidden`}>
            <div className="absolute inset-0 opacity-30 mix-blend-overlay animate-pulse-slow"
              style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent" />
          </div>

          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between -mt-12 gap-6">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                {/* Avatar Section */}
                <div className="relative group/avatar">
                  <motion.div
                    className="w-32 h-32 rounded-3xl border-[6px] border-slate-900 shadow-2xl overflow-hidden cursor-pointer bg-slate-800 flex items-center justify-center relative z-10"
                    onHoverStart={() => setAvatarHover(true)}
                    onHoverEnd={() => setAvatarHover(false)}
                    onClick={() => fileRef.current?.click()}
                    whileHover={{ scale: 1.02 }}
                  >
                    {user.avatar
                      ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                      : <User size={48} className="text-slate-600" />
                    }
                    <AnimatePresence>
                      {avatarHover && (
                        <motion.div
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center"
                        >
                          <Camera size={24} className="text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  
                  {/* Level Float */}
                  <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl ${rank.bg} border-2 border-slate-900 flex items-center justify-center shadow-lg z-20`}>
                    <span className={`text-xs font-black ${rank.color}`}>{user.level}</span>
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-2 mb-2">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <h1 className="text-3xl font-black text-white tracking-tight">{user.name}</h1>
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 border ${rank.border} ${rank.color}`}>
                      {user.rank}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-2"><Mail size={14} className="text-blue-500/50" />{user.email}</span>
                    {user.location && <span className="flex items-center gap-2"><MapPin size={14} className="text-rose-500/50" />{user.location}</span>}
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-indigo-500/50" />Active since {formatDate(user.joinedAt)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditOpen(true)}
                className="px-6 py-3 rounded-2xl border border-slate-700 bg-slate-800/30 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 hover:border-slate-500 active:scale-95 transition-all"
              >
                <Edit3 size={16} /> Edit Profile
              </button>
            </div>

            {user.bio && (
              <p className="mt-8 text-sm text-slate-400 font-medium leading-relaxed max-w-2xl text-center md:text-left">
                {user.bio}
              </p>
            )}

            {/* XP Progress Section */}
            <div className="mt-8 pt-8 border-t border-slate-800/50">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                <span className="flex items-center gap-2 text-amber-500">
                  <Flame size={14} /> {user.xp.toLocaleString()} XP Points
                </span>
                <span>Level {user.level} Progress · {xpPct}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-800/50">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${xpPct}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${rank.gradient} relative shadow-[0_0_20px_rgba(59,130,246,0.3)]`}
                />
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                  {user.xp} / {user.xpToNext * user.level}
                </p>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">
                  {user.xpToNext - (user.xp % user.xpToNext)} XP to Level {user.level + 1}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Stats Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Target,    label: 'Tests Taken',    value: stats?.testStats?.totalTests || 0, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
            { icon: TrendingUp,label: 'Avg Accuracy',   value: `${(stats?.testStats?.accuracyRate || 0).toFixed(1)}%`, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
            { icon: Sparkles,  label: 'Current Streak', value: user.streak, color: 'from-rose-500 to-orange-500', shadow: 'shadow-rose-500/20' },
            { icon: Clock,     label: 'Best Score',     value: stats?.testStats?.bestScore || 0, color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20' },
          ].map(({ icon: Icon, label, value, color, shadow }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`bg-slate-900/50 border border-slate-800 p-5 rounded-3xl flex items-center gap-4 hover:border-slate-700 transition-all ${shadow} hover:shadow-2xl`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${color} shadow-lg`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl font-black text-white leading-tight">{value}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Tab Navigation ──────────────────────────────────────────────── */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-2 flex gap-2">
          {TABS.map(tab => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="relative flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold transition-all overflow-hidden"
              >
                {active && (
                  <motion.div
                    layoutId="tabGlow"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-900/40"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <tab.icon size={18} className={`relative z-10 transition-colors ${active ? 'text-white' : 'text-slate-500'}`} />
                <span className={`relative z-10 transition-colors ${active ? 'text-white' : 'text-slate-400'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="min-h-[400px]"
          >
            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <Target size={20} className="text-blue-500" /> Stats Breakdown
                  </h3>
                  <div className="space-y-4">
                    {[
                      { l: 'Practice Tests', v: stats?.testStats?.practiceTests || 0, c: 'text-blue-400', bg: 'bg-blue-400/10' },
                      { l: 'Grand Tests',    v: stats?.testStats?.grandTests || 0,    c: 'text-amber-400', bg: 'bg-amber-400/10' },
                      { l: 'Subject Stats',  v: stats?.subjectStats?.length || 0,      c: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                      { l: 'Total Score',    v: stats?.testStats?.totalScore || 0,    c: 'text-rose-400', bg: 'bg-rose-400/10' },
                    ].map(s => (
                      <div key={s.l} className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/30 border border-slate-800">
                        <span className="text-sm font-semibold text-slate-400">{s.l}</span>
                        <span className={`text-lg font-black ${s.c}`}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp size={120} className="text-blue-500" />
                  </div>
                  <AccuracyRing pct={stats?.testStats?.accuracyRate || 0} size={160} stroke={12} />
                  <div className="mt-8 text-center space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Accuracy</p>
                    <p className="text-4xl font-black text-white">{(stats?.testStats?.accuracyRate || 0).toFixed(1)}%</p>
                    <p className="text-xs text-slate-400 font-medium">Keep it above 80% to maintain your rank!</p>
                  </div>
                </div>
              </div>
            )}

            {/* TEST HISTORY */}
            {activeTab === 'tests' && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <BookMarked size={20} className="text-blue-500" /> Recent Activities
                  </h3>
                  <span className="text-[10px] font-black text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    {tests.length} Records
                  </span>
                </div>
                <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {tests.length > 0 ? tests.map((test, i) => {
                    const accuracy = (test.correctAnswers / test.totalQuestions) * 100 || 0;
                    return (
                      <div key={i} className="px-8 py-5 flex items-center gap-6 hover:bg-slate-800/40 transition-colors group">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${test.testType === 'grand' ? 'bg-amber-500/10' : 'bg-blue-500/10'} border border-white/5`}>
                          {test.testType === 'grand' ? <Trophy size={18} className="text-amber-500" /> : <BookOpen size={18} className="text-blue-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-sm font-bold text-slate-100 truncate capitalize">{test.subject?.name || 'Quick Test'}</p>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${test.testType === 'grand' ? 'bg-amber-900/30 text-amber-400' : 'bg-blue-900/30 text-blue-400'}`}>
                              {test.testType}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold flex items-center gap-3">
                            <span className="flex items-center gap-1.5"><Calendar size={12} /> {formatDate(test.date)}</span>
                            <span className="flex items-center gap-1.5"><Target size={12} /> {test.correctAnswers} / {test.totalQuestions} Right</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-black ${accuracy >= 80 ? 'text-emerald-400' : accuracy >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                            {accuracy.toFixed(0)}%
                          </p>
                          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Accuracy</p>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="px-8 py-20 text-center text-slate-500 font-bold tracking-tight">No test history available.</div>
                  )}
                </div>
              </div>
            )}

            {/* ACHIEVEMENTS */}
            {activeTab === 'achievements' && (
              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <Medal size={20} className="text-amber-500" /> Professional Badges
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 tracking-wider">EARNED 0 / {ACHIEVEMENTS_LIST.length}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {ACHIEVEMENTS_LIST.map((badge, i) => {
                    const Icon = badge.icon;
                    return (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                        className={`p-5 rounded-3xl border-2 flex items-center gap-4 group opacity-50 bg-slate-950/30 border-slate-800`}
                      >
                        <div className={`w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 relative`}>
                          <Icon size={20} className="text-slate-600" />
                          <div className="absolute -top-1 -right-1">
                            <Lock size={12} className="text-slate-500" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-tight">{badge.label}</p>
                          <p className="text-[10px] text-slate-600 font-medium leading-tight">{badge.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Edit Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {editOpen && (
          <EditProfileModal 
            user={user} 
            onClose={() => setEditOpen(false)} 
            onSave={(u) => { setUser(p => ({ ...p, ...u })); setEditOpen(false); }} 
          />
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.1; } }
      `}</style>
    </div>
  );
};

export default ProfilePage;