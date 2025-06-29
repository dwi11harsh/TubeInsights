"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Play,
  Shield,
  Clock,
  MessageCircle,
  Download,
  Fingerprint,
  Clipboard,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Youtube,
  BarChart3,
  Brain,
  Database,
} from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// 3D DNA Helix Component
function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const playIconsRef = useRef<THREE.Group[]>([]);

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }

    playIconsRef.current.forEach((icon, i) => {
      if (icon) {
        icon.rotation.z = state.clock.elapsedTime * 2 + i * 0.5;
        icon.position.y = Math.sin(state.clock.elapsedTime + i * 0.5) * 0.1;
      }
    });
  });

  const helixPoints: [number, number, number][] = [];
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 4;
    const x = Math.cos(angle) * 2;
    const z = Math.sin(angle) * 2;
    const y = (i - 10) * 0.3;
    helixPoints.push([x, y, z]);
  }

  return (
    <group ref={groupRef}>
      {helixPoints.map((point, i) => (
        <Float key={i} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh
            position={point}
            ref={(el: THREE.Mesh | null) => {
              if (el) playIconsRef.current[i] = el.parent as THREE.Group;
            }}
          >
            <coneGeometry args={[0.1, 0.2, 3]} />
            <meshStandardMaterial
              color="#FF0000"
              emissive="#FF0000"
              emissiveIntensity={0.3}
            />
          </mesh>
        </Float>
      ))}

      {/* Connecting lines */}
      <mesh>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3(
              helixPoints.map((p) => new THREE.Vector3(...p))
            ),
            64,
            0.02,
            8,
            false,
          ]}
        />
        <meshStandardMaterial
          color="#00FFFF"
          emissive="#00FFFF"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

// Floating particles component
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state: { clock: { elapsedTime: number } }) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#DA00FF" />
    </points>
  );
}

// Progress bar component
function LiveProgress({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}

// Glitch text effect
function GlitchText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`${className} ${
        isGlitching ? "animate-pulse text-cyan-400" : ""
      } transition-colors duration-200`}
    >
      {children}
    </span>
  );
}

