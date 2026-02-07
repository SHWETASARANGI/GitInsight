import React, { useState, useEffect } from 'react';
import {
  Search,
  Star,
  GitFork,
  Book,
  Calendar,
  TrendingUp,
  GitCommit,
  Settings,
  X
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

import { analyzeProfile } from '../api/github';

export default function GitHubAnalyzer() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('gh_token');
    if (savedToken) setToken(savedToken);
  }, []);

  const saveToken = () => {
    if (token.trim()) {
      localStorage.setItem('gh_token', token.trim());
      setShowSettings(false);
    }
  };

  const analyze = async () => {
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');
    setUserData(null);
    setAnalytics(null);

    try {
      const data = await analyzeProfile(username.trim(), token.trim());
      setUserData(data.user);
      setAnalytics(data.analytics);
    } catch (err) {
      setError(err.message || 'Failed to analyze profile');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') analyze();
  };

  const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            GitInsight
          </h1>
          <p className="text-gray-300">Advanced analytics with commits, languages, and contribution insights</p>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="absolute top-0 right-0 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>

        {showSettings && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-white hover:bg-white/10 p-1 rounded">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <label className="block text-gray-200 text-sm">
                GitHub Personal Access Token (optional, increases rate limit)
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={saveToken}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
              >
                Save Token
              </button>
              <p className="text-xs text-gray-300">
                Get your token at:{' '}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline"
                >
                  github.com/settings/tokens
                </a>
              </p>
            </div>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter GitHub username"
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={analyze}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors"
            >
              <Search size={20} />
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          {error && <p className="mt-3 text-red-300 text-sm">{error}</p>}
        </div>

        {userData && analytics && (
          /* ⬇️ EVERYTHING BELOW IS UNCHANGED UI ⬇️ */
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-6">
                <img
                  src={userData.avatar_url}
                  alt={userData.login}
                  className="w-24 h-24 rounded-full border-4 border-purple-400"
                />
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white">{userData.name || userData.login}</h2>
                  <p className="text-purple-300 mb-2">@{userData.login}</p>
                  {userData.bio && <p className="text-gray-300 mb-3">{userData.bio}</p>}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                    <span className="flex items-center gap-1">
                      <Book size={16} /> {userData.public_repos} repos
                    </span>
                    <span>{userData.followers} followers</span>
                    <span>{userData.following} following</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-yellow-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Total Stars</h3>
                </div>
                <p className="text-4xl font-bold text-purple-300">{analytics.totalStars}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <GitFork className="text-blue-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Total Forks</h3>
                </div>
                <p className="text-4xl font-bold text-purple-300">{analytics.totalForks}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <GitCommit className="text-green-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Total Commits</h3>
                </div>
                <p className="text-4xl font-bold text-purple-300">{analytics.totalCommits}+</p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Book className="text-pink-400" size={24} />
                  <h3 className="text-lg font-semibold text-white">Public Repos</h3>
                </div>
                <p className="text-4xl font-bold text-purple-300">{userData.public_repos}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">Language Distribution (by LOC)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.languageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${(value / 1000).toFixed(1)}K bytes`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">Top Repositories</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.repoSizeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="name" stroke="#ffffff" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#ffffff" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                    <Bar dataKey="stars" fill="#fbbf24" name="Stars" />
                    <Bar dataKey="forks" fill="#3b82f6" name="Forks" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {analytics.commitData.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-semibold text-white mb-4">Commit Activity (Last 12 Months)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.commitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="month" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="commits" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 5 }} name="Commits" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="text-purple-400" size={24} />
                  <h3 className="text-xl font-semibold text-white">Languages by LOC</h3>
                </div>
                <div className="space-y-3">
                  {analytics.languageData.map((lang, i) => (
                    <div key={lang.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-200">{lang.name}</span>
                        <span className="text-purple-300">{lang.percentage}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${lang.percentage}%`,
                            backgroundColor: COLORS[i % COLORS.length]
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="text-pink-400" size={24} />
                  <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  {analytics.recentActivity.map((activity, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-gray-200 truncate flex-1">{activity.name}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-xs text-yellow-300 flex items-center gap-1">
                          <Star size={12} /> {activity.stars}
                        </span>
                        <span className="text-xs text-purple-300">
                          {activity.updated
                               ? new Date(activity.updated).toLocaleDateString()
                              : "N/A"
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Star className="text-yellow-400" size={24} />
                <h3 className="text-xl font-semibold text-white">Most Starred Repositories</h3>
              </div>
              <div className="space-y-3">
                {analytics.topRepos.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold">{repo.name}</h4>
                      <div className="flex gap-3 text-sm">
                        <span className="flex items-center gap-1 text-yellow-300">
                          <Star size={14} /> {repo.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1 text-blue-300">
                          <GitFork size={14} /> {repo.forks_count}
                        </span>
                      </div>
                    </div>
                    {repo.description && (
                      <p className="text-sm text-gray-300">{repo.description}</p>
                    )}
                    {repo.language && (
                      <span className="inline-block mt-2 px-2 py-1 bg-purple-500/30 text-purple-200 rounded text-xs">
                        {repo.language}
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
