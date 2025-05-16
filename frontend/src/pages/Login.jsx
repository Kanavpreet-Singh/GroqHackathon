
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import { BASE_URL } from "../helper";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  // Initialize react-hook-form
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      age: 15,
      password: ""
    },
  });
  
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
    console.log(values);
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/user/signup`, {
        firstname: values.name,
        email: values.email,
        password: values.password,
        age:Number(values.age)
      });
  
      if (response.data.message === "you are signed up") {
        toast({
          title: "Signup successful",
          description: "Your account has been created successfully",
          variant: "default",
        });
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
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg border border-border">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isLogin ? "Login to Your Account" : "Create an Account"}
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(isLogin ? handleSubmitLogin : handleSubmitSignup)} className="space-y-4">
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name"
                          required={!isLogin}
                          {...field}
                        />
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"

                        placeholder="Enter your age: "
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder=""
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </Button>
            </form>
          </Form>

          

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:text-primary/80"
              disabled={loading}
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;