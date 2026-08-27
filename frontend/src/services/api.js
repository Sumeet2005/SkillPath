const RAW_BASE = import.meta.env.VITE_API_BASE_URL || "";
const API_BASE_URL = `${RAW_BASE.replace(/\/$/, "")}/api`;

/**
 * Helper to safely parse JSON responses or throw meaningful error
 */
async function parseJsonResponse(response) {
  const contentType = response.headers.get("content-type");
  if (!response.ok) {
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error (Status ${response.status})`);
    }
    throw new Error(`Failed request (Status ${response.status})`);
  }

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Server returned a non-JSON response.");
  }

  return response.json();
}

/**
 * Fetch available target jobs from backend
 */
export async function fetchJobs() {
  const response = await fetch(`${API_BASE_URL}/jobs`);
  return parseJsonResponse(response);
}

/**
 * Fetch available skills from backend
 */
export async function fetchSkills() {
  const response = await fetch(`${API_BASE_URL}/skills`);
  return parseJsonResponse(response);
}

/**
 * Generate learning path based on selected current skills and target job
 * @param {Array<string>} currentSkills
 * @param {string} targetJob
 */
export async function generatePath(currentSkills, targetJob) {
  const response = await fetch(`${API_BASE_URL}/path`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      currentSkills,
      targetJob,
    }),
  });

  const data = await parseJsonResponse(response);
  if (!data.success) {
    throw new Error(data.message || "Failed to generate learning path.");
  }
  return data;
}

/**
 * Healthcheck function to verify backend availability
 */
export async function checkBackendStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
