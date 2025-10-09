// API service for TalentFlow
const BASE_URL = '/api';

// Helper to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

// Jobs API
export const jobsApi = {
  async getJobs(params: {
    search?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.set('search', params.search);
    if (params.status && params.status !== 'all') searchParams.set('status', params.status);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());
    if (params.sort) searchParams.set('sort', params.sort);

    const response = await fetch(`${BASE_URL}/jobs?${searchParams}`);
    return handleResponse(response);
  },

  async createJob(data: {
    title: string;
    slug: string;
    status: 'active' | 'archived';
    description?: string;
    tags: string[];
  }) {
    const response = await fetch(`${BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateJob(id: string, data: Partial<{
    title: string;
    slug: string;
    status: 'active' | 'archived';
    description: string;
    tags: string[];
  }>) {
    const response = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async reorderJobs(id: string, fromOrder: number, toOrder: number) {
    const response = await fetch(`${BASE_URL}/jobs/${id}/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromOrder, toOrder }),
    });
    return handleResponse(response);
  },

  async deleteJob(id: string) {
    const response = await fetch(`${BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Candidates API
export const candidatesApi = {
  async getCandidates(params: {
    search?: string;
    stage?: string;
    page?: number;
    pageSize?: number;
  } = {}) {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.set('search', params.search);
    if (params.stage && params.stage !== 'all') searchParams.set('stage', params.stage);
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());

    const response = await fetch(`${BASE_URL}/candidates?${searchParams}`);
    return handleResponse(response);
  },

  async createCandidate(data: {
    name: string;
    email: string;
    stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
    jobId: string;
    phone?: string;
    resume?: string;
  }) {
    const response = await fetch(`${BASE_URL}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async updateCandidate(id: string, data: Partial<{
    name: string;
    email: string;
    stage: 'applied' | 'screen' | 'tech' | 'offer' | 'hired' | 'rejected';
    jobId: string;
    phone: string;
    resume: string;
  }>) {
    const response = await fetch(`${BASE_URL}/candidates/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async getCandidateTimeline(id: string) {
    const response = await fetch(`${BASE_URL}/candidates/${id}/timeline`);
    return handleResponse(response);
  },
};

// Assessments API
export const assessmentsApi = {
  async getAssessment(jobId: string) {
    const response = await fetch(`${BASE_URL}/assessments/${jobId}`);
    if (response.status === 404) {
      return null;
    }
    return handleResponse(response);
  },

  async saveAssessment(jobId: string, data: {
    title: string;
    sections: any[];
  }) {
    const response = await fetch(`${BASE_URL}/assessments/${jobId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async submitAssessment(jobId: string, data: {
    candidateId: string;
    responses: any[];
  }) {
    const response = await fetch(`${BASE_URL}/assessments/${jobId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};
