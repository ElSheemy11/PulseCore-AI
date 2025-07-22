"use client";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { vapi } from '@/lib/vapi';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

const GenerateProgramPage = () => {

  const [ callActive, setCallActive ] = useState(false);
  const [ connecting, setConnecting ] = useState(false);
  const [ isSpeaking, setIsSpeaking ] = useState(false);
  const [ messages, setMessages ] = useState<any[]>([]);
  const [ callEnded, setCallEnded ] = useState(false);

  const { user } = useUser();
  const router = useRouter();

  const messageContainerRef = useRef<HTMLDivElement>(null); 

  // Debugging Call's ended issue..
  useEffect(() => {
    const originalError = console.error;
    // override console.error to ignore "Meeting's ended" errors
    console.error = function(msg, ...args) {
      if ( msg &&
        (msg.includes("Meeting has ended") || 
        (args[0] && args[0].toString().includes("Meeting has ended")))
       ) {
        console.log("Ignoring Meeting ended error");
        return; // Don't pass to original handler
       }

       // Pass all other errors to the original handler
       return originalError.call(console, msg, ...args);
    };

    // Restore original handler on unmount
    return () => {
      console.error = originalError;
    };
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    if(messageContainerRef.current){
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
    }
  },[messages]);

  // Navigate user to ProfilePage after ending the call
  useEffect(() => {
    if(callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile")
      },1500)
      return () => clearTimeout(redirectTimer)
    }
  },[callEnded, router]);

  // Setup event listeners for vapi
  useEffect(() => {
    const handleCallStart = ()=> {
      console.log("Call Started")
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    }

    const handleCallEnd = ()=> {
      console.log("Call Ended")
      setCallActive(false);
      setConnecting(false);
      setIsSpeaking(false);
      setCallEnded(true);
    }

    const handleSpeechStart = ()=> {
      console.log("AI Started Speaking");
      setIsSpeaking(true);
    }

    const handleSpeechEnd = ()=> {
      console.log("AI stopped Speaking");
      setIsSpeaking(false);

    }

    const handleMessage = (message: any)=> {
      if(message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { content: message.transcript, role: message.role }
        setMessages(prev => [...prev, newMessage])
      }
    }

    const handleError = (error: any)=> {
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);

    }

    vapi.on("call-start", handleCallStart)
      .on("call-end", handleCallEnd)
      .on("speech-start", handleSpeechStart)
      .on("speech-end", handleSpeechEnd)
      .on("message", handleMessage)
      .on("error", handleError);
    
    //cleanup event listeners on unmount
    return () => {
      vapi.off("call-start", handleCallStart)
      .off("call-end", handleCallEnd)
      .off("speech-start", handleSpeechStart)
      .off("speech-end", handleSpeechEnd)
      .off("message", handleMessage)
      .off("error", handleError);
    }
    
  }, []);

  const toggleCall = async () => {
    if(callActive) {vapi.stop()}
    else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);

        const fullName = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "There";

        console.log("Assistant ID:", process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
        
        await vapi.start(undefined,
          undefined,
          undefined,
          process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,       
          {
          variableValues:{
            fullName: fullName,
            userId: user?.id,
          }
        }
      )
      console.log("workflow ID: ", process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID);
        console.log("Started call with assistant:", process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
      } catch (error) {
        console.log("Failed to start call :", error );
        setConnecting(false);
      }
    }
  }

  return (
    <div className='flex flex-col min-h-screen text-foreground overflow-hidden pb-6 pt-24'>
      <div className="container mx-auto px-4 h-full max-w-5xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono">
            <span>Generate Your </span>
            <span className='text-primary uppercase'>Fitness Program</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Have a voice conversation with our AI assistant to create your personalized plan
          </p>
        </div>
        {/* Video Call Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* AI Assistant Card */}
          <Card className='bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative'>
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* AI Voice Animation */}
              <div
                className={`absolute inset-0 ${
                  isSpeaking ? "opacity-30" : "opacity-0"
                } transition-opacity duration-300`}
              >
                {/* Voice wave animation when speaking */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`mx-1 h-16 w-1 bg-primary rounded-full ${
                        isSpeaking ? "animate-sound-wave" : ""
                      }`}
                      style={{
                        animationDelay: `${i * 0.1}s`,
                        height: isSpeaking ? `${Math.random() * 50 + 20}%` : "5%",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* AI Image */}
              <div className='relative size-32 mb-4'>
                <div className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${ isSpeaking ? "animate-pulse" : "" }`} />
                <div className="relative size-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                  <div className='absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10' />
                  <img src="/ai-avatar.png" alt="AI Assistant" className='size-full object-cover' />

                </div>
              </div>

              <h2 className="text-xl font-bold text-foreground">PulseCore AI</h2>
              <p className="text-sm text-muted-foreground mt-1">Fitness & Diet Coach</p>

              {/* SPEAKING INDICATOR */}
              <div className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${isSpeaking ? "border-primary" : ""}`}>
                <div className={`size-2 rounded-full ${isSpeaking ? "bg-primary animate-pulse" : "bg-muted"}`}/>
                <span className='text-xs text-muted-foreground'>
                  {isSpeaking ? "Speaking..." : callActive ? "Listening..." : callEnded ? "Redirecting to profile..." : "Waiting..." }
                </span>
              </div>

            </div>
          </Card>

          {/* User Card */}
          <Card className='bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative'>
            <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
              {/* User Image */}
              <div className='relative size-32 mb-4'>
                  <img src={user?.imageUrl} alt="User" className='rounded-full object-cover' />
              </div>

              <h2 className="text-xl font-bold text-foreground">You</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {user ? (user.firstName + " " + (user.lastName || "")).trim() : "Guest"}
              </p>

              {/* User Ready Text */}
              <div className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}>
                <div className={`size-2 rounded-full bg-muted`}/>
                <span className='text-xs text-muted-foreground'>
                  Ready
                </span>
              </div>

            </div>
          </Card>

          {/* MESSAGE CONTAINER */}
          { messages.length > 0 && (
            <div 
              ref={messageContainerRef}
              className='
                  col-span-2 w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-48 overflow-y-auto transition-all   duration-300 scroll-smooth space-y-3 overflow-auto
                  [&::-webkit-scrollbar]:hidden
                  [-ms-overflow-style:none]
                  [scrollbar-width:none]'
            >
              <div>
                {messages.map((msg,idx) => (
                  <div key={idx} className='message-item animate-fadeIn'>
                    <div className='font-semibold text-xs text-muted-foreground mb-1'>
                      {msg.role === "assistant" ? "PulseCore AI" : "You"} :
                    </div>
                    <p className="text-foreground">{msg.content}</p>
                  </div>
                ))}
                {callEnded && (
                  <div className='message-item animate-fadeIn'>
                    <div className='font-semibold text-xs text-primary mb-1'>System:</div>
                    <p className="text-foreground">
                      Your fitness program has been created! Redirecting to your profile...
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) }
          
          {/* Call Controls */}
          <div className="col-span-2 w-full flex justify-center gap-4">
            <Button
              className={`mx-auto w-40 text-xl rounded-xl ${callActive ? "bg-destructive hover:bg-destructive/80" : callEnded ? "bg-green-600 hover:bg-green-800" : "bg-primary hover:bg-primary/80"} text-white relative`}
              onClick={toggleCall}
              disabled={connecting || callEnded}
            >
              {connecting && (
                <span className='absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75' />
              )}
              <span>
                {callActive ? "End Call" : connecting ? "Connecting..." : callEnded ? "View Profile" : "Start Call"}
              </span>
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default GenerateProgramPage
