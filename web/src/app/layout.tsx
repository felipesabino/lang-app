import './globals.css'
import { UserHeader } from './components/UserHeader'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className='selection:bg-pink-300'>
        <div>
          <UserHeader pageTitle='New Story' name='The User' />
          {children}
        </div>
      </body>
    </html>
  )
}
