"use client" // to be able to use webhooks
import { SignInButton, SignOutButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'
import { DumbbellIcon, HomeIcon, UserIcon, ZapIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
    const { isSignedIn } = useUser()
  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3'>
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className='flex items-center gap-2 p-1'>
            <div className="p-1 bg-primary/10 rounded">
                <ZapIcon className='size-4 text-primary' />
            </div>
            <span className="text-xl font-bold font-mono">
                Pulse<span className='text-primary'>core</span>.ai
            </span>
        </Link>

        {/* NAVIGATION */}
        <nav className='flex items-center gap-5'>
            {isSignedIn ? (
                <>
                    <Link href="/" className='flex items-center gap-1.5 text-sm hover:text-primary hover:bg-secondary/10 rounded-lg transition-colors p-3'>
                        <HomeIcon size={16}/>
                        <span>Home</span>
                    </Link> 

                    <Link href="/generate-program" className='flex items-center gap-1.5 text-sm hover:text-primary hover:bg-secondary/10 rounded-lg transition-colors p-3'>
                        <DumbbellIcon size={16}/>
                        <span>Generate</span>
                    </Link>

                    <Link href="/profile" className='flex items-center gap-1.5 text-sm hover:text-primary hover:bg-secondary/10 rounded-lg transition-colors p-3'>
                        <UserIcon size={16}/>
                        <span>profile</span>
                    </Link>

                    <Button
                        asChild
                        variant="outline"
                        className="ml-2 border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                    >
                        <Link href="generate-program">Get Started</Link>
                    </Button>

                    <UserButton />

                </>
            ) : (
                <>
                    
                    <SignInButton>
                        <Button 
                            variant={"outline"}
                            className='border-primary/50 text-primary hover:text-white hover:bg-primary/10'
                        >
                            Sign In
                        </Button>
                    </SignInButton>

                    <SignUpButton>
                        <Button 
                            className='bg-primary text-primary-foreground hover:bg-primary/90'
                        >
                            Sign Up
                        </Button>
                    </SignUpButton>

                </>
            )}
        </nav>

      </div>
    </header>
  )
}

export default Navbar
