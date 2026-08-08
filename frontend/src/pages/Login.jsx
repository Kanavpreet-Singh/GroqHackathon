import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import { BASE_URL } from "../helper";
import { Mail, Lock, User, Cake, Eye, EyeOff, ArrowRight } from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      age: null,
      password: "",
    },
  });

  const switchMode = (loginMode) => {
    if (loginMode === isLogin) return;
    setIsLogin(loginMode);
    form.reset();
  };

  const handleSubmitLogin = async () => {
    const values = form.getValues();
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/user/signin`, {
        email: values.email,
        password: values.password
      });

      if (response.data.message) {
        localStorage.setItem('token', response.data.message);
        toast({
          title: "Login successful",
          description: "You have been logged in successfully",
          variant: "default",
        });
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSignup = async () => {
    const values = form.getValues();
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/user/signup`, {
        firstname: values.name,
        email: values.email,
        password: values.password,
        age: Number(values.age)
      });

      if (response.data.message === "you are signed up") {
        toast({
          title: "Signup successful",
          description: "Your account has been created successfully",
          variant: "default",
        });
        form.reset();
        setIsLogin(true);
      }
    } catch (error) {
      const errorData = error.response?.data;

      if (errorData?.errors) {
        errorData.errors.forEach((err) => {
          toast({
            variant: "destructive",
            title: `Invalid ${err.field}`,
            description: err.message,
          });
        });
      } else {
        toast({
          variant: "destructive",
          title: "Signup Error",
          description: errorData?.message || "Something went wrong",
        });
      }
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background ${isDark ? 'dark-theme' : ''}`}>
      <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-6">
            <img
              src="/myLogo.png"
              alt="BriefLens"
              className="h-12 w-12 object-contain mb-3"
            />
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {isLogin ? "Log in to pick up where you left off" : "Takes less than a minute"}
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-md border border-border p-6">
            <div className="grid grid-cols-2 gap-1 p-1 mb-6 rounded-lg bg-muted">
              <button
                type="button"
                onClick={() => switchMode(true)}
                className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
                  isLogin
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => switchMode(false)}
                className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
                  !isLogin
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign up
              </button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(isLogin ? handleSubmitLogin : handleSubmitSignup)} className="space-y-4">
                {!isLogin && (
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Your name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Your name" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!isLogin && (
                  <FormField
                    control={form.control}
                    name="age"
                    rules={{
                      required: "Age is required",
                      min: { value: 13, message: "You must be at least 13 years old" },
                      max: { value: 120, message: "Please enter a valid age" },
                      validate: (value) => Number.isInteger(Number(value)) || "Age must be a whole number",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Cake className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="Your age"
                              min={13}
                              max={120}
                              className="pl-9"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="email"
                  rules={{ required: "Email is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="email" placeholder="you@example.com" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{ required: "Password is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-9 pr-9"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      {!isLogin && <FormDescription>At least 6 characters</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-2 flex justify-center">
                  <Button type="submit" size="lg" className="px-10 gap-2" disabled={loading}>
                    {loading ? "Please wait…" : isLogin ? "Log in" : "Create account"}
                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
