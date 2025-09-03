import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap,
  LayoutDashboard,
  Users,
  DollarSign,
  Building,
  FileText,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  notifications?: number;
}

interface DashboardSidebarProps {
  role: "admin" | "staff" | "student";
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const DashboardSidebar = ({ role, activeSection, onSectionChange }: DashboardSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const sidebarItems: Record<string, SidebarItem[]> = {
    admin: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "admissions", label: "Admissions", icon: Users, badge: "New", notifications: 5 },
      { id: "fees", label: "Fee Management", icon: DollarSign },
      { id: "hostel", label: "Hostel", icon: Building },
      { id: "exams", label: "Exams", icon: FileText },
      { id: "reports", label: "Reports", icon: Calendar },
      { id: "settings", label: "Settings", icon: Settings },
    ],
    staff: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "attendance", label: "Attendance", icon: Users },
      { id: "exams", label: "Exams", icon: FileText, notifications: 3 },
      { id: "reports", label: "Reports", icon: Calendar },
      { id: "settings", label: "Settings", icon: Settings },
    ],
    student: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "fees", label: "Fees", icon: DollarSign, badge: "Due" },
      { id: "hostel", label: "Hostel", icon: Building },
      { id: "exams", label: "Exams", icon: FileText },
      { id: "profile", label: "Profile", icon: Settings },
    ]
  };

  const items = sidebarItems[role] || [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            {!collapsed && (
              <div>
                <span className="text-lg font-bold text-foreground">EduFlow</span>
                <p className="text-xs text-muted-foreground capitalize">{role} Portal</p>
              </div>
            )}
          </Link>
          {!collapsed && (
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  <div className="flex items-center gap-1">
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        {item.badge}
                      </Badge>
                    )}
                    {item.notifications && (
                      <div className="bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.notifications}
                      </div>
                    )}
                  </div>
                </>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        {!collapsed && (
          <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">3 new notifications</span>
          </div>
        )}
        
        <Link to="/login">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-muted-foreground hover:text-foreground",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn(
        "hidden md:flex flex-col bg-sidebar border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        <SidebarContent />
        
        {/* Collapse Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute -right-3 top-6 h-6 w-6 rounded-full border border-border bg-background shadow-sm hover:shadow-md"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-sidebar">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">EduFlow</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-64 bg-sidebar shadow-lg">
              <SidebarContent />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardSidebar;