import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Supabase } from "@/lib/supabaseClient";
import { 
  GraduationCap, 
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetEmail, setResetEmail] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setLoginError("");
    
    try {
      const { data, error } = await Supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError("Invalid email or password ❌");
        return;
      }

      if (data.user) {
        // Check which role-specific table the user exists in
        let userRole = null;
        let userName = null;

        // Check admins table first
        const { data: adminData, error: adminError } = await Supabase
          .from('admins')
          .select('name')
          .eq('id', data.user.id)
          .single();

        if (!adminError && adminData) {
          userRole = 'admin';
          userName = adminData.name;
        } else {
          // Check staff table
          const { data: staffData, error: staffError } = await Supabase
            .from('staff')
            .select('name')
            .eq('id', data.user.id)
            .single();

          if (!staffError && staffData) {
            userRole = 'staff';
            userName = staffData.name;
          } else {
            // Check active_students table
            const { data: studentData, error: studentError } = await Supabase
              .from('active_students')
              .select('name')
              .eq('user_id', data.user.id)
              .single();

            if (!studentError && studentData) {
              userRole = 'student';
              userName = studentData.name;
            }
          }
        }

        // If user not found in any role-specific table, logout and show error
        if (!userRole) {
          setLoginError("Invalid credentials or no role assigned.");
          // Sign out the user since they don't have a valid role
          await Supabase.auth.signOut();
          return;
        }

        toast({
          title: "Login Successful!",
          description: `Welcome back, ${userName || 'User'}!`,
        });
        
        // Navigate to appropriate dashboard based on actual role
        setTimeout(() => {
          navigate(`/${userRole}-dashboard`);
        }, 1000);
      }
    } catch (error) {
      setLoginError("Invalid email or password ❌");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!resetEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Reset Link Sent",
      description: "Password reset instructions have been sent to your email",
    });
    
    setShowResetDialog(false);
    setResetEmail("");
  };


  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">EduFlow ERP</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </div>


        {/* Login Form */}
        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                }}
                className={errors.email ? "border-destructive" : ""}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                  }}
                  className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Forgot Password?
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                      Enter your email address and we'll send you a password reset link.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="resetEmail">Email Address</Label>
                      <Input
                        id="resetEmail"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <Button onClick={handleForgotPassword} className="w-full erp-button-primary">
                      Send Reset Link
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Login Error */}
            {loginError && (
              <div className="text-center">
                <p className="text-sm text-destructive flex items-center justify-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {loginError}
                </p>
              </div>
            )}

            {/* Login Button */}
            <Button 
              onClick={handleLogin} 
              className="w-full erp-button-primary"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            {/* Register Link */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Register your college
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;