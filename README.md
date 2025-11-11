## Setup Instructions for Python Environment

1. Clone the repository
2. Create virtual environment: \`python -m venv venv\`
3. Activate virtual environment:
   - Mac/Linux: \`source venv/bin/activate\`
   - Windows: \`venv\\Scripts\\activate\`
4. Install dependencies: \`pip install -r requirements.txt\`
5. Copy \`.env.example\` to \`.env\` and fill in your database credentials
6. Run: \`uvicorn main:app --reload\`

### Best practice when installing a new package:
pip install new-package\
pip freeze > requirements.txt\
git add requirements.txt\
git commit -m "Add new-package"
