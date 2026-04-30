import { useState, useEffect, useRef, useId } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Divider, CircularProgress, Alert } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PhoneIcon from "@mui/icons-material/Phone";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  auth,
  googleProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "../firebase";

// ── Digit OTP box component ───────────────────────────────────────────────────
const OtpInput = ({ value, onChange }) => {
  const digits = 6;
  const refs = useRef([]);

  const handleKey = (e, idx) => {
    if (e.key === "Backspace") {
      if (value[idx]) {
        const next = value.split("");
        next[idx] = "";
        onChange(next.join(""));
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus();
      }
    }
  };

  const handleChange = (e, idx) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const next = value.split("");
    next[idx] = char;
    onChange(next.join(""));
    if (char && idx < digits - 1) refs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, digits);
    onChange(pasted.padEnd(digits, "").slice(0, digits));
    refs.current[Math.min(pasted.length, digits - 1)]?.focus();
    e.preventDefault();
  };

  return (
    <Box sx={{ display: "flex", gap: 1.2, justifyContent: "center" }}>
      {Array.from({ length: digits }).map((_, i) => (
        <Box
          key={i}
          component="input"
          inputMode="numeric"
          maxLength={1}
          ref={(el) => (refs.current[i] = el)}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          sx={{
            width: 46,
            height: 56,
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: 700,
            fontFamily: "Inter, sans-serif",
            background: "rgba(255,255,255,0.04)",
            border: "1.5px solid",
            borderColor: value[i] ? "#d4956a" : "rgba(255,255,255,0.12)",
            borderRadius: "12px",
            color: "#fff",
            outline: "none",
            caretColor: "#d4956a",
            transition: "border-color 0.2s, box-shadow 0.2s",
            "&:focus": {
              borderColor: "#d4956a",
              boxShadow: "0 0 0 3px rgba(212,149,106,0.2)",
            },
          }}
        />
      ))}
    </Box>
  );
};

