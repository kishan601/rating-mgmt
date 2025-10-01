import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";
import ThemeToggle from "@/components/ThemeToggle";
import { Store } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      const { confirmPassword, ...signupData } = data;
      const res = await apiRequest("POST", "/api/signup", signupData);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Account created successfully! Please log in.",
      });
      setIsLogin(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/login", data);
      return await res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
      
      if (data.user.role === "admin") {
        setLocation("/admin");
      } else if (data.user.role === "store") {
        setLocation("/store");
      } else {
        setLocation("/user");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log in",
        variant: "destructive",
      });
    },
  });

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
              onSubmit={(data) => loginMutation.mutate(data)}
              onSignupClick={() => setIsLogin(false)}
            />
          ) : (
            <SignupForm
              onSubmit={(data) => signupMutation.mutate(data)}
              onLoginClick={() => setIsLogin(true)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
