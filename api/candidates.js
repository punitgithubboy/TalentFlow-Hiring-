// Vercel API route for candidates
const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Michael', 'Emily', 'Daniel', 'Elizabeth', 'Matthew', 'Sofia', 'Jackson', 'Avery', 'Sebastian', 'Ella', 'Jack', 'Madison', 'Aiden', 'Scarlett', 'Owen', 'Victoria', 'Theodore', 'Aria', 'Samuel', 'Grace', 'Joseph', 'Chloe', 'John', 'Camila', 'David', 'Penelope', 'Wyatt', 'Riley', 'Luke', 'Layla'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

const stages = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate 50+ candidates
const candidates = [];
const activeJobIds = ['job-1', 'job-2', 'job-3', 'job-4', 'job-5', 'job-6', 'job-7', 'job-8', 'job-9', 'job-10', 'job-11', 'job-12', 'job-13', 'job-14', 'job-15', 'job-16', 'job-17', 'job-18', 'job-19', 'job-20', 'job-21', 'job-22', 'job-23', 'job-24', 'job-25'];

for (let i = 0; i < 50; i++) {
  const firstName = randomElement(firstNames);
  const lastName = randomElement(lastNames);
  const jobId = randomElement(activeJobIds);
  
  candidates.push({
    id: `candidate-${i + 1}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@example.com`,
    stage: randomElement(stages),
    jobId,
    phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
    createdAt: Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  });
}

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
