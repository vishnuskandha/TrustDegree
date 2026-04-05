import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, Variants } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Select,
  Button,
  Modal,
  useToast,
} from "@/components/magic";
import {
  Copy,
  Share2,
  User,
  GraduationCap,
  Building2,
  Award,
  Calendar,
  Link2,
  Wallet,
  CheckCircle2,
  Loader2,
  Trash2,
  Save,
  ArrowLeft,
} from "lucide-react";
import { issueFormSchema, type IssueFormData } from "@/lib/validations/issue-form";

/**
 * IssuePage - Upgraded Implementation
 *
 * Features:
 * - React Hook Form + Zod validation with real-time feedback
 * - Magic UI component library (Card, Input, Select, Button, Modal, Toast)
 * - Auto-save draft to localStorage with debouncing
 * - Form sections: Student Information + Credential Details
 * - Live credential preview as user types
 * - Confirmation modal with gas fee estimation
 * - Success state with QR code, copy & share buttons
 * - Framer Motion animations throughout
 * - Responsive layout (mobile-first, 2-column on desktop)
 * - Simplified user-facing language
 *
 * @author Claude Code
 * @since 2025-03-21
 */

// Ethereum address regex
const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;

const DEGREE_OPTIONS = [
  { value: "Bachelor", label: "Bachelor's Degree" },
  { value: "Master", label: "Master's Degree" },
  { value: "PhD", label: "Doctor of Philosophy (PhD)" },
  { value: "Diploma", label: "Diploma" },
  { value: "Certificate", label: "Certificate" },
];

const STORAGE_KEY = "trustdegree-issue-draft";

interface SuccessCredential {
  studentName: string;
  university: string;
  degreeType: string;
  graduationYear: string;
}

