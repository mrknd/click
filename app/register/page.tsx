"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  function handleSocialLogin(
  provider: "google" | "telegram" | "discord",
) {
  setError(
    `${provider.toUpperCase()} LOGIN WILL BE CONNECTED LATER`,
  );
}

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (cleanUsername.length < 3) {
      setError("USERNAME MUST HAVE AT LEAST 3 CHARACTERS");
      return;
    }

    if (!cleanEmail.includes("@")) {
      setError("ENTER A VALID EMAIL");
      return;
    }

    if (password.length < 6) {
      setError("PASSWORD MUST HAVE AT LEAST 6 CHARACTERS");
      return;
    }

    if (!agree) {
      setError("YOU MUST ACCEPT THE GAME RULES");
      return;
    }

    setIsPaying(true);

    window.setTimeout(() => {
      const player = {
        username: cleanUsername,
        email: cleanEmail,
        registeredAt: Date.now(),
        entryFee: 5,
        paid: true,
      };

      localStorage.setItem(
        "one-click-player",
        JSON.stringify(player),
      );

      localStorage.removeItem("one-click-last-click");

      router.push("/game");
    }, 900);
  }

  return (
    <main className="register-page">
      <div className="register-cabinet">
        <div className="register-frame">
          <span className="frame-corner frame-corner-tl" />
          <span className="frame-corner frame-corner-tr" />
          <span className="frame-corner frame-corner-bl" />
          <span className="frame-corner frame-corner-br" />

          <section className="register-top">
            <p className="register-kicker">
              ENTER THE GAME
            </p>

            <h1 className="register-title">
              ONE CLICK
            </h1>

            <p className="register-subtitle">
              SURVIVE 365 DAYS
            </p>
          </section>

          <section className="register-world">
            <div
              aria-hidden="true"
              className="register-background"
            />

            <div
              aria-hidden="true"
              className="register-shade"
            />

            <div className="register-content">
              <div className="register-story-card">
                <p className="story-small">
                  AN ONLINE
                </p>

                <p className="story-title">
                  GAME OF SURVIVAL
                </p>

                <div className="story-rule">
                  <strong>PAY $5</strong>
                  <span>TO ENTER THE GAME</span>
                </div>

                <div className="story-rule">
                  <strong>CLICK DAILY</strong>
                  <span>FOR 365 UTC DAYS</span>
                </div>

                <div className="story-rule">
                  <strong>MISS ONE DAY</strong>
                  <span>AND YOU ARE ELIMINATED</span>
                </div>

                <div className="story-rule">
                  <strong>ALL SURVIVORS</strong>
                  <span>SPLIT THE FINAL POOL</span>
                </div>
              </div>
<div className="social-login">
  <p className="social-login-title">
    QUICK ENTRY
  </p>

  <div className="social-login-buttons">
    <button
      type="button"
      className="social-button"
      onClick={() => handleSocialLogin("google")}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="social-icon"
      >
        <path
          fill="currentColor"
          d="M21.35 12.2c0-.68-.06-1.18-.19-1.7H12v3.09h5.38a4.6 4.6 0 0 1-2 3.02l-.02.1 2.9 2.25.2.02c1.86-1.72 2.9-4.25 2.9-6.78Z"
        />
        <path
          fill="currentColor"
          d="M12 21.75c2.64 0 4.86-.87 6.48-2.77l-3.08-2.37c-.82.55-1.9.94-3.4.94a5.9 5.9 0 0 1-5.57-4.08l-.1.01-3.02 2.34-.04.09A9.78 9.78 0 0 0 12 21.75Z"
        />
        <path
          fill="currentColor"
          d="M6.43 13.47A6.04 6.04 0 0 1 6.1 11.5c0-.69.12-1.35.32-1.97l-.01-.13-3.05-2.37-.1.05A9.73 9.73 0 0 0 2.22 11.5c0 1.59.38 3.1 1.05 4.42l3.16-2.45Z"
        />
        <path
          fill="currentColor"
          d="M12 5.45c1.84 0 3.08.8 3.8 1.46l2.74-2.68C16.86 2.66 14.64 1.25 12 1.25a9.78 9.78 0 0 0-8.73 5.83l3.15 2.45A5.93 5.93 0 0 1 12 5.45Z"
        />
      </svg>

      <span>GOOGLE</span>
    </button>

    <button
      type="button"
      className="social-button"
      onClick={() => handleSocialLogin("telegram")}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="social-icon"
      >
        <path
          fill="currentColor"
          d="M21.7 3.4 18.5 20c-.24 1.17-.88 1.46-1.78.91l-4.87-3.59-2.35 2.26c-.26.26-.48.48-.98.48l.35-4.96 9.03-8.16c.39-.35-.09-.55-.61-.2L6.13 13.77 1.32 12.27c-1.05-.33-1.07-1.05.22-1.55L20.37 3.46c.87-.32 1.63.2 1.33-.06Z"
        />
      </svg>

      <span>TELEGRAM</span>
    </button>

    <button
      type="button"
      className="social-button"
      onClick={() => handleSocialLogin("discord")}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="social-icon"
      >
        <path
          fill="currentColor"
          d="M19.5 5.34A17.2 17.2 0 0 0 15.36 4l-.51 1.05a15.1 15.1 0 0 0-5.68 0L8.64 4A17.5 17.5 0 0 0 4.5 5.35C1.88 9.2 1.17 12.96 1.53 16.67a16.7 16.7 0 0 0 5.08 2.57l1.23-1.68a10.7 10.7 0 0 1-1.93-.93l.47-.36a12.3 12.3 0 0 0 11.24 0l.48.36c-.62.37-1.27.69-1.94.93l1.23 1.68a16.6 16.6 0 0 0 5.08-2.57c.42-4.3-.72-8.03-2.97-11.33ZM8.2 14.42c-1 0-1.82-.91-1.82-2.02 0-1.12.8-2.03 1.82-2.03 1.03 0 1.84.92 1.82 2.03 0 1.11-.8 2.02-1.82 2.02Zm7.6 0c-1 0-1.82-.91-1.82-2.02 0-1.12.8-2.03 1.82-2.03 1.03 0 1.84.92 1.82 2.03 0 1.11-.79 2.02-1.82 2.02Z"
        />
      </svg>

      <span>DISCORD</span>
    </button>
  </div>

  <div className="register-divider">
    <span>OR CREATE ACCOUNT</span>
  </div>
</div>
              <form
                className="register-form"
                onSubmit={handleSubmit}
              >
                <label className="pixel-field">
                  <span className="pixel-field-label">
                    USERNAME
                  </span>

                  <input
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    placeholder="YOUR NAME"
                    maxLength={18}
                    autoComplete="username"
                  />
                </label>

                <label className="pixel-field">
                  <span className="pixel-field-label">
                    EMAIL
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="YOU@EMAIL.COM"
                    autoComplete="email"
                  />
                </label>

                <label className="pixel-field">
                  <span className="pixel-field-label">
                    PASSWORD
                  </span>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="MINIMUM 6 CHARACTERS"
                    autoComplete="new-password"
                  />
                </label>

                <label className="register-agreement">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(event) =>
                      setAgree(event.target.checked)
                    }
                  />

                  <span className="custom-checkbox">
                    {agree ? "X" : ""}
                  </span>

                  <span>
                    I UNDERSTAND THAT MISSING ONE UTC DAY
                    MEANS PERMANENT ELIMINATION
                  </span>
                </label>

                {error && (
                  <p className="register-error">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isPaying}
                  className="register-submit"
                >
                  <span className="register-submit-main">
                    {isPaying
                      ? "PROCESSING..."
                      : "PAY $5 & ENTER"}
                  </span>

                </button>
              </form>

              <p className="register-footer-text">
                THE GAME BEGINS AFTER PAYMENT
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}