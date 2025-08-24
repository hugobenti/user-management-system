import React, { useEffect } from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSession } from "../../context/SessionContext"
import Input from "../../components/Input"
import Button from "../../components/Button"
import { useFormValidation } from "../../hooks/useFormValidation"
import { authService } from "../../services/authService"

const SignIn: React.FC = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true })
    }
  }, [isAuthenticated, navigate])

  const { values, errors, isValid, register } = useFormValidation({
    email: [{ required: true, email: true }],
    password: [{ required: true }],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!isValid) {
      setError("Please fix the errors above")
      return
    }

    setLoading(true)

    try {
      const response = await authService.signIn({
        email: values.email,
        password: values.password,
      })

      login(response.token, response.user)
      navigate("/dashboard", { replace: true })
    } catch (err: any) {
      setError(err.message || "Sign in failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="email"
            label="Email Address"
            type="email"
            error={errors.email}
            {...register("email", [{ required: true, email: true }])}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            error={errors.password}
            {...register("password", [{ required: true }])}
          />

          {error && <div className="text-destructive text-sm text-center">{error}</div>}

          <Button type="submit" loading={loading} className="w-full" disabled={!isValid}>
            Sign In
          </Button>
        </form>

        <div className="text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>

       
      </div>
    </div>
  )
}

export default SignIn
