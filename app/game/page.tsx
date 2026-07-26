"use client";

import { useEffect, useRef, useState } from "react";

const INTRO_MESSAGES = [
  "CONNECTION ESTABLISHED.",
  "LISTEN CAREFULLY. YOU ONLY GET ONE CHANCE.",
  "PRESS THE BUTTON ONCE BEFORE EVERY UTC RESET.",
  "MISS A SINGLE DAY AND YOU ARE ELIMINATED FOREVER.",
  "NO RETRIES. NO REVIVES. NO EXCEPTIONS.",
  "WHEN ONLY 50 PLAYERS REMAIN, THE PRIZE POOL IS SPLIT EQUALLY.",
  "YOUR FIRST DAY STARTS NOW.",
];

export default function GamePage() {
  const [username, setUsername] = useState("GUEST");

  const [showIntro, setShowIntro] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [clickedToday, setClickedToday] = useState(false);
  const [lastClick, setLastClick] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const savedPlayer = localStorage.getItem("one-click-player");

    if (savedPlayer) {
      try {
        const player = JSON.parse(savedPlayer);

        if (player.username) {
          setUsername(player.username);
        }
      } catch {
        setUsername("GUEST");
      }
    }

    const savedLastClick = localStorage.getItem("one-click-last-click");

    if (savedLastClick) {
      const parsedClick = Number(savedLastClick);

      if (!Number.isNaN(parsedClick)) {
        setLastClick(parsedClick);
        setClickedToday(isSameUtcDay(parsedClick, Date.now()));
      }
    }

    setCurrentTime(Date.now());

    const timer = window.setInterval(() => {
      const now = Date.now();

      setCurrentTime(now);

      if (lastClick !== null) {
        setClickedToday(isSameUtcDay(lastClick, now));
      }
    }, 1000);

    const introSeen = localStorage.getItem("one-click-intro-seen");

    let animationFrameId: number | null = null;

    if (!introSeen) {
      animationFrameId = window.requestAnimationFrame(() => {
        setShowIntro(true);
      });
    }

    return () => {
      window.clearInterval(timer);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [lastClick]);

  useEffect(() => {
    if (!showIntro) {
      return;
    }

    const message = INTRO_MESSAGES[messageIndex];

    if (!message) {
      return;
    }

    if (typingTimerRef.current !== null) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    setDisplayedText("");
    setIsTyping(true);

    let characterIndex = 0;

    typingTimerRef.current = window.setInterval(() => {
      characterIndex += 1;

      setDisplayedText(message.slice(0, characterIndex));

      if (characterIndex >= message.length) {
        if (typingTimerRef.current !== null) {
          window.clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }

        setIsTyping(false);
      }
    }, 40);

    return () => {
      if (typingTimerRef.current !== null) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [showIntro, messageIndex]);

  function handlePress() {
    if (clickedToday) {
      return;
    }

    const clickedAt = Date.now();

    setLastClick(clickedAt);
    setCurrentTime(clickedAt);
    setClickedToday(true);

    localStorage.setItem("one-click-last-click", clickedAt.toString());
  }

  function finishCurrentTyping() {
    const message = INTRO_MESSAGES[messageIndex];

    if (!message) {
      return;
    }

    if (typingTimerRef.current !== null) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    setDisplayedText(message);
    setIsTyping(false);
  }

  function handlePreviousMessage() {
    if (messageIndex === 0) {
      return;
    }

    if (typingTimerRef.current !== null) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    setMessageIndex((currentIndex) => currentIndex - 1);
  }

  function handleNextMessage() {
    if (isTyping) {
      finishCurrentTyping();
      return;
    }

    if (messageIndex < INTRO_MESSAGES.length - 1) {
      setMessageIndex((currentIndex) => currentIndex + 1);
    }
  }

  function closeIntro() {
    if (typingTimerRef.current !== null) {
      window.clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    localStorage.setItem("one-click-intro-seen", "true");

    setShowIntro(false);
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

  const isLastIntroMessage =
    messageIndex === INTRO_MESSAGES.length - 1;

  return (
    <main className="min-h-screen bg-black p-2 text-[#8cff00] lg:h-screen lg:overflow-hidden">
      <div className="mx-auto flex min-h-[calc(100vh-16px)] max-w-[1500px] flex-col border border-[#8cff00] p-2 lg:h-[calc(100vh-16px)]">
        <header className="flex items-center justify-between border-b border-[#8cff00] pb-2 text-[8px] sm:text-[10px]">
          <span>ONE CLICK v1.0</span>

          <span>USER: {username.toUpperCase()}</span>
        </header>

        <section className="flex flex-1 flex-col py-3 lg:min-h-0">
          <div className="text-center">
            <h1
              data-text="ONE CLICK"
              className="
                crt-title
                text-3xl
                font-black
                tracking-[-0.05em]
                sm:text-5xl
              "
            >
              ONE CLICK
            </h1>

            <p
              className="
                crt-subtitle
                mt-2
                text-[8px]
                uppercase
                tracking-[0.12em]
                sm:text-[9px]
              "
            >
              One action. Every day. No second chance.
            </p>
          </div>

          <div className="mt-3 grid flex-1 gap-3 lg:min-h-0 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="flex min-h-[260px] flex-col border border-[#8cff00] p-4">
              <div className="border-b border-[#8cff00] pb-2 text-[8px]">
                TODAY&apos;S CLICK
              </div>

              <div className="flex flex-1 items-center justify-center">
                <button
                  type="button"
                  onClick={handlePress}
                  disabled={clickedToday}
                  className="
                    group
                    flex
                    h-[150px]
                    w-full
                    max-w-[390px]
                    flex-col
                    items-center
                    justify-center
                    border
                    border-[#8cff00]
                    bg-black
                    text-[#8cff00]
                    transition-colors
                    hover:bg-[#8cff00]
                    disabled:cursor-default
                    disabled:bg-black
                    lg:h-[115px]
                  "
                >
                  <span
                    className="
                      text-2xl
                      font-black
                      tracking-[0.12em]
                      text-[#8cff00]
                      group-hover:text-black
                      group-disabled:text-[#8cff00]
                      sm:text-3xl
                    "
                  >
                    {clickedToday
                      ? "CLICK SAVED"
                      : "PRESS"}
                  </span>

                  <span
                    className="
                      mt-2
                      text-[8px]
                      tracking-[0.12em]
                      text-[#8cff00]
                      group-hover:text-black
                      group-disabled:text-[#8cff00]
                      sm:text-[9px]
                    "
                  >
                    {clickedToday
                      ? "SEE YOU TOMORROW"
                      : "CLICK TO SURVIVE"}
                  </span>
                </button>
              </div>
            </section>

            <section className="flex flex-col border border-[#8cff00] p-4">
  <div className="border-b border-[#8cff00] pb-2 text-[8px]">
    STATUS
  </div>

  <div className="mt-3 space-y-2 text-[8px] sm:text-[9px]">
    <StatusRow label="DAY" value="001" />
    <StatusRow label="TOTAL PLAYERS" value="10,000" />
    <StatusRow label="ALIVE PLAYERS" value="10,000" />
    <StatusRow label="DEAD PLAYERS" value="0" />

    <StatusRow
      label="LAST CLICK"
      value={formatLastClick(lastClick, currentTime)}
    />
  </div>

  <div className="mt-5 border-y border-[#8cff00] py-5 text-center">
    <p
      className="
        text-[8px]
        font-bold
        uppercase
        tracking-[0.24em]
        text-[#8cff00]/70
        sm:text-[9px]
      "
    >
      Next UTC Reset
    </p>

    <p
      className="
        mt-3
        text-4xl
        font-black
        leading-none
        tracking-[0.08em]
        text-[#8cff00]
        sm:text-5xl
        lg:text-6xl
      "
    >
      {formatTime(timeLeft)}
    </p>

    <p
      className="
        mt-3
        text-[7px]
        uppercase
        tracking-[0.18em]
        text-[#8cff00]/50
        sm:text-[8px]
      "
    >
      00:00 UTC
    </p>
  </div>

  <div className="mt-5">
    <div className="mb-2 flex items-center justify-between text-[7px] uppercase tracking-[0.12em] sm:text-[8px]">
      <span>Cycle Progress</span>
      <span>{Math.round(progress)}%</span>
    </div>

    <div className="border border-[#8cff00] p-1">
      <div
        className="
          h-4
          bg-[#8cff00]
          transition-[width]
          duration-1000
          sm:h-5
        "
        style={{
          width: `${progress}%`,
        }}
      />
    </div>
  </div>

  <div
  className="
    mt-auto
    flex
    items-center
    justify-between
    pt-5
    text-[7px]
    uppercase
    tracking-[0.12em]
    sm:text-[8px]
  "
>
 <span
  className="
    animate-pulse
    text-[#8cff00]
    [animation-duration:2s]
    [text-shadow:0_0_4px_#8cff00,0_0_10px_rgba(140,255,0,.8),0_0_18px_rgba(140,255,0,.45)]
    [filter:blur(.2px)]
  "
>
  ● System Online
</span>

<span
  className="
    text-[#8cff00]
    [text-shadow:0_0_4px_#8cff00,0_0_10px_rgba(140,255,0,.8),0_0_18px_rgba(140,255,0,.45)]
    [filter:blur(.2px)]
  "
>
  UTC Sync Active
</span>
</div>
</section>
          </div>

          <section className="mt-3 grid gap-2 text-center sm:grid-cols-3">
            <StatCard
              label="ALIVE PLAYERS"
              value="10,000"
            />

            <StatCard
              label="PRIZE POOL"
              value="$50,000"
            />

            <StatCard
              label="PRIZE PER PLAYER"
              value="$1,000"
            />
          </section>
        </section>
      </div>

      {showIntro && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/90
            px-3
            py-4
            backdrop-blur-[2px]
            sm:px-4
          "
        >
          <div
            className="
              relative
              w-full
              max-w-3xl
              border
              border-[#8cff00]
              bg-black
              p-4
              text-[#8cff00]
              shadow-[0_0_15px_rgba(140,255,0,0.35),inset_0_0_25px_rgba(140,255,0,0.04)]
              sm:p-8
            "
          >
            <div
              className="
                mb-5
                flex
                items-center
                justify-between
                gap-3
                border-b
                border-[#8cff00]/50
                pb-3
                text-[7px]
                uppercase
                tracking-[0.12em]
                sm:mb-6
                sm:text-[10px]
                sm:tracking-[0.16em]
              "
            >
              <span>ONE CLICK SYSTEM</span>

              <span className="animate-pulse text-right">
                ● CONNECTION ACTIVE
              </span>
            </div>

            <div
              className="
                flex
                min-h-[190px]
                items-center
                sm:min-h-[230px]
              "
            >
              <p
  className="
    break-words
    text-[13px]
    font-bold
    uppercase
    leading-6
    tracking-[0.04em]
    text-[#8cff00]
    [text-shadow:0_0_2px_rgba(140,255,0,.35)]
    sm:text-lg
    sm:leading-9
    sm:tracking-[0.08em]
  "
>
                <span aria-hidden="true">
                  &gt;&nbsp;
                </span>

                {displayedText}

                <span
                  className="
                    ml-1
                    inline-block
                    h-[1em]
                    w-[7px]
                    animate-pulse
                    bg-[#8cff00]
                    align-middle
                  "
                />
              </p>
            </div>

            <div
              className="
                mb-4
                text-center
                text-[8px]
                uppercase
                tracking-[0.18em]
                text-[#8cff00]/70
                sm:text-[9px]
              "
            >
              Message {messageIndex + 1} /{" "}
              {INTRO_MESSAGES.length}
            </div>

            <div
  className="
    flex
    flex-col
    gap-3
    border-t
    border-[#8cff00]/50
    pt-4
    sm:grid
    sm:grid-cols-[1fr_auto_1fr]
    sm:items-center
    sm:gap-3
  "
>
  <button
    type="button"
    onClick={handlePreviousMessage}
    disabled={messageIndex === 0}
    className="
      group
      flex
      min-h-11
      w-full
      items-center
      justify-center
      border
      border-[#8cff00]
      px-3
      text-[9px]
      font-bold
      uppercase
      tracking-[0.04em]
      text-[#8cff00]
      transition-colors
      hover:bg-[#8cff00]
      disabled:cursor-not-allowed
      disabled:border-[#8cff00]/25
      disabled:text-[#8cff00]/25
      disabled:hover:bg-transparent
      sm:w-auto
      sm:justify-self-start
      sm:px-5
      sm:text-[10px]
      sm:tracking-[0.08em]
    "
  >
    <span
      className="
        whitespace-nowrap
        group-hover:text-black
        group-disabled:text-[#8cff00]/25
      "
    >
      ◀ Previous
    </span>
  </button>

  <span
    className="
      hidden
      text-[7px]
      uppercase
      tracking-[0.12em]
      text-[#8cff00]/50
      sm:block
    "
  >
    Manual navigation
  </span>

  {!isLastIntroMessage ? (
    <button
      type="button"
      onClick={handleNextMessage}
      className="
        group
        flex
        min-h-11
        w-full
        items-center
        justify-center
        border
        border-[#8cff00]
        px-3
        text-[9px]
        font-bold
        uppercase
        tracking-[0.04em]
        text-[#8cff00]
        transition-colors
        hover:bg-[#8cff00]
        sm:w-auto
        sm:justify-self-end
        sm:px-5
        sm:text-[10px]
        sm:tracking-[0.08em]
      "
    >
      <span className="group-hover:text-black">
  Next ▶
</span>
    </button>
  ) : (
    <button
      type="button"
      onClick={isTyping ? finishCurrentTyping : closeIntro}
      className="
        group
        flex
        min-h-11
        w-full
        items-center
        justify-center
        border
        border-[#8cff00]
        px-3
        text-[9px]
        font-bold
        uppercase
        tracking-[0.04em]
        text-[#8cff00]
        transition-colors
        hover:bg-[#8cff00]
        sm:w-auto
        sm:justify-self-end
        sm:px-5
        sm:text-[10px]
        sm:tracking-[0.08em]
      "
    >
      <span className="whitespace-nowrap group-hover:text-black">
        {isTyping ? "Show text" : "[ Understood ]"}
      </span>
    </button>
  )}
</div>
          </div>
        </div>
      )}
    </main>
  );
}

type StatusRowProps = {
  label: string;
  value: string;
};

function StatusRow({
  label,
  value,
}: StatusRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-[#8cff00]/30 pb-2">
      <span>{label}</span>

      <span className="font-black">
        {value}
      </span>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <div className="border border-[#8cff00] p-3">
      <p className="text-[7px] sm:text-[8px]">
        {label}
      </p>

      <p className="mt-1 text-base font-black sm:text-lg">
        {value}
      </p>
    </div>
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

function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(
    milliseconds / 1000,
  );

  const hours = Math.floor(
    totalSeconds / 3600,
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds = totalSeconds % 60;

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

  if (hours < 24) {
    return `${hours} HOUR${
      hours === 1 ? "" : "S"
    } AGO`;
  }

  const days = Math.floor(hours / 24);

  return `${days} DAY${
    days === 1 ? "" : "S"
  } AGO`;
}