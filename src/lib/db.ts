import Dexie, { Table } from 'dexie';

export interface Job {
  id: string;
  title: string;
  slug: string;
  status: 'active' | 'archived';
  tags: string[];
  order: number;
  description?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
  jobId: string;
  createdAt: number;
  updatedAt: number;
  phone?: string;
  resume?: string;
}

export interface TimelineEvent {
  id: string;
  candidateId: string;
  type: 'stage_change' | 'note_added' | 'assessment_completed';
  fromStage?: string;
  toStage?: string;
  note?: string;
  createdAt: number;
  createdBy: string;
}

export interface Assessment {
  id: string;
  jobId: string;
  title: string;
  sections: AssessmentSection[];
  createdAt: number;
  updatedAt: number;
}

export interface AssessmentSection {
  id: string;
  title: string;
  questions: Question[];
}

export interface Question {
  id: string;
  type: 'single-choice' | 'multi-choice' | 'short-text' | 'long-text' | 'numeric' | 'file-upload';
  text: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  conditionalOn?: {
    questionId: string;
    answer: string | string[];
  };
}

export interface AssessmentResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  responses: Record<string, any>;
  completedAt: number;
}

export class TalentFlowDB extends Dexie {
  jobs!: Table<Job>;
  candidates!: Table<Candidate>;
  timeline!: Table<TimelineEvent>;
  assessments!: Table<Assessment>;
  assessmentResponses!: Table<AssessmentResponse>;

  constructor() {
    super('talentflow');
    this.version(1).stores({
      jobs: 'id, title, status, order',
      candidates: 'id, name, email, stage, jobId',
      timeline: 'id, candidateId, createdAt',
      assessments: 'id, jobId',
      assessmentResponses: 'id, assessmentId, candidateId',
    });
  }
}

export const db = new TalentFlowDB();
