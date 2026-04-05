import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ShieldCheck,
  ScanLine,
  Globe,
  Lock,
  CheckCircle2,
  ArrowRight,
  Building2,
  Users,
  Sparkles,
} from "lucide-react";

// Magic components
import { Card } from "@/components/magic";
import { Button } from "@/components/magic";
import { Badge } from "@/components/magic";

// UI components
import { AnimatedCard } from "@/components/ui/AnimatedCard";

// Layout components
import { Section } from "@/components/layout/Section";

// Motion variants
import {
  fadeInUp,
  scaleIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
  springConfig,
} from "@/lib/motion-config";

// Custom components
import MagneticButton from "@/components/MagneticButton";
import RippleEffect from "@/components/RippleEffect";
import { cn } from "@/lib/utils";

const ctaBaseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const ctaVariantStyles: Record<"primary" | "secondary" | "outline", string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
  outline:
    "border border-border bg-background hover:bg-muted focus:ring-ring text-foreground",
};

const ctaSizeStyles: Record<"lg" | "xl", string> = {
  lg: "h-12 px-6 text-base min-h-[44px]",
  xl: "h-14 px-8 text-lg min-h-[44px]",
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

/**
 * Hook for reduced motion preference
 */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(media.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return reduced;
}

// ============================================================================
// BUTTON WRAPPERS WITH MAGNETIC + RIPPLE EFFECTS
// ============================================================================

/**
 * Enhanced button with both magnetic effect and ripple click
 * Wraps Link with MagneticButton, RippleEffect, and Magic Button
 */
function MagneticRippleLink({
  to,
  children,
  variant = "primary",
  size = "lg",
  leftIcon,
  rightIcon,
  className,
}: {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "lg" | "xl";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}) {
  const buttonContent = (
    <span
      className={cn(
        ctaBaseStyles,
        ctaVariantStyles[variant],
        ctaSizeStyles[size],
        className
      )}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </span>
  );

  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <Link to={to}>{buttonContent}</Link>;
  }

  return (
    <Link to={to}>
      <MagneticButton strength={0.2}>
        <RippleEffect>
          {buttonContent}
        </RippleEffect>
      </MagneticButton>
    </Link>
  );
}

// ============================================================================
// ANIMATED COMPONENTS
// ============================================================================

/**
 * Background gradient blobs for hero section
 */
function GradientBlobs() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {reducedMotion ? (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-amber-200/20" />
      ) : (
        <>
          {/* First blob - reduced size on mobile to prevent overflow */}
          <motion.div
            className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-cyan-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: "10%", left: "-20%" }}
          />
          {/* Second blob - reduced size on mobile */}
          <motion.div
            className="absolute w-64 h-64 sm:w-80 sm:h-80 bg-amber-300/20 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 100, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ bottom: "20%", right: "-20%" }}
          />
          {/* Third blob */}
          <motion.div
            className="absolute w-64 h-64 bg-sky-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -80, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: "50%", left: "50%" }}
          />
        </>
      )}
    </div>
  );
}

function AssuranceItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="pro-panel rounded-2xl p-6"
    >
      <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-semibold text-slate-800 mb-2">{title}</h4>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

/**
 * Feature card with icon and description
 */
