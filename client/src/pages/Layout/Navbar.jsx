import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
  FiChevronDown,
  FiSearch,
  FiCommand,
  FiZap,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const pageTitle =
    {
      "/": "Dashboard",
      "/learn": "Learn",
      "/tests": "Tests",
      "/analytics": "Analytics",
      "/profile": "Profile",
      "/settings": "Settings",
    }[location.pathname] ?? "CSE Prep";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setShowNotifications(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={`sticky top-0 z-30 h-16 flex items-center px-4 md:px-6 gap-4 transition-all duration-300 ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 shadow-md shadow-black/20"
          : "bg-slate-900/80 backdrop-blur-sm border-b border-slate-800/40"
      }`}
    >
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.h1
            key={pageTitle}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-white font-semibold text-lg tracking-tight truncate hidden md:block"
          >
            {pageTitle}
          </motion.h1>
        </AnimatePresence>

        {/* Search hint — desktop only
        <button className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-300 hover:border-slate-600 transition-all duration-200 text-sm group">
          <FiSearch className="w-3.5 h-3.5" />
          <span>Search topics...</span>
          <span className="ml-4 flex items-center gap-0.5 text-xs text-slate-500 group-hover:text-slate-400">
            <FiCommand className="w-3 h-3" />K
          </span>
        </button> */}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        {/* XP Points */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400"
        >
          <FiZap className="w-3.5 h-3.5 fill-amber-400" />
          <span className="text-xs font-bold tracking-tight">{user?.xp || 0} XP</span>
        </motion.div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              setShowNotifications((v) => !v);
              setShowProfile(false);
            }}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-200"
            aria-label="Notifications"
          >
            <FiBell className="w-4.5 h-4.5" />
            {/* Unread dot */}
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-400 rounded-full ring-1 ring-slate-900" />
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                  <p className="text-white text-sm font-semibold">
                    Notifications
                  </p>
                  <span className="text-xs text-amber-400 font-medium bg-amber-400/10 px-2 py-0.5 rounded-full">
                    0 new
                  </span>
                </div>
                <div className="px-4 py-8 text-center">
                  <FiBell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">
                    You're all caught up!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              setShowProfile((v) => !v);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-800 transition-all duration-200 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden md:block text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              {user?.name?.split(" ")[0] || "Student"}
            </span>
            <motion.div
              animate={{ rotate: showProfile ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown className="w-3.5 h-3.5 text-slate-500 hidden md:block" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700/70 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-white text-sm font-semibold truncate">
                      {user?.name}
                    </p>
                    <p className="text-slate-400 text-xs truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  {[
                    { to: "/profile", icon: FiUser, label: "Profile Settings" },
                    {
                      to: "/settings",
                      icon: FiSettings,
                      label: "Account Settings",
                    },
                  ].map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-150 text-sm"
                    >
                      <item.icon className="w-4 h-4 text-slate-500" />
                      {item.label}
                    </Link>
                  ))}

                  <div className="mx-3 my-1 h-px bg-slate-800" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-150 text-sm"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
