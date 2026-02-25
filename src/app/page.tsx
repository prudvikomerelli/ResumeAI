import Link from "next/link";
import {
  FileText,
  Target,
  Zap,
  Shield,
  BarChart3,
  Download,
  CheckCircle,
  ArrowRight,
  Star,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <FileText className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ResumeAI</span>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Star className="h-4 w-4" />
              Trusted by 10,000+ job seekers
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Land More Interviews with{" "}
              <span className="text-blue-600">ATS-Optimized</span> Resumes
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Paste your resume and job description — get an ATS-optimized resume, tailored
              cover letter, match score, and keyword gap analysis in seconds.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-colors"
              >
                Start Free <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                See How It Works
              </a>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-blue-100 opacity-30 blur-3xl" />
          <div className="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-purple-100 opacity-30 blur-3xl" />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need to Beat the ATS
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our AI analyzes job descriptions and optimizes your resume for maximum ATS compatibility.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Target,
                title: "ATS Score Analysis",
                description:
                  "Get a clear 0-100 score showing how well your resume matches the job description, with actionable improvement tips.",
              },
              {
                icon: Zap,
                title: "Instant Optimization",
                description:
                  "AI rewrites your bullet points to align with job requirements while keeping your experience truthful.",
              },
              {
                icon: BarChart3,
                title: "Keyword Gap Analysis",
                description:
                  "See exactly which keywords you're matching and which ones are missing from your resume.",
              },
              {
                icon: FileText,
                title: "Tailored Cover Letters",
                description:
                  "Generate role-specific cover letters that complement your optimized resume perfectly.",
              },
              {
                icon: Download,
                title: "ATS-Safe Export",
                description:
                  "Download your resume and cover letter as clean DOCX files with no tables, columns, or graphics.",
              },
              {
                icon: Shield,
                title: "Application History",
                description:
                  "Track all your tailored applications, edit outputs, and regenerate with different tones.",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-gray-200 p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Three Steps to Your Perfect Resume
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Paste Your Content",
                description: "Paste your existing resume and the job description you're targeting.",
              },
              {
                step: "2",
                title: "AI Optimizes",
                description: "Our AI analyzes keywords, rewrites bullets, and generates a tailored cover letter.",
              },
              {
                step: "3",
                title: "Download & Apply",
                description: "Review your ATS score, edit if needed, and download ATS-safe documents.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Start free. Upgrade when you need more power.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
            {/* Free Plan */}
            <div className="rounded-2xl border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <p className="mt-1 text-sm text-gray-500">Perfect for getting started</p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-sm text-gray-500">/month</span>
              </p>
              <Link
                href="/signup"
                className="mt-6 block rounded-lg border border-gray-300 bg-white py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Get Started
              </Link>
              <ul className="mt-8 space-y-3">
                {["3 generations per day", "1 export per day", "Basic ATS scoring", "Email support"].map(
                  (feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
                      <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                      {feature}
                    </li>
                  )
                )}
              </ul>
            </div>
            {/* Pro Plan */}
            <div className="relative rounded-2xl border-2 border-blue-600 p-8">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-medium text-white">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
              <p className="mt-1 text-sm text-gray-500">For serious job seekers</p>
              <p className="mt-6">
                <span className="text-4xl font-bold text-gray-900">$19</span>
                <span className="text-sm text-gray-500">/month</span>
              </p>
              <Link
                href="/signup"
                className="mt-6 block rounded-lg bg-blue-600 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Start Pro Trial
              </Link>
              <ul className="mt-8 space-y-3">
                {[
                  "Unlimited generations",
                  "Unlimited exports",
                  "Advanced ATS scoring",
                  "Priority support",
                  "Keyword gap analysis",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Land Your Dream Job?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join thousands of job seekers who have improved their interview rates with ResumeAI.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Get Started Free <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">ResumeAI</span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
