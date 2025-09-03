import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  DollarSign, 
  Building, 
  GraduationCap,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  FileText,
  Settings,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { toast } = useToast();

  // Mock data
  const stats = {
    totalStudents: 1247,
    totalStaff: 89,
    pendingAdmissions: 23,
    hostelOccupancy: 85,
    feesCollected: 1250000,
    pendingFees: 180000
  };

  const recentAdmissions = [
    { id: 1, name: "John Doe", course: "Computer Science", status: "Pending", date: "2024-01-15" },
    { id: 2, name: "Jane Smith", course: "Electronics", status: "Approved", date: "2024-01-14" },
    { id: 3, name: "Mike Johnson", course: "Mechanical", status: "Under Review", date: "2024-01-13" },
    { id: 4, name: "Sarah Wilson", course: "Civil", status: "Pending", date: "2024-01-12" },
  ];

  const hostelRooms = [
    { number: "101", occupancy: 4, capacity: 4, status: "Full" },
    { number: "102", occupancy: 3, capacity: 4, status: "Available" },
    { number: "103", occupancy: 2, capacity: 4, status: "Available" },
    { number: "104", occupancy: 4, capacity: 4, status: "Full" },
    { number: "105", occupancy: 1, capacity: 4, status: "Available" },
    { number: "106", occupancy: 4, capacity: 4, status: "Full" },
  ];

  const renderDashboardHome = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening at your college.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="erp-stat-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection("admissions")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-foreground">{stats.totalStudents.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-success" />
                  <span className="text-sm text-success">+12% from last month</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection("admissions")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Admissions</p>
                <p className="text-3xl font-bold text-foreground">{stats.pendingAdmissions}</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-warning" />
                  <span className="text-sm text-warning">Needs attention</span>
                </div>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection("hostel")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hostel Occupancy</p>
                <p className="text-3xl font-bold text-foreground">{stats.hostelOccupancy}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowUpRight className="h-4 w-4 text-success" />
                  <span className="text-sm text-success">High occupancy</span>
                </div>
              </div>
              <Building className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection("fees")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fees Collected</p>
                <p className="text-3xl font-bold text-foreground">₹{(stats.feesCollected / 100000).toFixed(1)}L</p>
                <div className="flex items-center gap-1 mt-2">
                  <ArrowDownRight className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive">₹{(stats.pendingFees / 1000).toFixed(0)}K pending</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="erp-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">New admission application</p>
                  <p className="text-sm text-muted-foreground">John Doe - Computer Science</p>
                </div>
                <Badge variant="outline">Just now</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Fee payment received</p>
                  <p className="text-sm text-muted-foreground">₹45,000 from Jane Smith</p>
                </div>
                <Badge variant="outline">2 mins ago</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Hostel room allocated</p>
                  <p className="text-sm text-muted-foreground">Room 102 to Mike Johnson</p>
                </div>
                <Badge variant="outline">5 mins ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="erp-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Department Distribution</span>
                <Button variant="ghost" size="sm">
                  <PieChart className="h-4 w-4 mr-2" />
                  View Chart
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Computer Science</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Electronics</span>
                  <span>30%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary/80 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mechanical</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary/60 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAdmissions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admissions Management</h1>
          <p className="text-muted-foreground">Manage student applications and admissions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="erp-button-primary">
              <Plus className="h-4 w-4 mr-2" />
              New Admission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Enter student details for admission</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input placeholder="Student Name" />
              <Input placeholder="Email Address" />
              <Input placeholder="Course" />
              <Button onClick={() => {
                toast({ title: "Student Added", description: "New student admission created successfully" });
              }}>
                Add Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-10" />
        </div>
        <Button variant="outline" className="erp-button-secondary">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card className="erp-card">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Latest admission applications pending review</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="erp-table">
              <thead className="erp-table-header">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Course</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentAdmissions.map((admission) => (
                  <tr key={admission.id} className="erp-table-row">
                    <td className="px-4 py-3 font-medium">{admission.name}</td>
                    <td className="px-4 py-3">{admission.course}</td>
                    <td className="px-4 py-3">
                      <Badge variant={admission.status === "Approved" ? "default" : "secondary"}>
                        {admission.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{admission.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFees = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
          <p className="text-muted-foreground">Track payments and generate receipts</p>
        </div>
        <Button className="erp-button-primary">
          <Download className="h-4 w-4 mr-2" />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Collected</p>
                <p className="text-2xl font-bold text-success">₹12,50,000</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">₹1,80,000</p>
              </div>
              <DollarSign className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-destructive">₹45,000</p>
              </div>
              <DollarSign className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="erp-card">
        <CardHeader>
          <CardTitle>Fee Collection Table</CardTitle>
          <CardDescription>Detailed view of all fee transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input placeholder="Search by student name or ID..." className="flex-1" />
              <Button variant="outline">Filter by Status</Button>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg text-center">
              <p className="text-muted-foreground">Fee collection table with downloadable receipts would appear here</p>
              <Button 
                className="mt-2 erp-button-primary" 
                onClick={() => toast({ title: "Receipt Downloaded", description: "Fee receipt has been downloaded successfully" })}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample Receipt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHostel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hostel Management</h1>
          <p className="text-muted-foreground">Manage room allocations and occupancy</p>
        </div>
        <Button className="erp-button-primary">
          <Plus className="h-4 w-4 mr-2" />
          Allocate Room
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hostelRooms.map((room) => (
          <Card 
            key={room.number} 
            className={`erp-card cursor-pointer hover:shadow-md transition-shadow ${
              room.status === 'Full' ? 'border-destructive/20 bg-destructive/5' : 'border-success/20 bg-success/5'
            }`}
            onClick={() => toast({ 
              title: `Room ${room.number}`, 
              description: `Occupancy: ${room.occupancy}/${room.capacity} students` 
            })}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">Room {room.number}</h3>
                <Badge variant={room.status === 'Full' ? 'destructive' : 'default'}>
                  {room.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Occupancy</span>
                  <span>{room.occupancy}/{room.capacity}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${room.status === 'Full' ? 'bg-destructive' : 'bg-success'}`}
                    style={{ width: `${(room.occupancy / room.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderExams = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exam Management</h1>
          <p className="text-muted-foreground">Schedule exams and manage results</p>
        </div>
        <Button className="erp-button-primary">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Exam
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Exam Calendar</CardTitle>
            <CardDescription>Upcoming examinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-8 rounded-lg text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Calendar view with clickable exam dates would appear here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Result Entry</CardTitle>
            <CardDescription>Enter and manage exam results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input placeholder="Select Course" />
              <Input placeholder="Select Subject" />
              <Input placeholder="Select Exam" />
              <Button className="w-full erp-button-primary">
                <FileText className="h-4 w-4 mr-2" />
                Enter Results
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground">Generate and download various reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Student Report", description: "Complete student database", icon: Users },
          { title: "Fee Collection", description: "Financial reports", icon: DollarSign },
          { title: "Academic Report", description: "Exam and grade reports", icon: FileText },
          { title: "Hostel Report", description: "Occupancy and maintenance", icon: Building },
          { title: "Staff Report", description: "Employee information", icon: Users },
          { title: "Attendance Report", description: "Student attendance data", icon: Calendar },
        ].map((report, index) => (
          <Card key={index} className="erp-card erp-card-hover cursor-pointer">
            <CardContent className="p-6">
              <report.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{report.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <Button 
                size="sm" 
                className="w-full erp-button-primary"
                onClick={() => toast({ 
                  title: "Report Generated", 
                  description: `${report.title} has been downloaded successfully` 
                })}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
        <p className="text-muted-foreground">Manage system configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="erp-card">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full erp-button-secondary">Manage Admin Users</Button>
            <Button className="w-full erp-button-secondary">Manage Staff Accounts</Button>
            <Button className="w-full erp-button-secondary">Manage Student Accounts</Button>
          </CardContent>
        </Card>

        <Card className="erp-card">
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Configure system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full erp-button-secondary">Academic Year Settings</Button>
            <Button className="w-full erp-button-secondary">Fee Structure</Button>
            <Button className="w-full erp-button-secondary">Backup & Restore</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return renderDashboardHome();
      case "admissions": return renderAdmissions();
      case "fees": return renderFees();
      case "hostel": return renderHostel();
      case "exams": return renderExams();
      case "reports": return renderReports();
      case "settings": return renderSettings();
      default: return renderDashboardHome();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar 
        role="admin" 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;