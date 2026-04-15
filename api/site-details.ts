const DEFAULT_BRANCH = process.env.GITHUB_BRANCH || "main";
const DEFAULT_PATH = process.env.GITHUB_CONTENT_PATH || "src/data/siteDetails.json";

function json(res: any, status: number, body: any) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

async function ghRequest(url: string, init: RequestInit, token: string) {
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers || {}),
    },
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // ignore
  }

  if (!res.ok) {
    const message = data?.message || `GitHub request failed: ${res.status}`;
    throw new Error(message);
  }

  return data;
}

function decodeBase64(b64: string) {
  return Buffer.from(b64, "base64").toString("utf8");
}

function encodeBase64(str: string) {
  return Buffer.from(str, "utf8").toString("base64");
}

export default async function handler(req: any, res: any) {
  try {
    const method = (req.method || "GET").toUpperCase();

    const token = getRequiredEnv("GITHUB_TOKEN");
    const owner = getRequiredEnv("GITHUB_OWNER");
    const repo = getRequiredEnv("GITHUB_REPO");
    const branch = process.env.GITHUB_BRANCH || DEFAULT_BRANCH;
    const path = process.env.GITHUB_CONTENT_PATH || DEFAULT_PATH;

    const contentsUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${encodeURIComponent(branch)}`;

    if (method === "GET") {
      const file = await ghRequest(contentsUrl, { method: "GET" }, token);
      const content = decodeBase64(file.content || "");
      const parsed = JSON.parse(content);
      return json(res, 200, { ok: true, data: parsed });
    }

    if (method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return json(res, 405, { ok: false, error: "Method not allowed" });
    }

    // Auth
    // For local/preview testing you can optionally disable auth by setting:
    // - ALLOW_INSECURE_ADMIN=true (server env)
    // This is ignored in production deployments.
    const allowInsecureAdmin =
      process.env.ALLOW_INSECURE_ADMIN === "true" && process.env.VERCEL_ENV !== "production";

    if (!allowInsecureAdmin) {
      const adminPassword = getRequiredEnv("ADMIN_PASSWORD");
      const provided =
        req.headers?.["x-admin-password"] ||
        req.headers?.["X-Admin-Password"] ||
        (req.headers?.authorization || "").replace(/^Bearer\s+/i, "");

      if (!provided || provided !== adminPassword) {
        return json(res, 401, { ok: false, error: "Unauthorized" });
      }
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (body?.__validate === true) {
      return json(res, 200, { ok: true });
    }

    if (!body || typeof body !== "object") {
      return json(res, 400, { ok: false, error: "Invalid JSON body" });
    }

    const file = await ghRequest(contentsUrl, { method: "GET" }, token);
    const sha = file.sha;

    const nextJson = JSON.stringify(body, null, 2) + "\n";
    const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`;

    const message = `Update siteDetails.json via admin (${new Date().toISOString()})`;
    await ghRequest(
      putUrl,
      {
        method: "PUT",
        body: JSON.stringify({
          message,
          content: encodeBase64(nextJson),
          sha,
          branch,
        }),
      },
      token
    );

    return json(res, 200, { ok: true });
  } catch (error: any) {
    console.error(error);
    return json(res, 500, { ok: false, error: error?.message || "Server error" });
  }
}
