
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import BertTokenizer, BertModel
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

app = Flask(__name__)
CORS(app, origins="http://localhost:5173", supports_credentials=True)


class SkillExtractorML:
    def __init__(self):
        print("Initializing SkillExtractorML...")
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        self.model = BertModel.from_pretrained('bert-base-uncased')

        self.skills = {
            "frontend developer": ["JavaScript", "React.js", "HTML/CSS", "Bootstrap", "Tailwind CSS"],
            "backend developer": ["Node.js", "Express.js", "SQL", "NoSQL"],
            "app developer": ["Flutter", "Dart", "Swift", "Kotlin"],
            "devops engineer": ["Docker", "Kubernetes", "AWS", "Azure"],
            "website developer": ["HTML", "CSS", "JavaScript", "React.js", "Bootstrap"],
            "software developer":["c/c++","Java","DSA","OOPS","DBMS"]
        }

        self.general_skills = [
            "Python", "JavaScript", "React.js", "HTML/CSS", "Node.js", "Express.js",
            "SQL", "NoSQL", "Git", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
            "Django", "Flask", "HTML", "CSS" , "Flutter" , "Dart"
        ]

        print("SkillExtractorML initialized.")
        self.skill_embeddings = self._get_skill_embeddings()
        self.general_skill_embeddings = self._get_general_skill_embeddings()

    def _get_skill_embeddings(self):
        skill_embeddings = {}
        for category, skills in self.skills.items():
            category_embeddings = []
            for skill in skills:
                inputs = self.tokenizer(skill, return_tensors='pt', truncation=True, padding=True)
                with torch.no_grad():
                    outputs = self.model(**inputs)
                embeddings = outputs.last_hidden_state.mean(dim=1).numpy()
                category_embeddings.append(embeddings)
            skill_embeddings[category] = np.vstack(category_embeddings)
        return skill_embeddings

    def _get_general_skill_embeddings(self):
        skill_embeddings = []
        for skill in self.general_skills:
            inputs = self.tokenizer(skill, return_tensors='pt', truncation=True, padding=True)
            with torch.no_grad():
                outputs = self.model(**inputs)
            embeddings = outputs.last_hidden_state.mean(dim=1).numpy()
            skill_embeddings.append(embeddings)
        return np.vstack(skill_embeddings)

    def _get_embedding(self, text):
        inputs = self.tokenizer(text, return_tensors='pt', truncation=True, padding=True)
        with torch.no_grad():
            outputs = self.model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).numpy()

    def extract_skills(self, job_title):
        print(f"Extracting skills for job title: '{job_title}'")

        matched_category = None
        for category in self.skills.keys():
            if category in job_title.lower():
                matched_category = category
                break

        if matched_category:
            relevant_skills = self.skills[matched_category]
            print(f"Matched category: {matched_category}, Relevant skills: {relevant_skills}")
        else:
            print("No direct match found, falling back to similarity-based extraction.")
            job_title_embedding = self._get_embedding(job_title)

            similarities = cosine_similarity(job_title_embedding, self.general_skill_embeddings).flatten()
            for skill, similarity in zip(self.general_skills, similarities):
                print(f"Skill: {skill}, Similarity: {similarity:.4f}")

            threshold = 0.7
            relevant_skills = [skill for skill, sim in zip(self.general_skills, similarities) if sim > threshold]
            print(f"Relevant skills found: {relevant_skills}")

        return relevant_skills

extractor = SkillExtractorML()

@app.route('/extract_skills', methods=['POST'])
def extract_skills():
    data = request.json
    job_title = data.get('job_title')

    if not job_title:
        return jsonify({'error': 'Job title is required'}), 400

    skills = extractor.extract_skills(job_title)
    return jsonify({'skills': skills})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
