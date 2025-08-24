import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormValidation } from "../../hooks/useFormValidation";
import { useSession } from "../../context/SessionContext";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { authService } from "../../services/authService";
import ThemeToggle from "../../components/ThemeToggle";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const { values, errors, isValid, register } = useFormValidation({
    first_name: [{ required: true }],
    last_name: [{ required: true }],
    email: [{ required: true, email: true }],
    password: [{ required: true, minLength: 6 }],
    confirmPassword: [{ required: true, equals: "password" }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValid) {
      setError("Please fix the errors above");
      return;
    }

    // Password confirmation check as required by specification
    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.signUp({
        email: values.email,
        password: values.password,
        first_name: values.first_name,
        last_name: values.last_name,
      });

      login(response.token, response.user);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <ThemeToggle />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
          <p className="mt-2 text-muted-foreground">Sign up to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="first_name"
              data-testid="signup-first-name-input"
              label="First Name"
              type="text"
              error={errors.first_name}
              {...register("first_name", [{ required: true }])}
            />
            <Input
              id="last_name"
              data-testid="signup-last-name-input"
              label="Last Name"
              type="text"
              error={errors.last_name}
              {...register("last_name", [{ required: true }])}
            />
          </div>

          <Input
            id="email"
            data-testid="signup-email-input"
            label="Email Address"
            type="email"
            error={errors.email}
            {...register("email", [{ required: true, email: true }])}
          />

          <Input
            id="password"
            data-testid="signup-password-input"
            label="Password"
            type="password"
            error={errors.password}
            {...register("password", [{ required: true, minLength: 6 }])}
          />

          <Input
            id="confirmPassword"
            data-testid="signup-confirm-password-input"
            label="Confirm Password"
            type="password"
            error={errors.confirmPassword}
            {...register("confirmPassword", [
              { required: true, equals: "password" },
            ])}
          />

          {error && (
            <div className="text-destructive text-sm text-center">{error}</div>
          )}

          <Button
            type="submit"
            data-testid="signup-submit-btn"
            loading={loading}
            className="w-full"
            disabled={!isValid}
          >
            Create Account
          </Button>
        </form>

        <div className="text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
