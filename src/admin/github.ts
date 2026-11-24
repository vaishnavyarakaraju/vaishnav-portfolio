/** Minimal GitHub API client used by the editor (runs in the browser). */
import { REPO_BRANCH, REPO_NAME, REPO_OWNER } from "./config";

const API = "https://api.github.com";
const repoPath = `/repos/${REPO_OWNER}/${REPO_NAME}`;

export class GitHubError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function gh<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      msg = ((await res.json()) as { message?: string }).message ?? msg;
    } catch {}
    throw new GitHubError(msg, res.status);
  }
  return (await res.json()) as T;
}

export function decodeBase64Utf8(b64: string): string {
  const bin = atob(b64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export async function getUser(token: string) {
  return gh<{ login: string; avatar_url: string; name: string | null }>(token, "/user");
}

export async function canPush(token: string) {
  const repo = await gh<{ permissions?: { push?: boolean } }>(token, repoPath);
  return !!repo.permissions?.push;
}

export async function readJson(token: string, path: string): Promise<{ data: unknown; sha: string }> {
  const file = await gh<{ content: string; sha: string }>(
    token,
    `${repoPath}/contents/${path}?ref=${encodeURIComponent(REPO_BRANCH)}`,
  );
  return { data: JSON.parse(decodeBase64Utf8(file.content)), sha: file.sha };
}

export async function fileSha(token: string, path: string): Promise<string | null> {
  try {
    const file = await gh<{ sha: string }>(token, `${repoPath}/contents/${path}?ref=${encodeURIComponent(REPO_BRANCH)}`);
    return file.sha;
  } catch (e) {
    if (e instanceof GitHubError && e.status === 404) return null;
    throw e;
  }
}

export type CommitFile = { path: string; text?: string; base64?: string };

/** Saves several files in one commit on the branch. Returns the new commit sha. */
export async function commitFiles(token: string, files: CommitFile[], message: string): Promise<string> {
  const ref = await gh<{ object: { sha: string } }>(token, `${repoPath}/git/ref/heads/${REPO_BRANCH}`);
  const parent = ref.object.sha;
  const commit = await gh<{ tree: { sha: string } }>(token, `${repoPath}/git/commits/${parent}`);

  const tree = [] as { path: string; mode: "100644"; type: "blob"; sha?: string; content?: string }[];
  for (const f of files) {
    if (f.base64 !== undefined) {
      const blob = await gh<{ sha: string }>(token, `${repoPath}/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: f.base64, encoding: "base64" }),
      });
      tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
    } else {
      tree.push({ path: f.path, mode: "100644", type: "blob", content: f.text ?? "" });
    }
  }

  const newTree = await gh<{ sha: string }>(token, `${repoPath}/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: commit.tree.sha, tree }),
  });
  const newCommit = await gh<{ sha: string }>(token, `${repoPath}/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [parent] }),
  });
  await gh(token, `${repoPath}/git/refs/heads/${REPO_BRANCH}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: newCommit.sha }),
  });
  return newCommit.sha;
}

/** Vercel reports deployments back to GitHub. Returns "pending" | "success" | "failure" | "unknown". */
export async function deploymentState(token: string, sha: string): Promise<string> {
  const deployments = await gh<{ id: number; environment: string }[]>(token, `${repoPath}/deployments?sha=${sha}`);
  const prod = deployments.find((d) => /production/i.test(d.environment)) ?? deployments[0];
  if (!prod) return "unknown";
  const statuses = await gh<{ state: string }[]>(token, `${repoPath}/deployments/${prod.id}/statuses`);
  const state = statuses[0]?.state;
  if (state === "success") return "success";
  if (state === "failure" || state === "error") return "failure";
  return "pending";
}
