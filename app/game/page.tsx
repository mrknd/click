"use client";

import { useEffect, useState } from "react";

const TOTAL_PLAYERS = 10_000;
const ALIVE_PLAYERS = 10_000;
const ENTRY_FEE = 5;
const WINNERS_COUNT = 50;

export default function GamePage() {
  const [username, setUsername] = useState("GUEST");
  const [clickedToday, setClickedToday] = useState(false);
  const [lastClick, setLastClick] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const now = Date.now();

    const savedPlayer = localStorage.getItem("one-click-player");
    const savedLastClick = localStorage.getItem("one-click-last-click");

    if (savedPlayer) {
      try {
        const player = JSON.parse(savedPlayer);

        if (
          typeof player.username === "string" &&
          player.username.trim().length > 0
        ) {
          setUsername(player.username.trim());
        }
      } catch {
        setUsername("GUEST");
      }
    }

    if (savedLastClick) {
      const parsedLastClick = Number(savedLastClick);

      if (!Number.isNaN(parsedLastClick)) {
        setLastClick(parsedLastClick);
        setClickedToday(isSameUtcDay(parsedLastClick, now));
      }
    }

    setCurrentTime(now);
    setMounted(true);

    const timer = window.setInterval(() => {
      const nextTime = Date.now();

      setCurrentTime(nextTime);

      setLastClick((storedClick) => {
        if (storedClick !== null) {
          setClickedToday(isSameUtcDay(storedClick, nextTime));
        }

        return storedClick;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  function handlePress() {
    if (clickedToday) {
      return;
    }

    const clickedAt = Date.now();

    localStorage.setItem(
      "one-click-last-click",
      clickedAt.toString(),
    );

    setLastClick(clickedAt);
    setCurrentTime(clickedAt);
    setClickedToday(true);
  }

  const timeLeft = currentTime
    ? getTimeUntilUtcReset(currentTime)
    : 0;

  const progress = currentTime
    ? Math.max(
        0,
        Math.min(100, (timeLeft / 86_400_000) * 100),
      )
    : 100;

  const eliminatedPlayers =
    TOTAL_PLAYERS - ALIVE_PLAYERS;

  const prizePool =
    TOTAL_PLAYERS * ENTRY_FEE;

  if (!mounted) {
    return (
      <main className="game-loading">
        <p>LOADING SURVIVAL DATA...</p>
      </main>
    );
  }

  return (
    <main className="game-page">
      <div className="game-cabinet">
        <div className="game-frame">
          <span className="frame-corner frame-corner-tl" />
          <span className="frame-corner frame-corner-tr" />
          <span className="frame-corner frame-corner-bl" />
          <span className="frame-corner frame-corner-br" />

          <section className="game-top">
            <p className="pool-label">
              TOTAL POOL
            </p>

            <div className="pool-row">
              <img
                src="/game/coin.png"
                alt=""
                aria-hidden="true"
                width={48}
                height={48}
                className="pool-coin"
              />

              <p className="pool-value">
                ${formatCompactMoney(prizePool)}
              </p>
            </div>

            <p className="pool-caption">
              LAST {WINNERS_COUNT} SURVIVORS SPLIT THE POOL
            </p>

            <div className="players-row">
              <div className="player-counter player-counter-alive">
                <p className="counter-label">
                  ALIVE
                </p>

                <div className="counter-value-row">
                  <span
                    aria-hidden="true"
                    className="alive-icon"
                  >
                    ♟
                  </span>

                  <span className="counter-value">
                    {ALIVE_PLAYERS.toLocaleString("en-US")}
                  </span>
                </div>
              </div>

              <div className="player-counter player-counter-dead">
                <p className="counter-label">
                  DEAD
                </p>

                <div className="counter-value-row">
                  <img
                    src="/game/skull.png"
                    alt=""
                    aria-hidden="true"
                    width={48}
                    height={48}
                    className="dead-icon"
                  />

                  <span className="counter-value">
                    {eliminatedPlayers.toLocaleString("en-US")}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="game-world">
            <div
              aria-hidden="true"
              className="world-shade"
            />

            <p className="player-name">
              PLAYER: {username.toUpperCase()}
            </p>

            <div className="knight-stage">
              <div
                aria-hidden="true"
                className="knight-glow"
              />

              <img
                src={
                  clickedToday
                    ? "/game/knight-saved.png"
                    : "/game/knight-idle.png"
                }
                alt={
                  clickedToday
                    ? "Knight survived today"
                    : "Knight waiting for today's click"
                }
                width={96}
                height={96}
                className="knight-image"
              />
            </div>

            <button
              type="button"
              onClick={handlePress}
              disabled={clickedToday}
              className={
                clickedToday
                  ? "survive-button survive-button-saved"
                  : "survive-button survive-button-danger"
              }
            >
              <span className="survive-main">
                {clickedToday
                  ? "CLICK SAVED"
                  : "PRESS TO SURVIVE"}
              </span>

              {!clickedToday && (
  <span
    aria-hidden="true"
    className="survive-icon"
  >
  </span>
)}

              <span className="survive-sub">
                {clickedToday
                  ? "RETURN AFTER UTC RESET"
                  : "ONE CLICK REMAINS"}
              </span>
            </button>

            <div className="timer-panel">
              <p className="timer-label">
                TIME LEFT TODAY
              </p>

              <p className="timer-value">
                {formatTime(timeLeft)}
              </p>
            </div>

            <div className="progress-section">
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="progress-meta">
                <span>REMAINING TODAY</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            <div className="status-row">
              <div>
                <span className="status-label">
                  STATUS
                </span>

                <strong
                  className={
                    clickedToday
                      ? "status-safe"
                      : "status-danger"
                  }
                >
                  {clickedToday
                    ? "SAFE TODAY"
                    : "ACTION REQUIRED"}
                </strong>
              </div>

              <div>
                <span className="status-label">
                  LAST CLICK
                </span>

                <strong>
                  {formatLastClick(
                    lastClick,
                    currentTime,
                  )}
                </strong>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function isSameUtcDay(
  firstTimestamp: number,
  secondTimestamp: number,
) {
  const first = new Date(firstTimestamp);
  const second = new Date(secondTimestamp);

  return (
    first.getUTCFullYear() ===
      second.getUTCFullYear() &&
    first.getUTCMonth() ===
      second.getUTCMonth() &&
    first.getUTCDate() ===
      second.getUTCDate()
  );
}

function getTimeUntilUtcReset(
  timestamp: number,
) {
  const now = new Date(timestamp);

  const nextReset = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0,
    0,
    0,
    0,
  );

  return Math.max(
    0,
    nextReset - timestamp,
  );
}

function formatTime(
  milliseconds: number,
) {
  const totalSeconds = Math.floor(
    milliseconds / 1000,
  );

  const hours = Math.floor(
    totalSeconds / 3600,
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds =
    totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) =>
      value.toString().padStart(2, "0"),
    )
    .join(":");
}

function formatLastClick(
  timestamp: number | null,
  currentTime: number | null,
) {
  if (!timestamp || !currentTime) {
    return "NEVER";
  }

  const difference = Math.max(
    0,
    currentTime - timestamp,
  );

  const seconds = Math.floor(
    difference / 1000,
  );

  const minutes = Math.floor(
    seconds / 60,
  );

  const hours = Math.floor(
    minutes / 60,
  );

  if (seconds < 10) {
    return "JUST NOW";
  }

  if (minutes < 1) {
    return `${seconds} SEC AGO`;
  }

  if (minutes < 60) {
    return `${minutes} MIN AGO`;
  }

  return `${hours} H AGO`;
}

function formatCompactMoney(
  value: number,
) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }

  return value.toLocaleString("en-US");
}