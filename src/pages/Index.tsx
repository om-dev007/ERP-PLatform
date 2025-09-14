import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  Shield,
  Menu,
  X,
  ChevronRight,
  Star,
  CheckCircle
} from "lucide-react";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: GraduationCap,
      title: "Student Management",
      description: "Complete student lifecycle management from admission to graduation"
    },
    {
      icon: Users,
      title: "Staff Administration",
      description: "Manage faculty, administrative staff, and their roles efficiently"
    },
    {
      icon: Calendar,
      title: "Academic Planning",
      description: "Course scheduling, exam management, and academic calendar"
    },
    {
      icon: DollarSign,
      title: "Fee Management",
      description: "Automated fee collection, receipts, and financial reporting"
    },
    {
      icon: BookOpen,
      title: "Hostel Management",
      description: "Room allocation, maintenance, and hostel administration"
    },
    {
      icon: Shield,
      title: "Security & Reports",
      description: "Role-based access control and comprehensive reporting"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">EduFlow ERP</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
              <Link to="/login">
                <Button variant="ghost" className="erp-nav-item-inactive">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="erp-button-primary">Register College</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
                <Link to="/login">
                  <Button variant="ghost" className="w-full justify-start">Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full">Register College</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Modern ERP for
              <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent"> Educational Excellence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Streamline your college operations with our comprehensive management system. 
              Handle admissions, fees, hostel management, and more in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/register">
                <Button size="lg" className="erp-button-primary text-lg px-8 py-6">
                  Start Free Trial
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>500+ Colleges Trust Us</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-warning fill-current" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything Your College Needs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive modules designed specifically for educational institutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="erp-card erp-card-hover cursor-pointer">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-br from-card to-muted/20 rounded-2xl p-12 border border-border shadow-lg">
            <h3 className="text-3xl font-bold text-foreground mb-6">
              Ready to Transform Your College Management?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of educational institutions already using EduFlow ERP
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="erp-button-primary text-lg px-8 py-6">
                  Register Your College
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 erp-button-secondary">
                  Existing User Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-muted/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">EduFlow ERP</span>
              </div>
              <p className="text-muted-foreground">
                Modern ERP solution for educational excellence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <Link to="/admin-dashboard" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Admin Dashboard
                </Link>
                <Link to="/staff-dashboard" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Staff Portal
                </Link>
                <Link to="/student-dashboard" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Student Portal
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <a href="#about" className="block text-muted-foreground hover:text-foreground transition-colors">About</a>
                <a href="#careers" className="block text-muted-foreground hover:text-foreground transition-colors">Careers</a>
                <a href="#contact" className="block text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#help" className="block text-muted-foreground hover:text-foreground transition-colors">Help Center</a>
                <a href="#docs" className="block text-muted-foreground hover:text-foreground transition-colors">Documentation</a>
                <a href="#privacy" className="block text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 EduFlow ERP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;