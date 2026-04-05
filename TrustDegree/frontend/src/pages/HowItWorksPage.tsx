import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ShieldCheck,
  Award,
  Scan,
  Building2,
  Wallet,
  CheckCircle
} from "lucide-react";
import { Section, Card, CardContent, Button } from "@/components";

export default function HowItWorksPage() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: t("howItWorks.steps.0.title"),
      simple: t("howItWorks.steps.0.simple"),
      description: t("howItWorks.steps.0.desc"),
      color: "bg-blue-50 text-blue-600",
      badge: t("howItWorks.steps.0.badge")
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: t("howItWorks.steps.1.title"),
      simple: t("howItWorks.steps.1.simple"),
      description: t("howItWorks.steps.1.desc"),
      color: "bg-emerald-50 text-emerald-600",
      badge: t("howItWorks.steps.1.badge")
    },
    {
      icon: <Scan className="w-8 h-8" />,
      title: t("howItWorks.steps.2.title"),
      simple: t("howItWorks.steps.2.simple"),
      description: t("howItWorks.steps.2.desc"),
      color: "bg-purple-50 text-purple-600",
      badge: t("howItWorks.steps.2.badge")
    }
  ];

  return (
    <div className="page-shell">
      {/* Hero Section */}
      <Section spacing="xl" className="text-center page-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pro-hero px-6 py-12 md:px-10 md:py-14 max-w-5xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            {t("howItWorks.title")}
          </h1>
          <p className="text-xl md:text-2xl text-sky-100 leading-relaxed max-w-3xl mx-auto mb-8">
            {t("howItWorks.subtitle")}
          </p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/25 text-white rounded-full text-sm">
              <ShieldCheck className="w-4 h-4" /> {t("howItWorks.badges.blockchain")}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/25 text-white rounded-full text-sm">
              <Award className="w-4 h-4" /> {t("howItWorks.badges.tamperProof")}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/25 text-white rounded-full text-sm">
              <Scan className="w-4 h-4" /> {t("howItWorks.badges.instant")}
            </span>
          </div>
        </motion.div>
      </Section>

      {/* Steps Section */}
      <Section spacing="lg" className="page-content">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines (desktop only) */}
            <div className="hidden md:block absolute top-16 left-20 right-20 h-0.5 bg-gradient-to-r from-blue-200 via-emerald-200 to-purple-200"></div>

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full pro-panel hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <CardContent className="pt-6">
                    {/* Step Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                        Step {index + 1}
                      </span>
                    </div>

                    {/* Icon */}
                    <div
                      className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-md`}
                    >
                      {step.icon}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-2 text-slate-900">
                      {step.title}
                    </h2>

                    {/* Simple tagline */}
                    <p className="text-primary-600 font-semibold mb-4 text-sm">
                      {step.simple}
                    </p>

                    {/* Description */}
                    <p className="text-slate-600 leading-relaxed mb-4">
                      {step.description}
                    </p>

                    {/* Badge */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                        {step.badge}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Interactive Demo Section */}
      <Section spacing="xl" className="page-content">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center pro-panel p-8 md:p-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            {t("howItWorks.demo.title")}
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            {t("howItWorks.demo.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/verify?sample=true">
              <Button size="lg" leftIcon={<Scan className="w-5 h-5" />}>
                {t("howItWorks.demo.verifyButton")}
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                {t("howItWorks.demo.backButton")}
              </Button>
            </Link>
          </div>

          {/* Visual indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12"
          >
            <div className="inline-flex items-center gap-2 text-slate-500">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-sm">
                {t("howItWorks.demo.timeEstimate")}
              </span>
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* Trust Indicators */}
      <Section spacing="lg" className="page-content">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6"
            >
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">{t("howItWorks.trust.verifiable")}</h3>
              <p className="text-slate-600 text-sm">
                {t("howItWorks.trust.verifiableDesc")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              <ShieldCheck className="w-12 h-12 text-primary-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">{t("howItWorks.trust.fraudProof")}</h3>
              <p className="text-slate-600 text-sm">
                {t("howItWorks.trust.fraudProofDesc")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-6"
            >
              <Wallet className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">{t("howItWorks.trust.studentOwned")}</h3>
              <p className="text-slate-600 text-sm">
                {t("howItWorks.trust.studentOwnedDesc")}
              </p>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section spacing="xl" className="text-center page-content">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pro-hero p-10 md:p-14 max-w-5xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("howItWorks.cta.title")}
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            {t("howItWorks.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/admin">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                {t("howItWorks.cta.issue")}
              </Button>
            </Link>
            <Link to="/verify">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                {t("howItWorks.cta.verify")}
              </Button>
            </Link>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
