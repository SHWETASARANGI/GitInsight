import httpx
from typing import List, Dict, Optional

GITHUB_API = "https://api.github.com"


class GitHubClient:
    def __init__(self, token: Optional[str] = None):
        headers = {
            "Accept": "application/vnd.github+json"
        }
        if token:
            headers["Authorization"] = f"Bearer {token}"

        self.client = httpx.AsyncClient(headers=headers, timeout=30)

    async def get(self, url: str, params=None):
        res = await self.client.get(url, params=params)
        if res.status_code == 403:
            raise Exception("GitHub rate limit exceeded")
        res.raise_for_status()
        return res.json()

    async def fetch_all_pages(self, url: str, params=None) -> List[Dict]:
        page = 1
        results = []

        while True:
            p = params.copy() if params else {}
            p.update({"per_page": 100, "page": page})

            data = await self.get(url, p)
            if not data:
                break

            results.extend(data)
            page += 1

        return results

    async def get_user(self, username: str):
        return await self.get(f"{GITHUB_API}/users/{username}")

    async def get_repos(self, username: str):
        return await self.fetch_all_pages(
            f"{GITHUB_API}/users/{username}/repos",
            params={"sort": "updated"}
        )

    async def get_events(self, username: str):
        return await self.fetch_all_pages(
            f"{GITHUB_API}/users/{username}/events"
        )

    async def close(self):
        await self.client.aclose()
