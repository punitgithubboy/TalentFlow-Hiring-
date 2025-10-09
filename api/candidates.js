// Vercel API route for candidates - OPTIMIZED FOR SPEED
const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Michael', 'Emily', 'Daniel', 'Elizabeth', 'Matthew', 'Sofia', 'Jackson', 'Avery', 'Sebastian', 'Ella', 'Jack', 'Madison', 'Aiden', 'Scarlett', 'Owen', 'Victoria', 'Theodore', 'Aria', 'Samuel', 'Grace', 'Joseph', 'Chloe', 'John', 'Camila', 'David', 'Penelope', 'Wyatt', 'Riley', 'Luke', 'Layla'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];
const activeJobIds = ['job-1', 'job-2', 'job-3', 'job-4', 'job-5', 'job-6', 'job-7', 'job-8', 'job-9', 'job-10', 'job-11', 'job-12', 'job-13', 'job-14', 'job-15', 'job-16', 'job-17', 'job-18', 'job-19', 'job-20', 'job-21', 'job-22', 'job-23', 'job-24', 'job-25'];

// Pre-generate 1200+ candidates for maximum speed and scalability
const candidates = (() => {
  const result = [];
  const now = Date.now();
  
  // Generate 1200+ candidates for realistic testing and scalability
  for (let i = 0; i < 1200; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const jobId = activeJobIds[i % activeJobIds.length];
    const stage = stages[i % stages.length];
    
    // Add some variety to names to avoid duplicates
    const nameSuffix = i > firstNames.length * lastNames.length ? ` ${Math.floor(i / (firstNames.length * lastNames.length)) + 1}` : '';
    
    result.push({
      id: `candidate-${i + 1}`,
      name: `${firstName} ${lastName}${nameSuffix}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@example.com`,
      stage,
      jobId,
      phone: `+1${(1000000000 + i * 123456789) % 9000000000 + 1000000000}`,
      createdAt: now - (i * 24 * 60 * 60 * 1000),
      updatedAt: now,
      // Add additional fields for better testing
      experience: `${Math.floor(Math.random() * 10) + 1} years`,
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].slice(0, Math.floor(Math.random() * 3) + 2),
      source: ['LinkedIn', 'Indeed', 'Company Website', 'Referral', 'Recruiter'][Math.floor(Math.random() * 5)],
      rating: Math.floor(Math.random() * 5) + 1,
      notes: i % 10 === 0 ? `Strong candidate with ${Math.floor(Math.random() * 5) + 3} years experience` : undefined,
    });
  }
  
  console.log(`Generated ${result.length} candidates for testing`);
  return result;
})();

export default function handler(req, res) {
  console.log('Candidates API called:', req.method, req.url, req.query);
  
  // Set caching headers for maximum speed
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300'); // 5 minutes cache
  res.setHeader('Content-Type', 'application/json');
  
  const { method } = req;
  
  if (method === 'GET') {
    const { jobId, stage, page = 1, pageSize = 10 } = req.query;
    
    // Fast filtering using pre-computed data
    let filteredCandidates = candidates;
    
    if (jobId) {
      filteredCandidates = candidates.filter(candidate => candidate.jobId === jobId);
    }
    
    if (stage && stage !== 'all') {
      filteredCandidates = filteredCandidates.filter(candidate => candidate.stage === stage);
    }
    
    // Fast pagination
    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = start + parseInt(pageSize);
    const paginatedCandidates = filteredCandidates.slice(start, end);
    
    // Return immediately with optimized response
    const response = {
      data: paginatedCandidates,
      total: filteredCandidates.length,
      totalCandidates: candidates.length, // Total candidates in system
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(filteredCandidates.length / parseInt(pageSize)),
    };
    
    // Debug stage distribution
    const stageDistribution = {};
    response.data.forEach(candidate => {
      stageDistribution[candidate.stage] = (stageDistribution[candidate.stage] || 0) + 1;
    });
    
    console.log('Candidates API response:', {
      totalCandidates: response.totalCandidates,
      filteredCount: response.total,
      returnedCount: response.data.length,
      page: response.page,
      pageSize: response.pageSize,
      stageDistribution
    });
    
    res.status(200).json(response);
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
