import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProfileSection from "@/components/ProfileSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Calendar, 
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Plus,
  Search,
  Edit
} from "lucide-react";

const StaffDashboard = () => {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get active section from URL or default to 'dashboard'
  const activeSection = section || "dashboard";
  
  const { toast } = useToast();

  // Handle section changes and update URL
  const handleSectionChange = (newSection: string) => {
    if (newSection === "dashboard") {
      navigate("/staff-dashboard/dashboard");
    } else {
      navigate(`/staff-dashboard/${newSection}`);
    }
  };

  // Handle URL changes and redirect to dashboard if on base route
  useEffect(() => {
    if (location.pathname === '/staff-dashboard') {
      navigate('/staff-dashboard/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Mock data
  const attendanceData = [
    { id: 1, name: "John Doe", rollNo: "CS001", status: "Present", time: "09:15 AM" },
    { id: 2, name: "Jane Smith", rollNo: "CS002", status: "Absent", time: "-" },
    { id: 3, name: "Mike Johnson", rollNo: "CS003", status: "Present", time: "09:20 AM" },
    { id: 4, name: "Sarah Wilson", rollNo: "CS004", status: "Late", time: "09:45 AM" },
    { id: 5, name: "Alex Brown", rollNo: "CS005", status: "Present", time: "09:10 AM" },
  ];

  const classes = [
    { id: 1, subject: "Data Structures", time: "09:00 AM", room: "CS-101", students: 45 },
    { id: 2, subject: "Database Systems", time: "11:00 AM", room: "CS-102", students: 40 },
    { id: 3, subject: "Web Development", time: "02:00 PM", room: "CS-103", students: 38 },
  ];

  const pendingExams = [
    { id: 1, subject: "Data Structures", date: "2024-02-15", time: "10:00 AM", duration: "3 hours" },
    { id: 2, subject: "Database Systems", date: "2024-02-18", time: "02:00 PM", duration: "2 hours" },
  ];

  const renderDashboardHome = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Staff Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Manage your classes and student progress.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Classes</p>
                <p className="text-3xl font-bold text-foreground">{classes.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Next at 9:00 AM</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-foreground">123</p>
                <p className="text-sm text-success mt-1">Across all subjects</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Exams</p>
                <p className="text-3xl font-bold text-foreground">{pendingExams.length}</p>
                <p className="text-sm text-warning mt-1">Results to be entered</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card className="erp-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
          <CardDescription>Your classes for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {classes.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-12 bg-primary rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">{cls.subject}</h3>
                    <p className="text-sm text-muted-foreground">{cls.time} • Room {cls.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{cls.students} students</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setActiveSection("attendance")}
                  >
                    Take Attendance
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start erp-button-secondary"
              onClick={() => setActiveSection("attendance")}
            >
              <Users className="h-4 w-4 mr-2" />
              Mark Attendance
            </Button>
            <Button 
              className="w-full justify-start erp-button-secondary"
              onClick={() => setActiveSection("exams")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Enter Exam Results
            </Button>
            <Button 
              className="w-full justify-start erp-button-secondary"
              onClick={() => setActiveSection("reports")}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Reports
            </Button>
          </CardContent>
        </Card>

        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{exam.subject}</h4>
                    <p className="text-sm text-muted-foreground">{exam.date} at {exam.time}</p>
                  </div>
                  <Badge variant="outline">{exam.duration}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground">Mark and track student attendance</p>
        </div>
        <Button className="erp-button-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Attendance Session
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="erp-card lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ds">Data Structures</SelectItem>
                <SelectItem value="db">Database Systems</SelectItem>
                <SelectItem value="web">Web Development</SelectItem>
              </SelectContent>
            </Select>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="custom">Custom Date</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Summary</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Present:</span>
                  <span className="text-success">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Absent:</span>
                  <span className="text-destructive">1</span>
                </div>
                <div className="flex justify-between">
                  <span>Late:</span>
                  <span className="text-warning">1</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="erp-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Student Attendance
              <Button size="sm" className="erp-button-primary">
                Save Attendance
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceData.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{student.time}</span>
                    <Select defaultValue={student.status.toLowerCase()}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderExams = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exam Management</h1>
          <p className="text-muted-foreground">Enter marks and manage exam results</p>
        </div>
        <Button className="erp-button-primary">
          <FileText className="h-4 w-4 mr-2" />
          Create New Exam
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Mark Entry Form</CardTitle>
            <CardDescription>Enter exam marks for students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ds">Data Structures</SelectItem>
                <SelectItem value="db">Database Systems</SelectItem>
                <SelectItem value="web">Web Development</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Exam Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="midterm">Mid-term Exam</SelectItem>
                <SelectItem value="final">Final Exam</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
              </SelectContent>
            </Select>

            <Input placeholder="Maximum Marks" type="number" />
            
            <Button 
              className="w-full erp-button-primary"
              onClick={() => {
                toast({ 
                  title: "Exam Created", 
                  description: "New exam has been created. You can now enter marks." 
                });
              }}
            >
              Load Student List
            </Button>
          </CardContent>
        </Card>

        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Recent Exams</CardTitle>
            <CardDescription>Exams requiring mark entry or review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{exam.subject}</h4>
                    <p className="text-sm text-muted-foreground">{exam.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mark Entry Table */}
      <Card className="erp-card">
        <CardHeader>
          <CardTitle>Student Mark Entry</CardTitle>
          <CardDescription>Enter marks for Data Structures - Mid-term Exam (Max: 100)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceData.slice(0, 3).map((student, index) => (
              <div key={student.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-8 text-center font-medium">{index + 1}</span>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.rollNo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number" 
                    placeholder="Marks" 
                    className="w-20" 
                    max="100"
                  />
                  <span className="text-sm text-muted-foreground">/ 100</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button 
              className="erp-button-primary"
              onClick={() => {
                toast({ 
                  title: "Marks Saved", 
                  description: "Exam marks have been saved successfully." 
                });
              }}
            >
              Save All Marks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-muted-foreground">Generate and export academic reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Attendance Report", description: "Student attendance records", icon: Users },
          { title: "Grade Report", description: "Exam results and grades", icon: FileText },
          { title: "Class Performance", description: "Overall class analytics", icon: Calendar },
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
                  title: "Report Exported", 
                  description: `${report.title} has been downloaded successfully` 
                })}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
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
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Full Name" defaultValue="Dr. John Smith" />
            <Input placeholder="Email" defaultValue="john.smith@college.edu" />
            <Input placeholder="Department" defaultValue="Computer Science" />
            <Button className="erp-button-primary">Update Profile</Button>
          </CardContent>
        </Card>

        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Class Size</label>
              <Select defaultValue="40">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 students</SelectItem>
                  <SelectItem value="40">40 students</SelectItem>
                  <SelectItem value="50">50 students</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="erp-button-primary">Save Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return renderDashboardHome();
      case "attendance": return renderAttendance();
      case "exams": return renderExams();
      case "reports": return renderReports();
      case "profile": return <ProfileSection />;
      case "settings": return renderSettings();
      default: return renderDashboardHome();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar 
        role="staff" 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default StaffDashboard;