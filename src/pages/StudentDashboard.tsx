import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Building, 
  FileText,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  BookOpen,
  GraduationCap,
  Award,
  TrendingUp
} from "lucide-react";

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { toast } = useToast();

  // Mock student data
  const studentInfo = {
    name: "Alex Johnson",
    rollNo: "CS2024001",
    course: "Computer Science Engineering",
    semester: "4th Semester",
    cgpa: "8.7",
    profilePicture: null
  };

  const feeDetails = {
    totalFees: 125000,
    paidAmount: 85000,
    pendingAmount: 40000,
    dueDate: "2024-02-28",
    lastPayment: "2024-01-15"
  };

  const hostelInfo = {
    roomNumber: "H-Block 205",
    roommate: "Mike Wilson",
    warden: "Mrs. Sarah Brown",
    checkIn: "2023-08-15",
    rent: 8000
  };

  const examSchedule = [
    { subject: "Data Structures", date: "2024-02-15", time: "10:00 AM", room: "CS-101" },
    { subject: "Database Systems", date: "2024-02-18", time: "02:00 PM", room: "CS-102" },
    { subject: "Web Development", date: "2024-02-22", time: "10:00 AM", room: "CS-103" },
    { subject: "Software Engineering", date: "2024-02-25", time: "02:00 PM", room: "CS-104" },
  ];

  const recentResults = [
    { subject: "Operating Systems", marks: 85, maxMarks: 100, grade: "A", date: "2024-01-20" },
    { subject: "Computer Networks", marks: 78, maxMarks: 100, grade: "B+", date: "2024-01-18" },
    { subject: "Algorithm Design", marks: 92, maxMarks: 100, grade: "A+", date: "2024-01-15" },
  ];

  const renderDashboardHome = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, {studentInfo.name}!</h1>
          <p className="text-muted-foreground">{studentInfo.course} • {studentInfo.semester}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current CGPA</p>
          <p className="text-2xl font-bold text-success">{studentInfo.cgpa}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="erp-stat-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection("fees")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Fees</p>
                <p className="text-2xl font-bold text-warning">₹{(feeDetails.pendingAmount / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground mt-1">Due: {feeDetails.dueDate}</p>
              </div>
              <DollarSign className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection("hostel")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hostel Room</p>
                <p className="text-2xl font-bold text-foreground">{hostelInfo.roomNumber}</p>
                <p className="text-xs text-muted-foreground mt-1">H-Block</p>
              </div>
              <Building className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveSection("exams")}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Exams</p>
                <p className="text-2xl font-bold text-foreground">{examSchedule.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Next: Feb 15</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                <p className="text-2xl font-bold text-success">94%</p>
                <p className="text-xs text-muted-foreground mt-1">This semester</p>
              </div>
              <Calendar className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <Card className="erp-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Recent Results
            </CardTitle>
            <CardDescription>Your latest exam scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{result.subject}</h4>
                    <p className="text-sm text-muted-foreground">{result.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{result.marks}/{result.maxMarks}</span>
                      <Badge variant={result.grade.includes('+') ? 'default' : 'secondary'}>
                        {result.grade}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setActiveSection("exams")}>
              View All Results
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Exams */}
        <Card className="erp-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Exam Schedule
            </CardTitle>
            <CardDescription>Upcoming examinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {examSchedule.slice(0, 3).map((exam, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">{exam.subject}</h4>
                    <p className="text-sm text-muted-foreground">{exam.date} • {exam.time}</p>
                  </div>
                  <Badge variant="outline">{exam.room}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setActiveSection("exams")}>
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="erp-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 erp-button-secondary"
              onClick={() => setActiveSection("fees")}
            >
              <DollarSign className="h-6 w-6" />
              Pay Fees
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 erp-button-secondary"
              onClick={() => setActiveSection("hostel")}
            >
              <Building className="h-6 w-6" />
              Hostel Info
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 erp-button-secondary"
              onClick={() => setActiveSection("exams")}
            >
              <FileText className="h-6 w-6" />
              Results
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2 erp-button-secondary"
              onClick={() => setActiveSection("profile")}
            >
              <User className="h-6 w-6" />
              Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFees = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
        <p className="text-muted-foreground">View and pay your college fees</p>
      </div>

      {/* Fee Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Fees</p>
                <p className="text-2xl font-bold text-foreground">₹{feeDetails.totalFees.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                <p className="text-2xl font-bold text-success">₹{feeDetails.paidAmount.toLocaleString()}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">₹{feeDetails.pendingAmount.toLocaleString()}</p>
                <p className="text-xs text-destructive mt-1">Due: {feeDetails.dueDate}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="erp-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Make Payment
            </CardTitle>
            <CardDescription>Pay your pending fees online</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                <span className="font-medium text-warning">Payment Due</span>
              </div>
              <p className="text-sm">₹{feeDetails.pendingAmount.toLocaleString()} is due by {feeDetails.dueDate}</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Semester Fees:</span>
                <span>₹25,000</span>
              </div>
              <div className="flex justify-between">
                <span>Hostel Fees:</span>
                <span>₹12,000</span>
              </div>
              <div className="flex justify-between">
                <span>Library Fees:</span>
                <span>₹2,000</span>
              </div>
              <div className="flex justify-between">
                <span>Lab Fees:</span>
                <span>₹1,000</span>
              </div>
              <hr />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>₹{feeDetails.pendingAmount.toLocaleString()}</span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full erp-button-primary">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Payment Gateway</DialogTitle>
                  <DialogDescription>Complete your fee payment securely</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium">Amount to Pay: ₹{feeDetails.pendingAmount.toLocaleString()}</p>
                  </div>
                  <Input placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" />
                    <Input placeholder="CVV" />
                  </div>
                  <Input placeholder="Cardholder Name" />
                  <Button 
                    className="w-full erp-button-primary"
                    onClick={() => {
                      toast({ 
                        title: "Payment Successful!", 
                        description: "Your fee payment has been processed. Receipt will be sent to your email." 
                      });
                    }}
                  >
                    Complete Payment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Your recent fee payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Semester 3 Fees</p>
                  <p className="text-sm text-muted-foreground">2024-01-15</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">₹45,000</p>
                  <Button size="sm" variant="ghost">
                    <Download className="h-3 w-3 mr-1" />
                    Receipt
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Hostel Fees Q2</p>
                  <p className="text-sm text-muted-foreground">2023-12-20</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">₹24,000</p>
                  <Button size="sm" variant="ghost">
                    <Download className="h-3 w-3 mr-1" />
                    Receipt
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Admission Fees</p>
                  <p className="text-sm text-muted-foreground">2023-08-15</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success">₹16,000</p>
                  <Button size="sm" variant="ghost">
                    <Download className="h-3 w-3 mr-1" />
                    Receipt
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderHostel = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Hostel Information</h1>
        <p className="text-muted-foreground">Your hostel room details and services</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="erp-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Room Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Room Number</p>
                <p className="font-semibold text-lg">{hostelInfo.roomNumber}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Block</p>
                <p className="font-semibold text-lg">H-Block</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Roommate</p>
                <p className="font-semibold">{hostelInfo.roommate}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Warden</p>
                <p className="font-semibold">{hostelInfo.warden}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Check-in Date</p>
                <p className="font-semibold">{hostelInfo.checkIn}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Monthly Rent</p>
                <p className="font-semibold">₹{hostelInfo.rent.toLocaleString()}</p>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full erp-button-primary">
                  <Eye className="h-4 w-4 mr-2" />
                  View Room Layout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Room {hostelInfo.roomNumber} Layout</DialogTitle>
                  <DialogDescription>3D view of your hostel room</DialogDescription>
                </DialogHeader>
                <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Interactive 3D room layout would appear here</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Hostel Services</CardTitle>
            <CardDescription>Available facilities and services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
                  <p className="text-sm font-medium">WiFi</p>
                </div>
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
                  <p className="text-sm font-medium">Laundry</p>
                </div>
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
                  <p className="text-sm font-medium">Mess</p>
                </div>
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg text-center">
                  <CheckCircle className="h-6 w-6 mx-auto mb-2 text-success" />
                  <p className="text-sm font-medium">Security</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Mess Timings</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Breakfast:</span>
                    <span>7:00 AM - 9:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lunch:</span>
                    <span>12:00 PM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dinner:</span>
                    <span>7:00 PM - 9:00 PM</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full erp-button-secondary">
                Report Maintenance Issue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderExams = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Examinations</h1>
        <p className="text-muted-foreground">View exam schedule and results</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="erp-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Exam Timetable
            </CardTitle>
            <CardDescription>Upcoming examinations this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {examSchedule.map((exam, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => toast({ 
                    title: exam.subject, 
                    description: `${exam.date} at ${exam.time} in ${exam.room}` 
                  })}
                >
                  <div>
                    <h4 className="font-medium">{exam.subject}</h4>
                    <p className="text-sm text-muted-foreground">{exam.date} • {exam.time}</p>
                  </div>
                  <Badge variant="outline">{exam.room}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="erp-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Exam Results
            </CardTitle>
            <CardDescription>Your academic performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentResults.map((result, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors"
                  onClick={() => toast({ 
                    title: "Detailed Result", 
                    description: `${result.subject}: ${result.marks}/${result.maxMarks} (${result.grade})` 
                  })}
                >
                  <div>
                    <h4 className="font-medium">{result.subject}</h4>
                    <p className="text-sm text-muted-foreground">{result.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{result.marks}/{result.maxMarks}</span>
                      <Badge variant={result.grade.includes('+') ? 'default' : 'secondary'}>
                        {result.grade}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Download All Results
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Academic Progress */}
      <Card className="erp-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Academic Progress
          </CardTitle>
          <CardDescription>Your semester-wise performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { semester: "Semester 1", cgpa: "8.2", status: "Completed" },
              { semester: "Semester 2", cgpa: "8.5", status: "Completed" },
              { semester: "Semester 3", cgpa: "8.9", status: "Completed" },
              { semester: "Semester 4", cgpa: "8.7", status: "Ongoing" },
            ].map((sem, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg text-center">
                <h4 className="font-medium">{sem.semester}</h4>
                <p className="text-2xl font-bold text-primary my-2">{sem.cgpa}</p>
                <Badge variant={sem.status === "Ongoing" ? "default" : "secondary"}>
                  {sem.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm">Change Photo</Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input defaultValue={studentInfo.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Roll Number</label>
                <Input defaultValue={studentInfo.rollNo} disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Input defaultValue={studentInfo.course} disabled />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Semester</label>
                <Input defaultValue={studentInfo.semester} disabled />
              </div>
            </div>

            <Input placeholder="Email Address" defaultValue="alex.johnson@student.college.edu" />
            <Input placeholder="Phone Number" defaultValue="+91 9876543210" />
            <Input placeholder="Address" />
            
            <Button className="erp-button-primary">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="erp-card">
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Your academic details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current CGPA</p>
                <p className="text-2xl font-bold text-success">{studentInfo.cgpa}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Academic Year</p>
                <p className="font-semibold">2023-2024</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Admission Date</p>
                <p className="font-semibold">Aug 15, 2023</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Expected Graduation</p>
                <p className="font-semibold">May 2027</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-semibold">Computer Science & Engineering</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Faculty Advisor</p>
              <p className="font-semibold">Dr. Sarah Thompson</p>
            </div>

            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download Academic Transcript
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard": return renderDashboardHome();
      case "fees": return renderFees();
      case "hostel": return renderHostel();
      case "exams": return renderExams();
      case "profile": return renderProfile();
      default: return renderDashboardHome();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar 
        role="student" 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default StudentDashboard;