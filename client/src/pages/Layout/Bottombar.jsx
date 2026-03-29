import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { FiHome, FiBookOpen, FiClipboard, FiBarChart2 } from "react-icons/fi";

const navItems = [
  { to: "/", icon: FiHome, label: "Home", end: true },
  { to: "/learn", icon: FiBookOpen, label: "Learn" },
  { to: "/tests", icon: FiClipboard, label: "Tests" },
  { to: "/analytics", icon: FiBarChart2, label: "Stats" },
];

const Bottombar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 shadow-[0_-4px_24px_rgba(0,0,0,0.3)] safe-area-inset-bottom">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />

      <div className="flex items-center justify-around h-full px-2 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="relative flex-1 flex flex-col items-center justify-center h-full group"
          >
            {({ isActive }) => (
              <>
                {/* Active background pill */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="bottombar-active-bg"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.7 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                      className="absolute inset-x-1 inset-y-2 rounded-xl"
                    />
                  )}
                </AnimatePresence>

                {/* Icon */}
                <motion.div
                  animate={isActive ? { y: -2 } : { y: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="relative z-10"
                >
                  <item.icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive
                        ? "text-amber-400"
                        : "text-slate-500 group-active:text-slate-300"
                    }`}
                  />

                  {/* Active dot indicator */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full"
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Label */}
                <span
                  className={`text-[10px] font-medium mt-1.5 transition-colors duration-200 relative z-10 ${
                    isActive ? "text-amber-400" : "text-slate-500"
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Bottombar;
