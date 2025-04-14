
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";

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

  // Handle OAuth redirect
  useEffect(() => {
    // Check if there's an OAuth response in the URL
    const params = new URLSearchParams(location.search);
    const oauthToken = params.get('oauth_token');
    const oauthUser = params.get('oauth_user');
    
    if (oauthToken && oauthUser) {
      try {
        // Decode the user info (in a real app this would be verified on the backend)
        const userInfo = JSON.parse(atob(oauthUser));
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify({
          id: userInfo.id || 'google-user',
          name: userInfo.name || 'Google User',
          email: userInfo.email || 'google@example.com',
          provider: 'google'
        }));
        
        // Show success toast
        toast({
          title: "Google Login Successful",
          description: `Welcome ${userInfo.name || 'back'}!`,
        });
        
        // Redirect to home
        navigate('/');
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Could not process the authentication response",
        });
      }
    }
  }, [location, toast, navigate]);

  const handleSubmit = async (formData) => {
    setLoading(true);

    try {
      // This would be an actual API call in production
      // For now we'll just simulate a login
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate email (basic validation)
      if (!formData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password
      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Validate name for registration
      if (!isLogin && formData.name.length < 2) {
        throw new Error('Please enter your name');
      }

      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify({
        id: '123',
        name: isLogin ? 'User' : formData.name,
        email: formData.email,
        provider: 'email'
      }));

      toast({
        title: isLogin ? "Login successful" : "Registration successful",
        description: `Welcome ${isLogin ? 'back' : formData.name}!`,
      });

      navigate('/');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Authentication failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // In a real implementation, you would redirect to Google's OAuth endpoint
    // For simulation purposes, we'll create a mock OAuth flow
    
    // This would normally be your Google OAuth authorization URL
    // For our demo, we'll simulate the OAuth redirect and response
    
    // Create mock user data
    const mockGoogleUser = {
      id: 'google-' + Math.random().toString(36).substring(2, 10),
      name: 'Google User',
      email: 'user@gmail.com',
      picture: 'https://via.placeholder.com/100'
    };
    
    // Convert to base64 to simulate an encoded token
    const encodedUser = btoa(JSON.stringify(mockGoogleUser));
    
    // Set loading state
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      // Simulate OAuth redirect and callback
      // In a real implementation, the window would be redirected to Google
      window.location.href = `/login?oauth_token=mock_token_${Date.now()}&oauth_user=${encodedUser}`;
    }, 1500);
    
    toast({
      title: "Redirecting to Google",
      description: "Please wait while we connect to Google...",
    });
  };

  return (
    <div className={`min-h-screen flex flex-col bg-background ${isDark ? 'dark-theme' : ''}`}>
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg border border-border">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isLogin ? "Login to Your Account" : "Create an Account"}
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="age"
                        placeholder="Enter your age: "
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
                        placeholder="••••••••"
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

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">Or continue with</p>
            <Button
              variant="outline"
              className="mt-2 w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              {loading ? "Connecting..." : "Sign in with Google"}
            </Button>
          </div>

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