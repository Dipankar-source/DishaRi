import React, { useState, useEffect, useRef } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler,
} from "chart.js";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  FiBarChart2,
  FiBookOpen,
  FiCheckCircle,
  FiTarget,
  FiAward,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiZap,
  FiArrowRight,
  FiCalendar,
  FiStar,
  FiClipboard,
  FiRefreshCw,
  FiMap,
} from "react-icons/fi";
import api from "../../utils/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  Filler,
);

/* ─── Demo Data Generator ──────────────────────────────────────────────────── */
// Demo data generators for fallback when API data is not available
const generateDemoStats = () => ({
  totalPracticeTests: 24,
  totalGrandTests: 8,
  averageAccuracy: 72.5,
  complexityStats: {
    easy: 45,
    moderate: 65,
    hard: 38,
    extreme: 12,
  },
  totalQuestions: 1250,
  averageTimePerQuestion: 48,
  strongSubjects: ["Mathematics", "Physics"],
  weakSubjects: ["Chemistry"],
});

const generateDemoTests = () => {
  const tests = [];
  const types = ["Practice Test", "Grand Test", "Practice Test", "Grand Test"];
  const names = [
    "Algebra Fundamentals",
    "Full Mock Exam",
    "Trigonometry Basics",
    "Physics Mechanics",
    "Chemistry Concepts",
    "Calculus I",
    "Grand Mock #3",
    "Organic Chemistry",
  ];

  for (let i = 0; i < 8; i++) {
    const accuracy = 55 + Math.random() * 40;
    const date = new Date();
    date.setDate(date.getDate() - (7 - i));
    tests.push({
      _id: `demo-${i}`,
      testName: names[i % names.length],
      type: types[i % types.length],
      accuracy: accuracy,
      completedAt: date.toISOString(),
      score: Math.floor(accuracy * 0.8),
      totalMarks: 100,
    });
  }
  return tests;
};

const generateDemoProgress = () => {
  const subjects = [
    { name: "Mathematics", totalTopics: 24, color: "#34d399" },
    { name: "Physics", totalTopics: 18, color: "#60a5fa" },
    { name: "Chemistry", totalTopics: 20, color: "#fbbf24" },
    { name: "Biology", totalTopics: 22, color: "#f87171" },
    { name: "English", totalTopics: 15, color: "#a78bfa" },
  ];

  return subjects.map((subject) => ({
    subject: {
      _id: subject.name.toLowerCase(),
      name: subject.name,
      totalTopics: subject.totalTopics,
    },
    completedTopics: Math.floor(Math.random() * subject.totalTopics),
    isCompleted: Math.random() > 0.8,
  }));
};

