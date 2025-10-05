// Vercel API route for candidates
const candidates = [
  {
    id: 'candidate-1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    stage: 'applied',
    jobId: 'job-1',
    phone: '+1234567890',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    id: 'candidate-2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    stage: 'screen',
    jobId: 'job-1',
    phone: '+1234567891',
    createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    id: 'candidate-3',
    name: 'Mike Wilson',
    email: 'mike.wilson@example.com',
    stage: 'tech',
    jobId: 'job-2',
    phone: '+1234567892',
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    id: 'candidate-4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    stage: 'offer',
    jobId: 'job-2',
    phone: '+1234567893',
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    id: 'candidate-5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    stage: 'hired',
    jobId: 'job-3',
    phone: '+1234567894',
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    id: 'candidate-6',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@example.com',
    stage: 'rejected',
    jobId: 'job-3',
    phone: '+1234567895',
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  }
];

export default function handler(req, res) {
  const { method } = req;
  
  if (method === 'GET') {
    const { jobId, stage, page = 1, pageSize = 10 } = req.query;
    
    let filteredCandidates = [...candidates];
    
    // Filter by jobId
    if (jobId) {
      filteredCandidates = filteredCandidates.filter(candidate => candidate.jobId === jobId);
    }
    
    // Filter by stage
    if (stage && stage !== 'all') {
      filteredCandidates = filteredCandidates.filter(candidate => candidate.stage === stage);
    }
    
    // Paginate
    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = start + parseInt(pageSize);
    const paginatedCandidates = filteredCandidates.slice(start, end);
    
    res.status(200).json({
      data: paginatedCandidates,
      total: filteredCandidates.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(filteredCandidates.length / parseInt(pageSize)),
    });
  } else if (method === 'POST') {
    const newCandidate = {
      id: `candidate-${Date.now()}`,
      ...req.body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    candidates.push(newCandidate);
    res.status(201).json(newCandidate);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
