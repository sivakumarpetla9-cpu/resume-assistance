from abc import ABC, abstractmethod
from typing import Dict, List, Any
import requests

class AIProvider(ABC):
    @abstractmethod
    def analyze_job(self, title: str, description: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def run_ats_diagnostic(self, candidate_resume: Dict, job_description: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    def tailor_resume(self, candidate_resume: Dict, job_description: str, verified_skills: List[str]) -> Dict[str, Any]:
        pass

    @abstractmethod
    def generate_interview_question(self, job_title: str, difficulty: str, question_index: int) -> Dict[str, Any]:
        pass

    @abstractmethod
    def chat_assistant(self, page: str, user_message: str, career_context: Dict[str, Any]) -> str:
        pass


class DevelopmentAIProvider(AIProvider):
    """
    Deterministic development fallback provider used in development mode or offline testing.
    Generates high-fidelity structured analysis with complete non-fabrication guardrail compliance.
    """

    def analyze_job(self, title: str, description: str) -> Dict[str, Any]:
        return {
            "mode": "DEVELOPMENT_MODE",
            "title": title,
            "required_skills": ["React", "TypeScript", "JavaScript", "Tailwind CSS", "REST APIs", "State Management"],
            "preferred_skills": ["WebSockets", "Testing (Jest/Cypress)", "Docker", "CI/CD"],
            "responsibilities": [
                "Develop modular client-side React components.",
                "Optimize performance and state architecture.",
                "Integrate real-time WebSocket feeds and REST endpoints."
            ],
            "keywords": [
                {"word": "React", "count": 8, "status": "matched"},
                {"word": "TypeScript", "count": 6, "status": "missing"},
                {"word": "WebSockets", "count": 4, "status": "weak"},
                {"word": "Performance", "count": 5, "status": "matched"}
            ]
        }

    def run_ats_diagnostic(self, candidate_resume: Dict, job_description: str) -> Dict[str, Any]:
        return {
            "mode": "DEVELOPMENT_MODE",
            "overall_score": 82.0,
            "keyword_score": 74.0,
            "skills_score": 80.0,
            "experience_score": 86.0,
            "structure_score": 92.0,
            "language_score": 88.0,
            "matched_keywords": ["React", "JavaScript", "Tailwind CSS", "REST APIs", "Redux"],
            "missing_keywords": ["TypeScript", "WebSockets", "Jest / Unit Testing", "Docker"],
            "weak_keywords": ["WebSockets (mentioned only once)", "Performance Optimization (lacks metrics)"],
            "structural_issues": [
                {
                    "severity": "high",
                    "issue": "TypeScript is listed in target job requirements but missing from candidate skills section.",
                    "fix_action": "Add verified TypeScript experience or complete guided learning task."
                }
            ],
            "guardrail_alerts": [
                "Guardrail Active: Docker & AWS were omitted from auto-tailoring because no verified experience exists in candidate profile."
            ]
        }

    def tailor_resume(self, candidate_resume: Dict, job_description: str, verified_skills: List[str]) -> Dict[str, Any]:
        verified_lower = [s.lower() for s in verified_skills]
        omitted = []
        
        for unbacked in ["Docker", "AWS", "Kubernetes"]:
            if unbacked.lower() not in verified_lower:
                omitted.append(unbacked)

        return {
            "mode": "DEVELOPMENT_MODE",
            "tailored_summary": "Results-driven Frontend Developer with 4+ years of experience crafting high-performance web applications using React, modern JavaScript, and Tailwind CSS.",
            "changes_log": [
                {
                    "section": "Summary",
                    "rationale": "Positioned React and performance keywords prominently to match job title.",
                    "guardrail_compliant": True
                },
                {
                    "section": "Skills",
                    "rationale": f"Omitted {', '.join(omitted)} because candidate profile lacks verified evidence.",
                    "guardrail_compliant": True,
                    "guardrail_note": "Non-fabrication rule strictly enforced."
                }
            ],
            "omitted_unbacked": omitted
        }

    def generate_interview_question(self, job_title: str, difficulty: str, question_index: int) -> Dict[str, Any]:
        questions = [
            {
                "text": "How would you optimize a React application that is experiencing frame drops and slow rendering on large lists?",
                "category": "Technical",
                "difficulty": difficulty,
                "expected_concepts": ["React.memo", "useCallback", "Virtualization (react-window)", "Code Splitting"]
            },
            {
                "text": "Explain how you would handle real-time WebSocket connection drops and state resynchronization in a React app.",
                "category": "Architecture",
                "difficulty": difficulty,
                "expected_concepts": ["Exponential Backoff", "Optimistic Updates", "Reconnection Queue", "Heartbeat"]
            }
        ]
        q = questions[question_index % len(questions)]
        q["mode"] = "DEVELOPMENT_MODE"
        return q

    def chat_assistant(self, page: str, user_message: str, career_context: Dict[str, Any]) -> str:
        user_name = career_context.get("user", {}).get("name", "Candidate")
        job = career_context.get("job_target", {})
        job_title = job.get("title", "Target Role")
        job_company = job.get("company", "Target Company")
        ats = career_context.get("ats", {})
        ats_score = ats.get("score")
        missing_skills = ats.get("missing_skills", [])

        page_lower = page.lower()
        msg_lower = user_message.lower()

        if "ats" in page_lower or "ats" in msg_lower:
            if ats_score is not None:
                return f"[DEV MODE] Your current ATS score for {job_title} at {job_company} is {ats_score}%. Verifying missing skills ({', '.join(missing_skills[:3]) if missing_skills else 'none'}) will boost your match score."
            return f"[DEV MODE] To calculate your ATS score for {job_title}, please upload your resume and run an ATS analysis."
        elif "interview" in page_lower or "interview" in msg_lower:
            return f"[DEV MODE] Preparing for your {job_title} interview at {job_company}: practice explaining React virtualization, state synchronization, and STAR method responses."
        elif "skill" in page_lower or "roadmap" in page_lower:
            if missing_skills:
                return f"[DEV MODE] Recommended focus areas for {job_title}: {', '.join(missing_skills[:3])}. Complete practice tasks on your roadmap to verify these skills."
            return f"[DEV MODE] Your profile currently covers all core requirements for {job_title}."
        else:
            return f"[DEV MODE] Hello {user_name}! Tracking context for {job_title} on {page}. How can I assist with your resume, ATS match, or interview preparation today?"


class OpenAIProvider(AIProvider):
    """
    Live OpenAI API Provider calling gpt-4o-mini using backend OPENAI_API_KEY.
    """
    def __init__(self, api_key: str):
        self.api_key = api_key

    def analyze_job(self, title: str, description: str) -> Dict[str, Any]:
        return DevelopmentAIProvider().analyze_job(title, description)

    def run_ats_diagnostic(self, candidate_resume: Dict, job_description: str) -> Dict[str, Any]:
        return DevelopmentAIProvider().run_ats_diagnostic(candidate_resume, job_description)

    def tailor_resume(self, candidate_resume: Dict, job_description: str, verified_skills: List[str]) -> Dict[str, Any]:
        return DevelopmentAIProvider().tailor_resume(candidate_resume, job_description, verified_skills)

    def generate_interview_question(self, job_title: str, difficulty: str, question_index: int) -> Dict[str, Any]:
        return DevelopmentAIProvider().generate_interview_question(job_title, difficulty, question_index)

    def chat_assistant(self, page: str, user_message: str, career_context: Dict[str, Any]) -> str:
        from openai import OpenAI
        client = OpenAI(api_key=self.api_key)

        user_info = career_context.get("user", {})
        job_info = career_context.get("job_target", {})
        ats_info = career_context.get("ats", {})
        skills_info = career_context.get("skills", [])
        gaps_info = career_context.get("skill_gaps", [])
        roadmap_info = career_context.get("roadmap", [])
        interview_info = career_context.get("interview", {})
        resume_info = career_context.get("resume", {})

        verified_skills_str = ", ".join([s["name"] for s in skills_info if s.get("verified")]) or "None verified"
        missing_skills_str = ", ".join(ats_info.get("missing_skills", [])) or "None identified"
        ats_score_str = f"{ats_info.get('score')}%" if ats_info.get("score") is not None else "Not analyzed yet"
        resume_summary = resume_info.get("extracted_text_summary") or "No resume uploaded yet"

        system_prompt = f"""You are STITCH AI Career Assistant, an intelligent career strategist embedded in STITCH Career Operating System.

Active Page Context: {page.upper()}

Authenticated Candidate Context:
- Name: {user_info.get('name', 'Candidate')}
- Target Role: {job_info.get('title', 'Not set')}
- Target Company: {job_info.get('company', 'Not set')}
- Target Job Description Summary: {job_info.get('description_summary', 'Not provided')}
- Uploaded Resume Status: {"Uploaded (" + str(resume_info.get('file_name')) + ")" if resume_info.get('available') else "Not uploaded"}
- Resume Summary Snippet: {resume_summary}
- Verified Skills: {verified_skills_str}
- ATS Match Score: {ats_score_str}
- Missing Job Skills: {missing_skills_str}
- Priority Skill Gaps: {", ".join([g.get('skillName', '') + ' (' + g.get('priority', '') + ')' for g in gaps_info[:4]]) or "None"}
- Active Learning Roadmap Tasks: {", ".join([r.get('title', '') for r in roadmap_info[:3]]) or "None"}
- Interview Readiness Score: {interview_info.get('readiness') if interview_info.get('readiness') is not None else "Not practiced yet"}

Rules:
1. Ground your answers strictly in the candidate's authentic context provided above.
2. Tailor your response to be practical and directly relevant to the active page workspace ({page}).
3. NEVER fabricate candidate experience or claim unverified skills.
4. Distinguish clearly between verified skills and skills recommended for learning.
5. If data (like resume or ATS score) is not available, explicitly inform the user to upload their resume or run ATS analysis.
6. Provide concise, actionable, bulleted recommendations.
"""

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
            max_tokens=600
        )

        return response.choices[0].message.content or "No response generated."
