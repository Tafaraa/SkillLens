
# 🤝 Contributing to SkillLens

Welcome, and thank you for considering contributing to **SkillLens** — an AI-powered skill analyzer that evaluates your code to identify strengths, weaknesses, and recommends learning paths.

I appreciate your interest and effort to make this project better. This guide will help ensure a smooth collaboration.

---

## 🛠️ Getting Started

1. **Fork the repository**

2. **Clone your fork**
```bash
git clone https://github.com/yourusername/SkillLens.git
cd SkillLens
```

3. **Set up the frontend**
```bash
cd client
npm install
```

4. **Set up the backend**
```bash
cd ../server
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🧼 Code Guidelines

### ✍️ Style & Structure
- Use **TypeScript** for all React components
- Keep files concise (ideally < 500 lines)
- Group components, services, pages, and utils into their respective folders
- Use **Tailwind CSS** for all styling
- Use **FastAPI** (Python) for backend routes and logic
- Follow consistent naming (e.g., `SkillRadarChart.tsx`, `analyze_route.py`)

### 📦 Best Practices
- Comment complex logic
- Use `.env` for secrets and NEVER commit real credentials
- Keep imports clean and ordered
- Reuse UI components when possible

---

## ✅ What You Can Contribute

- Frontend components (React + Tailwind)
- Backend API routes (Python + FastAPI)
- Skill classification logic / enhancements
- Bug fixes and UI improvements
- Documentation and tutorials
- Accessibility, responsiveness, or testing

---

## 🚫 What Not to Do

- Do NOT commit `.env` or sensitive data
- Do NOT run or execute uploaded code
- Do NOT break the folder structure
- Avoid adding large, untested features without discussion

---

## 🔍 Before Submitting a PR

1. Pull the latest changes:
```bash
git pull origin main
```

2. Create a feature branch:
```bash
git checkout -b your-feature-name
```

3. Format your code and test locally

4. Add a clear commit message:
```bash
git commit -m "[feature] add upload validation logic"
```

5. Push and open a pull request:
```bash
git push origin your-feature-name
```

6. Describe what you did, tag your PR (`[feature]`, `[bugfix]`, `[docs]`, etc.)

---

## 🛡️ Security & Compliance

All contributions must follow MY [Security Policy](./SECURITY.md). By submitting code, you agree not to include malicious logic or violate user privacy in any form.

---

## 🙌 Thanks for Being Awesome!

I'm glad to have you here. Contribute smart, code clean, and help us make SkillLens better for everyone.
