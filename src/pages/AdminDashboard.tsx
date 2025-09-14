import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DashboardSidebar from "@/components/DashboardSidebar";
import ProfileSection from "@/components/ProfileSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Supabase } from "@/lib/supabaseClient";
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
  ArrowDownRight,
  Check,
  X
} from "lucide-react";

// Define the type for admission data
interface AdmissionData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  applied_at: string;
  date_of_birth?: string;
  address?: string;
  previous_qualification?: string;
  documents_submitted?: any[];
  notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

// Define the type for fee payment data
interface FeePaymentData {
  id: string;
  student_id: string;
  student_name: string;
  student_email: string;
  student_roll_no?: string;
  course: string;
  semester: string;
  academic_year: string;
  fee_type: string;
  fee_category: string;
  amount: number;
  paid_amount: number;
  balance_amount: number;
  payment_status: 'pending' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  payment_method?: string;
  payment_reference?: string;
  payment_date?: string;
  due_date: string;
  description?: string;
  receipt_number?: string;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get active section from URL or default to 'dashboard'
  const activeSection = section || "dashboard";
  
  // Debug logging
  console.log('AdminDashboard - activeSection:', activeSection);
  console.log('AdminDashboard - section param:', section);
  
  const [admissions, setAdmissions] = useState<AdmissionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionData | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // State for fee management
  const [feePayments, setFeePayments] = useState<FeePaymentData[]>([]);
  const [feeLoading, setFeeLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");

  // State for student account management
  const [students, setStudents] = useState<any[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [showCreateStudentDialog, setShowCreateStudentDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    date_of_birth: "",
    address: "",
    previous_qualification: "",
    semester: "1st Semester",
    academic_year: new Date().getFullYear().toString()
  });
  
  const { toast } = useToast();

  // Handle section changes and update URL
  const handleSectionChange = (newSection: string) => {
    if (newSection === "dashboard") {
      navigate("/admin-dashboard/dashboard");
    } else {
      navigate(`/admin-dashboard/${newSection}`);
    }
  };

  // Calculate stats from real data
  const stats = {
    totalStudents: 1247,
    totalStaff: 89,
    pendingAdmissions: admissions.filter(admission => admission.status === 'pending').length,
    hostelOccupancy: 85,
    feesCollected: feePayments
      .filter(payment => payment.payment_status === 'paid')
      .reduce((sum, payment) => sum + payment.paid_amount, 0),
    pendingFees: feePayments
      .filter(payment => payment.payment_status === 'pending' || payment.payment_status === 'partial')
      .reduce((sum, payment) => sum + payment.balance_amount, 0)
  };

  // Fetch admissions data from Supabase
  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await Supabase
        .from('pending_admissions')
        .select('*')
        .in('status', ['pending', 'under_review', 'rejected'])
        .order('applied_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching admissions:', error);
        toast({
          title: "Error",
          description: "Failed to fetch admissions data",
          variant: "destructive"
        });
        return;
      }
      
