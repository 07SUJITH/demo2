import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Code,
  Github,
  Infinity as InfinityIcon,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ThemeToggleButton from "@/components/ui/theme-toggle-button";

import { Button } from "../../components/ui/button";
import { getApiEndpoints } from "../../utils/apiEndpointsData";

export const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to section if hash present
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }

    setIsVisible(true);

    // GSAP animations
    gsap.registerPlugin(ScrollTrigger);

    // Hero fade-in
    gsap.fromTo(
      ".gsap-hero",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    // Features reveal on scroll
    gsap.fromTo(
      ".gsap-feature",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: "#features",
          start: "top 90%",
        },
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        immediateRender: false,
      }
    );

    // Security features flow animation
    gsap.fromTo(
      ".gsap-security-feature",
      { opacity: 0, x: -100 },
      {
        opacity: 1,
        x: 0,
        scrollTrigger: {
          trigger: "#security-features",
          start: "top 90%",
          end: "bottom 50%",
          scrub: 1,
        },
        stagger: 0.1,
        duration: 1,
        ease: "power3.out",
        immediateRender: false,
      }
    );

    // Security cards animation
    gsap.fromTo(
      ".gsap-security-card",
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: "#security-cards",
          start: "top 80%",
          end: "bottom 50%",
          scrub: 1,
        },
        stagger: 0.2,
        duration: 0.6,
        ease: "power3.out",
        immediateRender: false,
      }
    );

    // Ensure measurements are up-to-date
    ScrollTrigger.refresh();
  }, []);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-950 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="min-h-screen overflow-hidden  bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(0,0,0,0))] bg-fixed">
        {/* Header */}
        <header className="relative z-10 flex justify-between items-center p-6">
          <div
            className="flex items-center space-x-2"
            style={{ fontFamily: "Architects Daughter" }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-[#E7A4B8] to-[#E7A4B8]/80 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#E7A4B8] to-[#E7A4B8]/90 bg-clip-text text-transparent">
              AuthFlow
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              onClick={() =>
                window.open("https://github.com/07SUJITH/AuthFlow", "_blank")
              }
            >
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
            <ThemeToggleButton />
          </div>
        </header>

        {/* Hero Section */}
        <section
          className="relative z-10 w-full  mx-auto px-6 pt-20 pb-16"
          style={{ fontFamily: "Architects Daughter" }}
        >
          <div
            className={`gsap-hero text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-purple-500/20 mb-8">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              <span className="text-sm font-medium">
                Secure Authentication System
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent leading-tight">
              Modern Authentication
              <br />
              <span className="bg-gradient-to-r from-[#E7A4B8] to-[#E7A4B8]/80 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              A complete authentication system with JWT, rate limiting, and
              Redis integration. Built with React, TypeScript, and modern web
              technologies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#E7A4B8] to-[#E7A4B8]/80 hover:from-blue-600 hover:to-purple-600 text-white border-0 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => (window.location.href = "/login")}
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
                onClick={() => (window.location.href = "#features")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Security Features Section */}
        <section id="features" className="w-full mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Advanced Security Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our system implements a defense-in-depth strategy with multiple
              overlapping security layers
            </p>
          </div>

          {/* Security Flow */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="gsap-security-feature bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Advanced Token Management
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>Dual-Token JWT System</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>Automatic Token Rotation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span>Immediate Token Revocation</span>
                  </li>
                </ul>
              </div>

              <div className="gsap-security-feature bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Secure Session Handling
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span>HttpOnly Cookies</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span>Strict Transport Security</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span>Cross-Site Protection</span>
                  </li>
                </ul>
              </div>

              <div className="gsap-security-feature bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Intelligent Access Controls
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="py-2">Protection Layer</th>
                        <th className="py-2">Threshold</th>
                        <th className="py-2">Scope</th>
                        <th className="py-2">Lockout Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="py-2">IP-Based</td>
                        <td className="py-2">5/min</td>
                        <td className="py-2">Global</td>
                        <td className="py-2">1 minute</td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-2">User-Based</td>
                        <td className="py-2">3/5min</td>
                        <td className="py-2">Per Account</td>
                        <td className="py-2">20 minutes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="gsap-security-feature bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Multi-Factor Authentication
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white">OTP</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        6-digit codes valid for 5 minutes
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Single-use only with cryptographic verification
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white">Recovery</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Time-bound reset links (15 minute validity)
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        IP fingerprinting for suspicious requests
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Cards */}
          <div
            id="security-cards"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <div className="gsap-security-card bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-500 hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                <span className="text-white font-bold">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Data Protection
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Credential safeguards including password hashing with work
                factor 12 and automated breach password detection
              </p>
            </div>

            <div className="gsap-security-card bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-500 hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                <span className="text-white font-bold">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Defense-in-Depth
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Multiple overlapping security layers designed to protect against
                modern threats while maintaining usability
              </p>
            </div>

            <div className="gsap-security-card bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-800 transition-all duration-500 hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                <span className="text-white font-bold">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Continuous Security
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Automatic token rotation and immediate revocation during
                critical events
              </p>
            </div>
          </div>
        </section>

        {/* API Documentation Section */}
        <section id="api-docs" className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              API Documentation
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Complete list of API endpoints for the authentication system
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4">Method</th>
                  <th className="text-left py-2 px-4">Endpoint</th>
                  <th className="text-left py-2 px-4">Description</th>
                </tr>
              </thead>
              <tbody>
                {getApiEndpoints().map((endpoint, index) => (
                  <tr
                    key={index}
                    className={
                      (index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "") +
                      " cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                    onClick={() => navigate(`/endpoint/${endpoint.id}`)}
                  >
                    <td className="py-3 px-4">
                      <span
                        className={
                          "px-2 py-1 rounded text-xs " +
                          (endpoint.method === "GET"
                            ? "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
                            : endpoint.method === "POST"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : endpoint.method === "PUT"
                                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                                : endpoint.method === "DELETE"
                                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                                  : "")
                        }
                      >
                        {endpoint.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {endpoint.url}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {endpoint.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/80 dark:from-primary/90 dark:via-primary dark:to-primary/80">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-full mix-blend-overlay"></div>
            <div className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent rounded-full mix-blend-overlay"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-6 text-center">
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Ready to get started?
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => (window.location.href = "/register")}
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-2 border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                onClick={() => {
                  const element = document.getElementById("features");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Learn More
              </Button>
            </motion.div>

            <motion.div
              className="mt-12 flex flex-wrap justify-center gap-6 text-white/60 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-emerald-400" />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-amber-400" />
                <span>Lightning Fast</span>
              </div>
              <div className="flex items-center">
                <InfinityIcon className="w-5 h-5 mr-2 text-blue-400" />
                <span>Scalable</span>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
