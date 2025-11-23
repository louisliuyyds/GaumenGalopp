## Setup Instructions for Python Environment

1. Clone the repository/Update project
2. Create virtual environment: \`python -m venv venv\`
3. Activate virtual environment:
   - Mac/Linux: \`source venv/bin/activate\`
   - Windows: \`venv\\Scripts\\activate\`
4. Install dependencies: \`pip install -r requirements.txt\`
5. Copy \`.env.example\` to \`.env\` and fill in database credentials
6. Test connection: run database.py or test_db.py
7. \`uvicorn main:app --reload\`

### Best practice when installing a new package (für high performer):
pip install new-package\
pip freeze > requirements.txt\
git add requirements.txt\
git commit -m "Add new-package"