      setAdmissions(data || []);
    } catch (error) {
      console.error('Error fetching admissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admissions data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Approve admission - create student profile and move to active_students table
  const approveAdmission = async (admission: AdmissionData) => {
    try {
      console.log('Approving admission:', admission);
      
      // First, try to call the PostgreSQL function
      const { data: result, error: functionError } = await Supabase
        .rpc('approve_student_admission', {
          admission_id: admission.id,
          temp_password: 'TempPassword123!'
        });

      if (functionError) {
        console.log('Function not available, falling back to direct insert:', functionError.message);
        
        // Fallback: Direct insert into active_students table without user_id
        const { data: insertData, error: insertError } = await Supabase
          .from('active_students')
          .insert([
            {
              name: admission.name,
              email: admission.email,
              phone: admission.phone,
              course: admission.course,
              date_of_birth: admission.date_of_birth,
              address: admission.address,
              previous_qualification: admission.previous_qualification,
              documents_submitted: admission.documents_submitted,
              notes: admission.notes,
              approved_at: new Date().toISOString(),
              academic_year: new Date().getFullYear().toString(),
              semester: '1st Semester'
            }
          ])
          .select();

        if (insertError) {
          console.error('Error inserting into active_students:', insertError);
          toast({
            title: "Error",
            description: `Failed to approve admission: ${insertError.message}`,
            variant: "destructive"
          });
          return;
        }

        console.log('Successfully inserted into active_students:', insertData);

        // Delete from pending_admissions table
        const { error: deleteError } = await Supabase
          .from('pending_admissions')
          .delete()
          .eq('id', admission.id);

        if (deleteError) {
          console.error('Error deleting from pending_admissions:', deleteError);
          toast({
            title: "Error",
            description: `Failed to remove from pending list: ${deleteError.message}`,
            variant: "destructive"
          });
          return;
        }

        console.log('Successfully deleted from pending_admissions');
        
        // Refresh the admissions list
        await fetchAdmissions();
        
        toast({
          title: "Success",
          description: "Admission approved successfully! Student has been added to active students. Note: Student will need to register separately to get login access.",
        });
        return;
      }

      // Function executed successfully
      if (result?.success) {
        console.log('Successfully approved admission via function:', result);
        
        // Refresh the admissions list
        await fetchAdmissions();
        
        toast({
          title: "Success",
          description: `Admission approved successfully! Student account created. Email: ${result.email}, Temporary Password: ${result.temp_password}`,
        });
      } else {
        console.error('Function returned error:', result);
        toast({
          title: "Error",
          description: `Failed to approve admission: ${result?.message || 'Unknown error'}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error approving admission:', error);
      toast({
        title: "Error",
        description: `Failed to approve admission: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  // Reject admission - move to rejected_admissions table
  const rejectAdmission = async (admission: AdmissionData, rejectionReason?: string) => {
    try {
      console.log('Rejecting admission:', admission);
      
      // First, try to insert into rejected_admissions table
      const { data: insertData, error: insertError } = await Supabase
        .from('rejected_admissions')
        .insert([
          {
            name: admission.name,
            email: admission.email,
            phone: admission.phone,
            course: admission.course,
            date_of_birth: admission.date_of_birth,
            address: admission.address,
            previous_qualification: admission.previous_qualification,
            documents_submitted: admission.documents_submitted,
            notes: rejectionReason ? 
              `${admission.notes || ''}\n\nRejection Reason: ${rejectionReason}`.trim() : 
              admission.notes,
            applied_at: admission.applied_at,
            rejected_at: new Date().toISOString(),
            rejected_by: 'admin' // You can get this from current user context
          }
        ])
        .select();

      if (insertError) {
        console.log('rejected_admissions table not found, falling back to status update:', insertError.message);
        
        // Fallback: Update status in pending_admissions table
        const { error: updateError } = await Supabase
          .from('pending_admissions')
          .update({
            status: 'rejected',
            notes: rejectionReason ? 
              `${admission.notes || ''}\n\nRejection Reason: ${rejectionReason}`.trim() : 
              admission.notes,
            reviewed_at: new Date().toISOString()
          })
          .eq('id', admission.id);

        if (updateError) {
          console.error('Error updating admission status:', updateError);
          toast({
            title: "Error",
            description: `Failed to reject admission: ${updateError.message}`,
            variant: "destructive"
          });
          return;
        }

        console.log('Successfully updated admission status to rejected');
        
        // Refresh the admissions list
        await fetchAdmissions();
        
        toast({
          title: "Success",
          description: "Admission rejected successfully! Application status updated.",
        });
        return;
      }

      console.log('Successfully inserted into rejected_admissions:', insertData);

      // Delete from pending_admissions table
      const { error: deleteError } = await Supabase
        .from('pending_admissions')
        .delete()
        .eq('id', admission.id);

      if (deleteError) {
        console.error('Error deleting from pending_admissions:', deleteError);
        toast({
          title: "Error",
          description: `Failed to remove from pending list: ${deleteError.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Successfully deleted from pending_admissions');
      
      // Refresh the admissions list
      await fetchAdmissions();
      
      toast({
        title: "Success",
        description: "Admission rejected successfully! Application moved to rejected list.",
      });
    } catch (error) {
      console.error('Error rejecting admission:', error);
      toast({
        title: "Error",
        description: `Failed to reject admission: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  // View admission details
  const viewAdmission = (admission: AdmissionData) => {
    setSelectedAdmission(admission);
    setViewDialogOpen(true);
  };

  // Fetch students from active_students table
  const fetchStudents = async () => {
    setStudentLoading(true);
    try {
      const { data, error } = await Supabase
        .from('active_students')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching students:', error);
        toast({
          title: "Error",
          description: "Failed to fetch students data",
          variant: "destructive"
        });
        return;
      }
      
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to fetch students data",
        variant: "destructive"
      });
    } finally {
      setStudentLoading(false);
    }
  };

  // Create new student account
  const createStudentAccount = async () => {
    try {
      // Validate required fields
      if (!newStudent.name || !newStudent.email || !newStudent.course) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields (Name, Email, Course)",
          variant: "destructive"
        });
        return;
      }

      // Check if email already exists
      const { data: existingStudent } = await Supabase
        .from('active_students')
        .select('email')
        .eq('email', newStudent.email)
        .single();

      if (existingStudent) {
        toast({
          title: "Error",
          description: "A student with this email already exists",
          variant: "destructive"
        });
        return;
      }

      // Insert new student
      const { data, error } = await Supabase
        .from('active_students')
        .insert([
          {
            name: newStudent.name,
            email: newStudent.email,
            phone: newStudent.phone,
            course: newStudent.course,
            date_of_birth: newStudent.date_of_birth,
            address: newStudent.address,
            previous_qualification: newStudent.previous_qualification,
            semester: newStudent.semester,
            academic_year: newStudent.academic_year,
            approved_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error('Error creating student:', error);
        toast({
          title: "Error",
          description: `Failed to create student account: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Successfully created student:', data);
      
      // Reset form
      setNewStudent({
        name: "",
        email: "",
        phone: "",
        course: "",
        date_of_birth: "",
        address: "",
        previous_qualification: "",
        semester: "1st Semester",
        academic_year: new Date().getFullYear().toString()
      });
      
      setShowCreateStudentDialog(false);
      
      // Refresh students list
      await fetchStudents();
      
      toast({
        title: "Success",
        description: "Student account created successfully! Student can now register with this email to get login access.",
      });
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Error",
        description: `Failed to create student account: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  // Delete student account
  const deleteStudentAccount = async (studentId: string, studentName: string) => {
    if (!confirm(`Are you sure you want to delete ${studentName}'s account? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await Supabase
        .from('active_students')
        .delete()
        .eq('id', studentId);

      if (error) {
        console.error('Error deleting student:', error);
        toast({
          title: "Error",
          description: `Failed to delete student account: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      // Refresh students list
      await fetchStudents();
      
      toast({
        title: "Success",
        description: "Student account deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: `Failed to delete student account: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    }
  };

  // Filter students based on search
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  // Fetch fee payments data from Supabase
  const fetchFeePayments = async () => {
    setFeeLoading(true);
    try {
      const { data, error } = await Supabase
        .from('fee_payments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching fee payments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch fee payments data",
          variant: "destructive"
        });
        return;
      }
      
      setFeePayments(data || []);
    } catch (error) {
      console.error('Error fetching fee payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch fee payments data",
        variant: "destructive"
      });
    } finally {
      setFeeLoading(false);
    }
  };

  // Filter fee payments based on search and filters
  const filteredFeePayments = feePayments.filter(payment => {
    const matchesSearch = 
      payment.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.student_roll_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.receipt_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || payment.payment_status === statusFilter;
    const matchesCourse = courseFilter === "all" || payment.course === courseFilter;
    const matchesSemester = semesterFilter === "all" || payment.semester === semesterFilter;
    
    return matchesSearch && matchesStatus && matchesCourse && matchesSemester;
  });

  // Get unique courses for filter dropdown
  const uniqueCourses = [...new Set(feePayments.map(payment => payment.course))];
  
  // Get unique semesters for filter dropdown
  const uniqueSemesters = [...new Set(feePayments.map(payment => payment.semester))];

  // Download receipt for a specific payment
  const downloadReceipt = (payment: FeePaymentData) => {
    if (!payment.receipt_number) {
      toast({
        title: "Error",
        description: "No receipt available for this payment",
        variant: "destructive"
      });
      return;
    }

    // Create receipt content
    const receiptContent = `
FEE PAYMENT RECEIPT
==================

Receipt Number: ${payment.receipt_number}
Date: ${new Date(payment.payment_date || payment.created_at).toLocaleDateString()}

STUDENT DETAILS:
Name: ${payment.student_name}
Email: ${payment.student_email}
Roll No: ${payment.student_roll_no || 'N/A'}
Course: ${payment.course}
Semester: ${payment.semester}
Academic Year: ${payment.academic_year}

PAYMENT DETAILS:
Fee Type: ${payment.fee_type}
Fee Category: ${payment.fee_category}
Total Amount: ₹${payment.amount.toLocaleString()}
Paid Amount: ₹${payment.paid_amount.toLocaleString()}
Balance Amount: ₹${payment.balance_amount.toLocaleString()}
Payment Status: ${payment.payment_status.toUpperCase()}
Payment Method: ${payment.payment_method || 'N/A'}
Payment Reference: ${payment.payment_reference || 'N/A'}
Due Date: ${new Date(payment.due_date).toLocaleDateString()}

Description: ${payment.description || 'N/A'}

---
Generated on: ${new Date().toLocaleString()}
    `.trim();

    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${payment.receipt_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Receipt Downloaded",
      description: `Receipt ${payment.receipt_number} has been downloaded successfully`,
    });
  };

  // Handle URL changes and redirect to dashboard if on base route
  useEffect(() => {
    if (location.pathname === '/admin-dashboard') {
      // If user is on base admin-dashboard route, redirect to dashboard section
      navigate('/admin-dashboard/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Load admissions when component mounts or when admissions section is active
  useEffect(() => {
    if (activeSection === 'admissions') {
      fetchAdmissions();
    }
  }, [activeSection]);

  // Load fee payments when fees section is active
  useEffect(() => {
    if (activeSection === 'fees') {
      fetchFeePayments();
    }
  }, [activeSection]);

  // Load students when student management section is active
  useEffect(() => {
    if (activeSection === 'student-accounts') {
      fetchStudents();
    }
  }, [activeSection]);

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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Loading admissions...</div>
              </div>
            ) : (
            <table className="erp-table">
              <thead className="erp-table-header">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Course</th>
                  <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Applied Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                  {admissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No admissions found
                      </td>
                    </tr>
                  ) : (
                    admissions.map((admission) => (
                  <tr key={admission.id} className="erp-table-row">
                    <td className="px-4 py-3 font-medium">{admission.name}</td>
                    <td className="px-4 py-3">{admission.course}</td>
                    <td className="px-4 py-3">
                          <Badge 
                            variant={
                              admission.status === "approved" ? "default" : 
                              admission.status === "rejected" ? "destructive" : 
                              "secondary"
                            }
                          >
                            {admission.status.charAt(0).toUpperCase() + admission.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(admission.applied_at).toLocaleDateString()}
                        </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => viewAdmission(admission)}
                              title="View Details"
                            >
                          <Eye className="h-4 w-4" />
                        </Button>
                            {admission.status === 'pending' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => approveAdmission(admission)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  title="Approve"
                                >
                                  <Check className="h-4 w-4" />
                        </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => rejectAdmission(admission)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title="Reject"
                                >
                                  <X className="h-4 w-4" />
                        </Button>
                              </>
                            )}
                            {admission.status === 'under_review' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => approveAdmission(admission)}
                                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                  title="Approve"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => rejectAdmission(admission)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  title="Reject"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {admission.status === 'rejected' && (
                              <span className="text-sm text-muted-foreground">
                                Rejected
                              </span>
                            )}
                      </div>
                    </td>
                  </tr>
                    ))
                  )}
              </tbody>
            </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Admission Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Admission Details</DialogTitle>
            <DialogDescription>
              Complete information for the selected admission application
            </DialogDescription>
          </DialogHeader>
          {selectedAdmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
        <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-sm">{selectedAdmission.name}</p>
        </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{selectedAdmission.email}</p>
      </div>
              <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm">{selectedAdmission.phone || 'Not provided'}</p>
              </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Course</label>
                  <p className="text-sm">{selectedAdmission.course}</p>
            </div>
              <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge 
                    variant={
                      selectedAdmission.status === "approved" ? "default" : 
                      selectedAdmission.status === "rejected" ? "destructive" : 
                      "secondary"
                    }
                  >
                    {selectedAdmission.status.charAt(0).toUpperCase() + selectedAdmission.status.slice(1).replace('_', ' ')}
                  </Badge>
              </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Applied Date</label>
                  <p className="text-sm">{new Date(selectedAdmission.applied_at).toLocaleDateString()}</p>
            </div>
                {selectedAdmission.date_of_birth && (
              <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="text-sm">{new Date(selectedAdmission.date_of_birth).toLocaleDateString()}</p>
              </div>
                )}
                {selectedAdmission.previous_qualification && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Previous Qualification</label>
                    <p className="text-sm">{selectedAdmission.previous_qualification}</p>
            </div>
                )}
      </div>
              {selectedAdmission.address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Address</label>
                  <p className="text-sm">{selectedAdmission.address}</p>
                </div>
              )}
              {selectedAdmission.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notes</label>
                  <p className="text-sm">{selectedAdmission.notes}</p>
                </div>
              )}
              {selectedAdmission.reviewed_at && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reviewed At</label>
                  <p className="text-sm">{new Date(selectedAdmission.reviewed_at).toLocaleString()}</p>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setViewDialogOpen(false)}
                >
                  Close
                </Button>
                {selectedAdmission.status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => {
                        approveAdmission(selectedAdmission);
                        setViewDialogOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        rejectAdmission(selectedAdmission);
                        setViewDialogOpen(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {selectedAdmission.status === 'under_review' && (
                  <>
                    <Button 
                      onClick={() => {
                        approveAdmission(selectedAdmission);
                        setViewDialogOpen(false);
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => {
                        rejectAdmission(selectedAdmission);
                        setViewDialogOpen(false);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {selectedAdmission.status === 'rejected' && (
                  <div className="text-sm text-muted-foreground">
                    This application has been rejected
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderFees = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fee Management</h1>
        <p className="text-muted-foreground">Track payments and generate receipts</p>
      </div>

      {/* Fee Collection Table */}
      <Card className="erp-card">
        <CardHeader>
          <CardTitle>Fee Collection Table</CardTitle>
          <CardDescription>Detailed view of all fee transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Input 
                placeholder="Search by student name, email, roll no, or receipt number..." 
                className="flex-1" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select 
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="all">All Courses</option>
                  {uniqueCourses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
                <select 
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                >
                  <option value="all">All Semesters</option>
                  {uniqueSemesters.map(semester => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
            </div>
            </div>

            {/* Loading State */}
            {feeLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading fee payments...</p>
                </div>
              </div>
            ) : filteredFeePayments.length === 0 ? (
              <div className="bg-muted/30 p-8 rounded-lg text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">No fee payments found</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || statusFilter !== "all" || courseFilter !== "all" || semesterFilter !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Fee payments will appear here once students start making payments"}
                </p>
              </div>
            ) : (
              /* Fee Payments Table */
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Student</th>
                      <th className="text-left p-3 font-medium">Course</th>
                      <th className="text-left p-3 font-medium">Fee Type</th>
                      <th className="text-right p-3 font-medium">Amount</th>
                      <th className="text-right p-3 font-medium">Paid</th>
                      <th className="text-right p-3 font-medium">Balance</th>
                      <th className="text-center p-3 font-medium">Status</th>
                      <th className="text-center p-3 font-medium">Due Date</th>
                      <th className="text-center p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeePayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-muted/50">
                        <td className="p-3">
                          <div>
                            <p className="font-medium">{payment.student_name}</p>
                            <p className="text-sm text-muted-foreground">{payment.student_email}</p>
                            {payment.student_roll_no && (
                              <p className="text-xs text-muted-foreground">Roll: {payment.student_roll_no}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="text-sm">{payment.course}</p>
                            <p className="text-xs text-muted-foreground">{payment.semester}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="text-sm font-medium">{payment.fee_type}</p>
                            <p className="text-xs text-muted-foreground">{payment.fee_category}</p>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                        </td>
                        <td className="p-3 text-right">
                          <p className="text-success font-medium">₹{payment.paid_amount.toLocaleString()}</p>
                        </td>
                        <td className="p-3 text-right">
                          <p className={`font-medium ${payment.balance_amount > 0 ? 'text-warning' : 'text-success'}`}>
                            ₹{payment.balance_amount.toLocaleString()}
                          </p>
                        </td>
                        <td className="p-3 text-center">
                          <Badge 
                            variant={
                              payment.payment_status === 'paid' ? 'default' :
                              payment.payment_status === 'partial' ? 'secondary' :
                              payment.payment_status === 'overdue' ? 'destructive' :
                              payment.payment_status === 'cancelled' ? 'outline' :
                              'secondary'
                            }
                          >
                            {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <p className="text-sm">{new Date(payment.due_date).toLocaleDateString()}</p>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {payment.receipt_number && (
              <Button 
                                size="sm"
                                variant="outline"
                                onClick={() => downloadReceipt(payment)}
                                className="h-8"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Receipt
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                // View payment details
                                toast({
                                  title: "Payment Details",
                                  description: `Viewing details for ${payment.student_name}'s ${payment.fee_type} payment`,
                                });
                              }}
                            >
                              <Eye className="h-3 w-3" />
              </Button>
            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary Stats */}
            {filteredFeePayments.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">
                    ₹{filteredFeePayments
                      .filter(p => p.payment_status === 'paid')
                      .reduce((sum, p) => sum + p.paid_amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Collected</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-warning">
                    ₹{filteredFeePayments
                      .filter(p => p.payment_status === 'pending' || p.payment_status === 'partial')
                      .reduce((sum, p) => sum + p.balance_amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Amount</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-destructive">
                    ₹{filteredFeePayments
                      .filter(p => p.payment_status === 'overdue')
                      .reduce((sum, p) => sum + p.balance_amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Overdue Amount</p>
                </div>
              </div>
            )}
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

  const renderStudentAccounts = () => {
    console.log('renderStudentAccounts called');
    console.log('students:', students);
    console.log('studentLoading:', studentLoading);
    
    // Simple test to see if this renders at all
    return (
    <div className="space-y-6">
      <div className="bg-red-100 p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-red-800">TEST: Student Accounts Section</h1>
        <p className="text-red-600">If you can see this, the section is working!</p>
        <p className="text-sm text-red-500">Students count: {students.length}</p>
        <p className="text-sm text-red-500">Loading: {studentLoading ? 'Yes' : 'No'}</p>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Account Management</h1>
          <p className="text-muted-foreground">Create and manage student accounts</p>
        </div>
        <Button 
          className="erp-button-primary"
          onClick={() => setShowCreateStudentDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Student Account
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-foreground">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active This Year</p>
                <p className="text-2xl font-bold text-foreground">
                  {students.filter(s => s.academic_year === new Date().getFullYear().toString()).length}
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="erp-stat-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">With Login Access</p>
                <p className="text-2xl font-bold text-foreground">
                  {students.filter(s => s.user_id).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="erp-card">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Input 
              placeholder="Search students by name, email, or course..." 
              className="flex-1" 
              value={studentSearchTerm}
              onChange={(e) => setStudentSearchTerm(e.target.value)}
            />
            <Button variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card className="erp-card">
        <CardHeader>
          <CardTitle>Student Accounts</CardTitle>
          <CardDescription>Manage all student accounts in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {studentLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading students...</p>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-muted/30 p-8 rounded-lg text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">No students found</p>
              <p className="text-sm text-muted-foreground">
                {studentSearchTerm ? "Try adjusting your search criteria" : "Create your first student account to get started"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Student</th>
                    <th className="text-left p-3 font-medium">Course</th>
                    <th className="text-left p-3 font-medium">Semester</th>
                    <th className="text-left p-3 font-medium">Academic Year</th>
                    <th className="text-center p-3 font-medium">Login Access</th>
                    <th className="text-center p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                          {student.phone && (
                            <p className="text-xs text-muted-foreground">{student.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="text-sm">{student.course}</p>
                      </td>
                      <td className="p-3">
                        <p className="text-sm">{student.semester}</p>
                      </td>
                      <td className="p-3">
                        <p className="text-sm">{student.academic_year}</p>
                      </td>
                      <td className="p-3 text-center">
                        {student.user_id ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // View student details
                              toast({
                                title: "Student Details",
                                description: `Viewing details for ${student.name}`,
                              });
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteStudentAccount(student.id, student.name)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    );
  };

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
            <Button 
              className="w-full erp-button-secondary"
              onClick={() => navigate('/admin-dashboard/student-accounts')}
            >
              Manage Student Accounts
            </Button>
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
    console.log('renderContent - activeSection:', activeSection);
    switch (activeSection) {
      case "dashboard": return renderDashboardHome();
      case "admissions": return renderAdmissions();
      case "fees": return renderFees();
      case "hostel": return renderHostel();
      case "exams": return renderExams();
      case "reports": return renderReports();
      case "profile": return <ProfileSection />;
      case "settings": return renderSettings();
      case "student-accounts": 
        console.log('Rendering student accounts section');
        return (
          <div>
            <div className="bg-blue-100 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-bold text-blue-800">DEBUG: Student Accounts Route Working!</h2>
              <p className="text-blue-600">activeSection: {activeSection}</p>
            </div>
            {renderStudentAccounts()}
          </div>
        );
      default: 
        console.log('Default case - rendering dashboard home');
        return renderDashboardHome();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar 
        role="admin" 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      <main className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </main>

      {/* Create Student Dialog */}
      <Dialog open={showCreateStudentDialog} onOpenChange={setShowCreateStudentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Student Account</DialogTitle>
            <DialogDescription>
              Add a new student to the system. The student will be able to register with this email to get login access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date of Birth</label>
                <Input
                  type="date"
                  value={newStudent.date_of_birth}
                  onChange={(e) => setNewStudent({...newStudent, date_of_birth: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Course *</label>
                <Input
                  value={newStudent.course}
                  onChange={(e) => setNewStudent({...newStudent, course: e.target.value})}
                  placeholder="Enter course name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Semester</label>
                <select
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={newStudent.semester}
                  onChange={(e) => setNewStudent({...newStudent, semester: e.target.value})}
                >
                  <option value="1st Semester">1st Semester</option>
                  <option value="2nd Semester">2nd Semester</option>
                  <option value="3rd Semester">3rd Semester</option>
                  <option value="4th Semester">4th Semester</option>
                  <option value="5th Semester">5th Semester</option>
                  <option value="6th Semester">6th Semester</option>
                  <option value="7th Semester">7th Semester</option>
                  <option value="8th Semester">8th Semester</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <Input
                value={newStudent.address}
                onChange={(e) => setNewStudent({...newStudent, address: e.target.value})}
                placeholder="Enter address"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Previous Qualification</label>
              <Input
                value={newStudent.previous_qualification}
                onChange={(e) => setNewStudent({...newStudent, previous_qualification: e.target.value})}
                placeholder="Enter previous qualification"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateStudentDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="erp-button-primary"
                onClick={createStudentAccount}
              >
                Create Student Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;