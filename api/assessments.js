// Vercel API route for assessments
const assessments = [
  {
    id: 'assessment-job-1',
    jobId: 'job-1',
    title: 'Senior Frontend Developer Assessment',
    sections: [
      {
        id: 'section-1-1',
        title: 'Technical Skills',
        questions: [
          {
            id: 'q-1-1',
            type: 'single-choice',
            text: 'How many years of experience do you have?',
            required: true,
            options: ['0-2 years', '2-5 years', '5-10 years', '10+ years'],
          },
          {
            id: 'q-1-2',
            type: 'multi-choice',
            text: 'Which technologies are you proficient in?',
            required: true,
            options: ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'Go', 'Rust'],
          },
          {
            id: 'q-1-3',
            type: 'short-text',
            text: 'What is your primary programming language?',
            required: true,
            validation: { maxLength: 50 },
          },
        ],
      },
      {
        id: 'section-1-2',
        title: 'Behavioral Questions',
        questions: [
          {
            id: 'q-1-4',
            type: 'single-choice',
            text: 'Are you available for remote work?',
            required: true,
            options: ['Yes', 'No', 'Partially'],
          },
          {
            id: 'q-1-5',
            type: 'long-text',
            text: 'Why do you want to work with us?',
            required: false,
            validation: { maxLength: 500 },
          },
        ],
      },
    ],
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    id: 'assessment-job-2',
    jobId: 'job-2',
    title: 'Backend Engineer Assessment',
    sections: [
      {
        id: 'section-2-1',
        title: 'Technical Skills',
        questions: [
          {
            id: 'q-2-1',
            type: 'single-choice',
            text: 'How many years of backend experience do you have?',
            required: true,
            options: ['0-2 years', '2-5 years', '5-10 years', '10+ years'],
          },
          {
            id: 'q-2-2',
            type: 'multi-choice',
            text: 'Which backend technologies do you know?',
            required: true,
            options: ['Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#', 'PHP', 'Ruby'],
          },
        ],
      },
    ],
    createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
  {
    id: 'assessment-job-3',
    jobId: 'job-3',
    title: 'Full Stack Developer Assessment',
    sections: [
      {
        id: 'section-3-1',
        title: 'Full Stack Skills',
        questions: [
          {
            id: 'q-3-1',
            type: 'single-choice',
            text: 'What is your preferred full-stack framework?',
            required: true,
            options: ['React + Node.js', 'Vue + Express', 'Angular + Spring', 'Next.js', 'Other'],
          },
          {
            id: 'q-3-2',
            type: 'long-text',
            text: 'Describe a full-stack project you built.',
            required: true,
            validation: { minLength: 100, maxLength: 1000 },
          },
        ],
      },
    ],
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  },
];

export default function handler(req, res) {
  const { method } = req;
  
  if (method === 'GET') {
    const { jobId } = req.query;
    
    let filteredAssessments = [...assessments];
    
    // Filter by jobId
    if (jobId) {
      filteredAssessments = filteredAssessments.filter(assessment => assessment.jobId === jobId);
    }
    
    res.status(200).json({
      data: filteredAssessments,
      total: filteredAssessments.length,
    });
  } else if (method === 'POST') {
    const newAssessment = {
      id: `assessment-${Date.now()}`,
      ...req.body,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    assessments.push(newAssessment);
    res.status(201).json(newAssessment);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
