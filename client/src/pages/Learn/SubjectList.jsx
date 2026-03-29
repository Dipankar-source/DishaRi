import React, { useState, useMemo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiChevronDown,
  FiCheckCircle,
  FiPlay,
  FiBookOpen,
  FiCircle,
  FiZap,
  FiSearch,
  FiFilter,
  FiStar,
  FiTrendingUp,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";

const DIFFICULTY_STYLES = {
  beginner: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  intermediate: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  advanced: "bg-rose-400/10 text-rose-400 border-rose-400/20",
};

/* ── Skeleton ── */
export const SubjectListSkeleton = () => (
  <div className="bg-slate-900 border border-slate-800/70 rounded-2xl overflow-hidden">
    <div className="p-5 border-b border-slate-800/60">
      <div className="h-4 w-28 bg-slate-800 rounded-full animate-pulse" />
      <div className="h-3 w-40 bg-slate-800 rounded-full animate-pulse mt-2" />
    </div>
    <div className="divide-y divide-slate-800/50">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 space-y-2">
          <div className="h-3.5 w-36 bg-slate-800 rounded animate-pulse" />
          <div className="h-1.5 bg-slate-800 rounded-full animate-pulse" />
          <div className="h-2.5 w-20 bg-slate-800 rounded animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const SubjectList = ({
  subjects,
  selectedSubject,
  onSelectSubject,
  onSelectTopic,
  loading,
  onDeleteSubject,
  onDeleteTopic,
  onAddSubject,
}) => {
  const [expanded, setExpanded] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, bookmarked, inProgress, completed
  const [bookmarked, setBookmarked] = useState(new Set());
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("📖 SubjectList received subjects:", subjects);
    console.log("   Total subjects:", subjects?.length || 0);
    if (subjects && subjects.length > 0) {
      console.log("   First subject:", subjects[0].name, "with", subjects[0].totalTopics || subjects[0].topics?.length, "topics");
    }
  }, [subjects]);

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  // AI-powered search and filter
  const filteredSubjects = useMemo(() => {
    console.log("🔍 Filtering subjects...");
    let result = subjects;

    // Text search - matches subject name or topic names
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (subject) =>
          subject.name.toLowerCase().includes(query) ||
          (subject.topics &&
            subject.topics.some((topic) =>
              topic.title.toLowerCase().includes(query)
            ))
      );
    }

    // Filter by progress type
    switch (filterType) {
      case "completed":
        result = result.filter((s) => s.userProgress?.isCompleted);
        break;
      case "inProgress":
        result = result.filter(
          (s) =>
            !s.userProgress?.isCompleted &&
            (s.userProgress?.completedTopics || 0) > 0
        );
        break;
      case "bookmarked":
        result = result.filter((s) => bookmarked.has(s._id));
        break;
      default:
        // all
        break;
    }

    // Sort: by progress, then by name
    result = result.sort((a, b) => {
      const aProgress = (a.userProgress?.completedTopics || 0) / (a.totalTopics || 1);
      const bProgress = (b.userProgress?.completedTopics || 0) / (b.totalTopics || 1);
      if (bProgress !== aProgress) return bProgress - aProgress;
      return a.name.localeCompare(b.name);
    });

    console.log(`📊 Filter: ${filterType}, Search: "${searchQuery}" → Showing ${result.length} of ${subjects.length} subjects`);
    return result;
  }, [subjects, searchQuery, filterType, bookmarked]);

  const handleSubjectClick = (subject) => {
    if (selectedSubject?._id === subject._id) {
      onSelectSubject(null);
    } else {
      onSelectSubject(subject);
      if (!expanded[subject._id]) toggle(subject._id);
    }
  };

  const toggleBookmark = (e, subjectId) => {
    e.stopPropagation();
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(subjectId)) {
        next.delete(subjectId);
      } else {
        next.add(subjectId);
      }
      return next;
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800/70 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-4 md:px-5 py-4 border-b border-slate-800/60 flex-shrink-0 flex items-center justify-between">
        <div>
          <p className="text-white font-semibold text-sm md:text-base">Learning Path</p>
          <p className="text-slate-500 text-xs mt-0.5">
            Master CSE concepts step by step
          </p>
        </div>
        <motion.button
          onClick={onAddSubject}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-400/20 text-blue-400 hover:bg-blue-500/15 transition-colors text-xs md:text-sm font-semibold flex-shrink-0"
        >
          <FiPlus className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Add Subject</span>
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="px-3 md:px-4 py-3 border-b border-slate-800/40 flex-shrink-0 space-y-2">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search subjects or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { value: "all", label: "All", icon: FiZap },
            { value: "inProgress", label: "In Progress", icon: FiTrendingUp },
            { value: "completed", label: "Completed", icon: FiCheckCircle },
            { value: "bookmarked", label: "Bookmarked", icon: FiStar },
          ].map(({ value, label, icon: Icon }) => (
            <motion.button
              key={value}
              onClick={() => setFilterType(value)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                filterType === value
                  ? "bg-amber-400 text-slate-900 shadow-md shadow-amber-400/20"
                  : "bg-slate-800/50 text-slate-400 hover:text-slate-300"
              }`}
            >
              <Icon className="w-3 h-3" />
              <span className="hidden sm:inline">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Scrollable subjects list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600">
        {filteredSubjects.length > 0 ? (
          <div className="divide-y divide-slate-800/50">
            {filteredSubjects.map((subject, si) => {
              const completed = subject.userProgress?.completedTopics || 0;
              const total = subject.totalTopics || subject.topics?.length || 1;
              const pct = Math.round((completed / total) * 100);
              const isSelected = selectedSubject?._id === subject._id;
              const isExpanded = expanded[subject._id];
              const isDone = subject.userProgress?.isCompleted;
              const isBm = bookmarked.has(subject._id);

              console.log(`📌 Rendering subject: ${subject.name}, ID: ${subject._id}, Total: ${total}, Completed: ${completed}`);

              return (
                <div key={subject._id}>
                  {/* Subject row */}
                  <motion.div
                    onClick={() => handleSubjectClick(subject)}
                    whileHover={{ backgroundColor: "rgba(30,41,59,0.6)" }}
                    className={`relative px-3 md:px-4 py-3 md:py-3.5 cursor-pointer transition-colors ${
                      isSelected ? "bg-slate-800/60" : ""
                    }`}
                  >
                    {/* Active left bar */}
                    {isSelected && (
                      <motion.div
                        layoutId="subject-active-bar"
                        className="absolute left-0 top-3 bottom-3 w-0.5 bg-amber-400 rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}

                    <div className="flex items-start gap-2 md:gap-3">
                      {/* Expand chevron */}
                      <motion.button
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(subject._id);
                        }}
                        className="mt-0.5 text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0"
                      >
                        <FiChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </motion.button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-xs md:text-sm font-semibold truncate transition-colors ${
                                isSelected ? "text-amber-400" : "text-slate-200"
                              }`}
                            >
                              {subject.name}
                            </p>
                            {subject.isUserCreated && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-400/10 text-amber-400 border border-amber-400/20 font-medium">
                                AI
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {isDone ? (
                              <FiCheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-400" />
                            ) : (
                              <span className="text-slate-500 text-xs font-medium">
                                {pct}%
                              </span>
                            )}
                            {onDeleteSubject && (
                              <motion.button
                                whileHover={{ scale: 1.1, color: "#ef4444" }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteSubject(subject._id);
                                }}
                                className="p-1 text-slate-600 hover:text-red-500 transition-colors rounded"
                                title="Delete Subject"
                              >
                                <FiTrash2 className="w-3 h-3" />
                              </motion.button>
                            )}
                            <motion.button
                              onClick={(e) => toggleBookmark(e, subject._id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className={`text-xs lg md:text-sm transition-colors ${
                                isBm
                                  ? "text-amber-400"
                                  : "text-slate-600 hover:text-amber-400"
                              }`}
                            >
                              <FiStar
                                className="w-3 h-3 md:w-3.5 md:h-3.5"
                                fill={isBm ? "currentColor" : "none"}
                              />
                            </motion.button>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{
                              duration: 0.6,
                              delay: si * 0.04,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                            className={`h-full rounded-full ${
                              pct >= 80
                                ? "bg-emerald-400"
                                : pct >= 40
                                  ? "bg-amber-400"
                                  : "bg-blue-400"
                            }`}
                          />
                        </div>

                        <p className="text-slate-600 text-xs mt-1">
                          {completed}/{total} topics
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Topics accordion */}
                  <AnimatePresence>
                    {isExpanded && subject.topics && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden bg-slate-950/40"
                      >
                        <div className="px-2 md:px-3 py-2 space-y-0.5">
                          {subject.topics.map((topic, ti) => (
                            <motion.button
                              key={topic._id}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: ti * 0.03 }}
                              onClick={() => onSelectTopic(topic)}
                              className={`w-full text-left flex items-center gap-2 md:gap-3 px-2 md:px-3 py-1.5 md:py-2.5 rounded-lg transition-all duration-200 group ${
                                topic.isCompleted
                                  ? "hover:bg-emerald-400/5"
                                  : "hover:bg-slate-800"
                              }`}
                            >
                              {/* Completion indicator */}
                              <div className="flex-shrink-0">
                                {topic.isCompleted ? (
                                  <div className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <FiCheckCircle className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" />
                                  </div>
                                ) : (
                                  <FiCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-slate-600 group-hover:text-slate-400 transition-colors" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-xs md:text-sm font-medium truncate transition-colors ${
                                    topic.isCompleted
                                      ? "text-slate-500 line-through"
                                      : "text-slate-300 group-hover:text-white"
                                  }`}
                                >
                                  {topic.title}
                                </p>
                                <div className="flex items-center gap-1.5 md:gap-2 mt-0.5">
                                  {topic.videoUrl && (
                                    <span className="flex items-center gap-0.5 text-slate-600 text-[10px] md:text-xs">
                                      <FiPlay className="w-2.5 h-2.5" />
                                      Video
                                    </span>
                                  )}
                                  {topic.documentationUrl && (
                                    <span className="flex items-center gap-0.5 text-slate-600 text-[10px] md:text-xs">
                                      <FiBookOpen className="w-2.5 h-2.5" />
                                      Docs
                                    </span>
                                  )}
                                  <span className="text-slate-600 text-[10px] md:text-xs italic">
                                    {topic.difficulty}
                                  </span>
                                </div>
                              </div>

                              {onDeleteTopic && (
                                <motion.button
                                  whileHover={{ scale: 1.1, color: "#ef4444" }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteTopic(subject._id, topic._id);
                                  }}
                                  className="p-1.5 text-slate-600 hover:text-red-500 transition-colors rounded opacity-0 group-hover:opacity-100"
                                  title="Delete Topic"
                                >
                                  <FiTrash2 className="w-3.5 h-3.5" />
                                </motion.button>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-8 md:py-12 text-center">
            <FiZap className="w-8 h-8 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-xs md:text-sm">
              {searchQuery
                ? "No subjects match your search."
                : "No subjects found."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectList;
