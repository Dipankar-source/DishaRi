import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FiDownload,
  FiCheck,
  FiArrowLeft,
  FiAward,
  FiChevronRight,
} from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../../utils/api";

/* ─────────────────────────────────────────────────────────────────────────
   LAYOUT CONSTANTS
   ───────────────────────────────────────────────────────────────────────── */
const SEC_W = 160;
const SEC_H = 44;
const TOP_W = 140;
const TOP_H = 32;
const H_GAP = 28; // gap between section and topic columns
const V_GAP = 28; // Increased for sub-node space
const SEC_V = 56; // Increased for sub-node space
const CURVE_STRENGTH = 12;
const SUB_R = 3.5;
const SUB_GAP = 8;
const SUB_Y_OFF = 16;

/* Palette per section index — no amber */
const PALETTES = [
  { fill: "#111826", stroke: "#3b6bff", text: "#93b4ff", sub: "#3b5090" },
  { fill: "#0f1e15", stroke: "#22c55e", text: "#6ee7a0", sub: "#1a5a32" },
  { fill: "#1a1026", stroke: "#a855f7", text: "#d4aaff", sub: "#5a2090" },
  { fill: "#1a1414", stroke: "#ef4444", text: "#fca5a5", sub: "#7a2020" },
  { fill: "#0f1a1a", stroke: "#06b6d4", text: "#67e8f9", sub: "#0a4a55" },
  { fill: "#1a1420", stroke: "#ec4899", text: "#f9a8d4", sub: "#7a1a4a" },
];

const DIFF_COLORS = {
  beginner: { fill: "#0c1a0e", stroke: "#16a34a", text: "#86efac" },
  intermediate: { fill: "#1a1510", stroke: "#d97706", text: "#fcd34d" },
  advanced: { fill: "#1a0e0e", stroke: "#dc2626", text: "#fca5a5" },
  _default: { fill: "#12121e", stroke: "#3a3a58", text: "#9090b8" },
};

function topicColor(topic, isDone) {
  if (isDone) return { fill: "#081408", stroke: "#16a34a", text: "#86efac" };
  return DIFF_COLORS[topic.difficulty] || DIFF_COLORS._default;
}

/* Build layout → returns { sections[], totalH } */
function layout(sections = [], progress = {}) {
  let y = 56;
  const out = [];

  for (let si = 0; si < sections.length; si++) {
    const sec = sections[si];
    const pal = PALETTES[si % PALETTES.length];
    const topics = sec.topics || [];
    const done = topics.filter((t) => progress[`${sec.id}-${t.id}`]).length;
    const pct = topics.length ? Math.round((done / topics.length) * 100) : 0;

    /* Two-column topic layout */
    const rows = Math.ceil(topics.length / 2);
    const topicsH = rows * TOP_H + Math.max(0, rows - 1) * V_GAP;
    const blockH = Math.max(SEC_H, topicsH);

    /* Section box y: vertically centered in block */
    const secY = y + (blockH - SEC_H) / 2;
    const secX = 28;

    /* Topics start at y */
    const col0X = secX + SEC_W + H_GAP + 16;
    const col1X = col0X + TOP_W + H_GAP;

    const tops = topics.map((t, ti) => {
      const col = ti % 2;
      const row = Math.floor(ti / 2);
      const tx = col === 0 ? col0X : col1X;
      const ty = y + row * (TOP_H + V_GAP) + (blockH - topicsH) / 2;
      const isDone = !!progress[`${sec.id}-${t.id}`];
      return { t, tx, ty, col, row, isDone, color: topicColor(t, isDone) };
    });

    out.push({
      sec,
      pal,
      pct,
      done,
      secX,
      secY,
      tops,
      blockH,
      y,
      col0X,
      col1X,
    });
    y += blockH + SEC_V;
  }

  return { sections: out, totalH: y + 28 };
}

/* ─────────────────────────────────────────────────────────────────────────
   SVG TREE
   ───────────────────────────────────────────────────────────────────────── */
