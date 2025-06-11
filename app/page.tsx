"use client"

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Calendar, Camera, Music, Star, Gift, Sparkles, Users, Home, Plane, Baby } from "lucide-react"
import Image from "next/image"

// Optimized ParticleBackground component with memoization
const ParticleBackground = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const particlesArrayRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    // Optimize canvas settings
    ctx.imageSmoothingEnabled = false

    // Set canvas to full screen
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()

    // Reduced particle count for better performance
    const numberOfParticles = Math.min(50, Math.floor(window.innerWidth / 20))

    // Throttled resize handler
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(setCanvasSize, 100)
    }

    window.addEventListener("resize", handleResize, { passive: true })

    // Optimized Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 1 // Reduced size for better performance
        this.speedX = Math.random() * 0.3 - 0.15 // Reduced speed
        this.speedY = Math.random() * 0.3 - 0.15

        // Pre-computed colors for better performance
        const colors = ["#FFB6C1", "#FF69B4", "#DDA0DD", "#FFD700", "#FFC0CB"]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0
        if (this.x < 0) this.x = canvas.width
        if (this.y > canvas.height) this.y = 0
        if (this.y < 0) this.y = canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Initialize particles only once
    if (particlesArrayRef.current.length === 0) {
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArrayRef.current.push(new Particle())
      }
    }

    // Optimized animation loop with requestAnimationFrame
    let lastTime = 0
    const animate = (currentTime: number) => {
      // Throttle to 30fps for better performance
      if (currentTime - lastTime < 33) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }
      lastTime = currentTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      const particles = particlesArrayRef.current
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()
      }

      // Optimized particle connections (reduced distance for performance)
      connectParticles()

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Optimized particle connection function
    const connectParticles = () => {
      if (!ctx) return

      const particles = particlesArrayRef.current
      const maxDistance = 80 // Reduced for better performance

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3
            ctx.strokeStyle = `rgba(255, 182, 193, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 bg-transparent" />
})

ParticleBackground.displayName = "ParticleBackground"

// Optimized TimelineCard component
const TimelineCard = memo(({ event, index }: { event: any; index: number }) => {
  return (
    <div
      className={`flex flex-col md:flex-row items-center mb-16 ${index % 2 === 1 ? "md:flex-row-reverse" : ""} animate-fade-in`}
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <div className="md:w-1/2 mb-8 md:mb-0">
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="relative">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.alt}
              width={400}
              height={300}
              className="w-full h-64 object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
              className={`absolute top-4 left-4 w-12 h-12 ${event.color} rounded-full flex items-center justify-center animate-pulse`}
            >
              <event.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardContent className="p-6">
            <Badge variant="secondary" className="mb-2">
              {event.date}
            </Badge>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
            <p className="text-gray-600">{event.description}</p>
          </CardContent>
        </Card>
      </div>

      <div className="md:w-1/2 flex justify-center">
        <div className="w-4 h-4 bg-pink-500 rounded-full relative">
          <div className="absolute inset-0 bg-pink-500 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  )
})

TimelineCard.displayName = "TimelineCard"

// Optimized MemoryCard component
const MemoryCard = memo(({ memory, index }: { memory: any; index: number }) => {
  return (
    <Card
      className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative">
        <Image
          src={memory.src || "/placeholder.svg"}
          alt={memory.alt}
          width={400}
          height={300}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <Heart className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
        </div>
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {memory.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-gray-800 mb-1">{memory.title}</h3>
        <p className="text-sm text-gray-600">{memory.description}</p>
      </CardContent>
    </Card>
  )
})

MemoryCard.displayName = "MemoryCard"

// Optimized StatCard component
const StatCard = memo(({ stat, index }: { stat: any; index: number }) => {
  return (
    <Card
      className="text-center p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardContent className="p-0">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
          <stat.icon className="w-8 h-8 text-white" />
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
        <div className="text-gray-600">{stat.label}</div>
      </CardContent>
    </Card>
  )
})

StatCard.displayName = "StatCard"

export default function RomanticSite() {
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Memoized relationship start date
  const relationshipStart = useMemo(() => new Date("2022-05-12T00:00:00"), [])

  // Optimized timer with useCallback
  const updateTimer = useCallback(() => {
    const now = new Date()
    const diff = now.getTime() - relationshipStart.getTime()

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365))
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30))
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeTogether({ years, months, days, hours, minutes, seconds })
  }, [relationshipStart])

  useEffect(() => {
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [updateTimer])

  // Memoized data arrays to prevent unnecessary re-renders
  const timelineEvents = useMemo(
    () => [
      {
        date: "12 de Outubro, 2022",
        title: "Nosso Primeiro Encontro",
        description:
          "O dia em que finalmenete nos encontramos fora da escola.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-06-03-11-51-56%202.JPEG-lhR2X5TyVSNKMrQzY2nQk6OvekJuWn.jpeg",
        alt: "Nosso primeiro encontro - momento íntimo e carinhoso que marcou o início da nossa história",
        icon: Heart,
        color: "bg-pink-500",
      },
      {
        date: "28 de Novembro, 2024",
        title: "Primeira Viagem Juntos",
        description:
          "Primeira viagem junto para Porto Seguro, memorias inesqueciveis.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-06-03-12-01-55.JPEG-PBHatwBceGQem5F3kTW0VzyWpX1bPZ.jpeg",
        alt: "Nossa primeira viagem a Porto Seguro - momento romântico no letreiro iluminado com corações",
        icon: MapPin,
        color: "bg-blue-500",
      },
      {
        date: "31 de Dezembro, 2024",
        title: "Primeiro Ano Novo Juntos",
        description:
          "Celebramos nosso primeiro ano novo juntos.",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-06-03-11-52-58.JPEG-nEPfrhZsduKDvIDlAEkHLVPadmbMOC.jpeg",
        alt: "Celebração especial - arrumados e felizes para comemorar momentos importantes juntos",
        icon: Gift,
        color: "bg-green-500",
      },
      {
        date: "Hoje",
        title: "Nossa História Continua",
        description:
          "Continuamos firme e fortes, cada dia se amando mais!",
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0db3f1e8-6703-42ea-a1ab-91537f36647e.JPEG-Uuj8435Q6mHrCp7IPhUvJYTyquHANn.jpeg",
        alt: "Nossa família atual - nós dois felizes com nosso cachorrinho, representando nosso amor que cresce",
        icon: Sparkles,
        color: "bg-gradient-to-r from-pink-500 to-purple-500",
      },
    ],
    [],
  )

  const specialPlaces = useMemo(
    () => [
      {
        name: "Shopping",
        description: "Onde tivemos primeiro encontro",
        icon: Heart,
      },
      {
        name: "Escola",
        description: "Onde nos conhecemos",
        icon: Star,
      },
      {
        name: "Porto Seguro",
        description: "Nossa primeira viagem juntos",
        icon: MapPin,
      },
    ],
    [],
  )

  const futureDreams = useMemo(
    () => [
      {
        title: "Ter uma família feliz",
        description: "Construir uma família cheia de amor e alegria",
        icon: Users,
      },
      {
        title: "Ter filhos",
        description: "Criar pequenos seres cheios de amor",
        icon: Baby,
      },
      {
        title: "Viajar muito",
        description: "Conhecer o mundo juntinhos",
        icon: Plane,
      },
      {
        title: "Ter uma casa linda",
        description: "Nosso lar para toda a nossa família",
        icon: Home,
      },
    ],
    [],
  )

  const loveStats = useMemo(
    () => [
      {
        label: "Dias Juntos",
        value: Math.floor((new Date().getTime() - relationshipStart.getTime()) / (1000 * 60 * 60 * 24)),
        icon: Calendar,
      },
      { label: "Reels Enviados", value: "∞", icon: Camera },
      { label: "Falar Meu bem", value: "Incontáveis vezes", icon: Heart },
      { label: "Momentos Especiais", value: "Incontáveis", icon: Sparkles },
      { label: "Sorrisos Provocados", value: "∞", icon: Heart },
    ],
    [relationshipStart],
  )

  const ourMemories = useMemo(
    () => [
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-06-03-12-01-55.JPEG-PBHatwBceGQem5F3kTW0VzyWpX1bPZ.jpeg",
        alt: "Nossa primeira viagem a Porto Seguro - momento mágico no letreiro iluminado",
        title: "Porto Seguro",
        description: "Nossa primeira viagem juntos",
        category: "Viagem",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-06-03-11-55-31.JPEG-1lW7P7wYoT7CWpxcWM9HGnuftNxvMc.jpeg",
        alt: "Momento íntimo e carinhoso - abraço apertado cheio de amor",
        title: "Beijo de paz",
        description: "Momentos de carinho puro",
        category: "Intimidade",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-06-03-11-51-56%202.JPEG-lhR2X5TyVSNKMrQzY2nQk6OvekJuWn.jpeg",
        alt: "Selfie juntinhos - sorriso genuíno de felicidade",
        title: "Fotos espontanea",
        description: "Fotos espontaneas sao lindas!",
        category: "Espontaneo",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-06-03-11-51-56.JPEG-KGwyRlyTaVVVxQRFPxqBjmQjIHDlzV.jpeg",
        alt: "Jantar romântico - ele de verde e ela de vestido estampado",
        title: "Foto na viagem",
        description: "Noites inesqueciveis",
        category: "Romance",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0db3f1e8-6703-42ea-a1ab-91537f36647e.JPEG-Uuj8435Q6mHrCp7IPhUvJYTyquHANn.jpeg",
        alt: "Família completa - nós dois com nosso cachorrinho fofo",
        title: "Nos",
        description: "Nos dois e um cachorrinho",
        category: "Espontaneo",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-06-03-12-02-36.JPEG-hMGsh8PfFjTCNI5PfTnIBN7qR4IBzi.jpeg",
        alt: "Momento divertido - caretas e risadas no carro",
        title: "Foto aleatoria",
        description: "Momentos felizes",
        category: "Espontaneo",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-06-03-11-52-36.JPEG-jRUqUtSiK4usziTj7jpqozczlAfAxG.jpeg",
        alt: "Arrumados para sair - ele de camisa listrada e ela de azul",
        title: "Prontos para o sair",
        description: "Sempre lindos juntos",
        category: "Elegância",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-06-03-12-07-52.JPEG-4e724oljCuuafJY387sd7tS09w53xo.jpeg",
        alt: "Selfie carinhosa - ela de blusa estampada e ele de verde",
        title: "Amor infinito",
        description: "Amor em cada beijinho",
        category: "Amor",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-06-03-11-51-56%203.JPEG-WhPIGdvd0gMbFkVUMwlZjDCBFcJ1Vk.jpeg",
        alt: "Momento terno - mão no rosto em gesto de carinho",
        title: "Ternura Pura",
        description: "Nosso primeiro encontro",
        category: "Ternura",
      },
      {
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-06-03-11-52-58.JPEG-nEPfrhZsduKDvIDlAEkHLVPadmbMOC.jpeg",
        alt: "Noite especial - ele de listrado e ela de branco em momento romântico",
        title: "Noite Inesquecível",
        description: "Memórias que ficam para sempre",
        category: "Especial",
      },
    ],
    [],
  )

  // Optimized scroll handler
  const handleSmoothScroll = useCallback((elementId: string) => {
    document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Memoized floating hearts to prevent re-creation
  const floatingHearts = useMemo(
    () =>
      [...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-heart opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        >
          <Heart className="w-4 h-4 text-pink-400" />
        </div>
      )),
    [],
  )

  // Memoized sparkle effects
  const sparkleEffects = useMemo(
    () =>
      [...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        >
          <Sparkles className="w-3 h-3 text-yellow-400 opacity-60" />
        </div>
      )),
    [],
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 relative overflow-hidden">
      {/* Particle Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticleBackground />
      </div>

      {/* Floating Hearts Animation */}
      <div className="fixed inset-0 pointer-events-none z-0">{floatingHearts}</div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
              <span className="font-bold text-gray-800">Nossa História</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <button
                onClick={() => handleSmoothScroll("hero")}
                className="text-gray-600 hover:text-pink-500 transition-colors hover:scale-105"
              >
                Início
              </button>
              <button
                onClick={() => handleSmoothScroll("timeline")}
                className="text-gray-600 hover:text-pink-500 transition-colors hover:scale-105"
              >
                Nossa Jornada
              </button>
              <button
                onClick={() => handleSmoothScroll("gallery")}
                className="text-gray-600 hover:text-pink-500 transition-colors hover:scale-105"
              >
                Memórias
              </button>
              <button
                onClick={() => handleSmoothScroll("places")}
                className="text-gray-600 hover:text-pink-500 transition-colors hover:scale-105"
              >
                Lugares
              </button>
              <button
                onClick={() => handleSmoothScroll("future")}
                className="text-gray-600 hover:text-pink-500 transition-colors hover:scale-105"
              >
                Futuro
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-rose-400/20"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300/30 rounded-full animate-bounce-slow"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-purple-300/30 rounded-full animate-bounce-slow delay-1000"></div>
          <div className="absolute bottom-20 left-32 w-24 h-24 bg-rose-300/30 rounded-full animate-bounce-slow delay-2000"></div>
          <div className="absolute bottom-40 right-10 w-12 h-12 bg-pink-400/30 rounded-full animate-bounce-slow delay-500"></div>

          {/* Sparkle Effects */}
          {sparkleEffects}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 bg-clip-text text-transparent mb-6 animate-fade-in animate-text-shimmer">
              Meu Amor
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 animate-fade-in delay-500">
              Uma jornada de amor, experiencia e sonhos compartilhados
            </p>

            {/* Contador em Tempo Real */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12 animate-fade-in delay-1000">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-pink-200 hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold text-pink-600">{timeTogether.years}</div>
                <div className="text-sm text-gray-600">Anos</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-200 hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold text-purple-600">{timeTogether.months}</div>
                <div className="text-sm text-gray-600">Meses</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-rose-200 hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold text-rose-600">{timeTogether.days}</div>
                <div className="text-sm text-gray-600">Dias</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-pink-200 hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold text-pink-600">{timeTogether.hours}</div>
                <div className="text-sm text-gray-600">Horas</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-200 hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold text-purple-600">{timeTogether.minutes}</div>
                <div className="text-sm text-gray-600">Minutos</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-rose-200 hover:scale-105 transition-transform duration-300">
                <div className="text-2xl font-bold text-rose-600">{timeTogether.seconds}</div>
                <div className="text-sm text-gray-600">Segundos</div>
              </div>
            </div>

            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in delay-1500 hover:scale-110"
              onClick={() => handleSmoothScroll("timeline")}
            >
              Descubra Nossa História
              <Heart className="ml-2 w-5 h-5 animate-pulse" />
            </Button>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section id="timeline" className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">Nossa Jornada</h2>
            <p className="text-xl text-gray-600 animate-fade-in delay-300">Cada momento especial que vivemos juntos</p>
          </div>

          <div className="max-w-4xl mx-auto">
            {timelineEvents.map((event, index) => (
              <TimelineCard key={index} event={event} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-pink-100 to-purple-100 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">Nossos Números</h2>
            <p className="text-xl text-gray-600 animate-fade-in delay-300">Estatísticas do nosso amor</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {loveStats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">Nossas Memórias</h2>
            <p className="text-xl text-gray-600 animate-fade-in delay-300">
              Uma coleção dos nossos momentos mais especiais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {ourMemories.map((memory, index) => (
              <MemoryCard key={index} memory={memory} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Music Section */}
      <section className="py-20 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">Nossa Trilha Sonora</h2>
            <p className="text-xl text-gray-600 animate-fade-in delay-300">As músicas que marcaram nossa história</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-white to-pink-50 border-2 border-pink-200 animate-fade-in delay-500">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Nossa Playlist Especial</h3>
                    <p className="text-gray-600">3 músicas • Momentos únicos</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center animate-spin-slow">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* A Droga do Amor */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">A Droga do Amor</h4>
                        <p className="text-gray-600">Ari, Felipe Play, Dom R, Tiankris</p>
                      </div>
                    </div>
                    <div className="custom-audio-player">
                      <audio
                        controls
                        className="w-full h-12 rounded-lg"
                        preload="none"
                        style={{
                          filter: "sepia(20%) saturate(70%) hue-rotate(315deg) brightness(95%) contrast(105%)",
                        }}
                      >
                        <source
                          src="https://files.catbox.moe/q61aeq.mp4"
                          type="audio/mpeg"
                        />
                        Seu navegador não suporta áudio.
                      </audio>
                    </div>
                  </div>

                  {/* Velha Infância */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">Velha Infância</h4>
                        <p className="text-gray-600">Tribalistas</p>
                      </div>
                    </div>
                    <div className="custom-audio-player">
                      <audio
                        controls
                        className="w-full h-12 rounded-lg"
                        preload="none"
                        style={{
                          filter: "sepia(20%) saturate(70%) hue-rotate(250deg) brightness(95%) contrast(105%)",
                        }}
                      >
                        <source
                          src="https://files.catbox.moe/zkzfg7.mp4"
                          type="audio/mpeg"
                        />
                        Seu navegador não suporta áudio.
                      </audio>
                    </div>
                  </div>

                  {/* Yellow */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-yellow-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 animate-pulse">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">Yellow</h4>
                        <p className="text-gray-600">Coldplay</p>
                      </div>
                    </div>
                    <div className="custom-audio-player">
                      <audio
                        controls
                        className="w-full h-12 rounded-lg"
                        preload="none"
                        style={{
                          filter: "sepia(20%) saturate(70%) hue-rotate(45deg) brightness(95%) contrast(105%)",
                        }}
                      >
                        <source
                          src="https://files.catbox.moe/w0yyy1.mp4"
                          type="audio/mpeg"
                        />
                        Seu navegador não suporta áudio.
                      </audio>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-500 text-sm italic animate-pulse">
                    "Voce é assim, um sonho pra mim..." ❤️
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Places Section */}
      <section id="places" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">
              Nossos Lugares Especiais
            </h2>
            <p className="text-xl text-gray-600 animate-fade-in delay-300">Cada lugar tem uma história para contar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {specialPlaces.map((place, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                    <place.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{place.name}</h3>
                  <p className="text-gray-600 mb-3">{place.description}</p>
                  <Badge variant="secondary" className="animate-pulse">
                    Infinitas memórias
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Dreams Section */}
      <section id="future" className="py-20 bg-gradient-to-r from-rose-100 to-pink-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in">Nossos Sonhos</h2>
            <p className="text-xl text-gray-600 animate-fade-in delay-300">O que o futuro reserva para nós</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {futureDreams.map((dream, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 animate-bounce-slow">
                      <dream.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{dream.title}</h3>
                      <p className="text-gray-600">{dream.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            >
              <Star className="w-2 h-2 text-yellow-400 opacity-60" />
            </div>
          ))}
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
            <span className="text-xl font-bold">Feito com amor</span>
            <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
          </div>
          <p className="text-gray-400 mb-4">
            Este site é uma declaração de amor, feito por mim para você.
          </p>
          <p className="text-sm text-gray-500">Cada pixel foi pensado com amor - {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
