from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import BertTokenizer, BertModel
import numpy as np
from pyresparser import ResumeParser
import io
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter

app = Flask(__name__)
CORS(app, origins="http://localhost:5173")

class SkillExtractorML:
    def __init__(self):
        try:
            self.tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
            self.model = BertModel.from_pretrained('bert-base-uncased')
        except Exception as e:
            print(f"Error loading model or tokenizer: {e}")
            raise

        self.skills = {
            "frontend developer": ["JavaScript", "React.js", "HTML/CSS", "Bootstrap", "Tailwind CSS"],
            "backend developer": ["Node.js", "Express.js", "SQL", "NoSQL"],
            "app developer": ["Flutter", "Dart", "Swift", "Kotlin"],
            "devops engineer": ["Docker", "Kubernetes", "AWS", "Azure"],
            "website developer": ["HTML", "CSS", "JavaScript", "React.js", "Bootstrap"],
            "software developer": ["C/C++", "Java", "DSA", "OOPS", "DBMS"]
        }

        self.general_skills = ["Python", "JavaScript", "React.js", "HTML/CSS", "Node.js", "Express.js",
                               "SQL", "NoSQL", "Git", "Docker", "Kubernetes", "AWS", "Azure", "GCP",
                               "Django", "Flask", "HTML", "CSS", "Flutter", "Dart"]

        self.skill_embeddings = self._get_skill_embeddings()
        self.general_skill_embeddings = self._get_general_skill_embeddings()

    def _embed_text(self, text):
        inputs = self.tokenizer(text, return_tensors='pt', truncation=True, padding=True)
        with torch.inference_mode():
            outputs = self.model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).numpy()

    def _get_skill_embeddings(self):
        skill_embeddings = {}
        for category, skills in self.skills.items():
            skill_embeddings[category] = np.vstack([self._embed_text(skill) for skill in skills])
        return skill_embeddings

    def _get_general_skill_embeddings(self):
        return np.vstack([self._embed_text(skill) for skill in self.general_skills])

    def extract_skills(self, job_title, resume_skills):
        matched_category = next((category for category in self.skills if category in job_title.lower()), None)
        relevant_skills = self.skills[matched_category] if matched_category else self._find_similar_skills(job_title)
        return [skill for skill in relevant_skills if skill not in resume_skills]

    def _find_similar_skills(self, job_title):
        job_title_embedding = self._embed_text(job_title)
        similarities = np.dot(job_title_embedding, self.general_skill_embeddings.T).flatten()
        threshold = 0.7
        return [skill for skill, sim in zip(self.general_skills, similarities) if sim > threshold]

extractor = SkillExtractorML()

def pdf_reader(file):
    resource_manager = PDFResourceManager()
    fake_file_handle = io.StringIO()
    converter = TextConverter(resource_manager, fake_file_handle, laparams=LAParams())
    page_interpreter = PDFPageInterpreter(resource_manager, converter)

    with file.stream as fh:
        for page in PDFPage.get_pages(fh, caching=True, check_extractable=True):
            page_interpreter.process_page(page)
        text = fake_file_handle.getvalue()

    converter.close()
    fake_file_handle.close()
    
    return text

@app.route('/upload_resume', methods=['POST'])
def upload_resume():
    if 'pdf_file' not in request.files:
        return jsonify({'error': 'No PDF file uploaded'}), 400

    pdf_file = request.files['pdf_file']
    resume_text = pdf_reader(pdf_file)

    with open("uploaded_resume.pdf", "wb") as f:
        pdf_file.seek(0)  # reset file pointer
        f.write(pdf_file.read())

    resume_data = ResumeParser("uploaded_resume.pdf").get_extracted_data()
    extracted_skills = resume_data.get("skills", []) if resume_data else []

    job_title = request.form.get('job_title', '')
    if not job_title:
        return jsonify({'error': 'Job title is required'}), 400

    recommended_skills = extractor.extract_skills(job_title, extracted_skills)
    return jsonify({
        'extracted_skills': extracted_skills,
        'recommended_skills': recommended_skills
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
