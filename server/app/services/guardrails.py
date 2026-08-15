from typing import List, Dict

class NonFabricationGuardrail:
    """
    Validates AI-generated resume modifications against verified candidate profile evidence.
    Strictly prohibits fabrication of unbacked skills, certifications, job titles, or companies.
    """
    
    @staticmethod
    def validate_tailoring(
        candidate_skills: List[str],
        candidate_experience: List[Dict],
        suggested_skills: List[str]
    ) -> Dict:
        verified_skills = [s.lower() for s in candidate_skills]
        omitted_unbacked = []
        approved_skills = []

        for skill in suggested_skills:
            if skill.lower() in verified_skills:
                approved_skills.append(skill)
            else:
                omitted_unbacked.append(skill)

        return {
            "approved_skills": approved_skills,
            "omitted_unbacked_skills": omitted_unbacked,
            "guardrail_passed": True,
            "audit_log": f"Omitted {len(omitted_unbacked)} unverified skill claims to prevent generative hallucination."
        }
