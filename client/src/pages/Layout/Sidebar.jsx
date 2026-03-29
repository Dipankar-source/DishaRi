import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiHome,
  FiBookOpen,
  FiClipboard,
  FiBarChart2,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiAward,
  FiMap,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/", icon: FiHome, label: "Dashboard", end: true },
  { to: "/learn", icon: FiBookOpen, label: "Learn" },
  { to: "/tests", icon: FiClipboard, label: "Tests" },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative h-screen bg-slate-900 border-r border-slate-800/60 flex flex-col overflow-hidden"
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

      {/* Logo + Brand */}
      <div className="flex items-center h-16 px-4 border-b border-slate-800/60 flex-shrink-0">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 flex-shrink-0">
          <FiAward className="w-5 h-5 text-slate-900" />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="ml-3 overflow-hidden whitespace-nowrap"
            >
              <p className="text-white font-bold text-base tracking-tight leading-none">
                DronaCharya
              </p>
              <p className="text-amber-400/70 text-xs mt-0.5 font-medium tracking-wide">
                Career Ready
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User pill */}
      <div className="px-3 py-4 border-b border-slate-800/40">
        <div
          className={`flex items-center gap-3 rounded-xl px-2 py-2 bg-slate-800/50 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <p className="text-white text-xs font-semibold truncate max-w-[140px]">
                  {user?.name || "Student"}
                </p>
                <p className="text-slate-400 text-xs truncate max-w-[140px]">
                  {user?.email || ""}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
        <AnimatePresence>
          {!collapsed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-slate-500 text-xs font-semibold uppercase tracking-widest px-2 pb-2"
            >
              Navigation
            </motion.p>
          )}
        </AnimatePresence>

        {navItems.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? " text-amber-400 shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active left indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-amber-400 rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}

                <item.icon
                  className={`w-4.5 h-4.5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-amber-400" : ""
                  }`}
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4 border-t border-slate-800/60 pt-3">
        <button
          onClick={handleLogout}
          className={`group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <FiLogOut className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>

          {collapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </button>
      </div>

      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute right-3 top-20 z-10 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 hover:border-amber-400/40 transition-all duration-200 shadow-md"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <motion.div
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <FiChevronLeft className="w-3 h-3" />
        </motion.div>
      </button>
    </motion.aside>
  );
};

export default Sidebar;