// ── Main Login Page ──────────────────────────────────────────────────────────
const LoginPage = () => {
  const navigate = useNavigate();
  const recaptchaContainerId = useId().replace(/:/g, "_");

  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const recaptchaRef = useRef(null);
  const timerRef = useRef(null);

  // Clean up timer on unmount
  useEffect(() => () => clearInterval(timerRef.current), []);

  const startResendTimer = () => {
    setResendTimer(60);
    timerRef.current = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const initRecaptcha = () => {
    if (recaptchaRef.current) return recaptchaRef.current;
    const verifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: "invisible",
      callback: () => {},
    });
    recaptchaRef.current = verifier;
    return verifier;
  };

  const handleSendOtp = async () => {
    // Remove all spaces and dashes so "+91 98765 43210" becomes "+919876543210"
    const normalized = phone.trim().replace(/[\s-]/g, "");
    
    if (!normalized.match(/^\+[1-9]\d{6,14}$/)) {
      setError("Enter a valid phone number with country code (e.g. +91 98765 43210)");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const verifier = initRecaptcha();
      const result = await signInWithPhoneNumber(auth, normalized, verifier);
      setConfirmationResult(result);
      setStep("otp");
      startResendTimer();
    } catch (err) {
      setError(err.message || "Failed to send OTP. Try again.");
      // Reset reCAPTCHA so it can be used again
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) { setError("Enter the complete 6-digit OTP"); return; }
    setError("");
    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      navigate("/", { replace: true });
    } catch {
      setError("Incorrect OTP. Please try again.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp("");
    setError("");
    if (recaptchaRef.current) {
      recaptchaRef.current.clear();
      recaptchaRef.current = null;
    }
    await handleSendOtp();
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Google sign-in failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Shared card style ──────────────────────────────────────────────────────
  const cardSx = {
    width: "100%",
    maxWidth: 420,
    bgcolor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    p: { xs: 3, sm: 4 },
    backdropFilter: "blur(20px)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0d0d0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        // Subtle radial gradient background
        background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,149,106,0.08) 0%, #0d0d0d 70%)",
      }}
    >
      {/* Invisible reCAPTCHA container (required by Firebase Phone Auth) */}
      <div id={recaptchaContainerId} />

      <Box sx={cardSx}>
        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: "16px",
              bgcolor: "rgba(212,149,106,0.12)",
              border: "1px solid rgba(212,149,106,0.25)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              mb: 2,
              boxShadow: "0 0 24px rgba(212,149,106,0.2)",
            }}
          >
            <AutoAwesomeIcon sx={{ color: "#d4956a", fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight={700} color="#fff" letterSpacing={-0.5}>
            Kishanth AI
          </Typography>
          <Typography variant="body2" color="rgba(255,255,255,0.4)" mt={0.5}>
            {step === "phone" ? "Sign in to continue" : `Enter the OTP sent to ${phone}`}
          </Typography>
        </Box>

        {/* ── Error Alert ───────────────────────────────────────────────── */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5, borderRadius: "10px",
              bgcolor: "rgba(255,80,80,0.1)", color: "#ff8080",
              border: "1px solid rgba(255,80,80,0.2)",
              "& .MuiAlert-icon": { color: "#ff8080" },
              fontSize: "0.8125rem",
            }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* ═══ STEP 1: Phone Number ══════════════════════════════════════ */}
        {step === "phone" && (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="rgba(255,255,255,0.5)" fontWeight={600}
                sx={{ textTransform: "uppercase", letterSpacing: 1, fontSize: "0.7rem", mb: 0.75, display: "block" }}>
                Mobile Number
              </Typography>
              <TextField
                id="phone-input"
                fullWidth
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ color: "rgba(255,255,255,0.3)", mr: 1, fontSize: 18 }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(255,255,255,0.04)",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "0.9375rem",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.1)" },
                    "&:hover fieldset": { borderColor: "rgba(255,255,255,0.2)" },
                    "&.Mui-focused fieldset": { borderColor: "#d4956a", borderWidth: 1.5 },
                  },
                  "& input::placeholder": { color: "rgba(255,255,255,0.25)", opacity: 1 },
                }}
              />
              <Typography variant="caption" color="rgba(255,255,255,0.3)" sx={{ mt: 0.75, display: "block", fontSize: "0.72rem" }}>
                Include country code — e.g. +91 for India
              </Typography>
            </Box>

            <Button
              id="send-otp-btn"
              fullWidth
              onClick={handleSendOtp}
              disabled={loading}
              sx={{
                py: 1.4, borderRadius: "12px",
                background: "linear-gradient(135deg, #d4956a 0%, #c07a4f 100%)",
                color: "#fff", fontWeight: 700, fontSize: "0.9375rem",
                textTransform: "none", letterSpacing: 0.3,
                boxShadow: "0 4px 20px rgba(212,149,106,0.3)",
                "&:hover": { boxShadow: "0 6px 28px rgba(212,149,106,0.45)", opacity: 0.95 },
                "&:disabled": { opacity: 0.5 },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Send OTP"}
            </Button>

            {/* ── Divider ─────────────────────────────────────────────── */}
            <Box sx={{ display: "flex", alignItems: "center", my: 3, gap: 1.5 }}>
              <Divider sx={{ flexGrow: 1, borderColor: "rgba(255,255,255,0.08)" }} />
              <Typography variant="caption" color="rgba(255,255,255,0.3)" fontWeight={500}>
                or
              </Typography>
              <Divider sx={{ flexGrow: 1, borderColor: "rgba(255,255,255,0.08)" }} />
            </Box>

            {/* ── Google Button ────────────────────────────────────────── */}
            <Button
              id="google-signin-btn"
              fullWidth
              onClick={handleGoogle}
              disabled={loading}
              startIcon={<GoogleIcon />}
              sx={{
                py: 1.35, borderRadius: "12px",
                bgcolor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e0e0e0", fontWeight: 600, fontSize: "0.9rem",
                textTransform: "none",
                "&:hover": { bgcolor: "rgba(255,255,255,0.09)", borderColor: "rgba(255,255,255,0.18)" },
                "&:disabled": { opacity: 0.4 },
              }}
            >
              Continue with Google
            </Button>
          </>
        )}

        {/* ═══ STEP 2: OTP Verification ═════════════════════════════════ */}
        {step === "otp" && (
          <>
            <OtpInput value={otp} onChange={setOtp} />

            <Button
              id="verify-otp-btn"
              fullWidth
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 6}
              sx={{
                mt: 3, py: 1.4, borderRadius: "12px",
                background: "linear-gradient(135deg, #d4956a 0%, #c07a4f 100%)",
                color: "#fff", fontWeight: 700, fontSize: "0.9375rem",
                textTransform: "none",
                boxShadow: "0 4px 20px rgba(212,149,106,0.3)",
                "&:hover": { opacity: 0.95, boxShadow: "0 6px 28px rgba(212,149,106,0.45)" },
                "&:disabled": { opacity: 0.5 },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Verify OTP"}
            </Button>

            {/* ── Resend + Back ────────────────────────────────────────── */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2.5 }}>
              <Button
                id="back-btn"
                size="small" startIcon={<ArrowBackIcon sx={{ fontSize: 15 }} />}
                onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                sx={{ color: "rgba(255,255,255,0.4)", textTransform: "none", fontSize: "0.8125rem",
                  "&:hover": { color: "#fff", bgcolor: "transparent" } }}
              >
                Change number
              </Button>

              <Button
                id="resend-otp-btn"
                size="small" disabled={resendTimer > 0}
                onClick={handleResend}
                sx={{
                  color: resendTimer > 0 ? "rgba(255,255,255,0.25)" : "#d4956a",
                  textTransform: "none", fontSize: "0.8125rem",
                  "&:hover": { bgcolor: "transparent", color: "#e0a878" },
                  "&:disabled": { color: "rgba(255,255,255,0.25)" },
                }}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </Button>
            </Box>
          </>
        )}

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <Typography
          variant="caption"
          sx={{ display: "block", textAlign: "center", mt: 3.5,
            color: "rgba(255,255,255,0.2)", fontSize: "0.7rem", lineHeight: 1.6 }}
        >
          By continuing, you agree to our Terms of Service.
          <br />Powered by Firebase Authentication.
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
