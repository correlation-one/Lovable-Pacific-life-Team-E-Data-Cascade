import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, User, Car, MapPin, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ValidationError {
  field: string;
  message: string;
  suggestion?: string;
}

// City to state mapping for validation demo
const cityStateMap: Record<string, string[]> = {
  "miami": ["FL"],
  "orlando": ["FL"],
  "tampa": ["FL"],
  "jacksonville": ["FL"],
  "dallas": ["TX"],
  "houston": ["TX"],
  "austin": ["TX"],
  "san antonio": ["TX"],
  "los angeles": ["CA"],
  "san francisco": ["CA"],
  "san diego": ["CA"],
  "new york": ["NY"],
  "buffalo": ["NY"],
  "chicago": ["IL"],
  "springfield": ["IL", "MA", "MO", "OH"],
  "portland": ["OR", "ME"],
  "columbus": ["OH", "GA"],
};

const states = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" }, { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" }, { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" }, { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" }, { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" }, { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" }, { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" }, { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" }, { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" },
];

export function ApplicationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    licenseNumber: "",
    licenseState: "",
    policyAmount: "500000",
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  // Real-time validation effect
  useEffect(() => {
    const newErrors: ValidationError[] = [];
    
    // City-State mismatch validation
    if (formData.city && formData.state) {
      const cityLower = formData.city.toLowerCase().trim();
      const validStates = cityStateMap[cityLower];
      
      if (validStates && !validStates.includes(formData.state)) {
        newErrors.push({
          field: "city-state",
          message: `"${formData.city}" is typically in ${validStates.join(" or ")}, not ${formData.state}`,
          suggestion: `Did you mean ${validStates[0]}?`,
        });
      }
    }

    // License number format validation (simplified)
    if (formData.licenseNumber) {
      // Check if it looks like a valid format (alphanumeric, 6-15 chars)
      if (!/^[A-Za-z0-9]{6,15}$/.test(formData.licenseNumber.replace(/[\s-]/g, ""))) {
        newErrors.push({
          field: "licenseNumber",
          message: "Driver's license number format appears invalid",
          suggestion: "Should be 6-15 alphanumeric characters",
        });
      }
    }

    // License state vs address state mismatch
    if (formData.licenseState && formData.state && formData.licenseState !== formData.state) {
      newErrors.push({
        field: "license-state",
        message: `License state (${formData.licenseState}) differs from address state (${formData.state})`,
        suggestion: "This may cause MVR retrieval issues",
      });
    }

    // Zip code format
    if (formData.zipCode && !/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.push({
        field: "zipCode",
        message: "Invalid ZIP code format",
        suggestion: "Use 5 digits or 5+4 format (e.g., 12345 or 12345-6789)",
      });
    }

    setIsValidating(true);
    const timeout = setTimeout(() => {
      setErrors(newErrors);
      setIsValidating(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [formData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const applySuggestion = (field: string, suggestion: string) => {
    if (field === "city-state") {
      // Extract state code from suggestion
      const match = suggestion.match(/Did you mean (\w+)\?/);
      if (match) {
        setFormData(prev => ({ ...prev, state: match[1] }));
      }
    }
  };

  const hasFieldError = (field: string) => errors.some(e => e.field === field || e.field.includes(field));

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Life Insurance Application
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Policy Amount: ${parseInt(formData.policyAmount).toLocaleString()}
        </p>
      </div>

      {/* AI Validation Banner */}
      <motion.div
        className="mb-6 p-3 rounded-lg border flex items-center gap-3"
        style={{
          background: errors.length > 0 
            ? "hsl(var(--destructive) / 0.1)" 
            : "hsl(280 100% 60% / 0.1)",
          borderColor: errors.length > 0 
            ? "hsl(var(--destructive) / 0.3)" 
            : "hsl(280 100% 60% / 0.3)",
        }}
        animate={{ opacity: isValidating ? 0.7 : 1 }}
      >
        <div className="flex items-center gap-2">
          {isValidating ? (
            <motion.div
              className="w-5 h-5 rounded-full border-2 border-t-transparent"
              style={{ borderColor: "hsl(280 100% 60%)", borderTopColor: "transparent" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          ) : errors.length > 0 ? (
            <AlertCircle className="h-5 w-5 text-destructive" />
          ) : (
            <CheckCircle className="h-5 w-5" style={{ color: "hsl(280 100% 60%)" }} />
          )}
          <span className="text-sm font-medium">
            {isValidating 
              ? "AI validating..." 
              : errors.length > 0 
                ? `${errors.length} issue${errors.length > 1 ? "s" : ""} detected` 
                : "AI validation: All fields OK"}
          </span>
        </div>
      </motion.div>

      {/* Errors Panel */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 space-y-2"
          >
            {errors.map((error, i) => (
              <motion.div
                key={error.field}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-3 rounded-lg bg-destructive/10 border border-destructive/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-destructive">{error.message}</p>
                    {error.suggestion && (
                      <p className="text-xs text-muted-foreground mt-1">
                        💡 {error.suggestion}
                      </p>
                    )}
                  </div>
                  {error.suggestion && error.field === "city-state" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => applySuggestion(error.field, error.suggestion!)}
                    >
                      Apply Fix
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6">
        {/* Personal Information */}
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <User className="h-4 w-4" />
            Personal Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Smith"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="john.smith@email.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <MapPin className="h-4 w-4" />
            Address
            {hasFieldError("city") && (
              <span className="text-xs text-destructive font-normal ml-2">⚠️ Check city/state</span>
            )}
          </h3>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="streetAddress">Street Address</Label>
              <Input
                id="streetAddress"
                value={formData.streetAddress}
                onChange={(e) => handleChange("streetAddress", e.target.value)}
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Miami"
                  className={hasFieldError("city") ? "border-destructive" : ""}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select value={formData.state} onValueChange={(v) => handleChange("state", v)}>
                  <SelectTrigger className={hasFieldError("city") ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    {states.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  placeholder="33101"
                  className={hasFieldError("zipCode") ? "border-destructive" : ""}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Driver's License */}
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <Car className="h-4 w-4" />
            Driver's License Information
            {hasFieldError("license") && (
              <span className="text-xs text-destructive font-normal ml-2">⚠️ Check license info</span>
            )}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => handleChange("licenseNumber", e.target.value)}
                placeholder="S123-456-78-901"
                className={hasFieldError("licenseNumber") ? "border-destructive" : ""}
              />
            </div>
            <div>
              <Label htmlFor="licenseState">License State</Label>
              <Select value={formData.licenseState} onValueChange={(v) => handleChange("licenseState", v)}>
                <SelectTrigger className={hasFieldError("license-state") ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  {states.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {hasFieldError("license-state") && (
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ License issued in a different state may cause MVR retrieval delays
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button variant="outline">Save Draft</Button>
          <Button disabled={errors.length > 0}>
            {errors.length > 0 ? "Fix Errors to Continue" : "Submit Application"}
          </Button>
        </div>
      </div>
    </div>
  );
}