function TreeSVG({ roadmap, progress, onToggle }) {
  const secs = roadmap?.sections || [];
  const { sections: lays, totalH } = layout(secs, progress);
  const VW = 560;
  const spineX = 28 + SEC_W / 2;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${VW} ${totalH}`}
      style={{ display: "block" }}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Main vertical spine */}
      <line
        x1={spineX}
        y1="20"
        x2={spineX}
        y2={totalH - 20}
        stroke="#1e1e32"
        strokeWidth="2"
        strokeDasharray="5 4"
      />

      {lays.map((lay) => {
        const { sec, pal, pct, done, secX, secY, tops, col0X, col1X } = lay;
        const branchY = secY + SEC_H / 2;
        const rows = Math.ceil(tops.length / 2);

        return (
          <g key={sec.id}>
            {/* Spine dot */}
            <circle
              cx={spineX}
              cy={branchY}
              r="4.5"
              fill={pal.stroke}
              opacity="0.75"
            />

            {/* Organic curve branch to topics */}
            {tops.length > 0 && (
              <path
                d={`M ${secX + SEC_W} ${branchY} C ${secX + SEC_W + CURVE_STRENGTH} ${branchY}, ${col0X - CURVE_STRENGTH} ${branchY}, ${col0X - 2} ${branchY}`}
                fill="none"
                stroke="#2a2a48"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            )}

            {/* Vertical spine connecting topic rows (col0) with smooth ends */}
            {rows > 1 && (
              <path
                d={`M ${col0X - 8} ${tops[0].ty + TOP_H / 2} L ${col0X - 8} ${tops[Math.min((rows - 1) * 2, tops.length - 1)].ty + TOP_H / 2}`}
                fill="none"
                stroke="#1e1e32"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
            )}

            {/* Section box */}
            <g style={{ cursor: "default" }}>
              {/* Outer glow */}
              <rect
                x={secX - 2}
                y={secY - 2}
                width={SEC_W + 4}
                height={SEC_H + 4}
                rx="10"
                fill="none"
                stroke={pal.stroke}
                strokeWidth="0.8"
                opacity="0.2"
              />
              {/* Box */}
              <rect
                x={secX}
                y={secY}
                width={SEC_W}
                height={SEC_H}
                rx="8"
                fill={pal.fill}
                stroke={pal.stroke}
                strokeWidth="1.5"
              />
              {/* Progress underline */}
              {pct > 0 && (
                <rect
                  x={secX + 4}
                  y={secY + SEC_H - 3}
                  width={Math.max(0, ((SEC_W - 8) * pct) / 100)}
                  height="2"
                  rx="1"
                  fill={pal.stroke}
                  opacity="0.6"
                />
              )}
              {/* Order badge */}
              {sec.order && (
                <g>
                  <circle
                    cx={secX + 10}
                    cy={secY + 8}
                    r="5"
                    fill={pal.stroke}
                    opacity="0.8"
                  />
                  <text
                    x={secX + 10}
                    y={secY + 10}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={pal.fill}
                    fontSize="7"
                    fontWeight="bold"
                    fontFamily="inherit"
                  >
                    {sec.order}
                  </text>
                </g>
              )}
              {/* Title */}
              <text
                x={secX + SEC_W / 2}
                y={secY + 14}
                textAnchor="middle"
                dominantBaseline="central"
                fill={pal.text}
                fontSize="11"
                fontWeight="600"
                fontFamily="inherit"
              >
                {sec.title.length > 21
                  ? sec.title.slice(0, 20) + "…"
                  : sec.title}
              </text>
              {/* Sub info */}
              <text
                x={secX + SEC_W / 2}
                y={secY + 28}
                textAnchor="middle"
                dominantBaseline="central"
                fill={pal.stroke}
                fontSize="8.5"
                fontFamily="inherit"
                opacity="0.75"
              >
                {done}/{(sec.topics || []).length} topics · {pct}%
              </text>
            </g>

            {/* Topics */}
            {tops.map(({ t, tx, ty, col, row, isDone, color }) => {
              const connY = ty + TOP_H / 2;
              return (
                <g
                  key={t.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActiveTopic(t)}
                >
                  {/* Connector line with bezier curve if in col 1 */}
                  {col === 0 ? (
                    <path
                      d={`M ${col0X - 8} ${connY} L ${tx} ${connY}`}
                      fill="none"
                      stroke="#1e1e32"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                  ) : (
                    <path
                      d={`M ${col1X - H_GAP} ${connY} C ${col1X - H_GAP + CURVE_STRENGTH} ${connY}, ${tx - CURVE_STRENGTH} ${connY}, ${tx} ${connY}`}
                      fill="none"
                      stroke="#1e1e32"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                  )}

                  {/* Topic box */}
                  <rect
                    x={tx}
                    y={ty}
                    width={TOP_W}
                    height={TOP_H}
                    rx="6"
                    fill={color.fill}
                    stroke={color.stroke}
                    strokeWidth="1"
                  />

                  {/* Order badge for topic */}
                  {t.order && (
                    <g>
                      <circle
                        cx={tx + TOP_W - 8}
                        cy={ty + 6}
                        r="3.5"
                        fill={color.stroke}
                        opacity="0.7"
                      />
                      <text
                        x={tx + TOP_W - 8}
                        y={ty + 7}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={color.fill}
                        fontSize="6"
                        fontWeight="bold"
                        fontFamily="inherit"
                      >
                        {t.order}
                      </text>
                    </g>
                  )}

                  {/* Checkbox */}
                  <g 
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggle(sec.id, t.id);
                    }}
                  >
                    {isDone ? (
                      <g>
                        <circle
                          cx={tx + 12}
                          cy={ty + TOP_H / 2}
                          r="5.5"
                          fill="#16a34a"
                        />
                        <path
                          d={`M${tx + 9.5} ${ty + TOP_H / 2 + 0.5}l2.5 2.5 4-4`}
                          fill="none"
                          stroke="#fff"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    ) : (
                      <circle
                        cx={tx + 12}
                        cy={ty + TOP_H / 2}
                        r="4"
                        fill="none"
                        stroke={color.stroke}
                        strokeWidth="1"
                        opacity="0.5"
                      />
                    )}
                  </g>

                  {/* SUBTOPIC NODES (The "Graph" part) */}
                  {t.subtopics?.length > 0 && (
                    <g opacity="0.4">
                      {t.subtopics.slice(0, 4).map((sub, si) => {
                        const subX = tx + 30 + (si * (TOP_W - 40) / Math.max(1, t.subtopics.length - 1));
                        const subY = ty + TOP_H + SUB_Y_OFF;
                        return (
                          <g key={si}>
                            <line 
                              x1={tx + TOP_W/2} 
                              y1={ty + TOP_H} 
                              x2={subX} 
                              y2={subY} 
                              stroke={color.stroke} 
                              strokeWidth="0.8" 
                              strokeDasharray="2 2" 
                            />
                            <circle 
                              cx={subX} 
                              cy={subY} 
                              r={SUB_R} 
                              fill={color.fill} 
                              stroke={color.stroke} 
                              strokeWidth="1" 
                            />
                          </g>
                        );
                      })}
                    </g>
                  )}

                  {/* Label */}
                  <text
                    x={tx + 24}
                    y={ty + TOP_H / 2}
                    textAnchor="start"
                    dominantBaseline="central"
                    fill={color.text}
                    fontSize="10.5"
                    fontWeight={isDone ? "500" : "400"}
                    fontFamily="inherit"
                    opacity={isDone ? 0.65 : 1}
                  >
                    {t.title.length > 15 ? t.title.slice(0, 14) + "…" : t.title}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Terminal node */}
      <circle
        cx={spineX}
        cy={totalH - 16}
        r="6"
        fill="#0c0c18"
        stroke="#2a2a48"
        strokeWidth="1.5"
      />
      <circle cx={spineX} cy={totalH - 16} r="2.5" fill="#3a3a60" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN EXPORT
   ───────────────────────────────────────────────────────────────────────── */
const RoadmapVisual = ({ roadmap: propRoadmap, roadmapData, roadmapId, isInternal = false, progress: externalProgress, onToggle: externalOnToggle }) => {
  const initialRoadmap = propRoadmap || roadmapData;
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [progress, setProgress] = useState({});
  const [downloading, setDownloading] = useState(false);
  const [activeTopic, setActiveTopic] = useState(null);

  useEffect(() => {
    const activeRoadmap = propRoadmap || roadmapData;
    if (activeRoadmap) {
      setRoadmap(activeRoadmap);
    }
  }, [propRoadmap, roadmapData]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!roadmapId) return;
      try {
        const res = await api.get(`/roadmap/user/${roadmapId}`);
        if (res.data?.metadata?.progress) {
          setProgress(res.data.metadata.progress);
        }
        if (res.data) {
          setRoadmap(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch roadmap progress:", err);
        // Fallback to localStorage if API fails
        const saved = localStorage.getItem(`roadmap-progress-${roadmapId}`);
        if (saved) setProgress(JSON.parse(saved));
      }
    };
    fetchProgress();
  }, [roadmapId]);

  const toggleTopic = useCallback(
    async (sectionId, topicId) => {
      const key = `${sectionId}-${topicId}`;
      const newStatus = !progress[key];
      
      // Optimistic update
      setProgress((prev) => ({ ...prev, [key]: newStatus }));
      
      try {
        await api.post("/roadmap/topic-progress", {
          roadmapId,
          sectionId,
          topicId,
          isCompleted: newStatus
        });
        toast.success(newStatus ? "Topic completed!" : "Topic uncompleted", {
          icon: newStatus ? "✅" : "⭕"
        });
      } catch (err) {
        console.error("Failed to update status on server:", err);
        toast.error("Cloud sync failed. Status saved locally.");
        // Revert on failure? For now, we keep the local state and sync later or just let it be
        localStorage.setItem(
          `roadmap-progress-${roadmapId}`,
          JSON.stringify({ ...progress, [key]: newStatus }),
        );
      }
    },
    [roadmapId, progress],
  );

  const totalTopics =
    roadmap?.sections?.reduce((s, sec) => s + (sec.topics?.length || 0), 0) ||
    0;
  const doneCt = Object.values(progress).filter(Boolean).length;
  const pct = totalTopics ? Math.round((doneCt / totalTopics) * 100) : 0;

  const downloadRoadmap = async () => {
    if (!roadmapId) return toast.error("No roadmap ID");
    setDownloading(true);
    try {
      const res = await api.get(`/roadmap/download/${roadmapId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", `${roadmap?.title || "roadmap"}.pdf`);
      document.body.appendChild(a);
      a.click();
      a.parentNode.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Downloaded!");
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloading(false);
    }
  };

  if (isInternal) {
    return (
      <div className="w-full">
        <TreeSVG
          roadmap={roadmap}
          progress={externalProgress || progress}
          onToggle={externalOnToggle || toggleTopic}
        />
      </div>
    );
  }

  return (
    <div
      style={{ background: "#09090f", minHeight: "100vh" }}
      className="py-8 px-4 sm:px-6"
    >
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => (window.location.href = "/learn")}
          className="flex items-center gap-2 mb-8 text-xs font-semibold transition-colors group"
          style={{ color: "#4a4a6a" }}
        >
          <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span className="hover:text-slate-400 transition-colors">
            Back to learning
          </span>
        </motion.button>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p
            style={{ color: "#3b5090", fontSize: 10 }}
            className="font-bold uppercase tracking-widest mb-2"
          >
            AI Roadmap · Gemini
          </p>
          <h1
            style={{ color: "#d8d8f0" }}
            className="text-3xl font-black mb-1.5 leading-tight"
          >
            {roadmap?.title || "Learning Roadmap"}
          </h1>
          <p
            style={{ color: "#4a4a6a" }}
            className="text-sm leading-relaxed mb-6"
          >
            {roadmap?.description}
          </p>

          {/* Stats + download */}
          <div className="flex items-center gap-6 mb-5">
            {[
              { v: `${pct}%`, l: "Progress", c: "#7ba4ff" },
              {
                v: roadmap?.sections?.length || 0,
                l: "Sections",
                c: "#6ee7a0",
              },
              { v: totalTopics, l: "Topics", c: "#d4aaff" },
              { v: doneCt, l: "Done", c: "#6ee7a0" },
            ].map(({ v, l, c }) => (
              <div key={l}>
                <div
                  style={{
                    color: c,
                    fontSize: 18,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  {v}
                </div>
                <div style={{ color: "#4a4a6a", fontSize: 10, marginTop: 2 }}>
                  {l}
                </div>
              </div>
            ))}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={downloadRoadmap}
              disabled={downloading}
              style={{
                background: "#12121e",
                border: "1px solid #2a2a3e",
                color: "#7070a0",
                marginLeft: "auto",
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
            >
              <FiDownload className="w-3 h-3" />
              {downloading ? "…" : "PDF"}
            </motion.button>
          </div>

          {/* Progress bar */}
          <div
            style={{
              background: "#0f0f1e",
              border: "1px solid #1a1a2e",
              borderRadius: 8,
              padding: "10px 14px",
            }}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span
                style={{ color: "#3a3a5a", fontSize: 10 }}
                className="font-semibold uppercase tracking-wider"
              >
                Overall progress
              </span>
              <span
                style={{ color: "#5a7adf", fontSize: 10 }}
                className="font-bold"
              >
                {doneCt} / {totalTopics}
              </span>
            </div>
            <div
              style={{ background: "#0a0a16", borderRadius: 3, height: 3 }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  height: "100%",
                  borderRadius: 3,
                  background: "linear-gradient(90deg,#3b6bff,#7ba4ff)",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <div
          className="flex flex-wrap items-center gap-4 mb-4"
          style={{ fontSize: 10, color: "#3a3a5a" }}
        >
          <span className="font-bold uppercase tracking-wider">Legend</span>
          {[
            { c: "#3b6bff", l: "Section" },
            { c: "#16a34a", l: "Beginner" },
            { c: "#d97706", l: "Intermediate" },
            { c: "#dc2626", l: "Advanced" },
          ].map(({ c, l }) => (
            <div key={l} className="flex items-center gap-1">
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  border: `1px solid ${c}`,
                  background: c + "22",
                }}
              />
              <span>{l}</span>
            </div>
          ))}
          <span style={{ color: "#2a2a42" }}>· · ·</span>
          <span>Click a topic to mark done</span>
        </div>

        {/* ── THE TREE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          style={{
            background: "#0c0c16",
            border: "1px solid #181828",
            borderRadius: 14,
            padding: "20px 12px 20px 12px",
            overflowX: "auto",
          }}
        >
          {/* Title node */}
          <div className="flex justify-center mb-0">
            <div
              style={{
                background: "#12122a",
                border: "1.5px solid #2a2a50",
                borderRadius: 9,
                padding: "6px 20px",
                color: "#5050a0",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {roadmap?.title || "Roadmap"}
            </div>
          </div>

          <TreeSVG
            roadmap={roadmap}
            progress={progress}
            onToggle={toggleTopic}
          />
        </motion.div>

        {/* ── TOPIC DETAIL DRAWER ── */}
        <AnimatePresence>
          {activeTopic && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-slate-900/95 backdrop-blur-xl border-l border-white/10 z-[100] p-6 overflow-y-auto"
            >
              <button
                onClick={() => setActiveTopic(null)}
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white mb-6"
              >
                <FiDownload style={{ transform: "rotate(90deg)" }} className="w-4 h-4" />
              </button>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-white">{activeTopic.title}</h3>
                  <p className="text-slate-400 text-sm mt-2">{activeTopic.description}</p>
                </div>

                {activeTopic.importantQuestions?.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                       Important Questions
                    </h4>
                    <div className="space-y-2">
                      {activeTopic.importantQuestions.map((q, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-slate-200 text-xs leading-relaxed">
                          {q}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTopic.interviewTips?.length > 0 && (
                  <div className="space-y-4">
                     <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                       Interview Tips
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {activeTopic.interviewTips.map((tip, i) => (
                        <div key={i} className="p-3 rounded-xl bg-blue-400/5 border border-blue-400/10 text-blue-300 text-xs">
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Overlay when drawer is open */}
        {activeTopic && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            onClick={() => setActiveTopic(null)}
          />
        )}

        {/* Completion banner */}
        <AnimatePresence>
          {pct === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: "#071207",
                border: "1px solid #16a34a33",
                borderRadius: 14,
              }}
              className="mt-8 p-8 text-center"
            >
              <FiAward className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <h3
                style={{ color: "#6ee7a0" }}
                className="text-lg font-black mb-1.5"
              >
                Roadmap complete 🎉
              </h3>
              <p style={{ color: "#3a5a3a" }} className="text-sm">
                You've mastered every topic. Keep building!
              </p>
              <motion.a
                href="/tests"
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-xl text-sm font-bold transition-colors"
                style={{ background: "#16a34a", color: "#fff" }}
              >
                Practice Tests <FiChevronRight className="w-4 h-4" />
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoadmapVisual;