const IssuePage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txHash, setTxHash] = useState<string>("");
  const [contractAddress, setContractAddress] = useState<string>("");
  const [issuedTokenId, setIssuedTokenId] = useState<string>("");
  const [successCredential, setSuccessCredential] = useState<SuccessCredential | null>(null);
  const [copied, setCopied] = useState(false);

  const methods = useForm<IssueFormData>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      studentAddress: "",
      studentName: "",
      university: "",
      degreeType: "",
      graduationYear: "",
      metadataUri: "",
    },
    mode: "onBlur",
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty, isValid },
    reset,
  } = methods;

  // Watch form values for preview and auto-formatting
  const formValues = watch();

  // Auto-save draft to localStorage
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formValues, isDirty]);

  // Recover draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        reset(parsed);
      } catch (e) {
        console.error("Failed to parse draft:", e);
      }
    }
  }, [reset]);

  // Auto-format wallet address to lowercase
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("studentAddress", value.toLowerCase().trim(), { shouldValidate: true });
  };

  // Auto-format year to uppercase
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setValue("graduationYear", value, { shouldValidate: true });
  };

  // Clear form and localStorage
  const handleClear = () => {
    reset();
    localStorage.removeItem(STORAGE_KEY);
  };

  // Save draft manually
  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
    addToast({ title: "Draft saved successfully", variant: "success", duration: 3000 });
  };

  // Simulate transaction submission
  const onSubmit: SubmitHandler<IssueFormData> = async (_data) => {
    setShowConfirmModal(true);
  };

  const handleConfirmMint = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock transaction data
      const mockTxHash = "0x" + Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      const mockContractAddress = "0x" + Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      const mockTokenId = Math.floor(10000 + Math.random() * 90000).toString();

      setTxHash(mockTxHash);
      setContractAddress(mockContractAddress);
      setIssuedTokenId(mockTokenId);
      setSuccessCredential({
        studentName: formValues.studentName,
        university: formValues.university,
        degreeType: formValues.degreeType,
        graduationYear: formValues.graduationYear,
      });
      setShowSuccess(true);
      localStorage.removeItem(STORAGE_KEY);
      reset();
      addToast({ title: "Credential created successfully!", variant: "success", duration: 5000 });
    } catch (error) {
      addToast({ title: "Failed to create credential. Please try again.", variant: "error", duration: 5000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({ title: `${label} copied to clipboard`, variant: "success", duration: 3000 });
  };

  // Share (Web Share API if available)
  const handleShare = async () => {
    const shareData = {
      title: "Digital Credential",
      text: `Verify credential for ${successCredential?.studentName || "student"}`,
      url: verificationUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      handleCopy(shareData.url, "Verification link");
    }
  };

  // Memoize verification URL
  const verificationUrl = useMemo(() => {
    if (!contractAddress || !issuedTokenId) {
      return "";
    }
    return `${window.location.origin}/verify?contract=${contractAddress}&tokenId=${issuedTokenId}`;
  }, [contractAddress, issuedTokenId]);

  // Form container animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Success animation
  const successVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  if (showSuccess) {
    return (
      <div className="page-shell page-content p-4 md:p-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={successVariants}
          className="max-w-2xl mx-auto"
        >
          <Card className="overflow-hidden pro-panel">
            <CardHeader className="text-center bg-primary/5">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4"
              >
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </motion.div>
              <CardTitle className="text-2xl md:text-3xl">Credential Created!</CardTitle>
              <CardDescription>
                The digital credential has been successfully minted on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* QR Code */}
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white rounded-lg shadow-sm">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={200}
                    level="H"
                    includeMargin
                    className="w-48 h-48 md:w-56 md:h-56"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Scan this QR code to verify the credential authenticity
                </p>
              </div>

              {/* Verification Details */}
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="font-semibold text-lg">Verification Details</h3>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Student Name</label>
                    <p className="font-medium">{successCredential?.studentName || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Degree</label>
                    <p className="font-medium">
                      {successCredential?.degreeType || "-"} in {successCredential?.university || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Graduation Year</label>
                    <p className="font-medium">{successCredential?.graduationYear || "-"}</p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-border pt-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Smart Contract Address
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                        {contractAddress}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(contractAddress, "Contract address")}
                        leftIcon={<Copy className="h-4 w-4" />}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      Blockchain Receipt
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                        {txHash}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(txHash, "Transaction hash")}
                        leftIcon={<Copy className="h-4 w-4" />}
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Verification URL</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                        {verificationUrl}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        leftIcon={<Share2 className="h-4 w-4" />}
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border bg-muted/50">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate("/admin/dashboard")}
                rightIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Estimate gas fee (mock)
  const gasFeeEstimate = "0.01 MATIC";

  return (
    <div className="page-shell page-content p-4 md:p-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-6"
      >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight">
              Create Digital Credential
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Issue a verifiable diploma or certificate on the blockchain. Fill in the student and credential details below.
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden pro-panel">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  Credential Information
                </CardTitle>
                <CardDescription>
                  All fields are required unless marked optional
                </CardDescription>
              </CardHeader>

              <CardContent>
                <FormProvider {...methods}>
                  <form id="issue-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Section 1: Student Information */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-2 border-b border-border pb-3">
                        <User className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">Student Information</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student Name */}
                        <div className="md:col-span-2">
                          <Input
                            label="Student Full Name"
                            placeholder="e.g., Jane Doe"
                            error={errors.studentName?.message}
                            helperText="Enter the student's full legal name"
                            leftIcon={<User className="h-4 w-4" />}
                            {...register("studentName")}
                          />
                        </div>

                        {/* Wallet Address */}
                        <div className="md:col-span-2">
                          <Input
                            label="Wallet Address"
                            placeholder="0x..."
                            error={errors.studentAddress?.message}
                            helperText="Ethereum address where the credential will be sent"
                            leftIcon={<Wallet className="h-4 w-4" />}
                            value={formValues.studentAddress}
                            onChange={handleAddressChange}
                            onBlur={() => methods.trigger("studentAddress")}
                          />
                          {formValues.studentAddress && ethAddressRegex.test(formValues.studentAddress) && (
                            <div className="mt-2 space-y-2">
                              <p className="text-sm text-primary flex items-center gap-1">
                                <CheckCircle2 className="h-4 w-4" />
                                Valid Ethereum address
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <span className="font-mono">
                                  {formValues.studentAddress.slice(0, 10)}...{formValues.studentAddress.slice(-8)}
                                </span>
                                <span className="text-primary">|</span>
                                <span className="text-primary font-medium">ens:student.eth</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Section 2: Credential Details */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-2 border-b border-border pb-3">
                        <Award className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">Credential Details</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* University */}
                        <div className="md:col-span-2">
                          <Input
                            label="University / Institution"
                            placeholder="e.g., Stanford University"
                            error={errors.university?.message}
                            helperText="Name of the issuing institution"
                            leftIcon={<Building2 className="h-4 w-4" />}
                            {...register("university")}
                          />
                        </div>

                        {/* Degree Type */}
                        <div>
                          <Controller
                            name="degreeType"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                              <Select
                                label="Degree Type"
                                options={DEGREE_OPTIONS}
                                placeholder="Select a degree type"
                                error={error?.message}
                                helperText="Type of credential being issued"
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                          />
                        </div>

                        {/* Graduation Year */}
                        <div>
                          <Input
                            label="Graduation Year"
                            placeholder="2024"
                            error={errors.graduationYear?.message}
                            helperText="Year of graduation (1900-2100)"
                            leftIcon={<Calendar className="h-4 w-4" />}
                            value={formValues.graduationYear}
                            onChange={handleYearChange}
                            onBlur={() => methods.trigger("graduationYear")}
                          />
                        </div>

                        {/* Metadata URI */}
                        <div className="md:col-span-2">
                          <Input
                            label="Document Link (Optional)"
                            placeholder="https://..."
                            error={errors.metadataUri?.message}
                            helperText="URL to additional documentation or metadata (IPFS, etc.)"
                            leftIcon={<Link2 className="h-4 w-4" />}
                            {...register("metadataUri")}
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Preview Section */}
                    {isDirty && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border pt-6"
                      >
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <span className="text-muted-foreground">Preview</span>
                        </h3>
                        <Card className="bg-gradient-to-br from-muted to-muted/50">
                          <CardContent className="pt-6">
                            <div className="space-y-2">
                              <p className="font-medium text-lg">{formValues.studentName || "Student Name"}</p>
                              <p className="text-muted-foreground">
                                {formValues.degreeType || "Degree Type"} • {formValues.university || "University"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Class of {formValues.graduationYear || "YYYY"}
                              </p>
                              {formValues.metadataUri && (
                                <a
                                  href={formValues.metadataUri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                  <Link2 className="h-3 w-3" />
                                  View Document
                                </a>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </form>
                </FormProvider>
              </CardContent>

              <CardFooter className="border-t border-border bg-muted/50 flex-col space-y-4">
                {/* Gas Estimator */}
                <div className="flex items-center justify-between w-full text-sm">
                  <span className="text-muted-foreground">Estimated gas fee</span>
                  <span className="font-mono font-medium text-primary">{gasFeeEstimate}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleClear}
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    disabled={!isDirty}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    onClick={handleSaveDraft}
                    leftIcon={<Save className="h-4 w-4" />}
                    disabled={!isDirty}
                    className="flex-1"
                  >
                    Save Draft
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    form="issue-form"
                    isLoading={isSubmitting}
                    rightIcon={<Award className="h-4 w-4" />}
                    disabled={!isValid}
                    className="flex-1 sm:flex-none"
                  >
                    Create Credential
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>

        {/* Confirmation Modal */}
        <Modal
          open={showConfirmModal}
          onOpenChange={setShowConfirmModal}
          title="Create Digital Credential?"
          description="This action will mint a verifiable credential on the blockchain"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please confirm the following details before proceeding:
            </p>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Student:</strong> {formValues.studentName}</p>
              <p><strong>Institution:</strong> {formValues.university}</p>
              <p><strong>Degree:</strong> {formValues.degreeType}</p>
              <p><strong>Year:</strong> {formValues.graduationYear}</p>
            </div>
            <p className="text-sm text-destructive flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Gas fee: ~{gasFeeEstimate} will be charged
            </p>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmMint}
                isLoading={isSubmitting}
                className="flex-1"
              >
                Create
              </Button>
            </div>
          </div>
        </Modal>
      </div>
  );
};

export default IssuePage;
