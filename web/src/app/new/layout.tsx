import { UserHeader } from '../components/UserHeader'

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <UserHeader pageTitle='New Story' name='The User' />
      {children}
    </div>
  )
}
