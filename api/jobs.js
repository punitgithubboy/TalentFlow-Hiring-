// Vercel API route for jobs - OPTIMIZED FOR SPEED
const jobTitles = [
  'Senior Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Product Manager',
  'UI/UX Designer',
  'Data Scientist',
  'Mobile Developer',
  'QA Engineer',
  'Solutions Architect',
  'Technical Lead',
  'Business Analyst',
  'Scrum Master',
  'Security Engineer',
  'Cloud Architect',
  'Machine Learning Engineer',
  'Customer Success Manager',
  'Sales Engineer',
  'HR Manager',
  'Marketing Manager',
  'Financial Analyst',
  'Operations Manager',
  'Content Strategist',
  'SEO Specialist',
  'Growth Hacker'
];

const tags = ['Remote', 'Full-time', 'Contract', 'Urgent', 'Senior', 'Junior', 'Mid-level', 'Tech', 'Non-tech', 'Leadership'];

function generateSlug(title) {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Pre-generate jobs for maximum speed
const jobs = (() => {
  const now = Date.now();
  return jobTitles.map((title, index) => ({
    id: `job-${index + 1}`,
    title,
    slug: generateSlug(title),
    status: 'active',
    tags: [tags[index % 3], tags[(index + 1) % 3], tags[(index + 2) % 3]].slice(0, Math.floor(Math.random() * 3) + 1),
    order: index,
    description: `We are looking for an experienced ${title} to join our team.`,
    createdAt: now - (index * 24 * 60 * 60 * 1000),
    updatedAt: now,
  }));
})();

export default function handler(req, res) {
  // Set caching headers for maximum speed
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300'); // 5 minutes cache
  res.setHeader('Content-Type', 'application/json');
  
  const { method } = req;
  
  if (method === 'GET') {
    const { search, status, page = 1, pageSize = 10 } = req.query;
    
    // Fast filtering using pre-computed data
    let filteredJobs = jobs;
    
    if (search) {
      filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (status && status !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }
    
    // Jobs are already sorted by order in pre-generation
    // Fast pagination
    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = start + parseInt(pageSize);
    const paginatedJobs = filteredJobs.slice(start, end);
    
    // Return immediately with optimized response
    res.status(200).json({
      data: paginatedJobs,
      total: filteredJobs.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(filteredJobs.length / parseInt(pageSize)),
    });
  } else if (method === 'POST') {
    const newJob = {
      id: `job-${Date.now()}`,
      ...req.body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    jobs.push(newJob);
    res.status(201).json(newJob);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
