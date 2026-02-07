from collections import defaultdict
from datetime import datetime


def generate_analytics(repos: list, events: list) -> dict:
    total_stars = 0
    total_forks = 0
    total_commits = 0

    language_count = defaultdict(int)
    monthly_commits = defaultdict(int)

    repo_size_data = []
    top_repos = []
    recent_activity = []

    # -------------------------
    # Repository analytics
    # -------------------------
    for repo in repos:
        stars = repo.get("stargazers_count", 0)
        forks = repo.get("forks_count", 0)

        total_stars += stars
        total_forks += forks

        if repo.get("language"):
            language_count[repo["language"]] += 1

        repo_size_data.append({
            "name": repo["name"],
            "stars": stars,
            "forks": forks
        })

        top_repos.append({
            "name": repo["name"],
            "stars": stars,
            "url": repo["html_url"]
        })

    top_repos = sorted(
        top_repos,
        key=lambda r: r["stars"],
        reverse=True
    )[:5]

    # -------------------------
    # Event analytics
    # -------------------------
    for event in events:
        created_at = event.get("created_at")
        event_type = event.get("type")

        if event_type == "PushEvent":
            commits = event.get("payload", {}).get("commits", [])
            commit_count = len(commits)
            total_commits += commit_count

            if created_at:
                month = created_at[:7]  # YYYY-MM
                monthly_commits[month] += commit_count

        recent_activity.append({
            "type": event_type,
            "repo": event.get("repo", {}).get("name"),
            "created_at": created_at
        })

    recent_activity = sorted(
        recent_activity,
        key=lambda e: e["created_at"] or "",
        reverse=True
    )[:5]

    # -------------------------
    # Language percentages
    # -------------------------
    total_lang_repos = sum(language_count.values()) or 1
    language_data = [
        {
            "name": lang,
            "value": count,
            "percentage": round((count / total_lang_repos) * 100, 2)
        }
        for lang, count in language_count.items()
    ]

    commit_data = [
        {"month": month, "commits": commits}
        for month, commits in sorted(monthly_commits.items())
    ]

    return {
        "totalStars": total_stars,
        "totalForks": total_forks,
        "totalCommits": total_commits,
        "languageData": language_data,
        "commitData": commit_data,
        "repoSizeData": repo_size_data,
        "recentActivity": recent_activity,
        "topRepos": top_repos
    }
