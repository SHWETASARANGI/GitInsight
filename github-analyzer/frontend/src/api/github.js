export async function analyzeProfile(username, token) {
  if (!username) {
    throw new Error("Username is required");
  }

  const params = new URLSearchParams({ username });
  if (token) params.append("token", token);

  const url = `http://127.0.0.1:8000/analyze?${params.toString()}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      mode: "cors",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Backend error (${res.status}): ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch failed:", err);
    throw err;
  }
}
