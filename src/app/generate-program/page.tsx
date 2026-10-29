"use client";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { vapi } from '@/lib/vapi';
import { useUser } from '@clerk/nextjs';
import { Loader2Icon, MicIcon, MicOffIcon, PhoneIcon, PhoneOffIcon, UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react'

type ChatMessage = { content: string; role: string };

// Fixed bar heights (avoids Math.random() in render, which re-randomizes on every state change)
const WAVE_BARS = [35, 60, 90, 100, 90, 60, 35];

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

const getErrorText = (error: any): string =>
  typeof error === "string" ? error : error?.errorMsg || error?.message || error?.error?.message || "";

const GenerateProgramPage = () => {

  const [ callActive, setCallActive ] = useState(false);
  const [ connecting, setConnecting ] = useState(false);
  const [ isSpeaking, setIsSpeaking ] = useState(false);
  const [ isMuted, setIsMuted ] = useState(false);
  const [ messages, setMessages ] = useState<ChatMessage[]>([]);
  const [ callEnded, setCallEnded ] = useState(false);
  const [ seconds, setSeconds ] = useState(0);
  const [ errorMsg, setErrorMsg ] = useState<string | null>(null);

  const { user } = useUser();
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Ignore the harmless "Meeting has ended" console error from the Daily SDK
  useEffect(() => {
    const originalError = console.error;
    console.error = function (...args: any[]) {
      const text = args.map((a) => (typeof a === "string" ? a : a?.message ?? "")).join(" ");
      if (text.includes("Meeting has ended")) return;
      return originalError.apply(console, args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  // Stop the call if the user leaves the page mid-call
  useEffect(() => {
    return () => {
      try { vapi.stop(); } catch {}
    };
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    const el = messageContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Call timer
  useEffect(() => {
    if (!callActive) return;
    setSeconds(0);
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [callActive]);

  // Navigate to profile after the call ends
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => router.push("/profile"), 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  // Vapi event listeners
  useEffect(() => {
    const handleCallStart = () => {
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
      setIsMuted(false);
      setErrorMsg(null);
    };

    const handleCallEnd = () => {
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setIsMuted(false);
      setCallEnded(true);
    };

    const handleSpeechStart = () => setIsSpeaking(true);
    const handleSpeechEnd = () => setIsSpeaking(false);

    const handleMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages((prev) => [...prev, { content: message.transcript, role: message.role }]);
      }
    };

    const handleError = (error: any) => {
      const text = getErrorText(error);
      if (text.includes("Meeting has ended")) return; // normal end of call
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);
      setIsSpeaking(false);
      setErrorMsg(
        /permission|denied|NotAllowed/i.test(text)
          ? "Microphone access was blocked. Allow the microphone in your browser and try again."
          : "Something went wrong with the call. Check your connection and try again."
      );
    };

    vapi.on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);

    return () => {
      vapi.off("call-start", handleCallStart)
        .off("call-end", handleCallEnd)
        .off("speech-start", handleSpeechStart)
        .off("speech-end", handleSpeechEnd)
        .off("message", handleMessage)
        .off("error", handleError);
    };
  }, []);

  const toggleMute = useCallback(() => {
    const next = !isMuted;
    vapi.setMuted(next);
    setIsMuted(next);
  }, [isMuted]);

  const toggleCall = async () => {
    if (callEnded) {
      router.push("/profile");
      return;
    }

    if (callActive) {
      vapi.stop();
      return;
    }

    try {
      setConnecting(true);
      setMessages([]);
      setCallEnded(false);
      setErrorMsg(null);

      const fullName = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "There";

      await vapi.start(
        undefined,
        undefined,
        undefined,
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
        {
          variableValues: {
            fullName,
            userId: user?.id,
          },
        }
      );
    } catch (error) {
      console.log("Failed to start call:", error);
      setConnecting(false);
      setErrorMsg("Couldn't start the call. Check your connection and try again.");
    }
  };

  const userName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Guest" : "Guest";

  const aiStatus = isSpeaking
    ? "Speaking..."
    : callActive
    ? "Listening..."
    : connecting
    ? "Connecting..."
    : callEnded
    ? "Call ended"
    : "Waiting...";

  const userStatus = callActive ? (isMuted ? "Muted" : "Connected") : "Ready";

  return (
    <div className="flex flex-col min-h-dvh text-foreground overflow-x-hidden pb-10 pt-20 sm:pt-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold font-mono">
            <span>Generate Your </span>
            <span className="text-primary uppercase">Fitness Program</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl mx-auto">
            Have a voice conversation with our AI assistant to create your personalized plan.
          </p>
        </div>

        {/* Call area: two columns on every screen size, compact on mobile */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6">

          {/* AI Assistant Card */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 relative min-h-[210px] sm:min-h-0 sm:aspect-video">
              {/* Voice wave animation */}
              <div
                aria-hidden
                className={`absolute inset-0 pointer-events-none ${isSpeaking ? "opacity-30" : "opacity-0"} transition-opacity duration-300`}
              >
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                  {WAVE_BARS.map((h, i) => (
                    <div
                      key={i}
                      className={`mx-0.5 sm:mx-1 w-1 bg-primary rounded-full ${isSpeaking ? "motion-safe:animate-sound-wave" : ""}`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: isSpeaking ? `${h}%` : "5%",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* AI Image */}
              <div className="relative size-20 sm:size-32 mb-3 sm:mb-4">
                <div className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${isSpeaking ? "motion-safe:animate-pulse" : ""}`} />
                <div className="relative size-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10" />
                  <img src="/ai-avatar.png" alt="PulseCore AI assistant" className="size-full object-cover" />
                </div>
              </div>

              <h2 className="text-base sm:text-xl font-bold text-foreground">PulseCore AI</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Fitness & Diet Coach</p>

              {/* Status */}
              <div
                role="status"
                className={`mt-3 sm:mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border ${isSpeaking ? "border-primary" : "border-border"}`}
              >
                <div className={`size-2 rounded-full ${isSpeaking ? "bg-primary motion-safe:animate-pulse" : callActive ? "bg-primary/60" : "bg-muted"}`} />
                <span className="text-xs text-muted-foreground">{aiStatus}</span>
              </div>
            </div>
          </Card>

          {/* User Card */}
          <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
            <div className="flex flex-col items-center justify-center p-4 sm:p-6 relative min-h-[210px] sm:min-h-0 sm:aspect-video">
              {/* User Image */}
              <div className="relative size-20 sm:size-32 mb-3 sm:mb-4 rounded-full overflow-hidden border border-border bg-card flex items-center justify-center">
                {user?.imageUrl ? (
                  <img src={user.imageUrl} alt={userName} className="size-full object-cover" />
                ) : (
                  <UserIcon className="size-1/2 text-muted-foreground" aria-hidden />
                )}
              </div>

              <h2 className="text-base sm:text-xl font-bold text-foreground">You</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-full truncate px-2">
                {userName}
              </p>

              <div className="mt-3 sm:mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border">
                <div className={`size-2 rounded-full ${callActive && !isMuted ? "bg-green-500" : "bg-muted"}`} />
                <span className="text-xs text-muted-foreground">{userStatus}</span>
              </div>
            </div>
          </Card>

          {/* Transcript */}
          <div className="col-span-2 relative">
            <div
              ref={messageContainerRef}
              role="log"
              aria-live="polite"
              aria-label="Conversation transcript"
              className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-3 sm:p-4 h-44 sm:h-56 overflow-y-auto scroll-smooth space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {messages.length === 0 && !callEnded && (
                <p className="h-full flex items-center justify-center text-center text-sm text-muted-foreground px-4">
                  {callActive
                    ? "Say hello. Your conversation will show up here."
                    : "Start the call and your conversation will show up here."}
                </p>
              )}

              {messages.map((msg, idx) => {
                const isAI = msg.role === "assistant";
                return (
                  <div key={idx} className={`flex flex-col ${isAI ? "items-start" : "items-end"} animate-fadeIn`}>
                    <div className="font-semibold text-xs text-muted-foreground mb-1">
                      {isAI ? "PulseCore AI" : "You"}
                    </div>
                    <p
                      className={`max-w-[85%] rounded-xl px-3 py-2 text-sm sm:text-base ${
                        isAI ? "bg-muted/60 text-foreground" : "bg-primary/15 text-foreground border border-primary/30"
                      }`}
                    >
                      {msg.content}
                    </p>
                  </div>
                );
              })}

              {callEnded && (
                <div className="animate-fadeIn">
                  <div className="font-semibold text-xs text-primary mb-1">System</div>
                  <p className="text-foreground text-sm sm:text-base">
                    The call has ended. Taking you to your profile...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div
              role="alert"
              className="col-span-2 rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-foreground"
            >
              {errorMsg}
            </div>
          )}

          {/* Call controls */}
          <div className="col-span-2 flex flex-col items-center gap-3">
            <div className="flex w-full sm:w-auto items-center justify-center gap-3">
              {callActive && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  aria-pressed={isMuted}
                  aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                  className="size-12 rounded-xl shrink-0"
                >
                  {isMuted ? <MicOffIcon className="size-5 text-destructive" /> : <MicIcon className="size-5" />}
                </Button>
              )}

              <Button
                onClick={toggleCall}
                disabled={connecting}
                className={`flex-1 sm:flex-none sm:w-48 h-12 text-base sm:text-lg rounded-xl text-white ${
                  callActive
                    ? "bg-destructive hover:bg-destructive/80"
                    : callEnded
                    ? "bg-green-600 hover:bg-green-800"
                    : "bg-primary hover:bg-primary/80"
                }`}
              >
                {connecting ? (
                  <>
                    <Loader2Icon className="size-5 mr-2 animate-spin" aria-hidden />
                    Connecting...
                  </>
                ) : callActive ? (
                  <>
                    <PhoneOffIcon className="size-5 mr-2" aria-hidden />
                    End Call
                  </>
                ) : callEnded ? (
                  "View Profile"
                ) : (
                  <>
                    <PhoneIcon className="size-5 mr-2" aria-hidden />
                    Start Call
                  </>
                )}
              </Button>
            </div>

            {callActive && (
              <p className="font-mono text-sm text-muted-foreground" aria-label="Call duration">
                {formatTime(seconds)}
              </p>
            )}

            {!callActive && !connecting && !callEnded && (
              <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-md">
                Find a quiet spot and allow microphone access when your browser asks.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateProgramPage
