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
              ONE CLICK
            </p>

            <h1 className="register-title">
              ENTER THE GAME
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

                  <span className="register-submit-sub">
                    {isPaying
                      ? "OPENING THE GATE"
                      : "365 DAYS. ONE CLICK PER DAY."}
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