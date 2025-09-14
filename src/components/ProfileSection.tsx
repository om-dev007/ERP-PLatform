import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Supabase } from '@/lib/supabaseClient';
import { User, Mail, Phone, BookOpen, Calendar, MapPin, FileText } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  course?: string;
  department?: string;
  created_at?: string;
  updated_at?: string;
}

interface StudentDetails {
  student_id?: string;
  date_of_birth?: string;
  address?: string;
  previous_qualification?: string;
  documents_submitted?: string[];
  notes?: string;
  admission_date?: string;
  academic_year?: string;
  semester?: string;
  status?: string;
}

const ProfileSection: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile data from role-specific tables
  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user }, error: userError } = await Supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting user:', userError);
        toast({
          title: "Error",
          description: "Failed to get user information",
          variant: "destructive"
        });
        return;
      }

      let userProfile: UserProfile | null = null;
      let studentDetails: StudentDetails | null = null;

      // Check which table the user exists in
      // Try admins table first
      const { data: adminData, error: adminError } = await Supabase
        .from('admins')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!adminError && adminData) {
        // User is an admin
        userProfile = {
          id: user.id,
          name: adminData.name || 'Not provided',
          email: user.email || 'Not provided',
          role: 'admin',
          phone: adminData.phone || 'Not provided',
          department: adminData.department || 'Not provided',
          created_at: adminData.created_at,
          updated_at: adminData.updated_at
        };
      } else {
        // Try staff table
        const { data: staffData, error: staffError } = await Supabase
          .from('staff')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!staffError && staffData) {
          // User is staff
          userProfile = {
            id: user.id,
            name: staffData.name || 'Not provided',
            email: user.email || 'Not provided',
            role: 'staff',
            phone: staffData.phone || 'Not provided',
            department: staffData.department || 'Not provided',
            created_at: staffData.created_at,
            updated_at: staffData.updated_at
          };
        } else {
          // Try active_students table
          const { data: studentData, error: studentError } = await Supabase
            .from('active_students')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (!studentError && studentData) {
            // User is a student
            userProfile = {
              id: user.id,
              name: studentData.name || 'Not provided',
              email: user.email || 'Not provided',
              role: 'student',
              phone: studentData.phone || 'Not provided',
              course: studentData.course || 'Not provided',
              created_at: studentData.created_at,
              updated_at: studentData.updated_at
            };
            studentDetails = studentData;
          } else {
            // User not found in any table
            console.error('User not found in any role-specific table');
            toast({
              title: "Error",
              description: "User profile not found. Please contact support.",
              variant: "destructive"
            });
            return;
          }
        }
      }

      if (userProfile) {
        setProfile(userProfile);
        if (studentDetails) {
          setStudentDetails(studentDetails);
        }
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-erp-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load profile information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-muted-foreground">View your account information and personal details</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Information - Left Column */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <User className="h-5 w-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-erp-primary/20 to-erp-primary/10 flex items-center justify-center border-4 border-erp-primary/20 shadow-lg mx-auto">
                <User className="h-16 w-16 text-erp-primary/60" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <Badge variant="outline" className="text-sm">
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information - Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your account details and role information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    {profile.name || 'Not provided'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    {profile.email || 'Not provided'}
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    {profile.phone || 'Not provided'}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    Role
                  </Label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    <Badge variant="outline">
                      {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              {(profile.course || profile.department) && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <BookOpen className="h-4 w-4" />
                    {profile.role === 'student' ? 'Course' : 'Department'}
                  </Label>
                  <div className="p-3 bg-muted/50 rounded-lg border">
                    {profile.course || profile.department}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Account Created:</span>
                  <p className="text-foreground">{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</p>
                </div>
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">Last Updated:</span>
                  <p className="text-foreground">{profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Unknown'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student-specific information */}
          {profile.role === 'student' && studentDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Academic Information
                </CardTitle>
                <CardDescription>
                  Your academic details and enrollment information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {studentDetails.student_id && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4" />
                        Student ID
                      </Label>
                      <div className="p-3 bg-muted/50 rounded-lg border">
                        {studentDetails.student_id}
                      </div>
                    </div>
                  )}

                  {studentDetails.course && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <BookOpen className="h-4 w-4" />
                        Course
                      </Label>
                      <div className="p-3 bg-muted/50 rounded-lg border">
                        {studentDetails.course}
                      </div>
                    </div>
                  )}

                  {studentDetails.academic_year && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4" />
                        Academic Year
                      </Label>
                      <div className="p-3 bg-muted/50 rounded-lg border">
                        {studentDetails.academic_year}
                      </div>
                    </div>
                  )}

                  {studentDetails.semester && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="h-4 w-4" />
                        Semester
                      </Label>
                      <div className="p-3 bg-muted/50 rounded-lg border">
                        {studentDetails.semester}
                      </div>
                    </div>
                  )}

                  {studentDetails.status && (
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4" />
                        Status
                      </Label>
                      <div className="p-3 bg-muted/50 rounded-lg border">
                        <Badge variant="outline">
                          {studentDetails.status}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {studentDetails.date_of_birth && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      Date of Birth
                    </Label>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      {new Date(studentDetails.date_of_birth).toLocaleDateString()}
                    </div>
                  </div>
                )}

                {studentDetails.address && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4" />
                      Address
                    </Label>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      {studentDetails.address}
                    </div>
                  </div>
                )}

                {studentDetails.previous_qualification && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      Previous Qualification
                    </Label>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      {studentDetails.previous_qualification}
                    </div>
                  </div>
                )}

                {studentDetails.documents_submitted && studentDetails.documents_submitted.length > 0 && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      Documents Submitted
                    </Label>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      <div className="flex flex-wrap gap-2">
                        {studentDetails.documents_submitted.map((doc, index) => (
                          <Badge key={index} variant="outline">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {studentDetails.notes && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <FileText className="h-4 w-4" />
                      Notes
                    </Label>
                    <div className="p-3 bg-muted/50 rounded-lg border">
                      {studentDetails.notes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;