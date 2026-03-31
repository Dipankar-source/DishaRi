import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import {
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      console.log("Registration successful, navigating to home...");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 ">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col lg:flex-row">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex flex-col justify-center px-8 py-12 lg:w-1/2 lg:pr-16">
          <h1 className="mb-4 text-4xl font-bold text-neutral-900 ">
            DishaRi
          </h1>
          <p className="mb-6 text-lg text-neutral-600">
            Shape Your Future with DishaRi — Your Ultimate Career Preparation Companion!
          </p>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                1
              </span>
              <div>
                <h3 className="font-semibold text-neutral-800 ">
                  Learn
                </h3>
                <p className="text-sm text-neutral-500">
                  Access comprehensive resources and personalized learning paths to master the skills you need for your dream job.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                2
              </span>
              <div>
                <h3 className="font-semibold text-neutral-800">
                  Practice & Prepare
                </h3>
                <p className="text-sm text-neutral-500">
                  Simulate real interview scenarios with AI-powered mock interviews and get instant feedback to boost your confidence.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                3
              </span>
              <div>
                <h3 className="font-semibold text-neutral-800">
                  Succeed
                </h3>
                <p className="text-sm text-neutral-500">
                  Land your dream job with our comprehensive preparation tools and personalized guidance every step of the way.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs text-neutral-400">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        {/* Right Side - Sign Up Form */}
        <div className="flex items-start justify-center overflow-y-auto px-4 py-12 lg:w-1/2">
          <div className="shadow-input w-full max-w-md rounded-2xl bg-white p-6 md:p-8">
            <h2 className="text-xl font-bold text-neutral-800">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Join DishaRi and start preparing for your career today!
            </p>

            <form className="mt-6" onSubmit={handleSubmit}>
              <div>
                <LabelInputContainer className="mb-4">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    placeholder="+91 9876543210"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    placeholder="john@example.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </LabelInputContainer>
              </div>

              {/* Password */}
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
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

              {/* Confirm Password */}
              <LabelInputContainer className="mb-8">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    placeholder="••••••••"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                  >
                    {showConfirmPassword ? (
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
                {loading ? "Creating account..." : "Sign up"}
                <BottomGradient />
              </button>

              <div className="my-4 flex items-center gap-2 text-neutral-400">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs uppercase">or</span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>

              <p className="mt-4 text-center text-sm text-neutral-600 ">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>
          </div>
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

export default Register;
