from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from github import GitHubClient
from analytics import generate_analytics

app = FastAPI(title="GitHub Profile Analyzer API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def health_check():
    return {"status": "ok"}

@app.get("/analyze")
async def analyze_profile(
    username: str,
    token: str | None = Query(default=None),
):
    gh = GitHubClient(token)

    try:
        # Fetch user
        user = await gh.get_user(username)

        # Fetch repositories
        repos = await gh.get_repos(username)

        # Fetch recent public events (for commits & activity)
        events = await gh.get(
            f"https://api.github.com/users/{username}/events"
        )

        # Generate analytics (single source of truth)
        analytics = generate_analytics(
            repos=repos,
            events=events,
        )

        return {
            "user": user,
            "analytics": analytics,
        }

    except Exception as e:
        # Convert backend failures into clean API errors
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

    finally:
        await gh.close()
