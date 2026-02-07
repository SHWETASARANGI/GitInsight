from pydantic import BaseModel
from typing import List, Dict, Any


class LanguageData(BaseModel):
    name: str
    value: int
    percentage: float


class CommitPoint(BaseModel):
    month: str
    commits: int


class RepoBar(BaseModel):
    name: str
    stars: int
    forks: int


class AnalyticsResponse(BaseModel):
    totalStars: int
    totalForks: int
    totalCommits: int
    languageData: List[LanguageData]
    commitData: List[CommitPoint]
    repoSizeData: List[RepoBar]
    recentActivity: List[Dict[str, Any]]
    topRepos: List[Dict[str, Any]]


class FullResponse(BaseModel):
    user: Dict[str, Any]
    analytics: AnalyticsResponse
