import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { User, Menu, X, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./layout/LanguageSwitcher";
import BrandMark from "./BrandMark";

export default function Navbar() {
  const { t } = useTranslation("common");
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/how-it-works", label: t("nav.howItWorks") },
    { to: "/verify", label: t("nav.verify") },
    { to: "/technical-docs", label: t("nav.technicalDocs") },
    ...(isAdmin
      ? [{ to: "/admin", label: t("nav.dashboard") }]
      : [{ to: "/admin", label: t("nav.login"), isButton: true }]),
  ];

  const linkIsActive = (to: string) =>
    location.pathname === to || (to === "/admin" && isAdmin);

  return (
    <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[min(1120px,calc(100%-1.5rem))]">
      <div className="rounded-2xl border border-slate-200/80 bg-white/78 backdrop-blur-2xl shadow-[0_12px_30px_rgba(2,32,71,0.12)] px-3 sm:px-5">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="min-h-[44px] inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
              <BrandMark className="w-6 h-6" />
            </div>
            <span className="font-semibold text-2xl tracking-tight text-slate-800">
              TrustDegree
            </span>
          </Link>

          <div className="hidden md:flex items-center">
            <div className="rounded-full border border-slate-200 bg-white/90 p-1.5 flex items-center gap-1.5 shadow-sm">
              {navLinks.filter((link) => !link.isButton).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    linkIsActive(link.to)
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2.5">
            <LanguageSwitcher />
            {navLinks.map((link) =>
              link.isButton ? (
                <Link
                  key={link.to}
                  to={link.to}
                  className="h-11 min-h-[44px] px-4 rounded-full bg-slate-900 text-white text-sm font-semibold inline-flex items-center gap-2 transition-all duration-200 hover:bg-slate-800"
                >
                  <User className="w-4 h-4" />
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              ) : null
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-11 w-11 min-h-[44px] min-w-[44px] rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden py-3 border-t border-slate-200/60"
            >
              <div className="flex flex-col gap-2 pb-2">
                {navLinks.map((link) =>
                  link.isButton ? (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold inline-flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>{link.label}</span>
                    </Link>
                  ) : (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`h-11 px-4 rounded-xl text-sm font-medium inline-flex items-center transition-all duration-200 ${
                        linkIsActive(link.to)
                          ? "bg-slate-900 text-white"
                          : "text-slate-700 bg-slate-50 hover:bg-slate-100"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
