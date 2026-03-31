import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { X, Eye, EyeOff } from "lucide-react";
import { useLoginModal } from "../context/LoginModalContext";
import { useUser } from "../context/UserContext";
import api from "../utils/api";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "./ui/input-otp";

const LoginModal = () => {
  const { open, message, hideLoginModal } = useLoginModal();
  const { setUser, fetchUser } = useUser();

  const [step, setStep] = useState("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const resetForm = () => {
    setStep("credentials");
    setEmail("");
    setPassword("");
    setOtp("");
    setError("");
    setSending(false);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    hideLoginModal();
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await api.post("/auth/request-otp", { email, password });
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const { data } = await api.post("/auth/verify-otp", { email, otp });
      setUser(data.user);
      resetForm();
      hideLoginModal();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal card */}
          <motion.div
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 md:p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 flex items-center justify-center w-8 h-8 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Message banner */}
            {message && (
              <div className="mb-5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                {message}
              </div>
            )}

            {step === "credentials" ? (
              <>
                <h2 className="text-xl font-bold text-neutral-800">
                  Log in to continue
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Sign in to unlock analyses & comparisons.
                </p>

                <form className="mt-6" onSubmit={handleRequestOtp}>
                  <div className="flex w-full flex-col space-y-2 mb-4">
                    <Label htmlFor="modal-email">Email Address</Label>
                    <Input
                      id="modal-email"
                      placeholder="you@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex w-full flex-col space-y-2 mb-6">
                    <Label htmlFor="modal-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="modal-password"
                        placeholder="••••••••"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

                  <button
                    className="relative block h-10 w-full rounded-md bg-linear-to-br from-neutral-900 to-neutral-700 font-medium text-white shadow-sm hover:from-neutral-800 hover:to-neutral-600 disabled:opacity-50 transition-all"
                    type="submit"
                    disabled={sending}
                  >
                    {sending ? "Verifying..." : "Continue"}
                  </button>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <Link
                      to="/forget-password"
                      onClick={handleClose}
                      className="text-neutral-500 hover:text-neutral-700"
                    >
                      Forgot password?
                    </Link>
                    <p className="text-neutral-500">
                      No account?{" "}
                      <Link
                        to="/signup"
                        onClick={handleClose}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setStep("credentials"); setOtp(""); setError(""); }}
                  className="mb-4 flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
                >
                  Back
                </button>

                <h2 className="text-xl font-bold text-neutral-800">
                  Verify your identity
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-neutral-800">{email}</span>
                </p>

                <form className="mt-6" onSubmit={handleVerifyOtp}>
                  <div className="mb-6 flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={(v) => setOtp(v)}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

                  <button
                    className="relative block h-10 w-full rounded-md bg-linear-to-br from-neutral-900 to-neutral-700 font-medium text-white shadow-sm hover:from-neutral-800 hover:to-neutral-600 disabled:opacity-50 transition-all"
                    type="submit"
                    disabled={sending || otp.length < 6}
                  >
                    {sending ? "Verifying..." : "Verify & Log in"}
                  </button>

                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    className="mt-3 w-full text-center text-sm text-blue-600 hover:underline"
                    disabled={sending}
                  >
                    Resend OTP
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
