import type React from "react"
import { useSession } from "../context/SessionContext"
import Button from "../components/Button"

const Welcome: React.FC = () => {
  const { user, logout } = useSession()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Hello {user?.first_name}!</h1>
            <p className="text-xl text-muted-foreground">Welcome to your dashboard. You have successfully signed in.</p>
          </div>

          <div className="space-y-4">
            <Button variant="secondary" size="lg" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
   
        </div>
      </div>
    </div>
  )
}

export default Welcome
