import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import ThemeToggle from "@/components/ThemeToggle";
import { Store } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <Store className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to your account to continue"
              : "Sign up to start rating stores"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <LoginForm
              onSubmit={(data) => console.log("Login:", data)}
              onSignupClick={() => setIsLogin(false)}
            />
          ) : (
            <SignupForm
              onSubmit={(data) => console.log("Signup:", data)}
              onLoginClick={() => setIsLogin(true)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