/* ─── Animated counter ──────────────────────────────────────────────────── */
const AnimatedNumber = ({ value, suffix = "", duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const end = parseFloat(value) || 0;
    const startTime = performance.now();
    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(parseFloat((eased * end).toFixed(1)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
};

/* ─── Stat Card ─────────────────────────────────────────────────────────── */
const StatCard = ({
  title,
  value,
  suffix,
  icon: Icon,
  trend,
  trendLabel,
  accent,
  delay = 0,
}) => {
  const accentMap = {
    amber:
      "from-amber-400/20 to-amber-500/5 border-amber-400/20 text-amber-400",
    blue: "from-blue-400/20 to-blue-500/5 border-blue-400/20 text-blue-400",
    emerald:
      "from-emerald-400/20 to-emerald-500/5 border-emerald-400/20 text-emerald-400",
    rose: "from-rose-400/20 to-rose-500/5 border-rose-400/20 text-rose-400",
  };
  const iconBg = {
    amber: "bg-amber-400/10 text-amber-400",
    blue: "bg-blue-400/10 text-blue-400",
    emerald: "bg-emerald-400/10 text-emerald-400",
    rose: "bg-rose-400/10 text-rose-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={`relative rounded-2xl border bg-gradient-to-br p-5 overflow-hidden group cursor-default ${accentMap[accent]}`}
    >
      {/* Decorative circle */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-current opacity-5 group-hover:opacity-10 transition-opacity duration-300" />

      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg[accent]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {trend !== undefined && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"}`}
          >
          </div>
        )}
      </div>

      <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">
        {title}
      </p>
      <p className="text-white text-3xl font-bold tracking-tight">
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
      {trendLabel && (
        <p className="text-slate-500 text-xs mt-1">{trendLabel}</p>
      )}
    </motion.div>
  );
};

/* ─── Section heading ───────────────────────────────────────────────────── */
const SectionLabel = ({ label }) => (
  <div className="flex items-center gap-3 mb-0">
    <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
      {label}
    </span>
    <div className="flex-1 h-px bg-slate-800" />
  </div>
);

/* ─── Card wrapper ──────────────────────────────────────────────────────── */
const Card = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    className={`bg-slate-900 border border-slate-800/70 rounded-2xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

/* ─── Empty state ───────────────────────────────────────────────────────── */
const EmptyState = ({ message, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
      <Icon className="w-5 h-5 text-slate-600" />
    </div>
    <p className="text-slate-500 text-sm max-w-xs">{message}</p>
  </div>
);

/* ─── Skeleton loader ───────────────────────────────────────────────────── */
const Skeleton = ({ className = "" }) => (
  <div className={`bg-slate-800 rounded-xl animate-pulse ${className}`} />
);

const ChartSkeleton = ({ className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="w-full h-full bg-slate-800/50 rounded-xl animate-pulse flex items-center justify-center">
      <FiRefreshCw className="w-6 h-6 text-slate-600 animate-spin" />
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-32" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Skeleton className="lg:col-span-2 h-64" />
      <Skeleton className="h-64" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Skeleton className="h-56" />
      <Skeleton className="h-56" />
    </div>
  </div>
);

/* ─── Enhanced Graph Components with Loading States ────────────────────── */

// Line Chart Component with Skeleton
const EnhancedLineChart = ({ data, options, isLoading, isEmpty }) => {
  if (isLoading) {
    return <ChartSkeleton className="h-52" />;
  }

  if (isEmpty) {
    return (
      <EmptyState
        icon={FiBarChart2}
        message="Take some tests to see your accuracy trend here."
      />
    );
  }

  return (
    <div className="h-52">
      <Line data={data} options={options} />
    </div>
  );
};

// Doughnut Chart Component with Skeleton
const EnhancedDoughnutChart = ({ data, options, isLoading, isEmpty }) => {
  if (isLoading) {
    return <ChartSkeleton className="h-52" />;
  }

  if (isEmpty) {
    return (
      <EmptyState
        icon={FiTarget}
        message="No test data yet. Complete some tests to see the breakdown."
      />
    );
  }

  return (
    <div className="h-52 flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};

// Bar Chart Component with Skeleton
const EnhancedBarChart = ({ data, options, isLoading, isEmpty }) => {
  if (isLoading) {
    return <ChartSkeleton className="h-52" />;
  }

  if (isEmpty) {
    return (
      <EmptyState
        icon={FiBookOpen}
        message="Start learning a subject to see progress here."
      />
    );
  }

  return (
    <div className="h-52">
      <Bar data={data} options={options} />
    </div>
  );
};

// Recent Tests List Component with Skeleton
const RecentTestsList = ({ tests, isLoading }) => {
  if (isLoading) {
    return (
      <div className="divide-y divide-slate-800/60">
        {[1, 2, 3, 4, 5].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-3.5">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-12 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          icon={FiClipboard}
          message="No tests taken yet. Start your first practice test!"
        />
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-800/60">
      {tests.slice(0, 5).map((test, i) => {
        const accuracy = typeof test.accuracy === "number" ? test.accuracy : 0;
        const color =
          accuracy >= 80
            ? "text-emerald-400 bg-emerald-400/10"
            : accuracy >= 60
              ? "text-amber-400 bg-amber-400/10"
              : "text-rose-400 bg-rose-400/10";
        return (
          <motion.div
            key={test._id || i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            whileHover={{ backgroundColor: "rgba(30,41,59,0.6)" }}
            className="flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
              <FiClipboard className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-sm font-medium truncate">
                {test.testName || test.type || "Practice Test"}
              </p>
              <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                <FiClock className="w-3 h-3" />
                {new Date(test.completedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg ${color}`}
            >
              {accuracy.toFixed(1)}%
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

// Subject Progress List Component with Skeleton
const SubjectProgressList = ({ progress, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (progress.length === 0) {
    return (
      <div className="p-5">
        <EmptyState
          icon={FiBookOpen}
          message="No learning progress yet. Start with your first subject!"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
      {progress.map((subject, i) => {
        const pct = Math.round(
          (subject.completedTopics / subject.subject.totalTopics) * 100,
        );
        const barColor =
          pct >= 80
            ? "bg-emerald-400"
            : pct >= 50
              ? "bg-amber-400"
              : "bg-blue-400";

        return (
          <motion.div
            key={subject.subject._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.05 }}
            whileHover={{ backgroundColor: "rgba(30,41,59,0.5)" }}
            className={`p-5 transition-colors ${
              i % 2 === 0 &&
              i === progress.length - 1 &&
              progress.length % 2 !== 0
                ? "md:col-span-2"
                : ""
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-slate-200 text-sm font-semibold truncate">
                  {subject.subject.name}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {subject.completedTopics} of {subject.subject.totalTopics}{" "}
                  topics
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {subject.isCompleted && (
                  <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                )}
                <span
                  className={`text-sm font-bold ${
                    pct >= 80
                      ? "text-emerald-400"
                      : pct >= 50
                        ? "text-amber-400"
                        : "text-blue-400"
                  }`}
                >
                  {pct}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{
                  duration: 0.8,
                  delay: 0.6 + i * 0.05,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className={`h-full rounded-full ${barColor}`}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

/* ─── Chart defaults ────────────────────────────────────────────────────── */
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#1e293b",
      borderColor: "#334155",
      borderWidth: 1,
      titleColor: "#f8fafc",
      bodyColor: "#94a3b8",
      padding: 12,
      cornerRadius: 10,
      displayColors: true,
      boxPadding: 8,
      usePointStyle: true,
    },
  },
};

/* ─── Main Dashboard ────────────────────────────────────────────────────── */
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [tests, setTests] = useState([]);
  const [progress, setProgress] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useDemoData, setUseDemoData] = useState(false);
  const [chartLoading, setChartLoading] = useState({
    line: true,
    doughnut: true,
    bar: true,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setChartLoading({
      line: true,
      doughnut: true,
      bar: true,
    });

    try {
      // Fetch roadmaps first
      try {
        const rmRes = await api.get("/roadmap/user/roadmaps");
        if (rmRes.data) setRoadmaps(rmRes.data);
      } catch (e) {
        console.error("Error fetching roadmaps:", e);
      }
      const response = await api.get("/dashboard/stats");
      if (response?.data) {
        const { stats: dbStats, userDashboard, user: userData } = response.data;
        
        setStats({
          totalTests: dbStats.testStats?.totalTests || 0,
          practiceTests: dbStats.testStats?.practiceTests || 0,
          grandTests: dbStats.testStats?.grandTests || 0,
          averageAccuracy: dbStats.testStats?.accuracyRate || 0,
          complexityStats: dbStats.testStats?.complexityStats || {
            easy: 0, moderate: 0, hard: 0, extreme: 0
          },
          // New metrics
          xp: userData?.xp || 0,
          currentStreak: dbStats.learningStats?.currentStreak || 0,
          totalSessions: dbStats.learningStats?.totalSessions || 0,
          totalHours: dbStats.learningStats?.totalHoursSpent || 0,
          totalRoadmaps: dbStats.totalRoadmaps || 0,
          totalDocuments: dbStats.totalDocuments || 0,
          performanceTrend: dbStats.performanceTrend || []
        });

        // Use subject stats from DashboardStats if present, else fallback
        if (dbStats.subjectStats && dbStats.subjectStats.length > 0) {
          const normalizedProgress = dbStats.subjectStats.map(s => ({
            subject: {
              ...s.subject,
              totalTopics: s.totalTopics || 1
            },
            completedTopics: s.topicsCompleted || 0,
            isCompleted: (s.completionPercentage || 0) >= 100,
            completionPercentage: s.completionPercentage || 0
          }));
          setProgress(normalizedProgress);
        } else {
          // Fallback to individual subjects if needed
          try {
            const progressResponse = await api.get("/subjects/progress/me");
            if (progressResponse?.data) setProgress(progressResponse.data);
          } catch (e) {
            console.error("Error fetching subject progress fallback:", e);
          }
        }

        // Fetch recent tests
        try {
          const testsResponse = await api.get("/tests/history?limit=7");
          if (testsResponse?.data) {
            setTests(Array.isArray(testsResponse.data) ? testsResponse.data : testsResponse.data.tests || []);
          }
        } catch (e) {
          console.error("Error fetching test history:", e);
        }

        setUseDemoData(false);
      }
    } catch (error) {
      console.error("Error fetching comprehensive dashboard stats:", error);
      setUseDemoData(true);
      setStats(generateDemoStats());
      setTests(generateDemoTests());
      setProgress(generateDemoProgress());
    } finally {
      setLoading(false);
      setTimeout(() => {
        setChartLoading({ line: false, doughnut: false, bar: false });
      }, 500);
    }
  };

  if (loading) return <DashboardSkeleton />;

  /* ── Chart data ── */
  const recentTests = tests.slice(-7);

  const lineData = {
    labels: stats?.performanceTrend?.length > 0 
      ? stats.performanceTrend.map((t) =>
          new Date(t.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        )
      : recentTests.map((t) =>
          new Date(t.completedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
    datasets: [
      {
        label: "Accuracy (%)",
        data: stats?.performanceTrend?.length > 0 
          ? stats.performanceTrend.map((t) => t.averageScore)
          : recentTests.map((t) => t.accuracy),
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.12)",
        tension: 0.5,
        fill: true,
        pointBackgroundColor: "#f59e0b",
        pointBorderColor: "#1e293b",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 3,
        pointHoverBorderColor: "#fbbf24",
        pointStyle: 'circle',
        segment: {
          borderColor: (ctx) => {
            const value = ctx.p1.y;
            if (value >= 80) return '#34d399';
            if (value >= 60) return '#f59e0b';
            return '#f87171';
          },
          borderWidth: 2,
        },
      },
    ],
  };

  const lineOptions = {
    ...chartDefaults,
    animation: {
      duration: 800,
      easing: 'easeInOutQuart',
    },
    scales: {
      x: {
        grid: {
          color: "rgba(51,65,85,0.3)",
          drawTicks: false,
          drawBorder: false,
        },
        border: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 11, weight: '500' },
          padding: 8,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: "rgba(51,65,85,0.3)",
          drawTicks: false,
          drawBorder: false,
        },
        border: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 11, weight: '500' },
          padding: 8,
          callback: (v) => `${v}%`,
        },
      },
    },
    plugins: {
      ...chartDefaults.plugins,
      tooltip: {
        ...chartDefaults.plugins.tooltip,
        callbacks: {
          title: (context) => `${context[0].label}`,
          label: (context) => {
            const value = context.parsed.y;
            let label = `Accuracy: ${value.toFixed(1)}%`;
            if (value >= 80) label += ' 🔥 Excellent';
            else if (value >= 60) label += ' ✓ Good';
            else label += ' ⚠ Needs Improvement';
            return label;
          },
          afterLabel: (context) => {
            const data = context.chart.data.datasets[0].data;
            const currentIndex = context.dataIndex;
            if (currentIndex > 0) {
              const prevValue = data[currentIndex - 1];
              const currentValue = data[currentIndex];
              const diff = currentValue - prevValue;
              return `Trend: ${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
            }
          },
        },
        padding: 16,
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        borderRadius: 12,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      },
    },
  };

  const doughnutData = {
    labels: ["Easy", "Moderate", "Hard", "Extreme"],
    datasets: [
      {
        data: [
          stats?.complexityStats?.easy || 0,
          stats?.complexityStats?.moderate || 0,
          stats?.complexityStats?.hard || 0,
          stats?.complexityStats?.extreme || 0,
        ],
        backgroundColor: [
          "rgba(52, 211, 153, 0.9)",
          "rgba(96, 165, 250, 0.9)",
          "rgba(251, 191, 36, 0.9)",
          "rgba(248, 113, 113, 0.9)",
        ],
        borderColor: "#0f172a",
        borderWidth: 3,
        hoverOffset: 10,
        borderRadius: 4,
      },
    ],
  };

  const doughnutOptions = {
    ...chartDefaults,
    cutout: "72%",
    animation: {
      duration: 800,
      easing: 'easeInOutQuart',
      animateScale: true,
    },
    plugins: {
      ...chartDefaults.plugins,
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#94a3b8",
          font: { size: 11, weight: '500' },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
          generateLabels: (chart) => {
            const data = chart.data;
            return data.labels.map((label, i) => ({
              text: `${label}: ${data.datasets[0].data[i]}`,
              fillStyle: data.datasets[0].backgroundColor[i],
              hidden: false,
              index: i,
            }));
          },
        },
      },
      tooltip: {
        ...chartDefaults.plugins.tooltip,
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((context.parsed * 100) / total).toFixed(1) : 0;
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          },
          afterLabel: (context) => {
            const value = context.parsed;
            if (value > 50) return 'High volume ⚠';
            if (value > 25) return 'Moderate ✓';
            return 'Low volume';
          },
        },
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        borderRadius: 12,
        padding: 14,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      },
    },
  };

  const barData = {
    labels: progress.map((p) => p.subject.name),
    datasets: [
      {
        label: "Progress %",
        data: progress.map((p) =>
          Math.round((p.completedTopics / p.subject.totalTopics) * 100),
        ),
        backgroundColor: progress.map((p) => {
          const pct = (p.completedTopics / p.subject.totalTopics) * 100;
          if (pct >= 80) return "rgba(52, 211, 153, 0.85)";
          if (pct >= 50) return "rgba(245, 158, 11, 0.85)";
          return "rgba(96, 165, 250, 0.85)";
        }),
        borderColor: progress.map((p) => {
          const pct = (p.completedTopics / p.subject.totalTopics) * 100;
          if (pct >= 80) return "rgba(52, 211, 153, 1)";
          if (pct >= 50) return "rgba(245, 158, 11, 1)";
          return "rgba(96, 165, 250, 1)";
        }),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
      },
    ],
  };

  const barOptions = {
    ...chartDefaults,
    animation: {
      duration: 1000,
      easing: 'easeInOutElastic',
      delay: (ctx) => ctx.dataIndex * 50,
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 11, weight: '500' },
          padding: 8,
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: "rgba(51,65,85,0.3)",
          drawTicks: false,
          drawBorder: false,
        },
        border: { display: false },
        ticks: {
          color: "#64748b",
          font: { size: 11, weight: '500' },
          padding: 8,
          callback: (v) => `${v}%`,
        },
      },
    },
    plugins: {
      ...chartDefaults.plugins,
      tooltip: {
        ...chartDefaults.plugins.tooltip,
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            const value = context.parsed.y;
            const dataIndex = context.dataIndex;
            const completed = progress[dataIndex]?.completedTopics || 0;
            const total = progress[dataIndex]?.subject?.totalTopics || 1;
            let status = '';
            if (value >= 80) status = ' ✅ Excellent';
            else if (value >= 50) status = ' 📚 In Progress';
            else status = ' 🚀 Getting Started';
            return `${completed}/${total} topics (${value}%)${status}`;
          },
          afterLabel: (context) => {
            const dataIndex = context.dataIndex;
            const isCompleted = progress[dataIndex]?.isCompleted;
            return isCompleted ? '✨ Subject Completed!' : '';
          },
        },
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        borderRadius: 12,
        padding: 14,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      },
    },
  };

  const totalComplexity =
    (stats?.complexityStats?.easy || 0) +
    (stats?.complexityStats?.moderate || 0) +
    (stats?.complexityStats?.hard || 0) +
    (stats?.complexityStats?.extreme || 0);

  const completedCount = progress.filter((p) => p.isCompleted).length;
  const avgAccuracy = stats?.averageAccuracy?.toFixed(1) || 0;

  /* ── Greeting ── */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 pb-6">
      {/* ── Demo Data Indicator ── */}
      {useDemoData && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3 text-center"
        >
          <p className="text-amber-400 text-sm flex items-center justify-center gap-2">
            <FiRefreshCw className="w-4 h-4 animate-spin" />
            Showing demo data. Connect to API for live insights.
          </p>
        </motion.div>
      )}

      {/* ── Hero greeting ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
            <FiCalendar className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h2 className="text-white text-2xl font-bold tracking-tight mt-0.5">
            {greeting} 👋
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Here's your preparation overview for today.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={fetchDashboardData}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-amber-400 text-slate-900 rounded-xl font-semibold text-sm shadow-lg shadow-amber-400/20 hover:bg-amber-300 transition-colors flex-shrink-0"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh Data
        </motion.button>
      </motion.div>

      {/* ── Stat cards ── */}
      <SectionLabel label="Overview" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-2">
        <StatCard
          title="Avg Accuracy"
          value={avgAccuracy}
          suffix="%"
          icon={FiTarget}
          accent="emerald"
          trend={avgAccuracy >= 70 ? 5 : -2}
          trendLabel="Performance level"
          delay={0.05}
        />
        <StatCard
          title="Current Streak"
          value={stats?.currentStreak || 0}
          suffix=" Days"
          icon={FiZap}
          accent="amber"
          trend={stats?.currentStreak > 0 ? 1 : 0}
          trendLabel="Keep it up!"
          delay={0.1}
        />
        <StatCard
          title="Experience XP"
          value={stats?.xp || 0}
          icon={FiAward}
          accent="amber"
          trendLabel="Current preparation rank"
          delay={0.15}
        />
        <StatCard
          title="Study Sessions"
          value={stats?.totalSessions || 0}
          icon={FiClock}
          accent="rose"
          trendLabel="Total focus time"
          delay={0.2}
        />
      </div>

      {/* ── Secondary Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Practice Tests", value: stats?.practiceTests || 0, icon: FiBarChart2, color: "text-blue-400" },
          { label: "Grand Tests", value: stats?.grandTests || 0, icon: FiAward, color: "text-amber-400" },
          { label: "Completed Subjects", value: completedCount, icon: FiCheckCircle, color: "text-emerald-400" },
          { label: "Resources", value: stats?.totalDocuments || 0, icon: FiClipboard, color: "text-rose-400" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            className="bg-slate-900/50 border border-slate-800/40 rounded-xl p-3 flex items-center gap-3"
          >
            <div className={`w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">{item.label}</p>
              <p className="text-white text-sm font-bold leading-none">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Bento row 1: Line chart (2/3) + Doughnut (1/3) ── */}
      <SectionLabel label="Performance" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-2">
        {/* Line chart */}
        <Card className="lg:col-span-2" delay={0.25}>
          <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">Accuracy Trend</p>
              <p className="text-slate-500 text-xs mt-0.5">Last 7 tests</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full font-medium">
              <FiTrendingUp className="w-3 h-3" />
              Active streak
            </div>
          </div>
          <div className="p-5">
            <EnhancedLineChart
              data={lineData}
              options={lineOptions}
              isLoading={chartLoading.line}
              isEmpty={recentTests.length === 0}
            />
          </div>
        </Card>

        {/* Doughnut */}
        <Card delay={0.3}>
          <div className="p-5 border-b border-slate-800/60">
            <p className="text-white font-semibold text-sm">Difficulty Mix</p>
            <p className="text-slate-500 text-xs mt-0.5">Tests by complexity</p>
          </div>
          <div className="p-5">
            <EnhancedDoughnutChart
              data={doughnutData}
              options={doughnutOptions}
              isLoading={chartLoading.doughnut}
              isEmpty={totalComplexity === 0}
            />
          </div>
        </Card>
      </div>

      {/* ── Bento row 2: Bar chart (1/2) + Recent Tests (1/2) ── */}
      <SectionLabel label="Learning" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        {/* Subject progress bar chart */}
        <Card delay={0.35}>
          <div className="p-5 border-b border-slate-800/60">
            <p className="text-white font-semibold text-sm">Subject Progress</p>
            <p className="text-slate-500 text-xs mt-0.5">
              Completion per subject
            </p>
          </div>
          <div className="p-5">
            <EnhancedBarChart
              data={barData}
              options={barOptions}
              isLoading={chartLoading.bar}
              isEmpty={progress.length === 0}
            />
          </div>
        </Card>

        {/* Recent tests list */}
        <Card delay={0.4}>
          <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold text-sm">Recent Tests</p>
              <p className="text-slate-500 text-xs mt-0.5">
                Your latest activity
              </p>
            </div>
            <motion.button
              whileHover={{ x: 2 }}
              className="text-amber-400 text-xs font-medium flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              View all <FiArrowRight className="w-3 h-3" />
            </motion.button>
          </div>
          <RecentTestsList tests={tests} isLoading={chartLoading.line} />
        </Card>
      </div>

      {/* ── Subject progress details bento ── */}
      <SectionLabel label="Subjects" />
      <Card delay={0.5} className="mt-2">
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold text-sm">
              Learning Progress Details
            </p>
            <p className="text-slate-500 text-xs mt-0.5">
              Topic completion per subject
            </p>
          </div>
          <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">
            {completedCount} / {progress.length} done
          </span>
        </div>
        <SubjectProgressList progress={progress} isLoading={chartLoading.bar} />
      </Card>

      {/* ── Active Roadmaps Section ── */}
      {roadmaps.length > 0 && (
        <>
          <SectionLabel label="Active Learning Paths" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {roadmaps.slice(0, 2).map((rm, i) => {
              const totalTopics = rm.sections?.reduce((a, s) => a + (s.topics?.length || 0), 0) || 0;
              const progressMap = rm.metadata?.progress || {};
              const doneTopics = Object.values(progressMap).filter(Boolean).length;
              const pct = totalTopics ? Math.round((doneTopics / totalTopics) * 100) : 0;
              
              return (
                <Card key={rm._id} delay={0.45 + i * 0.05} className="group cursor-pointer" onClick={() => (window.location.href = "/roadmap")}>
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <FiMap className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white font-bold text-sm truncate">{rm.title}</p>
                        <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded uppercase tracking-wider">{rm.level}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            className="h-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-400">{pct}%</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {/* ── Quick actions bento strip ── */}
      <SectionLabel label="Quick Actions" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        {[
          {
            icon: FiZap,
            title: "Start Practice Test",
            desc: "Pick a subject and test your knowledge",
            accent: "amber",
            to: "/tests",
          },
          {
            icon: FiBookOpen,
            title: "Continue Learning",
            desc: "Resume where you left off",
            accent: "blue",
            to: "/learn",
          },
          {
            icon: FiStar,
            title: "Take Grand Test",
            desc: "Full-length mock exam",
            accent: "emerald",
            to: "/tests?type=grand",
          },
        ].map((action, i) => {
          const accentStyles = {
            amber:
              "border-amber-400/20 hover:border-amber-400/40 hover:bg-amber-400/5",
            blue: "border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-400/5",
            emerald:
              "border-emerald-400/20 hover:border-emerald-400/40 hover:bg-emerald-400/5",
          };
          const iconStyles = {
            amber: "bg-amber-400/10 text-amber-400",
            blue: "bg-blue-400/10 text-blue-400",
            emerald: "bg-emerald-400/10 text-emerald-400",
          };
          return (
            <motion.a
              key={action.title}
              href={action.to}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07, duration: 0.4 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className={`group flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border transition-all duration-200 cursor-pointer ${accentStyles[action.accent]}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyles[action.accent]}`}
              >
                <action.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-200 text-sm font-semibold">
                  {action.title}
                </p>
                <p className="text-slate-500 text-xs mt-0.5 truncate">
                  {action.desc}
                </p>
              </div>
              <FiArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;

// import React, { useState, useEffect, useRef } from "react";
// import { Line, Doughnut, Bar } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   BarElement,
//   Filler,
// } from "chart.js";
// import { motion, AnimatePresence, useInView } from "motion/react";
// import {
//   FiBarChart2,
//   FiBookOpen,
//   FiCheckCircle,
//   FiTarget,
//   FiAward,
//   FiTrendingUp,
//   FiTrendingDown,
//   FiClock,
//   FiZap,
//   FiArrowRight,
//   FiCalendar,
//   FiStar,
//   FiClipboard,
//   FiRefreshCw,
// } from "react-icons/fi";
// import api from "../../utils/api";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   BarElement,
//   Filler,
// );

// /* ─── Demo Data Generator ──────────────────────────────────────────────────── */
// // Demo data generators for fallback when API data is not available
// const generateDemoStats = () => ({
//   totalPracticeTests: 24,
//   totalGrandTests: 8,
//   averageAccuracy: 72.5,
//   complexityStats: {
//     easy: 45,
//     moderate: 65,
//     hard: 38,
//     extreme: 12,
//   },
//   totalQuestions: 1250,
//   averageTimePerQuestion: 48,
//   strongSubjects: ["Mathematics", "Physics"],
//   weakSubjects: ["Chemistry"],
// });

// const generateDemoTests = () => {
//   const tests = [];
//   const types = ["Practice Test", "Grand Test", "Practice Test", "Grand Test"];
//   const names = [
//     "Algebra Fundamentals",
//     "Full Mock Exam",
//     "Trigonometry Basics",
//     "Physics Mechanics",
//     "Chemistry Concepts",
//     "Calculus I",
//     "Grand Mock #3",
//     "Organic Chemistry",
//   ];

//   for (let i = 0; i < 8; i++) {
//     const accuracy = 55 + Math.random() * 40;
//     const date = new Date();
//     date.setDate(date.getDate() - (7 - i));
//     tests.push({
//       _id: `demo-${i}`,
//       testName: names[i % names.length],
//       type: types[i % types.length],
//       accuracy: accuracy,
//       completedAt: date.toISOString(),
//       score: Math.floor(accuracy * 0.8),
//       totalMarks: 100,
//     });
//   }
//   return tests;
// };

// const generateDemoProgress = () => {
//   const subjects = [
//     { name: "Mathematics", totalTopics: 24, color: "#34d399" },
//     { name: "Physics", totalTopics: 18, color: "#60a5fa" },
//     { name: "Chemistry", totalTopics: 20, color: "#fbbf24" },
//     { name: "Biology", totalTopics: 22, color: "#f87171" },
//     { name: "English", totalTopics: 15, color: "#a78bfa" },
//   ];

//   return subjects.map((subject) => ({
//     subject: {
//       _id: subject.name.toLowerCase(),
//       name: subject.name,
//       totalTopics: subject.totalTopics,
//     },
//     completedTopics: Math.floor(Math.random() * subject.totalTopics),
//     isCompleted: Math.random() > 0.8,
//   }));
// };

// /* ─── Animated counter ──────────────────────────────────────────────────── */
// const AnimatedNumber = ({ value, suffix = "", duration = 1200 }) => {
//   const [display, setDisplay] = useState(0);
//   const ref = useRef(null);
//   const inView = useInView(ref, { once: true });

//   useEffect(() => {
//     if (!inView) return;
//     const end = parseFloat(value) || 0;
//     const startTime = performance.now();
//     const tick = (now) => {
//       const elapsed = now - startTime;
//       const progress = Math.min(elapsed / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setDisplay(parseFloat((eased * end).toFixed(1)));
//       if (progress < 1) requestAnimationFrame(tick);
//     };
//     requestAnimationFrame(tick);
//   }, [inView, value, duration]);

//   return (
//     <span ref={ref}>
//       {display}
//       {suffix}
//     </span>
//   );
// };

// /* ─── Stat Card ─────────────────────────────────────────────────────────── */
// const StatCard = ({
//   title,
//   value,
//   suffix,
//   icon: Icon,
//   trend,
//   trendLabel,
//   accent,
//   delay = 0,
// }) => {
//   const accentMap = {
//     amber:
//       "from-amber-400/20 to-amber-500/5 border-amber-400/20 text-amber-400",
//     blue: "from-blue-400/20 to-blue-500/5 border-blue-400/20 text-blue-400",
//     emerald:
//       "from-emerald-400/20 to-emerald-500/5 border-emerald-400/20 text-emerald-400",
//     rose: "from-rose-400/20 to-rose-500/5 border-rose-400/20 text-rose-400",
//   };
//   const iconBg = {
//     amber: "bg-amber-400/10 text-amber-400",
//     blue: "bg-blue-400/10 text-blue-400",
//     emerald: "bg-emerald-400/10 text-emerald-400",
//     rose: "bg-rose-400/10 text-rose-400",
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 24 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
//       whileHover={{ y: -3, transition: { duration: 0.2 } }}
//       className={`relative rounded-2xl border bg-gradient-to-br p-5 overflow-hidden group cursor-default ${accentMap[accent]}`}
//     >
//       {/* Decorative circle */}
//       <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-current opacity-5 group-hover:opacity-10 transition-opacity duration-300" />

//       <div className="flex items-start justify-between mb-4">
//         <div
//           className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg[accent]}`}
//         >
//           <Icon className="w-5 h-5" />
//         </div>
//         {trend !== undefined && (
//           <div
//             className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? "bg-emerald-400/10 text-emerald-400" : "bg-rose-400/10 text-rose-400"}`}
//           >
//             {trend >= 0 ? (
//               <FiTrendingUp className="w-3 h-3" />
//             ) : (
//               <FiTrendingDown className="w-3 h-3" />
//             )}
//             {Math.abs(trend)}%
//           </div>
//         )}
//       </div>

//       <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-1">
//         {title}
//       </p>
//       <p className="text-white text-3xl font-bold tracking-tight">
//         <AnimatedNumber value={value} suffix={suffix} />
//       </p>
//       {trendLabel && (
//         <p className="text-slate-500 text-xs mt-1">{trendLabel}</p>
//       )}
//     </motion.div>
//   );
// };

// /* ─── Section heading ───────────────────────────────────────────────────── */
// const SectionLabel = ({ label }) => (
//   <div className="flex items-center gap-3 mb-0">
//     <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
//       {label}
//     </span>
//     <div className="flex-1 h-px bg-slate-800" />
//   </div>
// );

// /* ─── Card wrapper ──────────────────────────────────────────────────────── */
// const Card = ({ children, className = "", delay = 0 }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
//     className={`bg-slate-900 border border-slate-800/70 rounded-2xl overflow-hidden ${className}`}
//   >
//     {children}
//   </motion.div>
// );

// /* ─── Empty state ───────────────────────────────────────────────────────── */
// const EmptyState = ({ message, icon: Icon }) => (
//   <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
//     <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
//       <Icon className="w-5 h-5 text-slate-600" />
//     </div>
//     <p className="text-slate-500 text-sm max-w-xs">{message}</p>
//   </div>
// );

// /* ─── Skeleton loader ───────────────────────────────────────────────────── */
// const Skeleton = ({ className = "" }) => (
//   <div className={`bg-slate-800 rounded-xl animate-pulse ${className}`} />
// );

// const ChartSkeleton = ({ className = "" }) => (
//   <div className={`flex items-center justify-center ${className}`}>
//     <div className="w-full h-full bg-slate-800/50 rounded-xl animate-pulse flex items-center justify-center">
//       <FiRefreshCw className="w-6 h-6 text-slate-600 animate-spin" />
//     </div>
//   </div>
// );

// const DashboardSkeleton = () => (
//   <div className="space-y-6">
//     <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//       {[...Array(4)].map((_, i) => (
//         <Skeleton key={i} className="h-32" />
//       ))}
//     </div>
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//       <Skeleton className="lg:col-span-2 h-64" />
//       <Skeleton className="h-64" />
//     </div>
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//       <Skeleton className="h-56" />
//       <Skeleton className="h-56" />
//     </div>
//   </div>
// );

// /* ─── Enhanced Graph Components with Loading States ────────────────────── */

// // Line Chart Component with Skeleton
// const EnhancedLineChart = ({ data, options, isLoading, isEmpty }) => {
//   if (isLoading) {
//     return <ChartSkeleton className="h-52" />;
//   }

//   if (isEmpty) {
//     return (
//       <EmptyState
//         icon={FiBarChart2}
//         message="Take some tests to see your accuracy trend here."
//       />
//     );
//   }

//   return (
//     <div className="h-52">
//       <Line data={data} options={options} />
//     </div>
//   );
// };

// // Doughnut Chart Component with Skeleton
// const EnhancedDoughnutChart = ({ data, options, isLoading, isEmpty }) => {
//   if (isLoading) {
//     return <ChartSkeleton className="h-52" />;
//   }

//   if (isEmpty) {
//     return (
//       <EmptyState
//         icon={FiTarget}
//         message="No test data yet. Complete some tests to see the breakdown."
//       />
//     );
//   }

//   return (
//     <div className="h-52 flex items-center justify-center">
//       <Doughnut data={data} options={options} />
//     </div>
//   );
// };

// // Bar Chart Component with Skeleton
// const EnhancedBarChart = ({ data, options, isLoading, isEmpty }) => {
//   if (isLoading) {
//     return <ChartSkeleton className="h-52" />;
//   }

//   if (isEmpty) {
//     return (
//       <EmptyState
//         icon={FiBookOpen}
//         message="Start learning a subject to see progress here."
//       />
//     );
//   }

//   return (
//     <div className="h-52">
//       <Bar data={data} options={options} />
//     </div>
//   );
// };

// // Recent Tests List Component with Skeleton
// const RecentTestsList = ({ tests, isLoading }) => {
//   if (isLoading) {
//     return (
//       <div className="divide-y divide-slate-800/60">
//         {[1, 2, 3, 4, 5].map((_, i) => (
//           <div key={i} className="flex items-center gap-3 px-5 py-3.5">
//             <Skeleton className="w-8 h-8 rounded-xl" />
//             <div className="flex-1">
//               <Skeleton className="h-4 w-32 mb-2" />
//               <Skeleton className="h-3 w-24" />
//             </div>
//             <Skeleton className="h-6 w-12 rounded-lg" />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (tests.length === 0) {
//     return (
//       <div className="p-5">
//         <EmptyState
//           icon={FiClipboard}
//           message="No tests taken yet. Start your first practice test!"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="divide-y divide-slate-800/60">
//       {tests.slice(0, 5).map((test, i) => {
//         const accuracy = typeof test.accuracy === "number" ? test.accuracy : 0;
//         const color =
//           accuracy >= 80
//             ? "text-emerald-400 bg-emerald-400/10"
//             : accuracy >= 60
//               ? "text-amber-400 bg-amber-400/10"
//               : "text-rose-400 bg-rose-400/10";
//         return (
//           <motion.div
//             key={test._id || i}
//             initial={{ opacity: 0, x: -10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.4 + i * 0.06 }}
//             whileHover={{ backgroundColor: "rgba(30,41,59,0.6)" }}
//             className="flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors"
//           >
//             <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
//               <FiClipboard className="w-3.5 h-3.5 text-slate-400" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-slate-200 text-sm font-medium truncate">
//                 {test.testName || test.type || "Practice Test"}
//               </p>
//               <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
//                 <FiClock className="w-3 h-3" />
//                 {new Date(test.completedAt).toLocaleDateString("en-US", {
//                   month: "short",
//                   day: "numeric",
//                 })}
//               </p>
//             </div>
//             <span
//               className={`text-xs font-bold px-2.5 py-1 rounded-lg ${color}`}
//             >
//               {accuracy.toFixed(1)}%
//             </span>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// };

// // Subject Progress List Component with Skeleton
// const SubjectProgressList = ({ progress, isLoading }) => {
//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
//         {[1, 2, 3, 4].map((_, i) => (
//           <div key={i} className="p-5">
//             <div className="flex items-start justify-between mb-3">
//               <div className="flex-1">
//                 <Skeleton className="h-5 w-24 mb-2" />
//                 <Skeleton className="h-3 w-32" />
//               </div>
//               <Skeleton className="h-5 w-12" />
//             </div>
//             <Skeleton className="h-1.5 w-full rounded-full" />
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (progress.length === 0) {
//     return (
//       <div className="p-5">
//         <EmptyState
//           icon={FiBookOpen}
//           message="No learning progress yet. Start with your first subject!"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
//       {progress.map((subject, i) => {
//         const pct = Math.round(
//           (subject.completedTopics / subject.subject.totalTopics) * 100,
//         );
//         const barColor =
//           pct >= 80
//             ? "bg-emerald-400"
//             : pct >= 50
//               ? "bg-amber-400"
//               : "bg-blue-400";

//         return (
//           <motion.div
//             key={subject.subject._id}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.5 + i * 0.05 }}
//             whileHover={{ backgroundColor: "rgba(30,41,59,0.5)" }}
//             className={`p-5 transition-colors ${
//               i % 2 === 0 &&
//               i === progress.length - 1 &&
//               progress.length % 2 !== 0
//                 ? "md:col-span-2"
//                 : ""
//             }`}
//           >
//             <div className="flex items-start justify-between mb-3">
//               <div className="flex-1 min-w-0 pr-4">
//                 <p className="text-slate-200 text-sm font-semibold truncate">
//                   {subject.subject.name}
//                 </p>
//                 <p className="text-slate-500 text-xs mt-0.5">
//                   {subject.completedTopics} of {subject.subject.totalTopics}{" "}
//                   topics
//                 </p>
//               </div>
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 {subject.isCompleted && (
//                   <FiCheckCircle className="w-4 h-4 text-emerald-400" />
//                 )}
//                 <span
//                   className={`text-sm font-bold ${
//                     pct >= 80
//                       ? "text-emerald-400"
//                       : pct >= 50
//                         ? "text-amber-400"
//                         : "text-blue-400"
//                   }`}
//                 >
//                   {pct}%
//                 </span>
//               </div>
//             </div>

//             {/* Progress bar */}
//             <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
//               <motion.div
//                 initial={{ width: 0 }}
//                 animate={{ width: `${pct}%` }}
//                 transition={{
//                   duration: 0.8,
//                   delay: 0.6 + i * 0.05,
//                   ease: [0.4, 0, 0.2, 1],
//                 }}
//                 className={`h-full rounded-full ${barColor}`}
//               />
//             </div>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// };

// /* ─── Chart defaults ────────────────────────────────────────────────────── */
// const chartDefaults = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: { display: false },
//     tooltip: {
//       backgroundColor: "#1e293b",
//       borderColor: "#334155",
//       borderWidth: 1,
//       titleColor: "#f8fafc",
//       bodyColor: "#94a3b8",
//       padding: 12,
//       cornerRadius: 10,
//     },
//   },
// };

// /* ─── Main Dashboard ────────────────────────────────────────────────────── */
// const Dashboard = () => {
//   const [stats, setStats] = useState(null);
//   const [tests, setTests] = useState([]);
//   const [progress, setProgress] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [useDemoData, setUseDemoData] = useState(false);
//   const [chartLoading, setChartLoading] = useState({
//     line: true,
//     doughnut: true,
//     bar: true,
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     // Set chart loading states
//     setChartLoading({
//       line: true,
//       doughnut: true,
//       bar: true,
//     });

//     try {
//       // Attempt to fetch real data
//       const [statsRes, testsRes, progressRes] = await Promise.allSettled([
//         api.get("/tests/stats"),
//         api.get("/tests/history"),
//         api.get("/subjects/progress/me"),
//       ]);

//       // Process stats data
//       if (statsRes.status === "fulfilled" && statsRes.value.data) {
//         setStats(statsRes.value.data);
//         setUseDemoData(false);
//       } else {
//         // Fallback to demo data
//         setStats(generateDemoStats());
//         setUseDemoData(true);
//       }

//       // Process tests data
//       if (testsRes.status === "fulfilled" && testsRes.value.data?.length > 0) {
//         setTests(testsRes.value.data);
//       } else {
//         setTests(generateDemoTests());
//         setUseDemoData(true);
//       }

//       // Process progress data
//       if (
//         progressRes.status === "fulfilled" &&
//         progressRes.value.data?.length > 0
//       ) {
//         setProgress(progressRes.value.data);
//       } else {
//         setProgress(generateDemoProgress());
//         setUseDemoData(true);
//       }

//       // Simulate chart loading for better UX
//       setTimeout(() => {
//         setChartLoading({
//           line: false,
//           doughnut: false,
//           bar: false,
//         });
//       }, 800);
//     } catch (error) {
//       console.error("Error fetching dashboard data:", error);
//       // Use demo data on error
//       setStats(generateDemoStats());
//       setTests(generateDemoTests());
//       setProgress(generateDemoProgress());
//       setUseDemoData(true);

//       setTimeout(() => {
//         setChartLoading({
//           line: false,
//           doughnut: false,
//           bar: false,
//         });
//       }, 800);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <DashboardSkeleton />;

//   /* ── Chart data ── */
//   const recentTests = tests.slice(-7);

//   const lineData = {
//     labels: recentTests.map((t) =>
//       new Date(t.completedAt).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       }),
//     ),
//     datasets: [
//       {
//         label: "Accuracy",
//         data: recentTests.map((t) => t.accuracy),
//         borderColor: "#f59e0b",
//         backgroundColor: "rgba(245, 158, 11, 0.08)",
//         tension: 0.45,
//         fill: true,
//         pointBackgroundColor: "#f59e0b",
//         pointBorderColor: "#1e293b",
//         pointBorderWidth: 2,
//         pointRadius: 4,
//         pointHoverRadius: 6,
//       },
//     ],
//   };

//   const lineOptions = {
//     ...chartDefaults,
//     scales: {
//       x: {
//         grid: { color: "rgba(51,65,85,0.5)", drawTicks: false },
//         border: { display: false },
//         ticks: { color: "#64748b", font: { size: 11 } },
//       },
//       y: {
//         min: 0,
//         max: 100,
//         grid: { color: "rgba(51,65,85,0.5)", drawTicks: false },
//         border: { display: false },
//         ticks: {
//           color: "#64748b",
//           font: { size: 11 },
//           callback: (v) => `${v}%`,
//         },
//       },
//     },
//   };

//   const doughnutData = {
//     labels: ["Easy", "Moderate", "Hard", "Extreme"],
//     datasets: [
//       {
//         data: [
//           stats?.complexityStats?.easy || 0,
//           stats?.complexityStats?.moderate || 0,
//           stats?.complexityStats?.hard || 0,
//           stats?.complexityStats?.extreme || 0,
//         ],
//         backgroundColor: ["#34d399", "#60a5fa", "#fbbf24", "#f87171"],
//         borderColor: "#0f172a",
//         borderWidth: 3,
//         hoverOffset: 6,
//       },
//     ],
//   };

//   const doughnutOptions = {
//     ...chartDefaults,
//     cutout: "72%",
//     plugins: {
//       ...chartDefaults.plugins,
//       legend: {
//         display: true,
//         position: "bottom",
//         labels: {
//           color: "#94a3b8",
//           font: { size: 11 },
//           padding: 16,
//           usePointStyle: true,
//           pointStyleWidth: 8,
//         },
//       },
//     },
//   };

//   const barData = {
//     labels: progress.map((p) => p.subject.name),
//     datasets: [
//       {
//         label: "Progress",
//         data: progress.map((p) =>
//           Math.round((p.completedTopics / p.subject.totalTopics) * 100),
//         ),
//         backgroundColor: progress.map((p) => {
//           const pct = (p.completedTopics / p.subject.totalTopics) * 100;
//           if (pct >= 80) return "rgba(52, 211, 153, 0.8)";
//           if (pct >= 50) return "rgba(245, 158, 11, 0.8)";
//           return "rgba(96, 165, 250, 0.8)";
//         }),
//         borderRadius: 6,
//         borderSkipped: false,
//       },
//     ],
//   };

//   const barOptions = {
//     ...chartDefaults,
//     scales: {
//       x: {
//         grid: { display: false },
//         border: { display: false },
//         ticks: { color: "#64748b", font: { size: 11 } },
//       },
//       y: {
//         min: 0,
//         max: 100,
//         grid: { color: "rgba(51,65,85,0.4)", drawTicks: false },
//         border: { display: false },
//         ticks: {
//           color: "#64748b",
//           font: { size: 11 },
//           callback: (v) => `${v}%`,
//         },
//       },
//     },
//   };

//   const totalComplexity =
//     (stats?.complexityStats?.easy || 0) +
//     (stats?.complexityStats?.moderate || 0) +
//     (stats?.complexityStats?.hard || 0) +
//     (stats?.complexityStats?.extreme || 0);

//   const completedCount = progress.filter((p) => p.isCompleted).length;
//   const avgAccuracy = stats?.averageAccuracy?.toFixed(1) || 0;

//   /* ── Greeting ── */
//   const hour = new Date().getHours();
//   const greeting =
//     hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

//   return (
//     <div className="space-y-6 pb-6">
//       {/* ── Demo Data Indicator ── */}
//       {useDemoData && (
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-3 text-center"
//         >
//           <p className="text-amber-400 text-sm flex items-center justify-center gap-2">
//             <FiRefreshCw className="w-4 h-4 animate-spin" />
//             Showing demo data. Connect to API for live insights.
//           </p>
//         </motion.div>
//       )}

//       {/* ── Hero greeting ── */}
//       <motion.div
//         initial={{ opacity: 0, y: -12 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="flex items-start justify-between gap-4"
//       >
//         <div>
//           <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
//             <FiCalendar className="w-3.5 h-3.5" />
//             {new Date().toLocaleDateString("en-US", {
//               weekday: "long",
//               month: "long",
//               day: "numeric",
//             })}
//           </p>
//           <h2 className="text-white text-2xl font-bold tracking-tight mt-0.5">
//             {greeting} 👋
//           </h2>
//           <p className="text-slate-400 text-sm mt-1">
//             Here's your preparation overview for today.
//           </p>
//         </div>

//         <motion.button
//           whileHover={{ scale: 1.03 }}
//           whileTap={{ scale: 0.97 }}
//           onClick={fetchDashboardData}
//           className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-amber-400 text-slate-900 rounded-xl font-semibold text-sm shadow-lg shadow-amber-400/20 hover:bg-amber-300 transition-colors flex-shrink-0"
//         >
//           <FiRefreshCw className="w-4 h-4" />
//           Refresh Data
//         </motion.button>
//       </motion.div>

//       {/* ── Stat cards ── */}
//       <SectionLabel label="Overview" />
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-2">
//         <StatCard
//           title="Practice Tests"
//           value={stats?.totalPracticeTests || 0}
//           icon={FiBarChart2}
//           accent="blue"
//           trend={8}
//           trendLabel="vs last week"
//           delay={0.05}
//         />
//         <StatCard
//           title="Grand Tests"
//           value={stats?.totalGrandTests || 0}
//           icon={FiAward}
//           accent="amber"
//           trend={12}
//           trendLabel="vs last week"
//           delay={0.1}
//         />
//         <StatCard
//           title="Avg Accuracy"
//           value={avgAccuracy}
//           suffix="%"
//           icon={FiTarget}
//           accent="emerald"
//           trend={avgAccuracy >= 70 ? 5 : -2}
//           trendLabel="vs last month"
//           delay={0.15}
//         />
//         <StatCard
//           title="Completed Subjects"
//           value={completedCount}
//           icon={FiCheckCircle}
//           accent="rose"
//           trendLabel={`of ${progress.length} total subjects`}
//           delay={0.2}
//         />
//       </div>

//       {/* ── Bento row 1: Line chart (2/3) + Doughnut (1/3) ── */}
//       <SectionLabel label="Performance" />
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mt-2">
//         {/* Line chart */}
//         <Card className="lg:col-span-2" delay={0.25}>
//           <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
//             <div>
//               <p className="text-white font-semibold text-sm">Accuracy Trend</p>
//               <p className="text-slate-500 text-xs mt-0.5">Last 7 tests</p>
//             </div>
//             <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full font-medium">
//               <FiTrendingUp className="w-3 h-3" />
//               Active streak
//             </div>
//           </div>
//           <div className="p-5">
//             <EnhancedLineChart
//               data={lineData}
//               options={lineOptions}
//               isLoading={chartLoading.line}
//               isEmpty={recentTests.length === 0}
//             />
//           </div>
//         </Card>

//         {/* Doughnut */}
//         <Card delay={0.3}>
//           <div className="p-5 border-b border-slate-800/60">
//             <p className="text-white font-semibold text-sm"></p>
//             <p className="text-slate-500 text-xs mt-0.5">Tests by complexity</p>
//           </div>
//           <div className="p-5">
//             <EnhancedDoughnutChart
//               data={doughnutData}
//               options={doughnutOptions}
//               isLoading={chartLoading.doughnut}
//               isEmpty={totalComplexity === 0}
//             />
//           </div>
//         </Card>
//       </div>

//       {/* ── Bento row 2: Bar chart (1/2) + Recent Tests (1/2) ── */}
//       <SectionLabel label="Learning" />
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
//         {/* Subject progress bar chart */}
//         <Card delay={0.35}>
//           <div className="p-5 border-b border-slate-800/60">
//             <p className="text-white font-semibold text-sm">Subject Progress</p>
//             <p className="text-slate-500 text-xs mt-0.5">
//               Completion per subject
//             </p>
//           </div>
//           <div className="p-5">
//             <EnhancedBarChart
//               data={barData}
//               options={barOptions}
//               isLoading={chartLoading.bar}
//               isEmpty={progress.length === 0}
//             />
//           </div>
//         </Card>

//         {/* Recent tests list */}
//         <Card delay={0.4}>
//           <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
//             <div>
//               <p className="text-white font-semibold text-sm">Recent Tests</p>
//               <p className="text-slate-500 text-xs mt-0.5">
//                 Your latest activity
//               </p>
//             </div>
//             <motion.button
//               whileHover={{ x: 2 }}
//               className="text-amber-400 text-xs font-medium flex items-center gap-1 hover:text-amber-300 transition-colors"
//             >
//               View all <FiArrowRight className="w-3 h-3" />
//             </motion.button>
//           </div>
//           <RecentTestsList tests={tests} isLoading={chartLoading.line} />
//         </Card>
//       </div>

//       {/* ── Subject progress details bento ── */}
//       <SectionLabel label="Subjects" />
//       <Card delay={0.5} className="mt-2">
//         <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
//           <div>
//             <p className="text-white font-semibold text-sm">
//               Learning Progress Details
//             </p>
//             <p className="text-slate-500 text-xs mt-0.5">
//               Topic completion per subject
//             </p>
//           </div>
//           <span className="text-xs text-slate-500 bg-slate-800 px-2.5 py-1 rounded-full">
//             {completedCount} / {progress.length} done
//           </span>
//         </div>
//         <SubjectProgressList progress={progress} isLoading={chartLoading.bar} />
//       </Card>

//       {/* ── Quick actions bento strip ── */}
//       <SectionLabel label="Quick Actions" />
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
//         {[
//           {
//             icon: FiZap,
//             title: "Start Practice Test",
//             desc: "Pick a subject and test your knowledge",
//             accent: "amber",
//             to: "/tests",
//           },
//           {
//             icon: FiBookOpen,
//             title: "Continue Learning",
//             desc: "Resume where you left off",
//             accent: "blue",
//             to: "/learn",
//           },
//           {
//             icon: FiStar,
//             title: "Take Grand Test",
//             desc: "Full-length mock exam",
//             accent: "emerald",
//             to: "/tests?type=grand",
//           },
//         ].map((action, i) => {
//           const accentStyles = {
//             amber:
//               "border-amber-400/20 hover:border-amber-400/40 hover:bg-amber-400/5",
//             blue: "border-blue-400/20 hover:border-blue-400/40 hover:bg-blue-400/5",
//             emerald:
//               "border-emerald-400/20 hover:border-emerald-400/40 hover:bg-emerald-400/5",
//           };
//           const iconStyles = {
//             amber: "bg-amber-400/10 text-amber-400",
//             blue: "bg-blue-400/10 text-blue-400",
//             emerald: "bg-emerald-400/10 text-emerald-400",
//           };
//           return (
//             <motion.a
//               key={action.title}
//               href={action.to}
//               initial={{ opacity: 0, y: 16 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.55 + i * 0.07, duration: 0.4 }}
//               whileHover={{ y: -3 }}
//               whileTap={{ scale: 0.98 }}
//               className={`group flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border transition-all duration-200 cursor-pointer ${accentStyles[action.accent]}`}
//             >
//               <div
//                 className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconStyles[action.accent]}`}
//               >
//                 <action.icon className="w-5 h-5" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-slate-200 text-sm font-semibold">
//                   {action.title}
//                 </p>
//                 <p className="text-slate-500 text-xs mt-0.5 truncate">
//                   {action.desc}
//                 </p>
//               </div>
//               <FiArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
//             </motion.a>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;