export default function TubeInsightsLanding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isExtracting) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsExtracting(false);
            return 0;
          }
          return prev + Math.random() * 10;
        });
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isExtracting]);

  const steps = [
    {
      icon: Fingerprint,
      title: "Authenticate",
      description: "Secure fingerprint scan authentication",
      color: "text-green-400",
    },
    {
      icon: Clipboard,
      title: "Paste Link",
      description: "URL morphs into data stream",
      color: "text-blue-400",
    },
    {
      icon: Clock,
      title: "Real-Time Extraction",
      description: "Live progress with % counter",
      color: "text-yellow-400",
    },
    {
      icon: MessageCircle,
      title: "AI-Powered Q&A",
      description: "Gemini AI chat interface",
      color: "text-purple-400",
    },
    {
      icon: Download,
      title: "Download Insights",
      description: "File download animation",
      color: "text-cyan-400",
    },
  ];

  const testimonials = [
    {
      quote: "Saved me 20 hours of research!",
      author: "Data Analyst @TechCo",
      rating: 5,
    },
    {
      quote: "Game-changer for content strategy",
      author: "Marketing Director @StartupX",
      rating: 5,
    },
    {
      quote: "The AI insights are incredibly accurate",
      author: "YouTube Creator @ChannelPro",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
            animation: "grid-move 20s linear infinite",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00FFFF" />
            <pointLight
              position={[-10, -10, -10]}
              intensity={0.5}
              color="#DA00FF"
            />
            <DNAHelix />
            <FloatingParticles />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Canvas>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
              <GlitchText>TubeInsights</GlitchText>
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Unlock the <span className="text-cyan-400">Secrets</span> Behind
              Every Word.
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Paste a link. Extract transcripts. Chat with AI. Download
              insights. All in one click.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 group"
              onClick={() => setIsExtracting(true)}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-8 py-4 text-lg rounded-full transition-all duration-300 bg-transparent"
            >
              Watch Demo
              <Play className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Live Demo Preview */}
          <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 p-6 max-w-2xl mx-auto">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Youtube className="h-5 w-5 text-red-500" />
                <span className="text-sm text-gray-400">
                  youtube.com/watch?v=example
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-cyan-400 to-transparent" />
              </div>
              {isExtracting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Extracting transcripts...</span>
                    <span className="text-cyan-400">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <LiveProgress progress={progress} />
                </div>
              )}
              <div className="text-left space-y-2">
                <div className="bg-gray-800 rounded p-3 text-sm">
                  <span className="text-cyan-400">AI:</span> I&apos;ve analyzed
                  the video transcript. What would you like to know?
                </div>
                <div className="bg-blue-900/50 rounded p-3 text-sm ml-8">
                  <span className="text-blue-400">You:</span> Summarize the key
                  themes
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Workflow Visualization */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            How It <span className="text-cyan-400">Works</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === index;

              return (
                <Card
                  key={index}
                  className={`bg-gray-900/50 backdrop-blur-sm border-gray-700 p-6 text-center transition-all duration-500 transform hover:scale-105 ${
                    isActive
                      ? "border-cyan-400 shadow-lg shadow-cyan-400/25"
                      : ""
                  }`}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center transition-all duration-300 ${
                      isActive ? "shadow-lg shadow-cyan-400/50" : ""
                    }`}
                  >
                    <Icon
                      className={`h-8 w-8 ${step.color} ${
                        isActive ? "animate-pulse" : ""
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.description}</p>
                  {isActive && (
                    <div className="mt-4">
                      <div className="w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Unique <span className="text-purple-400">Selling Points</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 p-8 hover:border-cyan-400 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Channel/Playlist Mode</h3>
              <p className="text-gray-400 mb-4">
                Process entire channels or playlists in one go. Watch as video
                thumbnails merge into a unified transcript.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-video bg-red-600/20 rounded border border-red-500/30 flex items-center justify-center"
                  >
                    <Play className="h-3 w-3 text-red-400" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 p-8 hover:border-purple-400 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Live Progress</h3>
              <p className="text-gray-400 mb-4">
                Real-time WebSocket status updates with animated progress bars.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Extracting videos...</span>
                  <span className="text-purple-400">47/92</span>
                </div>
                <LiveProgress progress={51} />
                <div className="text-xs text-gray-500">
                  ETA: 2 minutes remaining
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-700 p-8 hover:border-cyan-400 transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Chat Showcase</h3>
              <p className="text-gray-400 mb-4">
                Interactive Gemini AI demo with instant responses to your
                queries.
              </p>
              <div className="space-y-2">
                <div className="bg-gray-800 rounded p-2 text-sm">
                  <span className="text-cyan-400">AI:</span> Ready to analyze!
                </div>
                <div className="bg-blue-900/50 rounded p-2 text-sm">
                  <span className="text-blue-400">You:</span> Summarize key
                  themes
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  <span>AI is typing...</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">
            What Our <span className="text-cyan-400">Users</span> Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm border-gray-700 p-6"
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-lg mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <cite className="text-sm text-gray-400">
                  — {testimonial.author}
                </cite>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">SSL Secured</h3>
              <p className="text-gray-400">Bank-level encryption</p>
            </div>

            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-gray-400">Privacy protected</p>
            </div>

            <div className="text-center">
              <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Featured In</h3>
              <div className="flex justify-center space-x-4 text-sm text-gray-400">
                <span>TechCrunch</span>
                <span>•</span>
                <span>DataToday</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-cyan-400 bg-clip-text text-transparent">
              TubeInsights
            </h3>
            <p className="text-gray-400 mt-2">
              Unlock the secrets behind every word
            </p>
          </div>

          <div className="flex justify-center space-x-8 mb-8">
            <a
              href="#"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              Support
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              API
            </a>
          </div>

          <p className="text-gray-500 text-sm">
            © 2024 TubeInsights. All rights reserved. Made with ❤️ for
            data-driven creators.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes grid-move {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  );
}
