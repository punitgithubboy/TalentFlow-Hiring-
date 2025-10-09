import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Briefcase, Users, FileCheck, ArrowRight, Sparkles, Zap, Shield, Heart, Award } from 'lucide-react';
import { PremiumBackground } from '@/components/PremiumBackground';
import { PremiumNavigation } from '@/components/PremiumNavigation';
import { TestimonialSection } from '@/components/TestimonialSection';
import { HeroBackground } from '@/components/HeroBackground';
import { AnimatedStats } from '@/components/AnimatedStats';
import { PremiumCTA, ScrollIndicator } from '@/components/PremiumCTA';
import { HumanTouch, TrustedBy } from '@/components/HumanTouch';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <HeroBackground />
      <PremiumNavigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            {/* Hero Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-white/10 to-white/10 border border-white/20 text-white text-sm font-medium mb-8 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
              Premium Hiring Platform
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-8 tracking-tight leading-tight"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="block mb-2"
              >
                Your next star hire
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="block bg-gradient-to-r from-white via-gray-100 to-gray-200 bg-clip-text text-transparent drop-shadow-lg"
              >
                starts here
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              The only hiring platform you'll ever need. Manage jobs, track candidates, 
              and create assessments with the elegance of a premium experience.
            </motion.p>

            {/* Human Touch */}
            <HumanTouch />

            {/* CTA Buttons */}
            <PremiumCTA />

            {/* Trusted By */}
            <TrustedBy />

            {/* Animated Stats */}
            <div className="max-w-6xl mx-auto">
              <AnimatedStats />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <ScrollIndicator />
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
              style={{
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                color: '#ffffff'
              }}
            >
              Everything you need to hire better
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From job posting to candidate assessment, we've got you covered with 
              powerful tools designed for modern hiring teams.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="premium-card hover-lift p-8 group">
                <motion.div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary/10 mb-6 group-hover:bg-gradient-primary/20 transition-all duration-300"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <Briefcase className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="text-2xl font-display font-semibold text-foreground mb-4 tracking-tight">
                  Job Management
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Create, edit, and organize job postings with drag-and-drop reordering, 
                  smart filtering, and automated workflows.
                </p>
                <Link to="/jobs">
                  <Button 
                    size="sm" 
                    className="font-medium rounded-md transition-colors"
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
                    Explore Jobs
                  </Button>
                </Link>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="premium-card hover-lift p-8 group">
                <motion.div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary/10 mb-6 group-hover:bg-gradient-primary/20 transition-all duration-300"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <Users className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="text-2xl font-display font-semibold text-foreground mb-4 tracking-tight">
                  Candidate Tracking
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Track 1000+ candidates with virtualized lists, kanban boards, 
                  detailed timelines, and advanced search capabilities.
                </p>
                <Link to="/candidates">
                  <Button 
                    size="sm" 
                    className="font-medium rounded-md transition-colors"
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
                    View Candidates
                  </Button>
                </Link>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="premium-card hover-lift p-8 group">
                <motion.div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary/10 mb-6 group-hover:bg-gradient-primary/20 transition-all duration-300"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <FileCheck className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="text-2xl font-display font-semibold text-foreground mb-4 tracking-tight">
                  Smart Assessments
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Build custom assessments with conditional logic, validation rules, 
                  live preview, and automated scoring.
                </p>
                <Link to="/assessments">
                  <Button 
                    size="sm" 
                    className="font-medium rounded-md transition-colors"
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
                    Create Assessment
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <TestimonialSection />
      </motion.div>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="premium-card p-12 text-center relative overflow-hidden">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight"
                  style={{
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    color: '#ffffff'
                  }}
                >
                  Ready to transform your hiring?
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-xl text-muted-foreground mb-8 leading-relaxed"
                >
                  Join hundreds of companies using TalentFlow to find and hire the best talent efficiently.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/jobs">
                      <Button 
                        size="lg" 
                        className="gap-2 px-8 py-4 text-lg font-medium rounded-md transition-colors"
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
                        Start Now <Zap className="h-5 w-5" />
                      </Button>
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
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
                      <Shield className="h-5 w-5 mr-2" />
                      Learn More
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">TalentFlow</span>
            </div>
            <p className="text-muted-foreground mb-4">
              &copy; 2025 TalentFlow. All data stored locally in your browser.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
