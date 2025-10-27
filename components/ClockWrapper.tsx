// components/ClockWrapper.tsx
"use client"

import dynamic from 'next/dynamic'

const Clock = dynamic(() => import('../app/Clock'), {
  ssr: false,
  loading: () => null
})

export default function ClockWrapper() {
  return <Clock />
}
