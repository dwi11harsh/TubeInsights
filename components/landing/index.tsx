"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Youtube,
  FileText,
  MessageSquare,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const LandingComponent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);

  // Demo progress simulation
  useEffect(() => {
    if (isExtracting) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsExtracting(false);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 800);
      return () => clearInterval(timer);
    }
  }, [isExtracting]);

  const features = [
    {
      icon: Youtube,
      title: "Paste YouTube Link",
      description: "Support for videos, playlists, and entire channels",
      color: "from-red-500 to-red-600",
    },
    {
      icon: FileText,
      title: "Extract Transcripts",
      description: "AI-powered extraction with real-time progress updates",
      color: "from-red-600 to-red-700",
    },
    {
      icon: MessageSquare,
      title: "Ask Questions",
      description: "Chat with your content using advanced AI",
      color: "from-red-500 to-red-800",
    },
  ];

  const steps = [
    "Analyzing YouTube link...",
    "Extracting video metadata...",
    "Processing transcripts...",
    "Optimizing for AI chat...",
    "Ready for questions!",
  ];

  const handleExtractDemo = () => {
    setIsExtracting(true);
    setProgress(0);
    setCurrentStep(0);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-hidden"
      style={{
        background:
          "linear-gradient(-45deg, #0f172a, #7f1d1d, #0f172a, #991b1b)",
        backgroundSize: "400% 400%",
        animation: "gradientMove 15s ease-in-out infinite",
      }}
    >
      <style jsx>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .hover\\:scale-105:hover {
          transform: scale(1.05);
        }

        .group:hover .group-hover\\:animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .group:hover .group-hover\\:text-red-400 {
          color: rgb(248 113 113);
        }

        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }

        .duration-300 {
          transition-duration: 300ms;
        }

        .duration-500 {
          transition-duration: 500ms;
        }

        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }

        .bg-gradient-to-r {
          background-image: linear-gradient(to right, var(--tw-gradient-stops));
        }

        .bg-gradient-to-br {
          background-image: linear-gradient(
            to bottom right,
            var(--tw-gradient-stops)
          );
        }

        .bg-clip-text {
          background-clip: text;
          -webkit-background-clip: text;
        }

        .text-transparent {
          color: transparent;
        }

        .mix-blend-multiply {
          mix-blend-mode: multiply;
        }

        .filter {
          filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast)
            var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert)
            var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
        }

        .blur-xl {
          --tw-blur: blur(24px);
        }
      `}</style>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ backgroundColor: "#ef4444", opacity: 0.7 }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"
          style={{ backgroundColor: "#dc2626", opacity: 0.7 }}
        ></div>
        <div
          className="absolute top-40 left-1/2 w-60 h-60 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"
          style={{ backgroundColor: "#b91c1c", opacity: 0.5 }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 md:p-8">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-xl font-bold bg-clip-text text-transparent"
            style={{
              background: "linear-gradient(to right, #f87171, #ef4444)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
            }}
          >
            TubeInsights
          </span>
        </div>
        <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105">
          Sign In
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-16 md:py-24 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Turn YouTube Content
            <br />
            <span
              className="bg-clip-text text-transparent animate-pulse"
              style={{
                background: "linear-gradient(to right, #f87171, #ef4444)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
              }}
            >
              Into AI Conversations
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Extract transcripts from any YouTube video, playlist, or channel.
            Then chat with your content using advanced AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
              onClick={handleExtractDemo}
              style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <Zap className="w-5 h-5 mr-2" />
              Try Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-black text-lg px-8 py-4 rounded-full transition-all duration-300"
            >
              Learn More
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Demo Progress Section */}
          {isExtracting && (
            <div className="max-w-2xl mx-auto mb-16 animate-fade-in">
              <Card
                className="border backdrop-blur-lg"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  borderColor: "rgba(239, 68, 68, 0.2)",
                }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-red-400 font-medium">
                      Extracting Content
                    </span>
                    <span className="text-sm text-gray-400">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="mb-4 h-2" />
                  <p className="text-gray-300 text-sm flex items-center">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
                    {steps[currentStep]}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          <span
            className="bg-clip-text text-transparent"
            style={{
              background: "linear-gradient(to right, #ffffff, #d1d5db)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
            }}
          >
            How It Works
          </span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="backdrop-blur-lg border transition-all duration-500 group hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderColor: "rgba(75, 85, 99, 0.5)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(75, 85, 99, 0.5)";
              }}
            >
              <CardContent className="p-8 text-center">
                <div
                  className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:animate-pulse`}
                  style={{
                    background: `linear-gradient(to right, ${
                      feature.color === "from-red-500 to-red-600"
                        ? "#ef4444, #dc2626"
                        : feature.color === "from-red-600 to-red-700"
                        ? "#dc2626, #b91c1c"
                        : "#ef4444, #991b1b"
                    })`,
                  }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-red-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Process Demo Section */}
      <section className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <Card
            className="backdrop-blur-lg border"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderColor: "rgba(75, 85, 99, 0.5)",
            }}
          >
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-8 text-center">
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    background: "linear-gradient(to right, #f87171, #ef4444)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                  }}
                >
                  Real-time Processing
                </span>
              </h3>

              <div className="space-y-6">
                <div
                  className="flex items-center space-x-4 p-4 rounded-lg"
                  style={{ backgroundColor: "rgba(31, 41, 55, 0.5)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(to right, #4ade80, #ef4444)",
                    }}
                  >
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">
                      Secure Authentication
                    </h4>
                    <p className="text-gray-400">
                      Sign in securely to start processing your content
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center space-x-4 p-4 rounded-lg"
                  style={{ backgroundColor: "rgba(31, 41, 55, 0.5)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(to right, #ef4444, #dc2626)",
                    }}
                  >
                    <Youtube className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">
                      Smart Link Detection
                    </h4>
                    <p className="text-gray-400">
                      Automatically identifies videos, playlists, or channels
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center space-x-4 p-4 rounded-lg"
                  style={{ backgroundColor: "rgba(31, 41, 55, 0.5)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(to right, #dc2626, #b91c1c)",
                    }}
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">
                      AI-Powered Extraction
                    </h4>
                    <p className="text-gray-400">
                      High-quality transcript extraction with progress updates
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: "linear-gradient(to right, #f87171, #dc2626)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
              }}
            >
              YouTube Experience?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators, researchers, and learners who use
            TubeInsights to unlock the power of video content.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
              style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <Play className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
            <div className="flex items-center space-x-2 text-gray-400">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-10 border-t mt-16"
        style={{ borderColor: "#1f2937" }}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-400">
            <p>
              &copy; 2024 TubeInsights. Transform your YouTube content with AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
