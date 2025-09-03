import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  User, 
  Users, 
  Shield,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetEmail, setResetEmail] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const roles = [
    {
      value: "admin",
      label: "Admin",
      icon: Shield,
      description: "Full system access and management",
      demoCredentials: { email: "admin@college.edu", password: "admin123" }
    },
    {
      value: "staff",
      label: "Staff",
      icon: Users,
      description: "Faculty and staff portal access",
      demoCredentials: { email: "staff@college.edu", password: "staff123" }
    },
    {
      value: "student",
      label: "Student",
      icon: User,
      description: "Student portal and services",
      demoCredentials: { email: "student@college.edu", password: "student123" }
    }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedRole) newErrors.role = "Please select your role";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      // Demo login logic - check if credentials match demo accounts
      const selectedRoleData = roles.find(role => role.value === selectedRole);
      
      if (selectedRoleData && 
          email === selectedRoleData.demoCredentials.email && 
          password === selectedRoleData.demoCredentials.password) {
        
        toast({
          title: "Login Successful!",
          description: `Welcome to ${selectedRoleData.label} Dashboard`,
        });
        
        // Navigate to appropriate dashboard
        setTimeout(() => {
          navigate(`/${selectedRole}`);
        }, 1000);
      } else {
        toast({
          title: "Invalid Credentials",
          description: "Please check your email and password",
          variant: "destructive"
        });
      }
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

  const fillDemoCredentials = (role: string) => {
    const selectedRoleData = roles.find(r => r.value === role);
    if (selectedRoleData) {
      setSelectedRole(role);
      setEmail(selectedRoleData.demoCredentials.email);
      setPassword(selectedRoleData.demoCredentials.password);
      setErrors({});
    }
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

        {/* Demo Credentials Info */}
        <Card className="mb-6 bg-muted/30 border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Demo Credentials</CardTitle>
            <CardDescription className="text-xs">Click any role to auto-fill demo credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {roles.map((role) => (
              <Button 
                key={role.value}
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-xs hover:bg-background"
                onClick={() => fillDemoCredentials(role.value)}
              >
                <role.icon className="h-3 w-3 mr-2" />
                {role.label}: {role.demoCredentials.email}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Select Your Role *</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <role.icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-muted-foreground">{role.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.role}
                </p>
              )}
            </div>

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

            {/* Login Button */}
            <Button onClick={handleLogin} className="w-full erp-button-primary">
              Sign In
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