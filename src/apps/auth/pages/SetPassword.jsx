import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { authValidateInvite, authSetPassword } from "../../../services/api";

const TOKENS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap');

  .bm-setpw {
    --navy: #071B33;
    --ocean: #0A4F83;
    --marine: #14669E;
    --cobalt: #0B82C9;
    --sky: #7FC3E8;
    --sky-2: #A9D8F0;
    --teal: #2E9E9B;
    --teal-light: #6FC9C4;
    --on-dark: #F2F7FA;
    --on-dark-2: rgba(233,242,247,.68);
    --on-dark-3: rgba(233,242,247,.46);
    --line-dark: rgba(160,210,240,.18);

    --font-sans: 'Instrument Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;
    --font-serif: 'Instrument Serif', ui-serif, Georgia, serif;

    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(2rem, 6vw, 4rem) 1.25rem;
    font-family: var(--font-sans);
    color: var(--on-dark);
    background:
      radial-gradient(90% 60% at 78% 6%, #17587F 0%, transparent 58%),
      radial-gradient(95% 70% at 10% 100%, #0A4F83 0%, transparent 62%),
      linear-gradient(172deg, #05192E 0%, #072744 44%, #08395F 100%);
    overflow: hidden;
  }

  .bm-setpw *, .bm-setpw *::before, .bm-setpw *::after { box-sizing: border-box; }
  .bm-setpw form { display: block; gap: unset; text-align: unset; }
  .bm-setpw input {
    all: unset;
    box-sizing: border-box;
    font-family: var(--font-sans);
  }

  .bm-setpw__grid {
    position: absolute; inset: -10%; z-index: 0; pointer-events: none;
    background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
    background-size: 70px 70px;
    mask-image: radial-gradient(65% 55% at 50% 40%, #000 0%, transparent 75%);
    -webkit-mask-image: radial-gradient(65% 55% at 50% 40%, #000 0%, transparent 75%);
  }

  .bm-setpw__card {
    position: relative; z-index: 2; width: 100%; max-width: 480px;
    border: 1px solid var(--line-dark); border-radius: 16px;
    background: linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.02));
    backdrop-filter: blur(18px) saturate(1.3);
    padding: clamp(2rem, 3.5vw, 2.75rem);
    box-shadow: 0 40px 80px -30px rgba(3,12,22,.65);
  }

  .bm-setpw__logo { display: inline-flex; align-items: center; gap: .55rem; font-size: .95rem; font-weight: 600; letter-spacing: -.02em; color: var(--on-dark); margin-bottom: 1.75rem; text-decoration: none; }

  .bm-setpw__card h1 { margin: 0; font-size: clamp(1.6rem, 1.3rem + 1vw, 1.9rem); font-weight: 500; letter-spacing: -.03em; line-height: 1.1; color: #ffffff; }
  .bm-setpw__card h1 .serif { font-family: var(--font-serif); font-style: italic; font-weight: 400; color: #ffffff; }
  .bm-setpw__sub { margin: .55rem 0 0; font-size: .92rem; color: var(--on-dark-2); }

  .bm-field { position: relative; margin-top: 1.25rem; }
  .bm-field__icon { position: absolute; left: .95rem; top: 50%; transform: translateY(-50%); color: var(--on-dark-3); pointer-events: none; z-index: 1; }
  .bm-field input {
    display: block; width: 100%; padding: .85rem 2.8rem .85rem 2.55rem; border-radius: 10px;
    background: rgba(4,18,31,.55) !important; border: 1px solid var(--line-dark) !important; color: var(--on-dark) !important;
    font-size: .92rem; font-family: var(--font-sans); transition: border-color .2s ease, background .2s ease;
    min-height: unset !important;
  }
  .bm-field input::placeholder { color: var(--on-dark-3) !important; }
  .bm-field input:focus { outline: none !important; border-color: var(--cobalt) !important; background: rgba(4,18,31,.75) !important; box-shadow: 0 0 0 3px rgba(11,130,201,.18) !important; }
  .bm-field__toggle {
    position: absolute !important; right: .7rem; top: 50%; transform: translateY(-50%);
    background: none !important; border: none !important; color: var(--on-dark-3) !important;
    cursor: pointer; padding: .3rem; display: grid !important; place-items: center;
    transition: color .2s ease; line-height: 0;
  }
  .bm-field__toggle:hover { color: var(--on-dark) !important; }

  button.bm-setpw__btn {
    margin-top: 1.4rem;
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    gap: .55rem;
    padding: .9rem 1.5rem;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    font-family: var(--font-sans);
    font-size: .88rem;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: #04121F;
    background: linear-gradient(135deg, var(--teal-light), var(--teal));
    box-shadow: 0 18px 36px -14px rgba(46,158,155,.55);
    transition: transform .2s ease, box-shadow .2s ease, opacity .2s ease;
    line-height: 1;
    box-sizing: border-box;
  }
  button.bm-setpw__btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 22px 40px -14px rgba(46,158,155,.65); }
  button.bm-setpw__btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .bm-setpw__spinner {
    width: 16px; height: 16px; border: 2px solid rgba(4,18,31,.3); border-top-color: #04121F;
    border-radius: 50%; animation: bspwSpin .65s linear infinite; flex-shrink: 0;
  }
  @keyframes bspwSpin { to { transform: rotate(360deg); } }

  .bm-setpw__error {
    margin-top: 1rem; padding: .65rem .9rem; border-radius: 8px;
    background: rgba(239,68,68,.12); border: 1px solid rgba(239,68,68,.25);
    color: #fca5a5; font-size: .85rem; line-height: 1.4;
  }
  .bm-setpw__notice {
    margin-top: 1rem; padding: .8rem .95rem; border-radius: 10px;
    background: rgba(45,212,191,.10); border: 1px solid rgba(45,212,191,.22);
    color: #c8fff8; font-size: .88rem; line-height: 1.45;
  }

  .bm-setpw__foot { margin-top: 1.35rem; text-align: center; font-size: .88rem; color: var(--on-dark-2); }
  .bm-setpw__foot a { color: var(--sky-2); font-weight: 500; text-decoration: none; }
  .bm-setpw__foot a:hover { color: #fff; }

  @media (prefers-reduced-motion: reduce) {
    .bm-setpw__spinner { animation: none; }
  }
`;

function Logo() {
  return (
    <Link to="/login" className="bm-setpw__logo" aria-label="BlueMind login">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2.9 9.6h18.2M2.9 14.4h18.2" stroke="currentColor" strokeWidth="1.1" opacity=".55" />
        <path
          d="M12 2.75c2.6 2.6 3.9 5.7 3.9 9.25S14.6 18.65 12 21.25c-2.6-2.6-3.9-5.7-3.9-9.25S9.4 5.35 12 2.75Z"
          stroke="currentColor"
          strokeWidth="1.1"
          opacity=".55"
        />
      </svg>
      Bluemind
    </Link>
  );
}

export default function SetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function checkToken() {
      if (!token) {
        setTokenError("This invite link is invalid or has expired.");
        setChecking(false);
        return;
      }
      try {
        const data = await authValidateInvite(token);
        if (cancelled) return;
        if (data.ok) {
          setTokenValid(true);
          setEmail(data.email || "");
        } else {
          setTokenError(data.message || "This invite link is invalid or has expired.");
        }
      } catch {
        if (!cancelled) setTokenError("Network error. Please try again.");
      } finally {
        if (!cancelled) setChecking(false);
      }
    }
    checkToken();
    return () => { cancelled = true; };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Please use at least 8 characters for your password.");
      return;
    }

    setLoading(true);
    try {
      const data = await authSetPassword(token, password, confirmPassword);
      if (data.ok) {
        navigate("/login", {
          replace: true,
          state: { flashMessage: "Password set successfully. Please sign in." },
        });
      } else {
        setError(data.message || "Unable to set password.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bm-setpw">
      <style>{TOKENS}</style>
      <div className="bm-setpw__grid" aria-hidden="true" />

      <div className="bm-setpw__card">
        <Logo />

        {checking ? (
          <>
            <h1>Checking your <span className="serif">invite…</span></h1>
            <p className="bm-setpw__sub">One moment while we verify your invite link.</p>
          </>
        ) : !tokenValid ? (
          <>
            <h1>Invite link <span className="serif">unavailable.</span></h1>
            <p className="bm-setpw__sub">{tokenError}</p>
            <div className="bm-setpw__foot">
              <Link to="/login">Back to login</Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <h1>Set your <span className="serif">password.</span></h1>
            <p className="bm-setpw__sub">
              {email ? <>You're setting a password for <strong>{email}</strong>.</> : "Choose a password for your admin account."}
            </p>

            {error && <div className="bm-setpw__error">{error}</div>}

            <div className="bm-field">
              <Lock className="bm-field__icon" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="bm-field__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="bm-field">
              <Lock className="bm-field__icon" size={16} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="bm-field__toggle"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button className="bm-setpw__btn" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="bm-setpw__spinner" />
                  Setting password…
                </>
              ) : (
                <>
                  Set password <ArrowRight size={15} />
                </>
              )}
            </button>

            <div className="bm-setpw__foot">
              <Link to="/login">Back to login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
