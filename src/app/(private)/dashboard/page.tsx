'use client'
import { useUser } from '@clerk/nextjs'
import React from 'react'

export default function DashboardPage() {
    const { user } = useUser()

    return (
        <div>
            {user?.firstName}
        </div>
    )
}
