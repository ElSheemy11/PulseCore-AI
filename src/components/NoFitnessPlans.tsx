import React from 'react'
import CornerElements from './CornerElements'
import { Button } from './ui/button'
import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import TypewriterComponent from 'typewriter-effect'

const NoFitnessPlans = () => {
  return (
    <div className='relative backdrop-blur-sm border border-border rounded-lg p-10 text-center'>
        <CornerElements />

        <h2 className="text-2xl font-bold mb-4 font-mono">
            <span className="text-primary">No</span> Fitness plans yet!
        </h2>
        <TypewriterComponent
        
            options={{
                
                strings: 'Start by creating a personalized fitness and diet plan... <br /> tailored to your specific goals and needs..! :O',
                autoStart: true,
                loop: false,
                delay: 20,
                wrapperClassName: 'text-xl text-muted-foreground m-10 max-w-md mx-auto',
                cursorClassName: 'text-primary animate-pulse',
                
            }}
        />
        <Button
            size={"lg"}
            asChild
            className='m-7 relative overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium'
        >
            <Link href="/generate-program">
                <span className="relative flex items-center font-bold">
                    Create Your First Plan Now!
                    <ArrowRightIcon className='ml-2 size-6 animate-pulse' />
                </span>
            </Link>

        </Button>
      
    </div>
  )
}

export default NoFitnessPlans
