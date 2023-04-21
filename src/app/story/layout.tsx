"use client"
import { useEffect } from 'react'
import { UserHeader } from '../components/UserHeader'

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // useEffect(() => {
  //   // @ts-ignore
  //   import('preline')
  // })

  useEffect(() => {
    const initPreline = async () => {
      // @ts-ignore
      await import('preline')
    }
    initPreline()
  }, [])

  return (
    <div>
      <UserHeader pageTitle='Story' name='The User' />
      {children}
    </div>
  )
}
