import React, { useState } from "react";
import {
  Button,
  Callout,
  Card,
  Classes,
  Divider,
  Elevation,
  FormGroup,
  Icon,
  InputGroup,
  Intent,
} from "@blueprintjs/core";
import { useNavigate } from "react-router";
import { useAuth } from "../context/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"login" | "forgot" | "assistance">("login");

  const { login, demoLogin } = useAuth();

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await demoLogin();
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Demo login failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={Classes.DARK}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#161616",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Branding */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <Icon icon="satellite" size={36} intent={Intent.PRIMARY} />
          <h1
            style={{
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: 4,
              margin: "10px 0 4px",
              color: "#f4f4f4",
            }}
          >
            VANTAGE
          </h1>
          <p
            style={{ fontSize: 12, margin: 0, letterSpacing: 0.5, color: "#c6c6c6" }}
          >
            Campaign Operations Intelligence Platform
          </p>
        </div>

        <Card elevation={Elevation.ZERO} style={{ padding: 24, borderRadius: 0, border: "1px solid #393939", background: "#262626" }}>
          {view === "login" && (
            <form onSubmit={handleLogin}>
              {error && (
                <Callout intent={Intent.DANGER} icon="warning-sign" style={{ marginBottom: 16 }}>
                  {error}
                </Callout>
              )}

              <FormGroup label="Username" labelFor="login-username">
                <InputGroup
                  id="login-username"
                  leftIcon="user"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  autoFocus
                  large
                />
              </FormGroup>

              <FormGroup label="Password" labelFor="login-password">
                <InputGroup
                  id="login-password"
                  leftIcon="lock"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  rightElement={
                    <Button
                      icon={showPassword ? "eye-off" : "eye-open"}
                      minimal
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={-1}
                    />
                  }
                  large
                />
              </FormGroup>

              <Button
                type="submit"
                text="Sign In"
                intent={Intent.PRIMARY}
                fill
                large
                loading={loading}
                style={{ marginTop: 8 }}
              />

              <Button
                type="button"
                text="Demo Access"
                icon="play"
                fill
                large
                loading={loading}
                onClick={handleDemoLogin}
                style={{ marginTop: 8 }}
              />

              <Divider style={{ margin: "20px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  text="Forgot Password"
                  minimal
                  small
                  icon="key"
                  onClick={() => {
                    setError(null);
                    setView("forgot");
                  }}
                />
                <Button
                  text="Request Assistance"
                  minimal
                  small
                  icon="help"
                  onClick={() => {
                    setError(null);
                    setView("assistance");
                  }}
                />
              </div>
            </form>
          )}

          {view === "forgot" && <ForgotPasswordView onBack={() => setView("login")} />}
          {view === "assistance" && <AssistanceView onBack={() => setView("login")} />}
        </Card>

        <p
          style={{ textAlign: "center", fontSize: 12, marginTop: 20, letterSpacing: 0.3, color: "#6f6f6f" }}
        >
          &copy; {new Date().getFullYear()} Kampanya 360 &mdash; Authorized access only.
        </p>
      </div>
    </div>
  );
}

/* ── Forgot Password Sub-view ── */

function ForgotPasswordView({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div>
        <Callout intent={Intent.SUCCESS} icon="tick-circle" style={{ marginBottom: 16 }}>
          If an account matches <strong>{email}</strong>, a password reset link has been sent.
        </Callout>
        <Button text="Back to Sign In" icon="arrow-left" minimal onClick={onBack} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4 style={{ margin: "0 0 4px" }}>Reset Your Password</h4>
      <p className={Classes.TEXT_MUTED} style={{ fontSize: 13, marginBottom: 16 }}>
        Enter the email address associated with your account and we will send a reset link.
      </p>

      <FormGroup label="Email Address" labelFor="forgot-email">
        <InputGroup
          id="forgot-email"
          leftIcon="envelope"
          placeholder="you@organization.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
          autoFocus
          large
        />
      </FormGroup>

      <Button
        type="submit"
        text="Send Reset Link"
        intent={Intent.PRIMARY}
        fill
        large
        disabled={!email.trim()}
        style={{ marginTop: 4 }}
      />

      <Divider style={{ margin: "20px 0" }} />

      <Button text="Back to Sign In" icon="arrow-left" minimal small onClick={onBack} />
    </form>
  );
}

/* ── Request Assistance Sub-view ── */

function AssistanceView({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <h4 style={{ margin: "0 0 4px" }}>Login Assistance</h4>
      <p className={Classes.TEXT_MUTED} style={{ fontSize: 13, marginBottom: 16 }}>
        If you are unable to access your account, please contact your system administrator or use one of the options below.
      </p>

      <Callout icon="phone" style={{ marginBottom: 12 }}>
        <strong>IT Help Desk</strong>
        <br />
        Available Mon–Fri, 8:00 AM – 6:00 PM
        <br />
        <span className={Classes.TEXT_MUTED}>helpdesk@kampanya360.org</span>
      </Callout>

      <Callout icon="envelope" style={{ marginBottom: 12 }}>
        <strong>Email Support</strong>
        <br />
        <span className={Classes.TEXT_MUTED}>support@kampanya360.org</span>
      </Callout>

      <Callout icon="shield" intent={Intent.WARNING} style={{ marginBottom: 16 }}>
        If you suspect unauthorized access to your account, report it immediately to Security Operations.
      </Callout>

      <Button text="Back to Sign In" icon="arrow-left" minimal small onClick={onBack} />
    </div>
  );
}
