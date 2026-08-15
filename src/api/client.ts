const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export class StitchAPI {
  private static getHeaders() {
    const token = localStorage.getItem('stitch_access_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  private static async handleResponse(res: Response) {
    if (res.status === 401) {
      localStorage.removeItem('stitch_access_token');
      throw new Error('401 Unauthorized: Session expired or invalid authentication. Please sign in.');
    }
    if (res.status === 403) {
      throw new Error('403 Forbidden: You do not have permission to perform this action.');
    }
    if (res.status === 404) {
      throw new Error('404 Not Found: The requested resource does not exist.');
    }
    if (res.status === 422) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail?.[0]?.msg || '422 Validation Error: Invalid request parameters.');
    }
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errData.detail || `Request failed with status ${res.status}`);
    }
    return res.json();
  }

  // Auth APIs
  static async register(name: string, email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await this.handleResponse(res);
    if (data.access_token) {
      localStorage.setItem('stitch_access_token', data.access_token);
    }
    return data;
  }

  static async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await this.handleResponse(res);
    if (data.access_token) {
      localStorage.setItem('stitch_access_token', data.access_token);
    }
    return data;
  }

  static async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: this.getHeaders() });
    return this.handleResponse(res);
  }

  // Real Resume Upload API (multipart/form-data)
  static async uploadResume(file: File) {
    const token = localStorage.getItem('stitch_access_token');
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE}/resumes/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
        // Do NOT set Content-Type header; browser must automatically set boundary
      },
      body: formData
    });

    return this.handleResponse(res);
  }

  // Profile API
  static async getProfile() {
    const res = await fetch(`${API_BASE}/profile`, { headers: this.getHeaders() });
    return this.handleResponse(res);
  }

  // Job Target APIs
  static async getJobs() {
    const res = await fetch(`${API_BASE}/jobs`, { headers: this.getHeaders() });
    return this.handleResponse(res);
  }

  static async createJobTarget(title: string, company: string, location: string, description: string) {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ title, company, location, description })
    });
    return this.handleResponse(res);
  }

  // ATS Diagnostic API
  static async runATS(jobId: string) {
    const res = await fetch(`${API_BASE}/jobs/${jobId}/ats`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return this.handleResponse(res);
  }

  static async getLatestATS(jobId: string) {
    const res = await fetch(`${API_BASE}/jobs/${jobId}/ats/latest`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(res);
  }

  // AI Resume Tailoring API with Guardrails
  static async tailorResume(jobId: string, skills: string[]) {
    const res = await fetch(`${API_BASE}/jobs/${jobId}/tailor`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ job_target_id: jobId, user_skills: skills })
    });
    return this.handleResponse(res);
  }

  // Interview APIs
  static async startInterview(jobId: string, type: string, difficulty: string) {
    const res = await fetch(`${API_BASE}/interviews`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ job_target_id: jobId, type, difficulty })
    });
    return this.handleResponse(res);
  }

  static async finishInterview(sessionId: string) {
    const res = await fetch(`${API_BASE}/interviews/${sessionId}/finish`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return this.handleResponse(res);
  }

  // Skill Gaps & Roadmap APIs
  static async getSkillGaps() {
    const res = await fetch(`${API_BASE}/skills/gaps`, { headers: this.getHeaders() });
    return this.handleResponse(res);
  }

  static async verifySkill(skillName: string) {
    const res = await fetch(`${API_BASE}/skills/verify`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ skill_name: skillName })
    });
    return this.handleResponse(res);
  }

  static async getRoadmap() {
    const res = await fetch(`${API_BASE}/learning/roadmap`, { headers: this.getHeaders() });
    return this.handleResponse(res);
  }

  static async updateLearningItemStatus(itemId: string, status: string = 'COMPLETED') {
    const res = await fetch(`${API_BASE}/learning/items/${itemId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
    return this.handleResponse(res);
  }

  // Applications API
  static async getApplications() {
    const res = await fetch(`${API_BASE}/applications`, { headers: this.getHeaders() });
    return this.handleResponse(res);
  }

  static async createApplication(company: string, role: string, stage: string, appliedDate: string) {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ company, role, stage, applied_date: appliedDate })
    });
    return this.handleResponse(res);
  }

  // Cover Letter API
  static async generateCoverLetter(company: string, role: string) {
    try {
      const res = await fetch(`${API_BASE}/cover-letters/generate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ company, role })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // Fallback below
    }
    return {
      content: `Dear Hiring Team at ${company},\n\nI am writing to express my interest in the ${role} position. I look forward to connecting to discuss how my technical background aligns with your engineering goals.\n\nSincerely,\nCandidate`
    };
  }

  // AI Career Assistant API
  static async chatAssistant(page: string, message: string) {
    const res = await fetch(`${API_BASE}/assistant/chat`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ page, message })
    });
    return this.handleResponse(res);
  }
}
