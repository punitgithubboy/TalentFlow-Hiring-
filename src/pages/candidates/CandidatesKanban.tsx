import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Search, Grid, List, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CandidateFormModal } from '@/components/candidates/CandidateFormModal';
import { CandidateCard } from '@/components/candidates/CandidateCard';
import { Candidate } from '@/lib/db';

// Generate 1000+ candidates locally for immediate display
const generateCandidates = () => {
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
  
  console.log(`Generated ${candidates.length} candidates locally`);
  return candidates;
};

const stages = [
  { 
    value: 'all', 
    label: 'All Candidates', 
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    value: 'applied', 
    label: 'Applied', 
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    value: 'screen', 
    label: 'Screening', 
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    value: 'tech', 
    label: 'Technical', 
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    value: 'offer', 
    label: 'Offer', 
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    value: 'hired', 
    label: 'Hired', 
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
  { 
    value: 'rejected', 
    label: 'Rejected', 
    color: 'bg-gray-100 text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    textColor: 'text-gray-700 dark:text-gray-300'
  },
];

export default function CandidatesKanban() {
  const [search, setSearch] = useState('');
  const [stage, setStage] = useState('all');
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Generate candidates locally for immediate display
  const allCandidates = useMemo(() => generateCandidates(), []);
  
  // Filter candidates based on search and stage
  const filteredCandidates = useMemo(() => {
    let filtered = allCandidates;
    
    // Filter by search
    if (search) {
      filtered = filtered.filter(candidate => 
        candidate.name.toLowerCase().includes(search.toLowerCase()) ||
        candidate.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by stage
    if (stage !== 'all') {
      filtered = filtered.filter(candidate => candidate.stage === stage);
    }
    
    return filtered;
  }, [allCandidates, search, stage]);

  // Calculate stage counts
  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    stages.forEach(s => counts[s.value] = 0);
    
    allCandidates.forEach(candidate => {
      counts[candidate.stage] = (counts[candidate.stage] || 0) + 1;
    });
    counts.all = allCandidates.length;
    
    return counts;
  }, [allCandidates]);

  // Group candidates by stage for kanban view - filter by selected stage
  const candidatesByStage = useMemo(() => {
    const grouped: Record<string, Candidate[]> = {};
    stages.forEach(s => grouped[s.value] = []);
    
    // If a specific stage is selected, only show candidates from that stage
    if (stage !== 'all') {
      allCandidates.forEach(candidate => {
        if (candidate.stage === stage) {
          grouped[candidate.stage].push(candidate);
        }
      });
    } else {
      // If "All Candidates" is selected, show all candidates in their respective stages
      allCandidates.forEach(candidate => {
        if (grouped[candidate.stage]) {
          grouped[candidate.stage].push(candidate);
        }
      });
    }
    
    return grouped;
  }, [allCandidates, stage]);

  const handleCreateCandidate = useCallback(() => {
    setEditingCandidate(null);
    setShowCandidateModal(true);
  }, []);

  const handleEditCandidate = useCallback((candidate: Candidate) => {
    setEditingCandidate(candidate);
    setShowCandidateModal(true);
  }, []);

  const handleCandidateSaved = useCallback((candidate: Candidate) => {
    // In a real app, this would update the local state or refetch data
    console.log('Candidate saved:', candidate);
    setShowCandidateModal(false);
    setEditingCandidate(null);
  }, []);

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;
    
    // Find the candidate and update their stage
    const candidate = allCandidates.find(c => c.id === draggableId);
    if (candidate) {
      candidate.stage = destination.droppableId as any;
      console.log(`Moved candidate ${candidate.name} from ${source.droppableId} to ${destination.droppableId}`);
    }
  }, [allCandidates]);

  // Debug logging
  console.log('CandidatesKanban Debug:', {
    totalCandidates: allCandidates.length,
    filteredCandidates: filteredCandidates.length,
    stageCounts,
    currentStage: stage,
    searchTerm: search
  });

  return (
    <div className="min-h-screen w-full">
      <div className="w-full px-2 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-2 gradient-text">
                Candidate Pipeline
              </h1>
              <p className="text-muted-foreground text-lg">
                Drag and drop candidates between stages
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Showing {stage === 'all' ? allCandidates.length : candidatesByStage[stage]?.length || 0} of {allCandidates.length} total candidates
                <span className="text-green-500 ml-2">(Local data - 1000+ candidates)</span>
                {stage !== 'all' && <span className="text-orange-500 ml-2">- Filtered by {stages.find(s => s.value === stage)?.label}</span>}
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

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search candidates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 input-premium"
              />
            </div>
          </div>

          {/* Stage Tabs */}
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

        {/* Kanban Board - Show filtered stages based on selection */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className={`grid gap-2 w-full ${stage === 'all' ? 'grid-cols-6' : 'grid-cols-1'}`}>
            {stage === 'all' 
              ? stages.filter(s => s.value !== 'all').map((stageOption) => (
              <motion.div
                key={stageOption.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col h-full min-w-0"
              >
                {/* Stage Header */}
                <div className="mb-4">
                  <h3 className="font-semibold text-sm text-foreground truncate">
                    {stageOption.label}
                  </h3>
                  <Badge className="bg-primary/10 text-primary font-semibold px-2 py-1 text-xs">
                    {candidatesByStage[stageOption.value]?.length || 0}
                  </Badge>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={stageOption.value}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[400px] p-2 rounded-lg border-2 border-dashed transition-all duration-200 ${
                        snapshot.isDraggingOver 
                          ? 'border-primary/50 bg-primary/5' 
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30'
                      }`}
                    >
                      <div className="space-y-3">
                        <AnimatePresence>
                          {candidatesByStage[stageOption.value]?.map((candidate, index) => (
                            <Draggable
                              key={candidate.id}
                              draggableId={candidate.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-2"
                                >
                                  <CandidateCard
                                    candidate={candidate}
                                    onEdit={handleEditCandidate}
                                    onMove={() => {}}
                                    viewMode="grid"
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </AnimatePresence>
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </motion.div>
            ))
              : (() => {
                  const selectedStage = stages.find(s => s.value === stage);
                  if (!selectedStage) return null;
                  
                  return (
                    <motion.div
                      key={selectedStage.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col h-full min-w-0"
                    >
                      {/* Stage Header */}
                      <div className="mb-4">
                        <h3 className="font-semibold text-lg text-foreground">
                          {selectedStage.label} Candidates
                        </h3>
                        <Badge className="bg-primary/10 text-primary font-semibold px-3 py-1">
                          {candidatesByStage[selectedStage.value]?.length || 0} candidates
                        </Badge>
                      </div>

                      {/* Droppable Area */}
                      <Droppable droppableId={selectedStage.value}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 min-h-[600px] p-4 rounded-lg border-2 border-dashed transition-all duration-200 ${
                              snapshot.isDraggingOver 
                                ? 'border-primary/50 bg-primary/5' 
                                : 'border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30'
                            }`}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                              <AnimatePresence>
                                {candidatesByStage[selectedStage.value]?.map((candidate, index) => (
                                  <Draggable
                                    key={candidate.id}
                                    draggableId={candidate.id}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="mb-2"
                                      >
                                        <CandidateCard
                                          candidate={candidate}
                                          onEdit={handleEditCandidate}
                                          onMove={() => {}}
                                          viewMode="grid"
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              </AnimatePresence>
                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    </motion.div>
                  );
                })()
            }
          </div>
        </DragDropContext>

        {/* Candidate Form Modal */}
        <CandidateFormModal
          isOpen={showCandidateModal}
          onClose={() => {
            setShowCandidateModal(false);
            setEditingCandidate(null);
          }}
          onSave={handleCandidateSaved}
          candidate={editingCandidate}
        />
      </div>
    </div>
  );
}