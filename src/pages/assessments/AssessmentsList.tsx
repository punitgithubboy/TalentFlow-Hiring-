import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Edit, Eye, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useJobs } from '@/hooks/useJobs';
import { AssessmentTestSection } from '@/components/AssessmentTestSection';

export default function AssessmentsList() {
  const [search, setSearch] = useState('');
  const [jobId, setJobId] = useState('all');
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showTestSection, setShowTestSection] = useState(false);
  const [selectedJobForTest, setSelectedJobForTest] = useState<{id: string, title: string} | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCreateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // React Query hooks
  const { data: jobsData, isLoading: jobsLoading, error: jobsError } = useJobs({ pageSize: 1000 });

  const jobs = jobsData?.data || [];

  console.log('AssessmentsList data:', { jobs, jobsLoading, jobsError, jobsData });

  // Fallback data if no jobs are loaded
  const fallbackJobs = [
    {
      id: 'job-1',
      title: 'Senior Frontend Developer',
      slug: 'senior-frontend-developer',
      status: 'active' as const,
      tags: ['React', 'TypeScript', 'Remote'],
      order: 1,
      description: 'We are looking for an experienced Senior Frontend Developer to join our team.',
      createdAt: Date.now() - 86400000 * 7,
      updatedAt: Date.now() - 86400000 * 2,
    },
    {
      id: 'job-2',
      title: 'Backend Engineer',
      slug: 'backend-engineer',
      status: 'active' as const,
      tags: ['Node.js', 'Python', 'AWS'],
      order: 2,
      description: 'We are looking for an experienced Backend Engineer to join our team.',
      createdAt: Date.now() - 86400000 * 5,
      updatedAt: Date.now() - 86400000 * 1,
    },
    {
      id: 'job-3',
      title: 'Full Stack Developer',
      slug: 'full-stack-developer',
      status: 'archived' as const,
      tags: ['React', 'Node.js', 'MongoDB'],
      order: 3,
      description: 'We are looking for an experienced Full Stack Developer to join our team.',
      createdAt: Date.now() - 86400000 * 10,
      updatedAt: Date.now() - 86400000 * 3,
    },
  ];

  const displayJobs = jobs.length > 0 ? jobs : fallbackJobs;

  // Create assessments list from jobs
  const assessmentsList = useMemo(() => {
    console.log('Creating assessments list from jobs:', displayJobs);
    return displayJobs.map(job => ({
      id: `assessment-${job.id}`,
      jobId: job.id,
      title: `${job.title} Assessment`,
      sections: [],
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      hasAssessment: false, // For now, we'll assume no assessments exist
      jobTitle: job.title,
      jobStatus: job.status,
    }));
  }, [displayJobs]);

  // Filter assessments
  const filteredAssessments = useMemo(() => {
    let filtered = assessmentsList;

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(assessment =>
        assessment.title.toLowerCase().includes(searchLower) ||
        assessment.jobTitle.toLowerCase().includes(searchLower)
      );
    }

    if (jobId !== 'all') {
      filtered = filtered.filter(assessment => assessment.jobId === jobId);
    }

    return filtered;
  }, [assessmentsList, search, jobId]);

  const handleCreateAssessment = (jobId: string) => {
    console.log('Creating assessment for job:', jobId);
    navigate(`/assessments/${jobId}`);
  };

  const handleEditAssessment = (jobId: string) => {
    navigate(`/assessments/${jobId}`);
  };

  const handleViewAssessment = (jobId: string) => {
    navigate(`/assessments/${jobId}?view=true`);
  };

  const handleSelectTest = (testId: string, jobId: string) => {
    console.log('handleSelectTest called:', { testId, jobId });
    // Navigate to assessment builder with the selected test
    const url = `/assessments/${jobId}?test=${testId}`;
    console.log('Navigating to:', url);
    navigate(url);
  };

  const handleCreateCustom = (jobId: string) => {
    console.log('handleCreateCustom called:', { jobId });
    setShowTestSection(false);
    setSelectedJobForTest(null);
    const url = `/assessments/${jobId}`;
    console.log('Navigating to:', url);
    navigate(url);
  };

  const handleShowTestSection = (job: {id: string, title: string}) => {
    setSelectedJobForTest(job);
    setShowTestSection(true);
    setShowCreateDropdown(false);
  };

  // Show loading state
  if (jobsLoading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-foreground mb-2 gradient-text">
              Assessments
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Loading assessments...
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if jobs failed to load - but provide fallback data
  if (jobsError) {
    console.log('Jobs API failed, using fallback data:', jobsError);
    
    // Fallback data when API fails
    const fallbackJobs = [
      {
        id: 'job-1',
        title: 'Senior Frontend Developer',
        slug: 'senior-frontend-developer',
        status: 'active' as const,
        tags: ['React', 'TypeScript', 'Remote'],
        order: 1,
        description: 'We are looking for an experienced Senior Frontend Developer to join our team.',
        createdAt: Date.now() - 86400000 * 7,
        updatedAt: Date.now() - 86400000 * 2,
      },
      {
        id: 'job-2',
        title: 'Backend Engineer',
        slug: 'backend-engineer',
        status: 'active' as const,
        tags: ['Node.js', 'Python', 'AWS'],
        order: 2,
        description: 'We are looking for an experienced Backend Engineer to join our team.',
        createdAt: Date.now() - 86400000 * 5,
        updatedAt: Date.now() - 86400000 * 1,
      },
      {
        id: 'job-3',
        title: 'Full Stack Developer',
        slug: 'full-stack-developer',
        status: 'archived' as const,
        tags: ['React', 'Node.js', 'MongoDB'],
        order: 3,
        description: 'We are looking for an experienced Full Stack Developer to join our team.',
        createdAt: Date.now() - 86400000 * 10,
        updatedAt: Date.now() - 86400000 * 3,
      },
    ];

    const fallbackAssessments = fallbackJobs.map(job => ({
      id: `assessment-${job.id}`,
      jobId: job.id,
      title: `${job.title} Assessment`,
      sections: [],
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      hasAssessment: false,
      jobTitle: job.title,
      jobStatus: job.status,
    }));

    const filteredFallbackAssessments = fallbackAssessments.filter(assessment => {
      if (search) {
        const searchLower = search.toLowerCase();
        return assessment.title.toLowerCase().includes(searchLower) ||
               assessment.jobTitle.toLowerCase().includes(searchLower);
      }
      if (jobId !== 'all') {
        return assessment.jobId === jobId;
      }
      return true;
    });

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
                  Assessments
                </h1>
                <p className="text-muted-foreground text-lg">
                  Create and manage job-specific assessments
                </p>
                <div className="mt-2 p-3 bg-white border border-gray-300 rounded-lg">
                  <p className="text-gray-800 text-sm">
                    ⚠️ Using offline data - API connection failed
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/jobs')} 
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
                Create Assessment
              </Button>
            </div>

            {/* Filters */}
            <Card className="p-6 animate-fade-up stagger-1">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search assessments..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 input-premium"
                  />
                </div>
                <Select value={jobId} onValueChange={setJobId}>
                  <SelectTrigger className="w-full sm:w-[200px] input-premium">
                    <SelectValue placeholder="Filter by job" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Jobs</SelectItem>
                    {fallbackJobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </motion.div>

          {/* Assessments Grid */}
          <div className="space-y-6">
            {filteredFallbackAssessments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary/10 rounded-2xl flex items-center justify-center">
                  <FileText className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                  No assessments found
                </h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence>
                  {filteredFallbackAssessments.map((assessment, index) => (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover-lift"
                    >
                      <Card className="premium-card h-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-lg font-display font-semibold text-foreground mb-2 line-clamp-2">
                                {assessment.title}
                              </CardTitle>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    assessment.hasAssessment
                                      ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                      : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                  }`}
                                >
                                  {assessment.hasAssessment ? 'Created' : 'Not Created'}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    assessment.jobStatus === 'active'
                                      ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                      : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                  }`}
                                >
                                  {assessment.jobStatus}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div className="text-sm text-muted-foreground">
                            <p className="font-medium text-foreground">{assessment.jobTitle}</p>
                            <p className="text-xs">
                              {assessment.hasAssessment 
                                ? `${assessment.sections.length} sections`
                                : 'No assessment created yet'
                              }
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {assessment.hasAssessment 
                                ? `Updated ${new Date(assessment.updatedAt).toLocaleDateString()}`
                                : `Created ${new Date(assessment.createdAt).toLocaleDateString()}`
                              }
                            </span>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between items-center pt-4">
                          <div className="flex gap-2">
                            {assessment.hasAssessment ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditAssessment(assessment.jobId)}
                                  className="text-primary hover:bg-primary/10"
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewAssessment(assessment.jobId)}
                                  className="text-primary hover:bg-primary/10"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCreateAssessment(assessment.jobId)}
                                className="text-primary hover:bg-primary/10"
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Create
                              </Button>
                            )}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAssessment(assessment.jobId)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show message if no jobs found
  if (!jobsLoading && displayJobs.length === 0) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold text-foreground mb-2 gradient-text">
              Assessments
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              No jobs found. Create a job first to create assessments.
            </p>
            <Button 
              onClick={() => navigate('/jobs')} 
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
              Create Job
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
                Assessments
              </h1>
              <p className="text-muted-foreground text-lg">
                Create and manage job-specific assessments
              </p>
            </div>
            <div className="relative" ref={dropdownRef}>
              <Button 
                onClick={() => setShowCreateDropdown(!showCreateDropdown)}
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
                Create Assessment
              </Button>
              
              {showCreateDropdown && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border-2 border-gray-300 dark:border-gray-600 z-50">
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Choose Assessment Type</h3>
                    <div className="space-y-3">
                      {displayJobs.map((job) => (
                        <div key={job.id} className="space-y-2">
                          <button
                            onClick={() => {
                              setShowCreateDropdown(false);
                              handleCreateAssessment(job.id);
                            }}
                            className="w-full text-left p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                          >
                            <div className="font-bold text-gray-900 dark:text-white text-base mb-1">{job.title}</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">Create custom assessment</div>
                          </button>
                          <button
                            onClick={() => handleShowTestSection(job)}
                            className="w-full text-left p-3 ml-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors border-2 border-blue-600 font-medium"
                          >
                            <Plus className="h-4 w-4 inline mr-2" />
                            Choose from test templates
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t-2 border-gray-300 dark:border-gray-600">
                      <button
                        onClick={() => {
                          setShowCreateDropdown(false);
                          navigate('/jobs');
                        }}
                        className="w-full text-left p-3 text-sm text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors font-medium"
                      >
                        Manage Jobs →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <Card className="p-6 animate-fade-up stagger-1">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search assessments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 input-premium"
                />
              </div>
              <Select value={jobId} onValueChange={setJobId}>
                <SelectTrigger className="w-full sm:w-[200px] input-premium">
                  <SelectValue placeholder="Filter by job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {displayJobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </motion.div>

        {/* Assessments Grid */}
        <div className="space-y-6">
          {filteredAssessments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary/10 rounded-2xl flex items-center justify-center">
                <FileText className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-3">
                No assessments found
              </h3>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                {search || jobId !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create assessments for your job postings to evaluate candidates'
                }
              </p>
              {(!search && jobId === 'all') && (
                <Button 
                  onClick={() => navigate('/jobs')} 
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
                  Create Your First Assessment
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {filteredAssessments.map((assessment, index) => (
                  <motion.div
                    key={assessment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover-lift"
                  >
                    <Card className="premium-card h-full">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-display font-semibold text-foreground mb-2 line-clamp-2">
                              {assessment.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  assessment.hasAssessment
                                    ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                    : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                }`}
                              >
                                {assessment.hasAssessment ? 'Created' : 'Not Created'}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  assessment.jobStatus === 'active'
                                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                    : 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                }`}
                              >
                                {assessment.jobStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium text-foreground">{assessment.jobTitle}</p>
                          <p className="text-xs">
                            {assessment.hasAssessment 
                              ? `${assessment.sections.length} sections`
                              : 'No assessment created yet'
                            }
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {assessment.hasAssessment 
                              ? `Updated ${new Date(assessment.updatedAt).toLocaleDateString()}`
                              : `Created ${new Date(assessment.createdAt).toLocaleDateString()}`
                            }
                          </span>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between items-center pt-4">
                        <div className="flex gap-2">
                          {assessment.hasAssessment ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditAssessment(assessment.jobId)}
                                className="text-primary hover:bg-primary/10"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewAssessment(assessment.jobId)}
                                className="text-primary hover:bg-primary/10"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCreateAssessment(assessment.jobId)}
                              className="text-primary hover:bg-primary/10"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Create
                            </Button>
                          )}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewAssessment(assessment.jobId)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Test Section Modal */}
      {showTestSection && selectedJobForTest && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border-2 border-gray-300 dark:border-gray-600"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Assessment Test Templates</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowTestSection(false);
                    setSelectedJobForTest(null);
                  }}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  ✕
                </Button>
              </div>
              
              <AssessmentTestSection
                jobId={selectedJobForTest.id}
                jobTitle={selectedJobForTest.title}
                onSelectTest={handleSelectTest}
                onCreateCustom={handleCreateCustom}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
