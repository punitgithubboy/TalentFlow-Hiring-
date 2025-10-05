// Vercel API route for jobs
const jobs = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    slug: 'senior-frontend-developer',
    status: 'active',
    tags: ['Remote', 'Full-time', 'Senior'],
    order: 0,
    description: 'We are looking for an experienced Senior Frontend Developer to join our team.',
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    id: 'job-2',
    title: 'Backend Engineer',
    slug: 'backend-engineer',
    status: 'active',
    tags: ['Remote', 'Full-time', 'Tech'],
    order: 1,
    description: 'We are looking for an experienced Backend Engineer to join our team.',
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    id: 'job-3',
    title: 'Full Stack Developer',
    slug: 'full-stack-developer',
    status: 'active',
    tags: ['Remote', 'Full-time', 'Mid-level'],
    order: 2,
    description: 'We are looking for an experienced Full Stack Developer to join our team.',
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    id: 'job-4',
    title: 'DevOps Engineer',
    slug: 'devops-engineer',
    status: 'active',
    tags: ['Remote', 'Full-time', 'Senior'],
    order: 3,
    description: 'We are looking for an experienced DevOps Engineer to join our team.',
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    id: 'job-5',
    title: 'Product Manager',
    slug: 'product-manager',
    status: 'active',
    tags: ['Remote', 'Full-time', 'Leadership'],
    order: 4,
    description: 'We are looking for an experienced Product Manager to join our team.',
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    id: 'job-6',
    title: 'UI/UX Designer',
    slug: 'ui-ux-designer',
    status: 'active',
    tags: ['Remote', 'Full-time', 'Design'],
    order: 5,
    description: 'We are looking for an experienced UI/UX Designer to join our team.',
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  }
];

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
