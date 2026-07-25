"use client";

import { useEffect, useState } from "react";

const totalPlayers = 1337;
const deadPlayers = 495;
const totalDays = 12541;
const totalClicks = 15872;
const alivePlayers = 842;
const prizePool = 45210;

const prizePerPlayer =
  alivePlayers > 0 ? prizePool / alivePlayers : 0;

function padNumber(value: number) {
  return value.toString().padStart(3, "0");
}

function getTimeUntilUtcReset() {
  const now = new Date();

  const nextReset = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0,
    ),
  );

  const difference = Math.max(0, nextReset.getTime() - now.getTime());

  const hours = Math.floor(difference / 3_600_000);
  const minutes = Math.floor((difference % 3_600_000) / 60_000);
  const seconds = Math.floor((difference % 60_000) / 1_000);

  return {
    hours,
    minutes,
    seconds,
    percentage: Math.round((difference / 86_400_000) * 100),
  };
}

export default function Home() {
  const [clicked, setClicked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeUntilUtcReset());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTimeLeft(getTimeUntilUtcReset());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  function handleClick() {
    if (clicked) return;

    setClicked(true);
  }

  const formattedTime = [
    timeLeft.hours,
    timeLeft.minutes,
    timeLeft.seconds,
  ]
    .map((value) => value.toString().padStart(2, "0"))
    .join(":");

  const filledBars = Math.max(
    0,
    Math.min(20, Math.round(timeLeft.percentage / 5)),
  );

  const emptyBars = 20 - filledBars;

  return (
    <main
      className="
        min-h-screen
        bg-black
        p-2
        text-[#8cff00]
        lg:h-screen
        lg:min-h-0
        lg:overflow-hidden
      "
    >
      <div
        className="
          mx-auto
          flex
          min-h-[calc(100vh-16px)]
          max-w-[1800px]
          flex-col
          border
          border-[#8cff00]
          p-2
          lg:h-[calc(100vh-16px)]
          lg:min-h-0
          lg:gap-2
          lg:overflow-hidden
        "
      >
        <header className="flex shrink-0 items-center justify-between px-1 text-[9px] sm:text-[10px] lg:text-xs">
          <span>ONE CLICK v1.0</span>
          <span>USER: GUEST</span>
        </header>

        <section
          className="
            mt-2
            shrink-0
            border
            border-[#8cff00]
            px-3
            py-2
            lg:mt-0
            lg:h-[16%]
            lg:min-h-[105px]
          "
        >


          <div className="flex h-[calc(100%-20px)] flex-col items-center justify-center">
            <h1
              className="
                whitespace-nowrap
                text-center
                text-2xl
                font-black
                tracking-[-0.04em]
                sm:text-3xl
                md:text-4xl
                lg:text-4xl
                xl:text-5xl
              "
            >
              ONE CLICK
            </h1>

            <div className="mt-2 flex w-full items-center gap-3">
              <div className="h-px flex-1 bg-[#8cff00]" />

              <p className="whitespace-nowrap text-center text-[7px] uppercase tracking-[0.12em] sm:text-[8px] lg:text-[9px]">
                One action. Every day. No second chance.
              </p>

              <div className="h-px flex-1 bg-[#8cff00]" />
            </div>
          </div>
        </section>

        <div
          className="
            mt-2
            grid
            gap-2
            lg:mt-0
            lg:min-h-0
            lg:flex-1
            lg:grid-cols-[1.45fr_0.95fr]
            lg:grid-rows-[minmax(180px,1.55fr)_minmax(135px,0.85fr)]
          "
        >
          <section className="flex min-h-[390px] flex-col border border-[#8cff00] p-3 lg:min-h-0">
            <h2 className="shrink-0 text-center text-base sm:text-lg lg:text-xl">
              TODAY&apos;S CLICK
            </h2>

            <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-5 lg:py-2">
              {!clicked ? (
                <button
                  type="button"
                  onClick={handleClick}
                  className="
                    flex
                    h-[175px]
                    w-full
                    max-w-[730px]
                    flex-col
                    items-center
                    justify-center
                    border
                    border-[#8cff00]
                    bg-black
                    px-4
                    text-center
                    transition-colors
                    hover:bg-[#071500]
                    active:translate-x-[2px]
                    active:translate-y-[2px]
                    lg:h-[125px]
                  "
                >
                  <span className="whitespace-nowrap text-3xl font-black tracking-[0.05em] sm:text-4xl lg:text-4xl">
                    PRESS
                  </span>

                  <span className="mt-3 text-[8px] tracking-[0.08em] sm:text-[9px] lg:text-[10px]">
                    CLICK TO SURVIVE
                  </span>
                </button>
              ) : (
                <div
                  className="
                    flex
                    h-[175px]
                    w-full
                    max-w-[730px]
                    flex-col
                    items-center
                    justify-center
                    border
                    border-[#8cff00]
                    px-4
                    text-center
                    lg:h-[125px]
                  "
                >
                  <p className="whitespace-nowrap text-2xl font-black tracking-[0.04em] sm:text-3xl lg:text-3xl">
                    CLICK SAVED
                  </p>

                  <p className="mt-3 text-[8px] tracking-[0.08em] sm:text-[9px] lg:text-[10px]">
                    SEE YOU TOMORROW
                  </p>
                </div>
              )}

              <p className="mt-4 text-center text-[8px] sm:text-[9px] lg:text-[10px]">
                ( you can click only once per day )
              </p>
            </div>
          </section>

          <aside className="flex min-h-[390px] flex-col border border-[#8cff00] p-3 lg:min-h-0">
            <h2 className="shrink-0 text-center text-base sm:text-lg lg:text-xl">
              STATUS
            </h2>

            <div className="mt-3 min-h-0 flex-1 border-t border-dashed border-[#8cff00] pt-3">
              <div className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1.5 text-[8px] sm:text-[9px] lg:text-[10px]">
                <span>DAY</span>
                <span>{padNumber(1)}</span>

                <span>TOTAL PLAYERS</span>
                <span>{totalPlayers.toLocaleString("en-US")}</span>

                <span>ALIVE PLAYERS</span>
                <span>{alivePlayers.toLocaleString("en-US")}</span>

                <span>DEAD PLAYERS</span>
                <span>{deadPlayers.toLocaleString("en-US")}</span>

                <span>LAST CLICK</span>
                <span>{clicked ? "SAVED" : "--:--"}</span>
              </div>

              <div className="mt-3 border-t border-dashed border-[#8cff00] pt-2 text-center">
                <p className="text-left text-[8px] sm:text-[9px] lg:text-[10px]">
                  NEXT RESET
                </p>

                <p className="mt-1 text-lg font-bold sm:text-xl lg:text-xl">
                  {formattedTime}
                </p>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-[7px] sm:text-[8px] lg:text-[9px]">
                  <span>TIME LEFT</span>
                  <span>{timeLeft.percentage}%</span>
                </div>

                <div className="mt-1 overflow-hidden border border-[#8cff00] p-1 text-[8px] leading-none tracking-[-2px]">
                  <span>{"█".repeat(filledBars)}</span>
                  <span className="opacity-35">
                    {"░".repeat(emptyBars)}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          <section className="border border-[#8cff00] p-3 lg:col-span-2 lg:min-h-0">
            <SectionTitle>STATS</SectionTitle>

            <div className="mt-3 grid gap-4 text-center sm:grid-cols-3 lg:h-[calc(100%-28px)]">
  <StatCard
    code="[A]"
    label="ALIVE PLAYERS"
    value={alivePlayers.toLocaleString("en-US")}
    footer="STILL IN THE GAME"
  />

  <StatCard
    code="[$]"
    label="PRIZE POOL"
    value={`$${prizePool.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`}
    footer="CURRENT TOTAL"
  />

  <StatCard
    code="[$/P]"
    label="PRIZE PER PLAYER"
    value={`$${prizePerPlayer.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`}
    footer="IF SPLIT NOW"
  />
</div>
          </section>
        </div>

        <section
          className="
            mt-2
            shrink-0
            border
            border-[#8cff00]
            p-3
            lg:mt-0
            lg:h-[13%]
            lg:min-h-[88px]
          "
        >
          <SectionTitle>RULES</SectionTitle>

          <div
            className="
              mt-2
              grid
              gap-1
              text-[8px]
              leading-4
              sm:text-[9px]
              lg:grid-cols-2
              lg:gap-x-8
            "
          >
            <p>&gt; Click the button once before the UTC reset.</p>
            <p>&gt; Miss one day — your run ends forever.</p>
            <p>&gt; Every click is permanent and cannot be undone.</p>
            <p>&gt; No retries, revives or second chances.</p>
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-dashed border-[#8cff00] pt-1 text-[6px] uppercase tracking-[0.08em] sm:text-[7px] lg:text-[8px]">
            <span>Protocol: Daily Survival</span>
            <span>System Law: Absolute</span>
          </div>
        </section>
      </div>
    </main>
  );
}

type SectionTitleProps = {
  children: React.ReactNode;
};

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-[#8cff00]" />

      <h2 className="text-sm sm:text-base lg:text-lg">
        {children}
      </h2>

      <div className="h-px flex-1 bg-[#8cff00]" />
    </div>
  );
}

type StatCardProps = {
  code: string;
  label: string;
  value: string;
  footer: string;
};

function StatCard({
  code,
  label,
  value,
  footer,
}: StatCardProps) {
  return (
    <article
      className="
        flex
        flex-col
        items-center
        justify-center
        border-b
        border-[#8cff00]
        pb-3
        sm:border-b-0
        sm:border-r
        sm:pb-0
        sm:last:border-r-0
      "
    >
      <p className="text-[8px] sm:text-[9px] lg:text-[10px]">
        {code}
      </p>

      <p className="mt-1 text-[7px] sm:text-[8px] lg:text-[9px]">
        {label}
      </p>

      <p className="mt-1 text-xl font-black sm:text-2xl lg:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[6px] sm:text-[7px] lg:text-[8px]">
        {footer}
      </p>
    </article>
  );
}