function FeatureCard({
  icon,
  title,
  description,
  color,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <AnimatedCard className="p-6 h-full">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${color} transition-transform duration-300`}
        >
          <div className="scale-110">{icon}</div>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-foreground font-display">
          {title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-base">
          {description}
        </p>
      </AnimatedCard>
    </motion.div>
  );
}

/**
 * How it works step
 */
function HowItWorksStep({
  step,
  title,
  description,
  isLeft,
  index,
}: {
  step: string;
  title: string;
  description: string;
  isLeft: boolean;
  index: number;
}) {
  const variants = isLeft ? slideInLeft : slideInRight;

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.2, ...springConfig }}
      className="relative"
    >
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center font-bold text-2xl text-primary shadow-lg ring-2 ring-white">
          {step}
        </div>
        <div className="flex-1 pt-2">
          <h4 className="font-bold text-xl mb-2 text-foreground">{title}</h4>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Quick verification form component
 */
function QuickVerifyForm() {
  const { t } = useTranslation("pages", { keyPrefix: "home" });
  const [degreeId, setDegreeId] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<null | {
    valid: boolean;
    name?: string;
    university?: string;
    year?: string;
  }>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!degreeId.trim()) return;

    setIsVerifying(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setResult({
      valid: true,
      name: "Sample Student",
      university: "Demo University",
      year: "2024",
    });
    setIsVerifying(false);
  };

  const handleExampleClick = () => {
    setDegreeId("TRD-2024-001");
  };

  return (
    <Card className="p-6 md:p-8 border-2 border-slate-200/60 hover:border-sky-300 transition-all duration-300 shadow-lg shadow-slate-200/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-sky-100 rounded-lg">
            <ScanLine className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-display">
              {t("demo.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("demo.subtitle")}
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={degreeId}
              onChange={(e) => setDegreeId(e.target.value)}
              placeholder={t("demo.placeholder")}
              className="w-full px-4 py-3 rounded-lg border border-slate-300/70 bg-white focus:ring-2 focus:ring-sky-300 focus:border-sky-400 outline-none transition-all"
            />
            <button
              type="button"
              onClick={handleExampleClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 text-xs font-medium bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 transition-colors min-h-[44px] flex items-center justify-center"
            >
              {t("demo.example")}
            </button>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            leftIcon={<ScanLine className="w-5 h-5" />}
            isLoading={isVerifying}
          >
            {t("demo.button")}
          </Button>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900 mb-1">
                  {t("demo.result.genuine")}
                </p>
                <div className="text-sm text-emerald-800 space-y-1">
                  <p>
                    <span className="font-medium">{t("demo.result.name")}</span> {result.name}
                  </p>
                  <p>
                    <span className="font-medium">{t("demo.result.university")}</span>{" "}
                    {result.university}
                  </p>
                  <p>
                    <span className="font-medium">{t("demo.result.year")}</span> {result.year}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function Home() {
  const { t } = useTranslation("pages", { keyPrefix: "home" });
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  // Hero section animation variants
  const heroVariants = reducedMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
          },
        },
      };

  // Hero item variants
  const heroItemVariants = reducedMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { ...springConfig, duration: 0.6 },
        },
      };

  // Features data with simplified language
  const features = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: t("features.secure.title"),
      description: t("features.secure.desc"),
      color: "bg-primary-50 text-primary-600 ring-primary-100",
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: t("features.wallet.title"),
      description: t("features.wallet.desc"),
      color: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    },
    {
      icon: <ScanLine className="w-8 h-8" />,
      title: t("features.verify.title"),
      description: t("features.verify.desc"),
      color: "bg-purple-50 text-purple-600 ring-purple-100",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t("features.simple.title"),
      description: t("features.simple.desc"),
      color: "bg-orange-50 text-orange-600 ring-orange-100",
    },
  ];

  const assurances = [
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: t("assurance.items.tamperProof.title"),
      description: t("assurance.items.tamperProof.description"),
    },
    {
      icon: <ScanLine className="w-5 h-5" />,
      title: t("assurance.items.oneScan.title"),
      description: t("assurance.items.oneScan.description"),
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      title: t("assurance.items.workflow.title"),
      description: t("assurance.items.workflow.description"),
    },
  ];

  // How it works steps
  const howSteps = [
    {
      step: "1",
      title: t("how.step1.title"),
      description: t("how.step1.desc"),
      isLeft: true,
    },
    {
      step: "2",
      title: t("how.step2.title"),
      description: t("how.step2.desc"),
      isLeft: false,
    },
    {
      step: "3",
      title: t("how.step3.title"),
      description: t("how.step3.desc"),
      isLeft: true,
    },
    {
      step: "4",
      title: t("how.step4.title"),
      description: t("how.step4.desc"),
      isLeft: false,
    },
  ];

  // Trust university logos (placeholder)
  const universities = ["MIT", "Stanford", "Oxford", "Tokyo U", "IIT"];

  return (
    <div className="page-shell">
      {/* Animated background */}
      <GradientBlobs />

      {/* Hero Section */}
      <Section spacing="xl" className="relative z-10 page-content">
        <div ref={heroRef} className="max-w-6xl mx-auto px-4">
          <motion.div
            className="pro-hero px-6 py-10 md:px-10 md:py-12"
            variants={heroVariants}
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <motion.div variants={heroItemVariants} className="mb-6 flex flex-wrap gap-3">
                  <Badge variant="default" dot className="px-4 py-2 text-sm bg-white/10 text-white border border-white/20">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t("hero.badge")}
                  </Badge>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-sky-100">
                    <ShieldCheck className="w-4 h-4" /> {t("hero.onChainProof")}
                  </span>
                </motion.div>

                <motion.h1
                  variants={heroItemVariants}
                  className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-amber-100">
                    {t("hero.title")}
                  </span>
                </motion.h1>

                <motion.p
                  variants={heroItemVariants}
                  className="text-lg md:text-2xl text-sky-100/90 mb-8 leading-relaxed max-w-2xl"
                >
                  {t("hero.subtitle")}
                </motion.p>

                <motion.div
                  variants={heroItemVariants}
                  className="flex flex-col sm:flex-row gap-4 items-start"
                >
                  <MagneticRippleLink
                    to="/verify"
                    variant="primary"
                    size="xl"
                    leftIcon={<ScanLine className="w-5 h-5" />}
                    className="min-w-[220px]"
                  >
                    {t("hero.cta.primary")}
                  </MagneticRippleLink>
                  <MagneticRippleLink
                    to="/admin"
                    variant="outline"
                    size="xl"
                    leftIcon={<Building2 className="w-5 h-5" />}
                    className="min-w-[220px] bg-white/10 text-white border-2 border-white/30 hover:bg-white/20"
                  >
                    {t("hero.cta.secondary")}
                  </MagneticRippleLink>
                </motion.div>
              </div>

              <motion.div
                variants={heroItemVariants}
                className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl p-5 md:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm uppercase tracking-widest text-sky-100/80">{t("hero.preview.title")}</p>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
                </div>

                <div className="rounded-xl bg-slate-950/35 border border-white/15 p-4 space-y-4">
                  <div>
                    <p className="text-xs text-sky-100/70 mb-1">{t("hero.preview.credentialId")}</p>
                    <p className="font-mono text-sm text-white">TRD-2026-004182</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-sky-100/70 mb-1">{t("hero.preview.status")}</p>
                      <p className="text-emerald-200 font-semibold">{t("hero.preview.statusValue")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-sky-100/70 mb-1">{t("hero.preview.issuer")}</p>
                      <p className="text-white">{t("hero.preview.issuerValue")}</p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs text-sky-100/70">{t("hero.preview.proofHash")}</span>
                    <span className="text-xs font-mono text-sky-100">0x8f...3ea9</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Trust Signals Section */}
      <Section spacing="lg" className="relative z-10 page-content">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-lg text-muted-foreground font-medium mb-6">
              {t("trust.subtitle")}
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
              {universities.map((uni) => (
                <div
                  key={uni}
                  className="text-2xl md:text-3xl font-bold font-display text-foreground/40 hover:text-foreground/80 transition-colors cursor-default"
                >
                  {uni}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Features Grid */}
      <Section
        spacing="xl"
        className="relative z-10 page-content"
        title={t("features.title")}
        centered
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                {...feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Assurance Section */}
      <Section spacing="xl" className="relative z-10 page-content">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900">{t("assurance.heading")}</h3>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              {t("assurance.subtitle")}
            </p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {assurances.map((item, index) => (
              <motion.div key={index} variants={staggerItem}>
                <AssuranceItem
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* How It Works Section */}
      <Section
        spacing="xl"
        className="relative z-10 page-content"
        title={t("how.title")}
        centered
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            {howSteps.map((step, index) => (
              <HowItWorksStep
                key={index}
                {...step}
                index={index}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Verification Demo Section */}
      <Section spacing="xl" className="relative z-10 page-content">
        <div className="max-w-3xl mx-auto px-4">
          <QuickVerifyForm />
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section spacing="xl" className="relative z-10 page-content">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <Card className="p-10 md:p-14 bg-gradient-to-br from-sky-50/90 via-white to-amber-50/80 border-2 border-sky-200/50 shadow-2xl shadow-slate-200/40">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display">
                {t("cta.title")}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t("cta.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <MagneticRippleLink
                  to="/admin"
                  variant="primary"
                  size="xl"
                  leftIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {t("cta.primary")}
                </MagneticRippleLink>
                <MagneticRippleLink
                  to="/admin"
                  variant="outline"
                  size="xl"
                  leftIcon={<Users className="w-5 h-5" />}
                >
                  {t("cta.secondary")}
                </MagneticRippleLink>
              </div>
            </Card>
          </motion.div>
        </div>
      </Section>

      {/* Footer spacing */}
      <div className="py-12 relative z-10" />
    </div>
  );
}
