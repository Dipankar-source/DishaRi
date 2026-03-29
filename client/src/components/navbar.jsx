// Navbar.jsx - No changes needed, it's already correct
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useSpring,
} from "framer-motion";
import { useUser } from "../context/UserContext";
import { useBanner } from "../context/BannerContext";
import { User, Menu, X } from "lucide-react";

const Navbar = ({ offsetTop = 0 }) => {
  const { user, logout } = useUser();
  const { isBannerVisible } = useBanner();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (currentScrollY) => {
      setScrolled(currentScrollY > 40);
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("up");
      }
      
      setLastScrollY(currentScrollY);
    });
    
    return () => unsubscribe();
  }, [scrollY, lastScrollY]);

  const navBackground = useTransform(
    scrollY,
    [0, 40],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.97)"],
  );
  const navShadow = useTransform(
    scrollY,
    [0, 40],
    ["0 0px 0px 0 rgba(0,0,0,0)", "0 6px 36px 0 rgba(0,0,0,0.10)"],
  );
  const navBorderColor = useTransform(
    scrollY,
    [0, 40],
    ["rgba(0,0,0,0)", "rgba(0,0,0,0.09)"],
  );
  const navY = useTransform(scrollY, [0, 40], [8, 4]);

  const navTop = useTransform(
    scrollY,
    (latest) => {
      const baseTop = isBannerVisible ? 50 : 10;
      
      if (scrollDirection === "down" && latest > 50) {
        return 10;
      }
      
      return baseTop;
    }
  );

  const rawWidthPct = useTransform(scrollY, [0, 40], [92, 78]);
  const springWidthPct = useSpring(rawWidthPct, {
    stiffness: 130,
    damping: 20,
  });
  const width = useTransform(springWidthPct, (v) => `${v}vw`);

  const rawMaxWidthPx = useTransform(scrollY, [0, 40], [1100, 900]);
  const springMaxWidthPx = useSpring(rawMaxWidthPx, {
    stiffness: 130,
    damping: 20,
  });
  const maxWidth = useTransform(springMaxWidthPx, (v) => `${v}px`);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Analyse", href: "/product-analysis" },
    { label: "Process", href: "/process-of-work" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <style>{`
        .nav-links-desktop {
          display: none;
        }
        .nav-auth-desktop {
          display: none;
        }
        .nav-divider-desktop {
          display: none;
        }
        .nav-hamburger {
          display: flex;
        }

        @media (min-width: 768px) {
          .nav-links-desktop {
            display: flex;
          }
          .nav-auth-desktop {
            display: flex;
          }
          .nav-divider-desktop {
            display: block;
          }
          .nav-hamburger {
            display: none;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .nav-link-btn {
            padding: 6px 8px !important;
            font-size: 13px !important;
          }
        }

        @media (max-width: 480px) {
          .nav-pill-inner {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
        }

        .nav-link-btn {
          position: relative;
          font-size: 14px;
          font-weight: 500;
          font-family: inherit;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          outline: none;
          white-space: nowrap;
        }

        .nav-link-btn:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .mobile-drawer {
          position: absolute;
          background: #fff;
          border-radius: 18px;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 12px 48px rgba(0,0,0,0.14);
          z-index: 9999;
        }

        @media (min-width: 480px) {
          .mobile-drawer {
            top: 68px;
            left: 4vw;
            right: 4vw;
          }
        }

        @media (max-width: 479px) {
          .mobile-drawer {
            top: 64px;
            left: 12px;
            right: 12px;
          }
        }
      `}</style>

      <motion.nav
        style={{
          position: "fixed",
          left: "50%",
          x: "-50%",
          top: navTop,
          y: navY,
          width,
          maxWidth,
          zIndex: 9999,
        }}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="nav-pill-inner"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingLeft: "clamp(12px, 3vw, 20px)",
            paddingRight: "clamp(12px, 3vw, 20px)",
            paddingTop: 10,
            paddingBottom: 10,
            borderRadius: 16,
            background: navBackground,
            boxShadow: navShadow,
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: navBorderColor,
            backdropFilter: scrolled ? "blur(18px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
            willChange: "transform",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginRight: 16,
              userSelect: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
            onClick={() => {
              navigate("/");
              window.scrollTo(0, 0);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate("/")}
            aria-label="Go to homepage"
          >
            <img
              src="./browser-logo.png"
              alt="Trust-io logo"
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span
              style={{
                fontWeight: 600,
                fontSize: "clamp(15px, 2.5vw, 18px)",
                color: "#111827",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              Trust<span style={{ color: "#3b82f6" }}>-io</span>
            </span>
          </div>

          <div
            className="nav-links-desktop"
            style={{
              alignItems: "center",
              gap: 2,
              flex: 1,
              justifyContent: "center",
              flexWrap: "nowrap",
              overflow: "hidden",
            }}
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.href);
              return (
                <button
                  key={link.label}
                  type="button"
                  className="nav-link-btn"
                  onClick={() => {
                    navigate(link.href);
                    window.scrollTo(0, 0);
                  }}
                  style={{
                    padding: "6px 12px",
                    background: isActive
                      ? "rgba(59,130,246,0.08)"
                      : "transparent",
                    color: isActive ? "#1d4ed8" : "#4b5563",
                    borderBottom: isActive
                      ? "2px solid #3b82f6"
                      : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                      e.currentTarget.style.color = "#111827";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#4b5563";
                    }
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginLeft: "auto",
              flexShrink: 0,
            }}
          >
            <div
              className="nav-divider-desktop"
              style={{
                width: 1,
                height: 20,
                background: "#e5e7eb",
                margin: "0 4px",
              }}
            />

            <div
              className="nav-auth-desktop"
              style={{ alignItems: "center", gap: 8 }}
            >
              {user ? (
                <div onClick={() => {navigate("/profile");scrollTo(0,0)}} style={{ textDecoration: "none" }}>
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "#111827",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                    aria-label="View profile"
                  >
                    <User size={15} color="#fff" />
                  </motion.div>
                </div>
              ) : (
                <>
                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    <button
                      style={{
                        padding: "7px 16px",
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#374151",
                        borderRadius: 10,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "background 0.15s",
                        whiteSpace: "nowrap",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(0,0,0,0.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      Sign Up
                    </button>
                  </Link>
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: "7px 16px",
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: "#fff",
                        borderRadius: 10,
                        border: "none",
                        background: "#111827",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.18)",
                        transition: "background 0.15s",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Login
                    </motion.button>
                  </Link>
                </>
              )}
            </div>

            <motion.button
              className="nav-hamburger"
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 10,
                border: "none",
                background: mobileOpen ? "rgba(0,0,0,0.06)" : "transparent",
                cursor: "pointer",
                color: "#374151",
                transition: "background 0.15s",
                flexShrink: 0,
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: "flex" }}
                  >
                    <X size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: "flex" }}
                  >
                    <Menu size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            style={{ position: "fixed", inset: 0, zIndex: 9998 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.18)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
              }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              className="mobile-drawer"
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                style={{
                  padding: "10px 8px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  marginTop: "50px",
                }}
              >
                {navLinks.map((link, i) => {
                  const isActive =
                    link.href === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(link.href);
                  return (
                    <motion.button
                      key={link.label}
                      type="button"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                      onClick={() => {
                        setMobileOpen(false);
                        navigate(link.href);
                        window.scrollTo(0, 0);
                      }}
                      style={{
                        padding: "12px 16px",
                        fontSize: 15,
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#1d4ed8" : "#374151",
                        borderRadius: 10,
                        border: "none",
                        background: isActive
                          ? "rgba(59,130,246,0.08)"
                          : "transparent",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                        transition: "background 0.15s",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          e.currentTarget.style.background = "transparent";
                      }}
                    >
                      {isActive && (
                        <span
                          style={{
                            width: 4,
                            height: 4,
                            borderRadius: "50%",
                            background: "#3b82f6",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {link.label}
                    </motion.button>
                  );
                })}
              </div>

              <div
                style={{
                  padding: "10px 8px 12px",
                  borderTop: "1px solid #f0f0f0",
                }}
              >
                {user ? (
                  <Link
                    to="/profile"
                    style={{ textDecoration: "none" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "12px 16px",
                        fontSize: 15,
                        fontWeight: 500,
                        color: "#374151",
                        borderRadius: 10,
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        width: "100%",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(0,0,0,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <User size={16} /> Profile
                    </button>
                  </Link>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      padding: "0 8px",
                    }}
                  >
                    <Link
                      to="/signup"
                      style={{ textDecoration: "none" }}
                      onClick={() => setMobileOpen(false)}
                    >
                      <button
                        style={{
                          width: "100%",
                          padding: "12px",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#374151",
                          borderRadius: 10,
                          border: "1px solid #e5e7eb",
                          background: "transparent",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(0,0,0,0.03)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        Sign Up
                      </button>
                    </Link>
                    <Link
                      to="/login"
                      style={{ textDecoration: "none" }}
                      onClick={() => setMobileOpen(false)}
                    >
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        style={{
                          width: "100%",
                          padding: "12px",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#fff",
                          borderRadius: 10,
                          border: "none",
                          background: "#111827",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                      >
                        Login
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;