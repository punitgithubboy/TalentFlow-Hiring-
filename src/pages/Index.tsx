import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Briefcase, Users, FileCheck, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground tracking-tight">TalentFlow</span>
            </div>

            <Link to="/jobs">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-semibold text-foreground mb-6 tracking-tight">
            Streamline Your Hiring Process
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Manage jobs, track candidates, and create assessments all in one powerful platform
          </p>
          <Link to="/jobs">
            <Button size="lg" className="gap-2">
              Start Hiring <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          <Card className="p-6 hover:shadow-md transition-all duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-4 shadow-sm">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight">Job Management</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Create, edit, and organize job postings with drag-and-drop reordering and smart filtering
            </p>
            <Link to="/jobs">
              <Button variant="outline" size="sm">Explore Jobs</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-md transition-all duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-4 shadow-sm">
              <Users className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight">Candidate Tracking</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Track 1000+ candidates with virtualized lists, kanban boards, and detailed timelines
            </p>
            <Link to="/candidates">
              <Button variant="outline" size="sm">View Candidates</Button>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-md transition-all duration-200">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary mb-4 shadow-sm">
              <FileCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3 tracking-tight">Smart Assessments</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Build custom assessments with conditional logic, validation rules, and live preview
            </p>
            <Link to="/assessments">
              <Button variant="outline" size="sm">Create Assessment</Button>
            </Link>
          </Card>
        </div>

        <Card className="p-8 bg-muted/30 border-border/50">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-foreground mb-4 tracking-tight">
                Ready to transform your hiring?
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Join hundreds of companies using TalentFlow to find and hire the best talent efficiently.
              </p>
              <Link to="/jobs">
                <Button size="lg">Start Now</Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center bg-background/50">
                <div className="text-3xl font-semibold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Candidates</div>
              </Card>
              <Card className="p-4 text-center bg-background/50">
                <div className="text-3xl font-semibold text-primary">25+</div>
                <div className="text-sm text-muted-foreground">Active Jobs</div>
              </Card>
              <Card className="p-4 text-center bg-background/50">
                <div className="text-3xl font-semibold text-primary">6</div>
                <div className="text-sm text-muted-foreground">Stages</div>
              </Card>
              <Card className="p-4 text-center bg-background/50">
                <div className="text-3xl font-semibold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Local Data</div>
              </Card>
            </div>
          </div>
        </Card>
      </main>

      <footer className="border-t border-border/50 mt-16 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2025 TalentFlow. All data stored locally in your browser.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
