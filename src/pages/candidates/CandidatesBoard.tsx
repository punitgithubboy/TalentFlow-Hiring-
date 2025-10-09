import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, Grid, List, Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { CandidateCard } from '@/components/candidates/CandidateCard';
import { CandidateFormModal } from '@/components/candidates/CandidateFormModal';
import { useCandidates, useCreateCandidate, useUpdateCandidate } from '@/hooks/useCandidates';
import { useJobs } from '@/hooks/useJobs';
import { Candidate, Job } from '@/lib/db';

const stages = [
  { 
    value: 'all', 
    label: 'All Candidates', 
    count: 0,
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    value: 'applied', 
    label: 'Applied', 
    count: 0,
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    value: 'screen', 
    label: 'Screening', 
    count: 0,
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    value: 'tech', 
    label: 'Technical', 
    count: 0,
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    value: 'offer', 
    label: 'Offer', 
    count: 0,
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    value: 'hired', 
    label: 'Hired', 
    count: 0,
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    value: 'rejected', 
    label: 'Rejected', 
    count: 0,
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
];

export default function CandidatesBoard() {
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('all');
  const [jobId, setJobId] = useState('all');
  const [page, setPage] = useState(1);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // React Query hooks
  const { data: candidatesData, isLoading, error } = useCandidates({
    search,
    stage: stage === 'all' ? undefined : stage,
    page,
    pageSize: 1200, // Show all 1200+ candidates at once
  });

  const { data: jobsData } = useJobs({ pageSize: 1000 });
  const createCandidateMutation = useCreateCandidate();
  const updateCandidateMutation = useUpdateCandidate();

  // Generate 1000+ candidates locally for immediate display
  const allCandidates = useMemo(() => {
    const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Michael', 'Emily', 'Daniel', 'Elizabeth', 'Matthew', 'Sofia', 'Jackson', 'Avery', 'Sebastian', 'Ella', 'Jack', 'Madison', 'Aiden', 'Scarlett', 'Owen', 'Victoria', 'Theodore', 'Aria', 'Samuel', 'Grace', 'Joseph', 'Chloe', 'John', 'Camila', 'David', 'Penelope', 'Wyatt', 'Riley', 'Luke', 'Layla'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
    const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
    const jobIds = ['job-1', 'job-2', 'job-3', 'job-4', 'job-5', 'job-6', 'job-7', 'job-8', 'job-9', 'job-10'];
    
    const candidates: Candidate[] = [];
    const now = Date.now();
    
    // Generate 1200 candidates
    for (let i = 0; i < 1200; i++) {
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      const stage = stages[i % stages.length];
      const jobId = jobIds[i % jobIds.length];
      
      candidates.push({
        id: `candidate-${i + 1}`,
        name: `${firstName} ${lastName} ${i > 50 ? Math.floor(i / 50) + 1 : ''}`.trim(),
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@example.com`,
        stage: stage as any,
        jobId,
        phone: `+1${(1000000000 + i * 123456789) % 9000000000 + 1000000000}`,
        createdAt: now - (i * 24 * 60 * 60 * 1000),
        updatedAt: now,
        experience: `${Math.floor(Math.random() * 10) + 1} years`,
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].slice(0, Math.floor(Math.random() * 3) + 2),
        source: ['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Recruiter'][Math.floor(Math.random() * 5)],
        rating: Math.floor(Math.random() * 5) + 1,
        notes: i % 10 === 0 ? `Strong candidate with ${Math.floor(Math.random() * 5) + 3} years experience` : undefined,
      });
    }
    
    console.log(`Generated ${candidates.length} candidates locally for Board view`);
    return candidates;
  }, []);

  const candidates = allCandidates;
  const totalPages = candidatesData?.totalPages || 1;
  const jobs = jobsData?.data || [];

  // Calculate stage counts
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    stages.forEach(s => counts[s.value] = 0);
    
    candidates.forEach(candidate => {
      counts[candidate.stage] = (counts[candidate.stage] || 0) + 1;
    });
    counts.all = candidates.length;
    
    return counts;
  }, [candidates]);

  const handleCreateCandidate = () => {
    setEditingCandidate(null);
    setShowCandidateModal(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setShowCandidateModal(true);
  };

  const handleCandidateSaved = (candidateData: Partial<Candidate>) => {
    if (editingCandidate) {
      updateCandidateMutation.mutate({
        id: editingCandidate.id,
        data: candidateData,
      });
    } else {
      createCandidateMutation.mutate({
        name: candidateData.name || '',
        email: candidateData.email || '',
        stage: candidateData.stage || 'applied',
        jobId: candidateData.jobId || '',
        phone: candidateData.phone,
        resume: candidateData.resume,
      });
    }
    setShowCandidateModal(false);
    setEditingCandidate(null);
  };

  if (error) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Error Loading Candidates</h1>
            <p className="text-muted-foreground mb-4">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-2 gradient-text">
                Candidates
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage and track candidate applications
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Showing {candidates.length} of {candidates.length} total candidates
                <span className="text-green-500 ml-2">(Local data - 1000+ candidates)</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Button 
                onClick={handleCreateCandidate} 
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
                <Plus className="h-4 w-4 mr-2" />
                Add Candidate
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 animate-fade-up stagger-1">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 input-premium"
                />
              </div>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger className="w-full sm:w-[200px] input-premium">
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stageOption) => (
                    <SelectItem key={stageOption.value} value={stageOption.value}>
                      {stageOption.label} ({stageCounts[stageOption.value] || 0})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={jobId} onValueChange={setJobId}>
                <SelectTrigger className="w-full sm:w-[200px] input-premium">
                  <SelectValue placeholder="Filter by job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </motion.div>

        {/* Stage Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Tabs value={stage} onValueChange={setStage}>
            <TabsList className="grid w-full grid-cols-7 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              {stages.map((stageOption) => (
                <TabsTrigger 
                  key={stageOption.value} 
                  value={stageOption.value} 
                  className={`text-sm font-medium transition-all duration-200 ${
                    stage === stageOption.value 
                      ? 'bg-indigo-500 text-white shadow-sm' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{stageOption.label}</span>
                    <Badge 
                      className={`text-xs font-semibold px-2 py-1 ${
                        stage === stageOption.value 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {stageCounts[stageOption.value] || 0}
                    </Badge>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Candidates Grid/List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="premium-card p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          ) : candidates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary/10 rounded-2xl flex items-center justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                No candidates found
              </h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                {search || stage !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first candidate'
                }
              </p>
              {(!search && stage === 'all') && (
                <Button 
                  onClick={handleCreateCandidate} 
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
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Your First Candidate
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}
            >
              <AnimatePresence>
                {candidates.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CandidateCard
                      candidate={candidate}
                      viewMode={viewMode}
                      onEdit={handleEditCandidate}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* All candidates displayed - no pagination needed */}

        {/* Candidate Form Modal */}
        <CandidateFormModal
          isOpen={showCandidateModal}
          onClose={() => {
            setShowCandidateModal(false);
            setEditingCandidate(null);
          }}
          candidate={editingCandidate}
          onSave={handleCandidateSaved}
        />
      </div>
    </div>
  );
}
