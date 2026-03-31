import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      console.log("Login successful, navigating to home...");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = 
        err.response?.data?.error || 
        err.response?.data?.message || 
        err.message || 
        "Invalid email or password";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col lg:flex-row">
        {/* Left Side - Login Form */}
        <div className="flex items-center justify-center overflow-y-auto px-4 py-12 lg:w-1/2">
          <div className="shadow-input w-full max-w-md rounded-2xl bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold text-neutral-800">
              Log in to DishaRi
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Enter your credentials to access your account.
            </p>

            <form className="mt-6" onSubmit={handleLogin}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer className="mb-6">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
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
                    {showPassword ? (
                      <IconEyeOff className="h-4 w-4" />
                    ) : (
                      <IconEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </LabelInputContainer>

              {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

              <button
                className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
                <BottomGradient />
              </button>

              <div className="my-4 flex items-center gap-2 text-neutral-400">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs uppercase">or</span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>

              <div className="mt-4 flex items-center justify-between text-sm">
                <Link
                  to="/forget-password"
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  Forgot password?
                </Link>
                <p className="text-neutral-600">
                  No account?{" "}
                  <Link
                    to="/signup"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side - Branding & Info */}
        <div className="hidden lg:flex flex-col justify-center px-8 py-12 lg:w-1/2 lg:pl-16">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900">
            DishaRi
          </h1>
          <p className="mb-6 text-lg text-neutral-600">
            Welcome back — log in to continue your learning journey.
          </p>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                1
              </span>
              <div>
                <h3 className="font-semibold text-neutral-800">
                  Enter your credentials
                </h3>
                <p className="text-sm text-neutral-500">
                  Provide your registered email and password to get started.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                2
              </span>
              <div>
                <h3 className="font-semibold text-neutral-800">
                  Access your dashboard
                </h3>
                <p className="text-sm text-neutral-500">
                  Get instant access to your courses, progress, and materials.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                3
              </span>
              <div>
                <h3 className="font-semibold text-neutral-800">
                  You&apos;re in!
                </h3>
                <p className="text-sm text-neutral-500">
                  Start Preparing for Your Career.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-neutral-400">
            Your data is protected with industry-standard encryption.
          </p>
        </div>
      </div>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default Login;
