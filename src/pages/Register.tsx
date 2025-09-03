import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  Upload,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    collegeName: "",
    establishedYear: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    email: "",
    website: "",
    principalName: "",
    principalEmail: "",
    principalPhone: "",
    affiliatedUniversity: "",
    accreditation: "",
    studentCapacity: "",
    logo: null,
    certificate: null
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const steps = [
    { number: 1, title: "College Information", description: "Basic details about your institution" },
    { number: 2, title: "Contact Details", description: "Address and communication information" },
    { number: 3, title: "Administration", description: "Principal and management details" },
    { number: 4, title: "Accreditation", description: "University affiliation and certificates" }
  ];

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.collegeName) newErrors.collegeName = "College name is required";
        if (!formData.establishedYear) newErrors.establishedYear = "Established year is required";
        break;
      case 2:
        if (!formData.address) newErrors.address = "Address is required";
        if (!formData.city) newErrors.city = "City is required";
        if (!formData.state) newErrors.state = "State is required";
        if (!formData.pincode) newErrors.pincode = "Pincode is required";
        if (!formData.phone) newErrors.phone = "Phone number is required";
        if (!formData.email) newErrors.email = "Email is required";
        break;
      case 3:
        if (!formData.principalName) newErrors.principalName = "Principal name is required";
        if (!formData.principalEmail) newErrors.principalEmail = "Principal email is required";
        if (!formData.principalPhone) newErrors.principalPhone = "Principal phone is required";
        break;
      case 4:
        if (!formData.affiliatedUniversity) newErrors.affiliatedUniversity = "University affiliation is required";
        if (!formData.accreditation) newErrors.accreditation = "Accreditation details are required";
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (validateStep(4)) {
      toast({
        title: "Registration Successful!",
        description: "Your college has been registered successfully. Redirecting to login...",
      });
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileUpload = (field: string) => {
    // Mock file upload
    setFormData(prev => ({ ...prev, [field]: "uploaded" }));
    toast({
      title: "File Uploaded",
      description: `${field} has been uploaded successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">EduFlow ERP</span>
            </Link>
            <Link to="/login">
              <Button variant="ghost">Already have an account?</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number 
                      ? 'bg-primary text-primary-foreground border-primary' 
                      : 'border-border text-muted-foreground'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.number}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step.number ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-muted-foreground">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <Card className="erp-card">
            <CardHeader>
              <CardTitle>Step {currentStep} of 4</CardTitle>
              <CardDescription>
                Please fill in all required fields to continue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: College Information */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="collegeName">College Name *</Label>
                    <Input
                      id="collegeName"
                      value={formData.collegeName}
                      onChange={(e) => handleInputChange("collegeName", e.target.value)}
                      className={errors.collegeName ? "border-destructive" : ""}
                      placeholder="Enter college name"
                    />
                    {errors.collegeName && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.collegeName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">Established Year *</Label>
                    <Input
                      id="establishedYear"
                      type="number"
                      value={formData.establishedYear}
                      onChange={(e) => handleInputChange("establishedYear", e.target.value)}
                      className={errors.establishedYear ? "border-destructive" : ""}
                      placeholder="YYYY"
                    />
                    {errors.establishedYear && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.establishedYear}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://www.college.edu"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>College Logo</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                         onClick={() => handleFileUpload("logo")}>
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload logo (PNG, JPG up to 5MB)
                      </p>
                      {formData.logo && (
                        <Badge variant="outline" className="mt-2">
                          Logo uploaded
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Details */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={errors.address ? "border-destructive" : ""}
                      placeholder="Complete address"
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={errors.city ? "border-destructive" : ""}
                      placeholder="City name"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className={errors.state ? "border-destructive" : ""}
                      placeholder="State name"
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.state}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      className={errors.pincode ? "border-destructive" : ""}
                      placeholder="6-digit pincode"
                    />
                    {errors.pincode && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.pincode}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-destructive" : ""}
                      placeholder="+91 9876543210"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-destructive" : ""}
                      placeholder="college@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Administration */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="principalName">Principal Name *</Label>
                    <Input
                      id="principalName"
                      value={formData.principalName}
                      onChange={(e) => handleInputChange("principalName", e.target.value)}
                      className={errors.principalName ? "border-destructive" : ""}
                      placeholder="Dr. Principal Name"
                    />
                    {errors.principalName && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.principalName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="principalEmail">Principal Email *</Label>
                    <Input
                      id="principalEmail"
                      type="email"
                      value={formData.principalEmail}
                      onChange={(e) => handleInputChange("principalEmail", e.target.value)}
                      className={errors.principalEmail ? "border-destructive" : ""}
                      placeholder="principal@college.edu"
                    />
                    {errors.principalEmail && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.principalEmail}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="principalPhone">Principal Phone *</Label>
                    <Input
                      id="principalPhone"
                      value={formData.principalPhone}
                      onChange={(e) => handleInputChange("principalPhone", e.target.value)}
                      className={errors.principalPhone ? "border-destructive" : ""}
                      placeholder="+91 9876543210"
                    />
                    {errors.principalPhone && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.principalPhone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="studentCapacity">Student Capacity</Label>
                    <Input
                      id="studentCapacity"
                      type="number"
                      value={formData.studentCapacity}
                      onChange={(e) => handleInputChange("studentCapacity", e.target.value)}
                      placeholder="Total student capacity"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Accreditation */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="affiliatedUniversity">Affiliated University *</Label>
                    <Input
                      id="affiliatedUniversity"
                      value={formData.affiliatedUniversity}
                      onChange={(e) => handleInputChange("affiliatedUniversity", e.target.value)}
                      className={errors.affiliatedUniversity ? "border-destructive" : ""}
                      placeholder="University name"
                    />
                    {errors.affiliatedUniversity && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.affiliatedUniversity}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accreditation">Accreditation Details *</Label>
                    <Input
                      id="accreditation"
                      value={formData.accreditation}
                      onChange={(e) => handleInputChange("accreditation", e.target.value)}
                      className={errors.accreditation ? "border-destructive" : ""}
                      placeholder="NAAC A+, NBA, etc."
                    />
                    {errors.accreditation && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.accreditation}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Accreditation Certificate</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                         onClick={() => handleFileUpload("certificate")}>
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload certificate (PDF up to 10MB)
                      </p>
                      {formData.certificate && (
                        <Badge variant="outline" className="mt-2">
                          Certificate uploaded
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="erp-button-secondary"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button onClick={handleNext} className="erp-button-primary">
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="erp-button-primary">
                    Register College
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;