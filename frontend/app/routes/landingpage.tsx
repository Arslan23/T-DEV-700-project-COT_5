import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useLoginInitMutation, useLoginVerifyMutation } from '~/store/services/authApi';
import { useAppDispatch, useAppSelector } from '~/hooks/redux';
import { setCredentials } from '~/store/slices/authSlice';
import { AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import BlurText from "../components/ui/BlurText";
import '../assets/LandingPage.css';

type TimeOption = 'arrival' | 'departure';

interface LoginResponseWith2FA {
  user: any;
  token: string;
  requires2FA?: boolean;
  tempToken?: string;
  message?: string;
}

interface Verify2FAParams {
  email: string;
  otp: string;
  session_token: string;
}

interface LoginInitResponse {
  detail: string;
  session_token: string;
}

interface LoginVerifyResponse {
  access: string;
  refresh: string;
  user?: any;
}

interface DemoAccountButtonProps {
  role: string;
  email: string;
  password: string;
  onClick: () => void;
  color: "purple" | "blue" | "gray";
  disabled?: boolean;
}

function DemoAccountButton({ role, email, onClick, color, disabled }: DemoAccountButtonProps) {
  const colors = {
    purple: "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-400 hover:border-purple-500/50",
    blue: "bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-400 hover:border-blue-500/50",
    gray: "bg-gray-500/10 border-gray-500/30 hover:bg-gray-500/20 text-gray-400 hover:border-gray-500/50",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full p-3 border rounded-lg transition-all duration-200",
        "flex justify-between items-center group",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        colors[color]
      )}
    >
      <div className="text-left">
        <p className="font-medium">{role}</p>
        <p className="text-xs opacity-75">{email}</p>
      </div>
      <div className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        Click to fill
      </div>
    </button>
  );
}

const LoginForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [loginInit, { isLoading }] = useLoginInitMutation();
  const [loginVerify, { isLoading: isVerifying }] = useLoginVerifyMutation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string>("");
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [sessionToken, setSessionToken] = useState("");

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) return;

    try {
      const result = await loginInit({
        email: formData.email,
        password: formData.password,
      }).unwrap() as LoginInitResponse;

      console.log('API Init Response:', result);

      if (result.session_token) {
        setSessionToken(result.session_token);
        setShow2FAModal(true);
        setIsCodeSent(true);
      } else {
        throw new Error("Missing session_token in response");
      }
    } catch (error: any) {
      console.error("Login init failed:", error);
      console.error("Error data:", error.data);

      if (error.status === 401) {
        setServerError("Invalid email or password");
      } else if (error.status === 429) {
        setServerError("Too many login attempts. Please try again later.");
      } else if (error.data?.detail) {
        setServerError(error.data.detail);
      } else if (error.data?.message) {
        setServerError(error.data.message);
      } else if (error.status === 404) {
        setServerError("API endpoint not found. Please check the server.");
      } else if (error.status >= 500) {
        setServerError("Server error. Please try again later.");
      } else {
        setServerError("Network error. Please check your connection and try again.");
      }
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔍 handle2FASubmit triggered");

    if (verificationCode.length !== 6 || !/^\d{6}$/.test(verificationCode)) {
      setServerError("Please enter a valid 6-digit code");
      console.log("❌ Invalid code format:", verificationCode);
      return;
    }

    setServerError("");
    console.log("✅ Valid code, sending to /verify...");

    try {
      const verifyParams: Verify2FAParams = {
        email: formData.email,
        otp: verificationCode,
        session_token: sessionToken,
      };

      console.log('📡 Verifying OTP with:', verifyParams);

      const result = await loginVerify(verifyParams).unwrap();

      console.log('✅ OTP Verification successful:', result);

      const adaptedResult: LoginResponseWith2FA = {
        user: result.user || { email: formData.email },
        token: result.access,
        requires2FA: false,
      };

      completeLogin(adaptedResult);
    } catch (error: any) {
      console.error("❌ OTP verification failed:", error);
      let errorMessage = "Verification failed. Please try again.";

      if (error.status === 401) {
        errorMessage = "Invalid verification code. Please try again.";
      } else if (error.data?.detail) {
        errorMessage = error.data.detail;
      } else if (error.data?.message) {
        errorMessage = error.data.message;
      } else if (error.status === 400) {
        errorMessage = "Invalid request. Please check your code and try again.";
      }

      setServerError(errorMessage);
      console.error("🚨 Final error message shown to user:", errorMessage);
    }
  };

  const completeLogin = (result: LoginResponseWith2FA) => {
    dispatch(setCredentials({
      user: result.user,
      token: result.token,
    }));

    document.cookie = `token=${result.token}; max-age=604800; path=/; SameSite=Strict${
      window.location.protocol === 'https:' ? '; Secure' : ''
    }`;

    setShow2FAModal(false);
    onSuccess();
    navigate("/dashboard");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError("");
    }
  };

  const resendCode = async () => {
    setServerError("");
    try {
      const result = await loginInit({
        email: formData.email,
        password: formData.password,
      }).unwrap() as LoginInitResponse;

      if (result.session_token) {
        setSessionToken(result.session_token);
        console.log('OTP code resent to:', formData.email);
      } else {
        throw new Error("No session token in resend response");
      }
    } catch (error: any) {
      console.error("Resend code failed:", error);
      setServerError("Failed to resend code. Please try again.");
    }
  };

  return (
    <>
      <div className="login-form">
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-fields">
          {serverError && !show2FAModal && (
            <div className="error-message mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{serverError}</p>
            </div>
          )}

          <div className="input-group">
            <Label htmlFor="email" className="input-label">
              Email Address
            </Label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className={cn("login-input", errors.email && "border-red-500/50")}
              disabled={isLoading || isCodeSent}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </div>

          <div className="input-group">
            <Label htmlFor="password" className="input-label">
              Password
            </Label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className={cn("login-input", errors.password && "border-red-500/50")}
              disabled={isLoading || isCodeSent}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" disabled={isLoading} />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            className="login-button"
            disabled={isLoading || isCodeSent}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </span>
            ) : isCodeSent ? (
              'Waiting for Verification...'
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Demo Accounts</span>
          </div>
        </div>

        <div className="space-y-3">
          <DemoAccountButton
            role="Admin"
            email="admin@timemanager.com"
            password="admin123"
            onClick={() => {
              setFormData({ email: "admin@timemanager.com", password: "admin123" });
              setErrors({});
              setServerError("");
            }}
            color="purple"
            disabled={isLoading || isCodeSent}
          />
          <DemoAccountButton
            role="Manager"
            email="manager@timemanager.com"
            password="manager123"
            onClick={() => {
              setFormData({ email: "manager@timemanager.com", password: "manager123" });
              setErrors({});
              setServerError("");
            }}
            color="blue"
            disabled={isLoading || isCodeSent}
          />
          <DemoAccountButton
            role="Employee"
            email="employee@timemanager.com"
            password="employee123"
            onClick={() => {
              setFormData({ email: "employee@timemanager.com", password: "employee123" });
              setErrors({});
              setServerError("");
            }}
            color="gray"
            disabled={isLoading || isCodeSent}
          />
        </div>
      </div>

      <Dialog open={show2FAModal} onOpenChange={setShow2FAModal}>
        <DialogContent className="twofa-modal">
          <DialogHeader>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
          </DialogHeader>

          <div className="twofa-content">
            <div className="twofa-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <p className="twofa-description">
              We've sent a 6-digit verification code to your email:
            </p>
            <p className="twofa-email font-medium text-gray-700 dark:text-gray-300">{formData.email}</p>

            {serverError && (
              <div className="error-message mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm text-center">{serverError}</p>
              </div>
            )}

            <form onSubmit={handle2FASubmit} className="twofa-form mt-6">
              <label htmlFor="otp-input" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                Enter verification code
              </label>

              <div className="flex justify-center space-x-2 sm:space-x-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    id={index === 0 ? "otp-input" : `otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={verificationCode[index] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d?$/.test(val)) {
                        const newCode = verificationCode.split("");
                        newCode[index] = val;
                        setVerificationCode(newCode.join(""));
                        if (val && index < 5) {
                          const next = document.getElementById(`otp-${index + 1}`);
                          next?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
                        const prev = document.getElementById(`otp-${index - 1}`);
                        prev?.focus();
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    className={cn(
                      "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border-2 rounded-lg transition-all",
                      "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600",
                      "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                      serverError && "border-red-500 dark:border-red-500"
                    )}
                    aria-label={`Digit ${index + 1} of 6`}
                  />
                ))}
              </div>

              <div className="twofa-actions mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resendCode}
                  disabled={isVerifying}
                  className="flex-1"
                >
                  Resend Code
                </Button>
                <Button
                  type="submit"
                  disabled={verificationCode.length !== 6 || isVerifying}
                  className="flex-1"
                >
                  {isVerifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </span>
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const LandingPage = () => {
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<TimeOption | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { user, token } = useAppSelector((state) => state.auth);
  const isLoggedIn = !!(user && token);

  const handleTimeSubmit = () => {
    console.log('Option sélectionnée:', selectedOption);
    setIsTimeModalOpen(false);
    setSelectedOption(null);
  };

  const handleCheckboxChange = (option: TimeOption) => (checked: boolean) => {
    if (checked) {
      setSelectedOption(option);
    } else if (selectedOption === option) {
      setSelectedOption(null);
    }
  };

  const handleAnimationComplete = () => {
    console.log('Text animation completed!');
  };

  return (
    <div className="landing-container">
      <div
        className="animated-background"
        style={{
          '--color-1': '#ff6b6b',
          '--color-2': '#4ecdc4',
          '--color-3': '#45b7d1',
          '--color-4': '#96ceb4',
          '--color-5': '#feca57'
        } as React.CSSProperties}
      >
        <div className="bg-shape shape-1"></div>
        <div className="bg-shape shape-2"></div>
        <div className="bg-shape shape-3"></div>
        <div className="bg-shape shape-4"></div>
        <div className="bg-shape shape-5"></div>
      </div>

      <header className="header">
        <div className="logo-section">
          <h2 className="site-name gradient-text">Time Manager</h2>
        </div>

        <nav className="nav-section">
          {isLoggedIn && (
            <a href="/dashboard" className="nav-link gradient-link">Dashboard</a>
          )}

          <a
            href="#"
            className="nav-link gradient-link"
            onClick={(e) => {
              e.preventDefault();
              setIsLoginModalOpen(true);
            }}
          >
            Login
          </a>
        </nav>
      </header>

      <main className="main-content">
        <div className="content-center">
          <div className="text-section">
            <div className="title-container">
              <BlurText
                text="Simplify Your Time Tracking"
                delay={100}
                animateBy="words"
                direction="top"
                onAnimationComplete={handleAnimationComplete}
                className="main-title"
              />
            </div>

            {isLoggedIn && (
              <button
                className="cta-button-wow"
                onClick={() => setIsTimeModalOpen(true)}
              >
                <span className="button-text">Track Time</span>
                <span className="button-sparkle">✨</span>
                <span className="button-glow"></span>
                <span className="button-shine"></span>
                <span className="button-particles">
                  <span className="particle"></span>
                  <span className="particle"></span>
                  <span className="particle"></span>
                  <span className="particle"></span>
                  <span className="particle"></span>
                </span>
              </button>
            )}
          </div>

          <div className="video-section">
            <video
              ref={videoRef}
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/Animation_du_logo.mp4" type="video/mp4" />
              <source src="/Animation_du_logo.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </main>

      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="login-modal">
          <LoginForm onSuccess={() => setIsLoginModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isTimeModalOpen} onOpenChange={setIsTimeModalOpen}>
        <DialogContent className="time-modal">
          <DialogHeader>
            <DialogTitle>Time Entry</DialogTitle>
          </DialogHeader>

          <div className="checkbox-group">
            <div className="checkbox-item">
              <Checkbox
                id="arrival"
                checked={selectedOption === 'arrival'}
                onCheckedChange={handleCheckboxChange('arrival')}
              />
              <Label htmlFor="arrival" className="checkbox-label">
                Arrival Time
              </Label>
            </div>

            <div className="checkbox-item">
              <Checkbox
                id="departure"
                checked={selectedOption === 'departure'}
                onCheckedChange={handleCheckboxChange('departure')}
              />
              <Label htmlFor="departure" className="checkbox-label">
                Departure Time
              </Label>
            </div>
          </div>

          <div className="modal-actions">
            <Button
              variant="outline"
              onClick={() => setIsTimeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTimeSubmit}
              disabled={!selectedOption}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPage;