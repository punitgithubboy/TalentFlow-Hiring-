import { motion, useScroll, useTransform, useAnimation } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const testimonials = [
  {
    id: 1,
    quote: "Our hiring speed doubled since switching. The candidate tracking is incredible.",
    author: "@sarah_hr",
    role: "Head of Talent",
    company: "TechCorp",
    avatar: "SC",
    rating: 5
  },
  {
    id: 2,
    quote: "Beautiful, fast, and effortless. Finally, a tool that gets it.",
    author: "@recruitwise",
    role: "VP of People",
    company: "StartupXYZ",
    avatar: "MR",
    rating: 5
  },
  {
    id: 3,
    quote: "The assessment builder saved us weeks of setup time. Game changer!",
    author: "@emily_watson",
    role: "Recruitment Manager",
    company: "InnovateLabs",
    avatar: "EW",
    rating: 5
  },
  {
    id: 4,
    quote: "Clean, intuitive, and powerful. Everything we needed in one place.",
    author: "@david_kim",
    role: "CTO",
    company: "ScaleUp",
    avatar: "DK",
    rating: 5
  },
  {
    id: 5,
    quote: "Our team productivity increased by 40% since switching to TalentFlow.",
    author: "@lisa_thompson",
    role: "HR Director",
    company: "GrowthCo",
    avatar: "LT",
    rating: 5
  },
  {
    id: 6,
    quote: "The midnight blue design is absolutely stunning. Love the premium feel.",
    author: "@alex_morgan",
    role: "Design Lead",
    company: "CreativeStudio",
    avatar: "AM",
    rating: 5
  },
  {
    id: 7,
    quote: "Streamlined our entire recruitment process. Highly recommend!",
    author: "@mike_recruiter",
    role: "Senior Recruiter",
    company: "FastTrack",
    avatar: "MR",
    rating: 5
  },
  {
    id: 8,
    quote: "The best hiring platform we've ever used. Period.",
    author: "@jessica_hr",
    role: "HR Manager",
    company: "InnovateCo",
    avatar: "JH",
    rating: 5
  }
];

const TestimonialCard = ({ testimonial, isHovered, onHover }: { 
  testimonial: typeof testimonials[0], 
  isHovered: boolean,
  onHover: (hovered: boolean) => void 
}) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        transition: { 
          duration: 0.3, 
          ease: [0.25, 0.46, 0.45, 0.94] // Smooth cubic-bezier
        }
      }}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
      className="group relative flex-shrink-0 w-80 md:w-96"
      style={{ willChange: "transform" }}
    >
      <div className="relative p-8 rounded-xl bg-card/60 backdrop-blur-sm border border-white/5 hover:border-white/12 transition-all duration-500 ease-out shadow-lg hover:shadow-xl">
        {/* Quote Icon */}
        <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity duration-500 ease-out">
          <Quote className="h-6 w-6 text-primary" />
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
        </div>

        {/* Quote Text */}
        <blockquote className="text-lg text-slate-200 leading-relaxed mb-6 font-medium">
          "{testimonial.quote}"
        </blockquote>

        {/* Author Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-white font-semibold text-sm">
            {testimonial.avatar}
          </div>
          <div>
            <div className="font-semibold text-foreground">{testimonial.author}</div>
            <div className="text-sm text-muted-foreground">{testimonial.role}</div>
            <div className="text-xs text-muted-foreground/80">{testimonial.company}</div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none" />
      </div>
    </motion.div>
  );
};

const GradientLightRays = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Light Ray 1 */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1]
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-primary/20 via-primary/5 to-transparent rounded-full blur-3xl"
        style={{ willChange: "transform, opacity" }}
      />
      
      {/* Light Ray 2 */}
      <motion.div
        animate={{
          x: [0, -80, 0],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          delay: 3
        }}
        className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-radial from-blue-400/15 via-blue-400/5 to-transparent rounded-full blur-3xl"
        style={{ willChange: "transform, opacity" }}
      />
      
      {/* Light Ray 3 */}
      <motion.div
        animate={{
          y: [0, -60, 0],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
          delay: 6
        }}
        className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-radial from-primary/10 via-primary/3 to-transparent rounded-full blur-3xl"
        style={{ willChange: "transform, opacity" }}
      />
    </div>
  );
};

const LightPulse = ({ progress }: { progress: number }) => {
  return (
    <motion.div
      className="absolute top-0 left-0 h-full w-96 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-3xl"
      style={{
        x: progress * (typeof window !== 'undefined' ? window.innerWidth + 400 : 1200) - 200,
        willChange: "transform, opacity"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 0] }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        repeatDelay: 4,
        ease: [0.4, 0, 0.6, 1]
      }}
    />
  );
};

export const TestimonialSection = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Carousel animation - ultra smooth with requestAnimationFrame
  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    const speed = 0.0010; // Even slower for ultra-smooth movement

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= 16) { // ~60fps
        if (!isHovered) {
          setProgress(prev => (prev + speed) % 1);
        }
        lastTime = currentTime;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  // Duplicate testimonials for infinite loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(30, 58, 138, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)
          `
        }}
      />
      
      {/* Gradient Light Rays */}
      <GradientLightRays />
      
      {/* Light Pulse */}
      <LightPulse progress={progress} />
      
      {/* Particle Shimmer Layer */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full particle-shimmer"
            style={{
              left: `${(i * 8.33) % 100}%`,
              top: `${(i * 7.5) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              willChange: "transform, opacity"
            }}
          />
        ))}
      </div>
      
      {/* Vignette Edges */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header with Parallax */}
        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
              Loved by professionals
            </span>
            <br />
            <span className="text-foreground">worldwide</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of teams who have transformed their hiring process with TalentFlow
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          style={{ y: y2, willChange: "transform" }}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="flex gap-8"
            animate={{
              x: `-${progress * 50}%`
            }}
            transition={{
              type: "tween",
              ease: "linear",
              duration: 0
            }}
            style={{
              width: `${duplicatedTestimonials.length * 400}px`,
              willChange: "transform"
            }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={`${testimonial.id}-${index}`}
                testimonial={testimonial} 
                isHovered={isHovered}
                onHover={setIsHovered}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6">
            Ready to join them?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 text-lg font-medium rounded-md transition-colors"
            style={{ 
              backgroundColor: 'rgb(99, 102, 241)', 
              color: 'white',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(79, 70, 229)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgb(99, 102, 241)';
            }}
          >
            Start Your Free Trial
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
