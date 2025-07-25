import TerminalOverlay from '@/components/TerminalOverlay'
import { Button } from '@/components/ui/button'
import UserPrograms from '@/components/UserPrograms'
import { SignedIn, SignedOut, SignInButton, SignOutButton } from '@clerk/nextjs'
import { ArrowRight, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const HomePage = () => {
  return (
    <div className='flex flex-col min-h-screen text-foreground overflow-hidden'>
      <section className='relative z-10 py-24 flex-grow'>
        <div className='container mx-auto px-4'>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* CORNER DERCORATION */}
            <div className='absolute -top-10 left-0 size-40 border-l-2 border-t-2' />
            {/* LEFT SIDE CONTENT */}
            <div className='lg:col-span-7 space-y-8 relative'>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight ml-5 mt-5">

                <div>
                  <span className="text-foreground">Transform</span>
                </div>
                <div>
                  <span className="text-primary">Your Body</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">With Advanced</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">AI</span>
                  <span className="text-primary"> Technology</span>
                </div>

              </h1>
              {/* SEPARATOR LINE */}
              <hr />

              <p className="text-xl text-muted foreground w-2/3">
                Talk to our AI assistant and get presonalized diet plans and workout routines designed just for you!
              </p>

              {/* STATS */}
              <div className="flex items-center gap-10 py-6 font-mono">

                <div className="flex flex-col">
                  <div className="text-2xl text-primary">500+</div>
                  <div className="text-xs uppercase tracking-wider">Active user</div>
                </div>

                <div className="h-12 w-1 bg-gradient-to-b from-transparent via-border to-transparent"></div>

                <div className="flex flex-col">
                  <div className="text-2xl text-primary">3min</div>
                  <div className="text-xs uppercase tracking-wider">generation</div>
                </div>

                <div className="h-12 w-1 bg-gradient-to-b from-transparent via-border to-transparent"></div>

                <div className="flex flex-col">
                  <div className="text-2xl text-primary">100%</div>
                  <div className="text-xs uppercase tracking-wider">Personalized</div>
                </div>

              </div>

              {/* BUTTON */}
              <Button 
                size="lg" 
                asChild
                className='group overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium'
                >
                  <Link href={"/generate-program"} className='flex items-center font-mono'>
                    Build Your Program
                    <ArrowRightIcon className='ml-2 size-5 group-hover:animate-pulse' />
                  </Link>
              </Button>

            </div>            
          {/* RIGHT SIDE CONTENT */}
            <div className="lg:col-span-5 relative">
            {/* CORNER PIECES */}
            <div className='absolute -top-8 left-2 size-16 border-l-2 border-t-2' />
            <div className='absolute -top-8 right-2 size-16 border-r-2 border-t-2' />
            <div className='absolute -bottom-8 left-2 size-16 border-l-2 border-b-2' />
            <div className='absolute -bottom-8 right-2 size-16 border-r-2 border-b-2' />
            {/* IMAGE CONTAINER */}
              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="relative overflow-hidden rounded-lg bg-cyber-black">
                  <img src="/hero-ai3.png" alt="AI Fitness Coach" className='size-full object-cover object-center' />
                  {/* SCAN LINE */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none" />


                </div>
                  {/* DECORATION ON IMAGE */}
                  <div className="absolute inset-0 pointer-events-none">

                    <div className="absolute top-1/3 left-1/3 size-1/3 border border-primary/40 rounded-full"></div>

                    <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50" />
                    <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50" />
                    <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50" />
                    <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50" />
                  </div>
                  
                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

                  {/* TERMINAL OVERLAY */}
                  <TerminalOverlay />
              </div>

            </div>
          </div>

        </div>
      </section>
      <UserPrograms />
    </div>
  )
}

export default HomePage
