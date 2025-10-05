// Vercel API route for jobs
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

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomElements(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const jobs = jobTitles.map((title, index) => ({
  id: `job-${index + 1}`,
  title,
  slug: generateSlug(title),
  status: 'active', // Make all jobs active for assessments to work
  tags: randomElements(tags, Math.floor(Math.random() * 3) + 1),
  order: index,
  description: `We are looking for an experienced ${title} to join our team.`,
  createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
  updatedAt: Date.now(),
}));

export default function handler(req, res) {
  const { method } = req;
  
  if (method === 'GET') {
    const { search, status, page = 1, pageSize = 10 } = req.query;
    
    let filteredJobs = [...jobs];
    
    // Filter by search
    if (search) {
      filteredJobs = filteredJobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by status
    if (status && status !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.status === status);
    }
    
    // Sort by order
    filteredJobs.sort((a, b) => a.order - b.order);
    
    // Paginate
    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = start + parseInt(pageSize);
    const paginatedJobs = filteredJobs.slice(start, end);
    
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
