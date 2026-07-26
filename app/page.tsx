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
        <main className="min-h-screen bg-black p-2 text-[#8cff00] lg:h-screen lg:overflow-hidden">
            <div className="mx-auto flex min-h-[calc(100vh-16px)] max-w-[1500px] flex-col border border-[#8cff00] p-2 lg:h-[calc(100vh-16px)] lg:min-h-0">
                <header className="flex shrink-0 items-center justify-between text-[8px] sm:text-[10px]">
                    <span>ONE CLICK v1.0</span>
                    <span>ACCESS: PUBLIC</span>
                </header>

                <div className="mt-2 grid flex-1 gap-2 lg:min-h-0 lg:grid-cols-[1.15fr_0.85fr]">
                    {/* LEFT SIDE */}
                    <section className="flex min-h-0 flex-col border border-[#8cff00] p-4 lg:p-5">
                        <div className="flex shrink-0 items-center justify-between border-b border-[#8cff00] pb-2 text-[7px] sm:text-[9px]">
                            <span>SYSTEM ONLINE</span>
                            <span>REGISTRATION OPEN</span>
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col justify-center py-4 lg:py-2">
                            <h1 className="text-center text-3xl font-black tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                                ONE CLICK
                            </h1>

                            <div className="mt-3 flex items-center gap-3">
                                <div className="h-px flex-1 bg-[#8cff00]" />

                                <p className="text-center text-[7px] uppercase tracking-[0.12em] sm:text-[9px]">
                                    One action. Every day. No second chance.
                                </p>

                                <div className="h-px flex-1 bg-[#8cff00]" />
                            </div>

                            <div className="mx-auto mt-5 w-full max-w-2xl border border-[#8cff00]">
                                <div className="border-b border-[#8cff00] px-3 py-2 text-[8px] sm:text-[9px]">
                                    GAME PROTOCOL
                                </div>

                                <div className="space-y-2 p-3 text-[8px] leading-4 sm:text-[10px] sm:leading-5">
                                    <p>&gt; REGISTER YOUR PLAYER ACCOUNT.</p>

                                    <p>
                                        &gt; PAY THE ONE-TIME ENTRY FEE OF $5.
                                    </p>

                                    <p>
                                        &gt; PRESS THE BUTTON ONCE BEFORE EVERY
                                        UTC RESET.
                                    </p>

                                    <p>
                                        &gt; MISS ONE DAY AND YOUR ACCOUNT IS
                                        PERMANENTLY ELIMINATED.
                                    </p>

                                    <p>
                                        &gt; THE PRIZE POOL GROWS WITH EVERY NEW
                                        PLAYER.
                                    </p>

                                    <p>
                                        &gt; WHEN ONLY 50 PLAYERS REMAIN, THE
                                        PRIZE POOL IS SPLIT EQUALLY BETWEEN
                                        THEM.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-2 text-center sm:grid-cols-3">
                                <InfoCard label="ENTRY FEE" value="$5" />
                                <InfoCard label="WINNERS" value="LAST 50" />
                                <InfoCard
                                    label="PRIZE"
                                    value="SHARED EQUALLY"
                                />
                            </div>
                        </div>

                        <div className="flex shrink-0 justify-between border-t border-[#8cff00] pt-2 text-[6px] uppercase tracking-[0.08em] sm:text-[7px]">
                            <span>Protocol: Daily survival</span>
                            <span>System law: Absolute</span>
                        </div>
                    </section>

                    {/* REGISTRATION */}
                    <section className="flex min-h-0 flex-col border border-[#8cff00] p-4 lg:p-5">
                        <div className="flex shrink-0 items-center gap-3">
                            <div className="h-px flex-1 bg-[#8cff00]" />

                            <h2 className="text-sm sm:text-lg">
                                CREATE PLAYER
                            </h2>

                            <div className="h-px flex-1 bg-[#8cff00]" />
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="flex min-h-0 flex-1 flex-col justify-center py-3"
                        >
                            <TerminalInput
                                id="username"
                                label="USERNAME"
                                type="text"
                                value={formData.username}
                                placeholder="ENTER USERNAME"
                                autoComplete="username"
                                onChange={(value) =>
                                    updateField("username", value)
                                }
                            />

                            <TerminalInput
                                id="email"
                                label="EMAIL"
                                type="email"
                                value={formData.email}
                                placeholder="PLAYER@EMAIL.COM"
                                autoComplete="email"
                                onChange={(value) =>
                                    updateField("email", value)
                                }
                            />

                            <TerminalInput
                                id="password"
                                label="PASSWORD"
                                type="password"
                                value={formData.password}
                                placeholder="MINIMUM 8 CHARACTERS"
                                autoComplete="new-password"
                                onChange={(value) =>
                                    updateField("password", value)
                                }
                            />

                            <label className="mt-2 flex cursor-pointer items-start gap-2 text-[7px] leading-4 sm:text-[8px]">
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
                                    I UNDERSTAND THAT MISSING ONE DAY
                                    PERMANENTLY ENDS MY PARTICIPATION.
                                </span>
                            </label>

                            {error && (
                                <div
                                    role="alert"
                                    className="mt-3 border border-red-500 px-3 py-2 text-[7px] leading-4 text-red-500 sm:text-[8px]"
                                >
                                    ERROR: {error}
                                </div>
                            )}

                            <div className="mt-3 border border-[#8cff00]">
                                <div className="flex items-center justify-between border-b border-[#8cff00] px-3 py-2 text-[8px]">
                                    <span>ENTRY PAYMENT</span>
                                    <span>ONE TIME</span>
                                </div>

                                <div className="flex items-center justify-between p-3">
                                    <div>
                                        <p className="text-[7px] sm:text-[8px]">
                                            GAME ACCESS
                                        </p>

                                        <p className="mt-1 text-2xl font-black">
                                            $5.00
                                        </p>
                                    </div>

                                    <div className="text-right text-[6px] leading-4 sm:text-[7px]">
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
                  mt-3
                  flex
                  min-h-[68px]
                  w-full
                  items-center
                  justify-center
                  border
                  border-[#8cff00]
                  bg-black
                  px-4
                  text-center
                  text-base
                  font-black
                  tracking-[0.08em]
                  text-[#8cff00]
                  transition-colors
                  hover:bg-[#8cff00]
                  hover:text-black
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  sm:text-lg
                "
                            >
                                <span className="text-current group-hover:text-black">
                                    {isSubmitting
                                        ? "PROCESSING..."
                                        : "[ REGISTER & PAY $5 ]"}
                                </span>
                            </button>

                            <p className="mt-2 text-center text-[6px] leading-3 opacity-80 sm:text-[7px]">
                                BY CONTINUING, YOU CONFIRM THAT YOU ARE ELIGIBLE
                                TO PARTICIPATE UNDER THE LAWS OF YOUR
                                JURISDICTION.
                            </p>
                        </form>

                        <div className="shrink-0 border-t border-[#8cff00] pt-2 text-center text-[6px] uppercase tracking-[0.08em] sm:text-[7px]">
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
        <div className="mb-3">
            <label htmlFor={id} className="mb-1 block text-[7px] sm:text-[8px]">
                {label}
            </label>

            <div className="flex items-center border border-[#8cff00]">
                <span className="px-3 text-[10px]">&gt;</span>

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
            py-2.5
            text-[8px]
            text-[#8cff00]
            outline-none
            placeholder:text-[#8cff00]/40
            sm:text-[9px]
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
        <div className="border border-[#8cff00] p-2.5">
            <p className="text-[6px] sm:text-[7px]">{label}</p>

            <p className="mt-1.5 text-sm font-black sm:text-base">{value}</p>
        </div>
    );
}
