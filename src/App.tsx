import {
  ArrowRight,
  Code,
  Download,
  GitBranch,
  Github,
  Layout,
  Settings,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import { ModeToggle } from "./components/mode-toggle";
// test purpose change import order
// husky should automatically run the lint and format commands
import { Button } from "./components/ui/button";

const App = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "React Router",
      description: "Modern client-side routing with seamless navigation",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Zustand State Management",
      description:
        "Lightweight, intuitive state management without boilerplate",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Shadcn UI Components",
      description: "Beautiful, accessible UI components built with Radix UI",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Tailwind CSS",
      description: "Utility-first CSS framework for rapid UI development",
      color: "from-orange-600 to-red-500",
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "ESLint & Prettier",
      description: "Automated code formatting and quality enforcement",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "GitHub Workflows",
      description: "Automated CI/CD with code quality checks",
      color: "from-teal-500 to-blue-500",
    },
  ];

  const codeSnippet = `// GitHub Workflow Configuration
name: Code Quality & Format Check
on:
  push:
  pull_request:
jobs:
  code-quality:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"
      - name: Install dependencies
        run: npm ci
      - name: Check Prettier formatting
        run: npm run format:check
      - name: Check ESLint
        run: npm run lint -- --max-warnings 0
      - name: TypeScript compilation check
        run: npx tsc --noEmit`;

  return (
    <div className="min-h-screen w-full bg-white dark:bg-neutral-950 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="min-h-screen w-full bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(0,0,0,0))] bg-fixed">
        {/* Header */}
        <header className="relative z-10 flex justify-between items-center p-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              React
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>
            <ModeToggle />
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16">
          <div
            className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-purple-500/20 mb-8">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              <span className="text-sm font-medium">
                Production-ready React starter
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent leading-tight">
              Build Modern React Apps
              <br />
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                With Confidence
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              A comprehensive React starter kit with routing, state management,
              UI components, and automated code quality tools. Everything you
              need to build production-ready applications.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="w-5 h-5 mr-2" />
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold"
                onclick={() =>
                  window.open("https://github.com/07SUJITH/demo2", "_blank")
                }
              >
                <Github className="w-5 h-5 mr-2" />
                View Source
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Pre-configured with industry-standard tools and best practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/20 hover:-translate-y-2 ${
                  activeFeature === index
                    ? "ring-2 ring-blue-500/20 shadow-lg"
                    : ""
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Code Preview */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Automated Code Quality
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              GitHub Actions workflow ensures consistent code quality and
              formatting
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gray-900 dark:bg-gray-950 rounded-2xl p-6 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-400">
                  .github/workflows/code-quality.yml
                </span>
              </div>
              <pre className="text-sm text-gray-300 overflow-x-auto">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Quick Start
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get up and running in minutes with our streamlined setup
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Clone Repository",
                description: "git clone your-repo-url",
                icon: <Download className="w-6 h-6" />,
              },
              {
                step: "2",
                title: "Install Dependencies",
                description: "npm install",
                icon: <Settings className="w-6 h-6" />,
              },
              {
                step: "3",
                title: "Start Development",
                description: "npm run dev",
                icon: <Zap className="w-6 h-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {item.description}
                </p>
                <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold">
                  {item.step}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  React
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <Button variant="ghost" size="sm">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button variant="ghost" size="sm">
                  Documentation
                </Button>
                <Button variant="ghost" size="sm">
                  Support
                </Button>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-600 dark:text-gray-400">
              <p>
                &copy; 2025 React Starter Kit. Built with ❤️ for developers.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
