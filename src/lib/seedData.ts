import { db, Job, Candidate, Assessment, TimelineEvent } from './db';

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
  'Growth Hacker',
];

const tags = ['Remote', 'Full-time', 'Contract', 'Urgent', 'Senior', 'Junior', 'Mid-level', 'Tech', 'Non-tech', 'Leadership'];

const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const stages: Candidate['stage'][] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomElements<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export async function seedDatabase() {
  try {
    // Check if already seeded
    const existingJobs = await db.jobs.count();
    if (existingJobs > 0) {
      console.log('Database already seeded with', existingJobs, 'jobs');
      return;
    }

    console.log('Seeding database...');

  // Seed Jobs
  const jobs: Job[] = jobTitles.slice(0, 25).map((title, index) => ({
    id: `job-${index + 1}`,
    title,
    slug: generateSlug(title),
    status: Math.random() > 0.3 ? 'active' : 'archived',
    tags: randomElements(tags, Math.floor(Math.random() * 3) + 1),
    order: index,
    description: `We are looking for an experienced ${title} to join our team.`,
    createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  }));

  await db.jobs.bulkAdd(jobs);

  // Seed Candidates
  const candidates: Candidate[] = [];
  const activeJobs = jobs.filter(j => j.status === 'active');

  for (let i = 0; i < 1000; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const jobId = randomElement(activeJobs).id;

    candidates.push({
      id: `candidate-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      stage: randomElement(stages),
      jobId,
      phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      createdAt: Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now(),
    });
  }

  await db.candidates.bulkAdd(candidates);

  // Seed Timeline Events
  const timelineEvents: TimelineEvent[] = [];
  for (const candidate of candidates.slice(0, 100)) {
    const eventCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < eventCount; i++) {
      timelineEvents.push({
        id: `timeline-${candidate.id}-${i}`,
        candidateId: candidate.id,
        type: 'stage_change',
        fromStage: i === 0 ? undefined : stages[i - 1],
        toStage: stages[i],
        createdAt: candidate.createdAt + i * 24 * 60 * 60 * 1000,
        createdBy: 'HR Team',
      });
    }
  }

  await db.timeline.bulkAdd(timelineEvents);

  // Seed Assessments
  const assessments: Assessment[] = activeJobs.slice(0, 5).map((job, index) => ({
    id: `assessment-${job.id}`,
    jobId: job.id,
    title: `${job.title} Assessment`,
    sections: [
      {
        id: `section-${index}-1`,
        title: 'Technical Skills',
        questions: [
          {
            id: `q-${index}-1`,
            type: 'single-choice' as const,
            text: 'How many years of experience do you have?',
            required: true,
            options: ['0-2 years', '2-5 years', '5-10 years', '10+ years'],
          },
          {
            id: `q-${index}-2`,
            type: 'multi-choice' as const,
            text: 'Which technologies are you proficient in?',
            required: true,
            options: ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'Go', 'Rust'],
          },
          {
            id: `q-${index}-3`,
            type: 'short-text' as const,
            text: 'What is your primary programming language?',
            required: true,
            validation: { maxLength: 50 },
          },
          {
            id: `q-${index}-4`,
            type: 'long-text' as const,
            text: 'Describe your most challenging project.',
            required: true,
            validation: { minLength: 100, maxLength: 1000 },
          },
          {
            id: `q-${index}-5`,
            type: 'numeric' as const,
            text: 'What is your expected salary (in thousands)?',
            required: true,
            validation: { min: 50, max: 300 },
          },
        ],
      },
      {
        id: `section-${index}-2`,
        title: 'Behavioral Questions',
        questions: [
          {
            id: `q-${index}-6`,
            type: 'single-choice' as const,
            text: 'Are you available for remote work?',
            required: true,
            options: ['Yes', 'No', 'Partially'],
          },
          {
            id: `q-${index}-7`,
            type: 'long-text' as const,
            text: 'Why do you want to work with us?',
            required: false,
            validation: { maxLength: 500 },
            conditionalOn: {
              questionId: `q-${index}-6`,
              answer: 'Yes',
            },
          },
          {
            id: `q-${index}-8`,
            type: 'file-upload' as const,
            text: 'Upload your resume (PDF)',
            required: true,
          },
          {
            id: `q-${index}-9`,
            type: 'single-choice' as const,
            text: 'How did you hear about this position?',
            required: false,
            options: ['LinkedIn', 'Company Website', 'Referral', 'Job Board', 'Other'],
          },
          {
            id: `q-${index}-10`,
            type: 'short-text' as const,
            text: 'Please provide the referral name',
            required: true,
            validation: { maxLength: 100 },
            conditionalOn: {
              questionId: `q-${index}-9`,
              answer: 'Referral',
            },
          },
        ],
      },
    ],
    createdAt: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now(),
  }));

  await db.assessments.bulkAdd(assessments);

  console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
