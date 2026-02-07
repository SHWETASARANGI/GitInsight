# GitInsight

A full-stack web application that analyzes a GitHub user’s public profile and repositories to generate insights such as repository statistics, language usage, stars, forks, and recent commit activity.

The project uses the GitHub REST API and presents analytics through a clean, interactive frontend.

---

## 🚀 Features

* Analyze any public GitHub username
* Repository statistics (stars, forks, repo count)
* Language distribution by repositories
* Recent commit activity timeline (last ~90 days)
* Interactive charts and visualizations
* Rate-limit–aware GitHub API integration

---

## 🧠 How It Works (High Level)

1. User enters a GitHub username
2. Frontend sends a request to the backend
3. Backend fetches:

   * User profile
   * Repositories
   * Public events (PushEvents)
4. Analytics are computed and returned
5. Frontend renders charts and statistics

⚠️ **Note**: Commit data is based on GitHub Events API, which only covers recent activity (up to ~90 days).

---

## 🗂️ Project Structure

```
github-profile-analyzer/
│
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── analytics.py         # Analytics computation logic
│   ├── github.py            # GitHub API interaction layer
│   ├── models.py            # Response schemas / models
│   ├── requirements.txt     # Backend dependencies
│   └── .env                 # Environment variables (not committed)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── GitHubAnalyzer.jsx
│   │   │   ├── Charts.jsx
│   │   │   └── StatCard.jsx
│   │   ├── api/
│   │   │   └── github.js    # API calls to backend
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

## 🧩 Tech Stack

### Frontend

* React
* Vite
* Charting library (e.g. Recharts / Chart.js)
* Axios / Fetch API

### Backend

* Python
* FastAPI
* GitHub REST API

---

## 🔐 GitHub API Authentication 

GitHub enforces strict rate limits on unauthenticated requests.

To avoid 403 / 500 errors:

1. Generate a GitHub Personal Access Token
2. Store it in a `.env` file in the backend

```
GITHUB_TOKEN=your_personal_access_token
```

The backend automatically uses this token for authenticated API requests.

---

## 📦 Dependencies

### Backend Dependencies

Located in `backend/requirements.txt`:

```
fastapi
uvicorn
httpx
python-dotenv
```

Install them with:

```bash
pip install -r requirements.txt
```

### Frontend Dependencies

Located in `frontend/package.json`.

Install with:

```bash
npm install
```

---

## ▶️ How to Run the Project

### 1️⃣ Start the Backend

```bash
cd backend
uvicorn main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

### 2️⃣ Start the Frontend

```bash
cd frontend
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## ⚠️ Known Limitations

* Commit analytics are based on recent GitHub events, not lifetime commits
* Language distribution is calculated by repositories, not lines of code
* GitHub API rate limits apply (even with authentication)

These trade-offs were chosen to balance accuracy, performance, and API usage.

---

## 🛠️ Future Improvements

* True commit counts per repository
* LOC-based language distribution
* Caching GitHub API responses
* Authentication via GitHub OAuth
* Deployment with Docker

---

## 📄 License

This project is for educational and portfolio purposes.
