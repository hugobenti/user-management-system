import type React from "react"
import { Navigate } from "react-router-dom"
import { useSession } from "../context/SessionContext"

interface AuthGuardProps {
  children: React.ReactNode
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated } = useSession()

  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />
  }

  return <>{children}</>
}

export default AuthGuard
