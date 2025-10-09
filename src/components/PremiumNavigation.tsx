import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Users, FileCheck, Kanban, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const PremiumNavigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Candidates', href: '/candidates', icon: Users },
    { name: 'Kanban', href: '/candidates/kanban', icon: Kanban },
    { name: 'Assessments', href: '/assessments', icon: FileCheck },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10 shadow-glass transition-all duration-300 ease-out">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="flex items-center gap-3 group transition-all duration-300 hover:scale-105"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground tracking-tight">
                TalentFlow
              </span>
            </Link>

            <div className="hidden md:flex md:gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-out',
                      isActive
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground hover:scale-105 hover:shadow-glow'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-foreground hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <Link to="/jobs">
              <button 
                className="px-6 py-2.5 text-sm font-medium rounded-md transition-colors"
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
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/5 backdrop-blur-sm border-t border-white/10">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-300 ease-out',
                      isActive
                        ? 'bg-gradient-primary text-primary-foreground shadow-glow'
                        : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
