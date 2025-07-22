import React from 'react'
import { UserResource } from "@clerk/types"
import CornerElements from './CornerElements'

const ProfileHeader = ({user}: {user: UserResource | null | undefined}) => {
  if(!user) return null
  return (
    <div className='mb-10 relative backdrop-blur-sm border border-border p-6'>
      <CornerElements />
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className='relative'>
          {user?.imageUrl ? (
            <div className='relative size-24 overflow-hidden rounded-lg'>
              <img 
                src={user.imageUrl} 
                alt={user.fullName || "Profile"}
                className='size-full object-cover'
              />
            </div>
          ) : (
            <div className='size-24 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center'>
              <span className="text-3xl font-bold text-primary">
                {user.fullName?.charAt(0) || "U"}
              </span>
            </div>
          )}
          {/* ONLINE INDICATOR (just UI) */}
          <div className='absolute bottom-0 right-0 size-4 rounded-full bg-green-500 border-2 border-background' />
        </div>

          <div className="flex-1">
            <div className='w-full flex flex-col! md:flex-row md:justify-between! md:items-center justify-center! gap-2 mb-2 sm:flex-col sm-justify-center'>
              <div className='w-full flex flex-row! justify-between! sm:flex-col'>

                <h1 className="text-3xl font-bold tracking-tight">
                  <span className="text-foreground">{user.fullName}</span>
                </h1>
                <div className='flex items-center bg-cyber-terminal-bg backdrop-blur-sm border border-border rounded px-3 py-1'>
                  <div className="size-2 rounded-full bg-primary animate-pulse mr-2" />
                  <p className="text-xs font-mono text-primary">USER ACTIVE</p>
                </div>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50 my-px" />
              <p className="w-full text-muted-foreground font-mono">
                {user.primaryEmailAddress?.emailAddress || "No email address"}
              </p>
            </div>
          </div>

      </div>
    </div>
  )
}

export default ProfileHeader
