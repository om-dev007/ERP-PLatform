import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Supabase } from "@/lib/supabaseClient";
import { GraduationCap, CheckCircle, Loader2, User, Mail, Phone, Calendar, MapPin, BookOpen, FileText, AlertCircle } from "lucide-react";

const AdmissionForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
    
    // Academic Information
    course: "",
    previous_qualification: "",
    
    // Additional Information
    notes: "",
    
    // Document submission
    documents_submitted: [] as string[],
    
    // Terms and conditions
    terms_accepted: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Available courses
  const courses = [
    "Computer Science",
    "Electronics Engineering", 
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering",
    "Information Technology",
    "Data Science",
    "Software Engineering",
    "Cybersecurity",
    "Artificial Intelligence",
    "Business Administration",
    "Economics",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Psychology",
    "English Literature",
    "History",
    "Political Science"
  ];

  // Available qualifications
  const qualifications = [
    "High School Diploma",
    "Associate Degree",
    "Bachelor's Degree",
    "Master's Degree",
    "GED (General Educational Development)",
    "International Baccalaureate (IB)",
    "A-Levels",
    "O-Levels",
    "Other"
  ];

  // Available documents
  const documentOptions = [
    "High School Transcript",
    "Birth Certificate",
    "Identity Document",
    "Passport Copy",
    "Medical Certificate",
    "Character Certificate",
    "Previous Academic Records",
    "Recommendation Letter",
    "Statement of Purpose",
    "Portfolio (if applicable)"
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDocumentChange = (document: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      documents_submitted: checked 
        ? [...prev.documents_submitted, document]
        : prev.documents_submitted.filter(doc => doc !== document)
    }));
  };

  const validateForm = () => {
    // Personal Information Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please enter your email address",
        variant: "destructive"
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.date_of_birth) {
      toast({
        title: "Validation Error",
        description: "Please enter your date of birth",
        variant: "destructive"
      });
      return false;
    }

    // Check if date of birth is valid (not in future, reasonable age)
    const birthDate = new Date(formData.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (birthDate > today) {
      toast({
        title: "Validation Error",
        description: "Date of birth cannot be in the future",
        variant: "destructive"
      });
      return false;
    }

    if (age < 16 || age > 100) {
      toast({
        title: "Validation Error",
        description: "Age must be between 16 and 100 years",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.address.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your address",
        variant: "destructive"
      });
      return false;
    }

    // Academic Information Validation
    if (!formData.course) {
      toast({
        title: "Validation Error",
        description: "Please select a course",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.previous_qualification) {
      toast({
        title: "Validation Error",
        description: "Please select your previous qualification",
        variant: "destructive"
      });
      return false;
    }

    // Terms and Conditions Validation
    if (!formData.terms_accepted) {
      toast({
        title: "Validation Error",
        description: "Please accept the terms and conditions",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting admission with data:', formData);
      
      const { data, error } = await Supabase
        .from('pending_admissions')
        .insert([
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            course: formData.course,
            date_of_birth: formData.date_of_birth,
            address: formData.address.trim(),
            previous_qualification: formData.previous_qualification,
            documents_submitted: formData.documents_submitted,
            notes: formData.notes.trim(),
            status: 'pending'
          }
        ])
        .select();

      if (error) {
        console.error('Error submitting admission:', error);
        toast({
          title: "Submission Error",
          description: `Failed to submit admission application: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('Successfully submitted admission:', data);

      // Success
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        course: ""
      });

      toast({
        title: "Application Submitted Successfully!",
        description: "Your admission application has been submitted and is under review.",
      });

    } catch (error) {
      console.error('Error submitting admission:', error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      address: "",
      course: "",
      previous_qualification: "",
      notes: "",
      documents_submitted: [],
      terms_accepted: false
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md erp-card">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h1>
              <p className="text-muted-foreground">
                Thank you for your interest in our college. Your admission application has been 
                successfully submitted and is now under review.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">What happens next?</p>
                <ul className="text-sm text-left space-y-1">
                  <li>• Your application will be reviewed by our admissions team</li>
                  <li>• You will receive an email confirmation shortly</li>
                  <li>• We will contact you within 3-5 business days</li>
                </ul>
              </div>
              <Button 
                onClick={resetForm}
                className="w-full erp-button-primary"
              >
                Submit Another Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl erp-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            Admission Application
          </CardTitle>
          <CardDescription className="text-lg">
            Apply for admission to our college. Fill out the form below and we'll get back to you soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="erp-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="erp-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="erp-input"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth" className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date of Birth *
                  </Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="erp-input"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Address *
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="erp-input min-h-[80px]"
                  required
                />
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Academic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="course" className="text-sm font-medium">
                    Desired Course *
                  </Label>
                  <Select
                    value={formData.course}
                    onValueChange={(value) => handleInputChange('course', value)}
                    required
                  >
                    <SelectTrigger className="erp-input">
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="previous_qualification" className="text-sm font-medium">
                    Previous Qualification *
                  </Label>
                  <Select
                    value={formData.previous_qualification}
                    onValueChange={(value) => handleInputChange('previous_qualification', value)}
                    required
                  >
                    <SelectTrigger className="erp-input">
                      <SelectValue placeholder="Select your qualification" />
                    </SelectTrigger>
                    <SelectContent>
                      {qualifications.map((qualification) => (
                        <SelectItem key={qualification} value={qualification}>
                          {qualification}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Document Submission Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Document Submission</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Please select the documents you will be submitting with your application:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {documentOptions.map((document) => (
                    <div key={document} className="flex items-center space-x-2">
                      <Checkbox
                        id={document}
                        checked={formData.documents_submitted.includes(document)}
                        onCheckedChange={(checked) => handleDocumentChange(document, checked as boolean)}
                      />
                      <Label htmlFor={document} className="text-sm font-medium">
                        {document}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information you'd like to share with the admissions committee..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="erp-input min-h-[100px]"
                />
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.terms_accepted}
                  onCheckedChange={(checked) => handleInputChange('terms_accepted', checked as boolean)}
                  required
                />
                <div className="space-y-1">
                  <Label htmlFor="terms" className="text-sm font-medium">
                    I accept the terms and conditions *
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    By checking this box, I confirm that all information provided is accurate and complete. 
                    I understand that providing false information may result in rejection of my application.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Important Information
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All fields marked with * are required</li>
                <li>• Please ensure your contact information is accurate</li>
                <li>• You will receive a confirmation email after submission</li>
                <li>• Our admissions team will review your application within 3-5 business days</li>
                <li>• Please have all required documents ready for verification</li>
              </ul>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 erp-button-primary"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  date_of_birth: "",
                  address: "",
                  course: "",
                  previous_qualification: "",
                  notes: "",
                  documents_submitted: [],
                  terms_accepted: false
                })}
                className="flex-1 erp-button-secondary"
                disabled={isSubmitting}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdmissionForm;
