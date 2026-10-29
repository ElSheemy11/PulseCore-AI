import TerminalOverlay from '@/components/TerminalOverlay'
import { Button } from '@/components/ui/button'
import UserPrograms from '@/components/UserPrograms'
import { ArrowRightIcon, DumbbellIcon, MicIcon, UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const STATS = [
  { value: '500+', label: 'Active users' },
  { value: '3 min', label: 'To generate' },
  { value: '100%', label: 'Personalized' },
]

const STEPS = [
  {
    icon: MicIcon,
    title: 'Talk to the coach',
    text: 'Start a voice call and tell the AI about your goals, schedule, and food preferences.',
  },
  {
    icon: DumbbellIcon,
    title: 'Get your plan',
    text: 'Your workout routine and diet plan are built from what you said in the call.',
  },
  {
    icon: UserIcon,
    title: 'Follow it from your profile',
    text: 'Open your profile any time to see your programs and pick up where you left off.',
  },
]

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-dvh text-foreground overflow-x-hidden">
      {/* HERO */}
      <section className="relative z-10 pt-24 pb-14 md:pt-28 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative">
            {/* CORNER DECORATION (desktop only) */}
            <div
              aria-hidden
              className="hidden lg:block absolute -top-10 left-0 size-40 border-l-2 border-t-2"
            />

            {/* LEFT SIDE */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 relative">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] lg:ml-5 lg:mt-5">
                <span className="block text-foreground">Transform</span>
                <span className="block text-primary">Your Body</span>
                <span className="block pt-2 text-foreground">With Advanced</span>
                <span className="block pt-2">
                  <span className="text-foreground">AI</span>
                  <span className="text-primary"> Technology</span>
                </span>
              </h1>

              <hr className="border-border" />

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl">
                Talk to our AI assistant and get personalized diet plans and workout routines
                designed just for you.
              </p>

              {/* STATS */}
              <dl className="grid grid-cols-3 max-w-md divide-x divide-border py-2 font-mono">
                {STATS.map((stat, i) => (
                  <div key={stat.label} className={i === 0 ? 'pr-4' : 'px-4'}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="text-xl sm:text-2xl text-primary">{stat.value}</dd>
                    <dd className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground mt-1">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  size="lg"
                  asChild
                  className="group w-full sm:w-auto overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium"
                >
                  <Link href="/generate-program" className="flex items-center justify-center font-mono">
                    Build Your Program
                    <ArrowRightIcon className="ml-2 size-5 group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto px-8 py-6 text-lg font-mono"
                >
                  <Link href="#how-it-works">How it works</Link>
                </Button>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="lg:col-span-5 relative px-2 sm:px-0">
              {/* CORNER PIECES */}
              <div aria-hidden className="absolute -top-4 sm:-top-8 left-0 sm:left-2 size-10 sm:size-16 border-l-2 border-t-2" />
              <div aria-hidden className="absolute -top-4 sm:-top-8 right-0 sm:right-2 size-10 sm:size-16 border-r-2 border-t-2" />
              <div aria-hidden className="absolute -bottom-4 sm:-bottom-8 left-0 sm:left-2 size-10 sm:size-16 border-l-2 border-b-2" />
              <div aria-hidden className="absolute -bottom-4 sm:-bottom-8 right-0 sm:right-2 size-10 sm:size-16 border-r-2 border-b-2" />

              {/* IMAGE CONTAINER */}
              <div className="relative aspect-square w-full max-w-md lg:max-w-lg mx-auto">
                <div className="absolute inset-0 overflow-hidden rounded-lg bg-cyber-black">
                  <Image
                    src="/hero-ai3.png"
                    alt="AI fitness coach"
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, (min-width: 640px) 448px, 90vw"
                    className="object-cover object-center"
                  />
                  {/* SCAN LINE */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] motion-safe:animate-scanline pointer-events-none" />
                </div>

                {/* TARGET DECORATION */}
                <div aria-hidden className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/3 left-1/3 size-1/3 border border-primary/40 rounded-full" />
                  <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50" />
                  <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50" />
                  <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50" />
                  <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50" />
                </div>

                {/* OVERLAY */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />

                {/* TERMINAL OVERLAY */}
                <TerminalOverlay />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="relative z-10 scroll-mt-24 pb-14 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-mono mb-6 md:mb-8">
            How it <span className="text-primary">works</span>
          </h2>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 md:p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex size-10 items-center justify-center rounded-lg border border-primary/40 text-primary">
                    <step.icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-mono text-sm text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <UserPrograms />
    </div>
  )
}

export default HomePage
