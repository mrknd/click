"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  username: string;
  email: string;
  password: string;
};

export default function LandingPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  });

  const [acceptedRules, setAcceptedRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof FormData, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const username = formData.username.trim();
    const email = formData.email.trim();

    if (username.length < 3) {
      setError("USERNAME MUST CONTAIN AT LEAST 3 CHARACTERS.");
      return;
    }

    if (!email.includes("@")) {
      setError("ENTER A VALID EMAIL ADDRESS.");
      return;
    }

    if (formData.password.length < 8) {
      setError("PASSWORD MUST CONTAIN AT LEAST 8 CHARACTERS.");
      return;
    }

    if (!acceptedRules) {
      setError("YOU MUST ACCEPT THE GAME RULES.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Тимчасова імітація реєстрації та оплати.
      // Пізніше тут буде запит до API та Stripe Checkout.
      await new Promise((resolve) => {
        window.setTimeout(resolve, 900);
      });

      localStorage.setItem(
        "one-click-player",
        JSON.stringify({
          username,
          email,
          paid: true,
          registeredAt: new Date().toISOString(),
        }),
      );

      router.push("/game");
    } catch {
      setError("REGISTRATION FAILED. TRY AGAIN.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black p-3 text-[#8cff00]">
      <div className="mx-auto flex min-h-[calc(100vh-24px)] max-w-[1500px] flex-col border border-[#8cff00] p-3">
        <header className="flex items-center justify-between text-[9px] sm:text-xs">
          <span>ONE CLICK v1.0</span>
          <span>ACCESS: PUBLIC</span>
        </header>

        <div className="mt-3 grid flex-1 gap-3 lg:min-h-0 lg:grid-cols-[1.2fr_0.8fr]">
          {/* LEFT SIDE */}
          <section className="flex flex-col border border-[#8cff00] p-5 sm:p-8">
            <div className="flex items-center justify-between border-b border-[#8cff00] pb-3 text-[8px] sm:text-[10px]">
              <span>SYSTEM ONLINE</span>
              <span>REGISTRATION OPEN</span>
            </div>

            <div className="flex flex-1 flex-col justify-center py-10 lg:py-4">
              <h1 className="text-center text-4xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                ONE CLICK
              </h1>

              <div className="mt-5 flex items-center gap-4">
                <div className="h-px flex-1 bg-[#8cff00]" />

                <p className="text-center text-[8px] uppercase tracking-[0.14em] sm:text-[10px]">
                  One action. Every day. No second chance.
                </p>

                <div className="h-px flex-1 bg-[#8cff00]" />
              </div>

              <div className="mx-auto mt-10 w-full max-w-2xl border border-[#8cff00]">
                <div className="border-b border-[#8cff00] px-4 py-3 text-[9px] sm:text-[10px]">
                  GAME PROTOCOL
                </div>

                <div className="space-y-5 p-5 text-[9px] leading-5 sm:text-xs sm:leading-6">
                  <p>&gt; REGISTER YOUR PLAYER ACCOUNT.</p>

                  <p>&gt; PAY THE ONE-TIME ENTRY FEE OF $5.</p>

                  <p>&gt; PRESS THE BUTTON ONCE BEFORE EVERY UTC RESET.</p>

                  <p>&gt; MISS ONE DAY AND YOUR ACCOUNT IS ELIMINATED.</p>

                  <p>&gt; ELIMINATION IS PERMANENT.</p>
                  
                </div>
              </div>

              <div className="mt-8 grid gap-3 text-center sm:grid-cols-3">
                <InfoCard label="ENTRY FEE" value="$5.00" />
                <InfoCard label="RETRIES" value="NONE" />
                <InfoCard label="WINNERS" value="LAST 50" />
              </div>
            </div>

            <div className="flex justify-between border-t border-[#8cff00] pt-3 text-[7px] uppercase tracking-[0.1em] sm:text-[8px]">
              <span>Protocol: Daily survival</span>
              <span>System law: Absolute</span>
            </div>
          </section>

          {/* REGISTRATION */}
          <section className="flex flex-col border border-[#8cff00] p-5 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-[#8cff00]" />

              <h2 className="text-base sm:text-xl">
                CREATE PLAYER
              </h2>

              <div className="h-px flex-1 bg-[#8cff00]" />
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-1 flex-col justify-center py-7"
            >
              <TerminalInput
                id="username"
                label="USERNAME"
                type="text"
                value={formData.username}
                placeholder="ENTER USERNAME"
                autoComplete="username"
                onChange={(value) => updateField("username", value)}
              />

              <TerminalInput
                id="email"
                label="EMAIL"
                type="email"
                value={formData.email}
                placeholder="PLAYER@EMAIL.COM"
                autoComplete="email"
                onChange={(value) => updateField("email", value)}
              />

              <TerminalInput
                id="password"
                label="PASSWORD"
                type="password"
                value={formData.password}
                placeholder="MINIMUM 8 CHARACTERS"
                autoComplete="new-password"
                onChange={(value) => updateField("password", value)}
              />

              <label className="mt-5 flex cursor-pointer items-start gap-3 text-[8px] leading-4 sm:text-[9px]">
                <input
                  type="checkbox"
                  checked={acceptedRules}
                  onChange={(event) => {
                    setAcceptedRules(event.target.checked);
                    setError("");
                  }}
                  className="terminal-checkbox mt-[2px]"
                />

                <span>
                  I UNDERSTAND THAT MISSING ONE DAY PERMANENTLY ENDS MY
                  PARTICIPATION.
                </span>
              </label>

              {error && (
  <div
    role="alert"
    className="mt-5 border border-red-500 px-4 py-3 text-[8px] leading-4 text-red-500 sm:text-[9px]"
  >
    ERROR: {error}
  </div>
)}

              <div className="mt-7 border border-[#8cff00]">
                <div className="flex items-center justify-between border-b border-[#8cff00] px-4 py-3 text-[9px]">
                  <span>ENTRY PAYMENT</span>
                  <span>ONE TIME</span>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-[8px] sm:text-[9px]">
                      GAME ACCESS
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      $5.00
                    </p>
                  </div>

                  <div className="text-right text-[7px] leading-4 sm:text-[8px]">
                    <p>NO SUBSCRIPTION</p>
                    <p>NO REFUNDS AFTER ENTRY</p>
                  </div>
                </div>
              </div>

              <button
  type="submit"
  disabled={isSubmitting}
  className="
    group
    mt-5
    flex
    min-h-[100px]
    w-full
    items-center
    justify-center
    border
    border-[#8cff00]
    bg-black
    px-5
    text-center
    text-xl
    font-black
    tracking-[0.08em]
    text-[#8cff00]
    transition-colors
    hover:bg-[#8cff00]
    hover:text-black
    disabled:cursor-not-allowed
    disabled:opacity-50
    sm:text-2xl
  "
>
  <span className="text-current group-hover:text-black">
    {isSubmitting
      ? "PROCESSING..."
      : "[ REGISTER & PAY $5 ]"}
  </span>
</button>

              <p className="mt-4 text-center text-[7px] leading-4 opacity-80 sm:text-[8px]">
                BY CONTINUING, YOU CONFIRM THAT YOU ARE ELIGIBLE TO
                PARTICIPATE UNDER THE LAWS OF YOUR JURISDICTION.
              </p>
            </form>

            <div className="border-t border-[#8cff00] pt-3 text-center text-[7px] uppercase tracking-[0.1em] sm:text-[8px]">
              Secure connection // Payment verification required
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

type TerminalInputProps = {
  id: string;
  label: string;
  type: "text" | "email" | "password";
  value: string;
  placeholder: string;
  autoComplete: string;
  onChange: (value: string) => void;
};

function TerminalInput({
  id,
  label,
  type,
  value,
  placeholder,
  autoComplete,
  onChange,
}: TerminalInputProps) {
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="mb-2 block text-[8px] sm:text-[9px]"
      >
        {label}
      </label>

      <div className="flex items-center border border-[#8cff00]">
        <span className="px-3 text-xs">&gt;</span>

        <input
          id={id}
          name={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className="
            min-w-0
            flex-1
            bg-black
            px-2
            py-4
            text-[9px]
            text-[#8cff00]
            outline-none
            placeholder:text-[#8cff00]/40
            sm:text-[10px]
          "
        />
      </div>
    </div>
  );
}

type InfoCardProps = {
  label: string;
  value: string;
};

function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="border border-[#8cff00] p-4">
      <p className="text-[7px] sm:text-[8px]">
        {label}
      </p>

      <p className="mt-3 text-base font-black sm:text-lg">
        {value}
      </p>
    </div>
  );
}