"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ExternalLink, Loader2, LogOut, RotateCcw, Send, TriangleAlert } from "lucide-react";
import { GitHubIcon } from "@/components/BrandIcons";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CONTENT_FILES, REPO_NAME, REPO_OWNER, UPLOAD_DIR, UPLOAD_URL, contentPath, type ContentKey } from "./config";
import { canPush, commitFiles, deploymentState, fileSha, getUser, readJson, type CommitFile } from "./github";
import { UploadContext } from "./ui";
import {
  AboutSection, CertificationsSection, EducationSection, ExperienceSection, IntroSection, ProjectsSection, ResumeSection, SkillsSection, SummarySection,
} from "./sections";

type Data = Record<ContentKey, any>;
type Phase = "checking" | "signed-out" | "loading" | "ready" | "no-access" | "error";
type Publish = { state: "idle" | "saving" | "deploying" | "live" | "slow" | "failed"; message?: string };

const TOKEN_KEY = "portfolio-admin-token";
const store = {
  get: () => { try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set: (t: string) => { try { sessionStorage.setItem(TOKEN_KEY, t); } catch {} },
  clear: () => { try { sessionStorage.removeItem(TOKEN_KEY); } catch {} },
};

const sections: { id: string; label: string; key: ContentKey }[] = [
  { id: "intro", label: "Intro", key: "profile" },
  { id: "skills", label: "Skills", key: "skills" },
  { id: "experience", label: "Experience", key: "experience" },
  { id: "projects", label: "Projects", key: "projects" },
  { id: "certifications", label: "Certifications", key: "certifications" },
  { id: "education", label: "Education", key: "education" },
  { id: "about", label: "About", key: "about" },
  { id: "summary", label: "Summary", key: "summary" },
  { id: "resume", label: "Resume", key: "resume" },
];

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });

export function AdminApp() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ login: string; avatar_url: string } | null>(null);
  const [error, setError] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [original, setOriginal] = useState<Data | null>(null);
  const [shas, setShas] = useState<Record<string, string>>({});
  const [publish, setPublish] = useState<Publish>({ state: "idle" });
  const uploads = useRef(new Map<string, { base64: string; objectUrl: string }>());
  const [uploadCount, setUploadCount] = useState(0);

  const siteUrl: string = data?.profile?.url || "/";

  /* ---------------- auth */
  const load = useCallback(async (t: string) => {
    setPhase("loading");
    try {
      const u = await getUser(t);
      setUser(u);
      if (!(await canPush(t))) { setPhase("no-access"); return; }
      const results = await Promise.all(CONTENT_FILES.map((k) => readJson(t, contentPath(k))));
      const d = {} as Data;
      const s: Record<string, string> = {};
      CONTENT_FILES.forEach((k, i) => { d[k] = results[i].data; s[k] = results[i].sha; });
      setData(structuredClone(d));
      setOriginal(d);
      setShas(s);
      setPhase("ready");
    } catch (e: any) {
      if (e?.status === 401) { store.clear(); setToken(null); setPhase("signed-out"); return; }
      setError(e?.message ?? "Something went wrong.");
      setPhase("error");
    }
  }, []);

  useEffect(() => {
    const t = store.get();
    if (t) { setToken(t); load(t); } else setPhase("signed-out");
  }, [load]);

  const signIn = () => {
    const w = 600, h = 720;
    const popup = window.open("/api/auth", "github-login", `width=${w},height=${h},left=${(screen.width - w) / 2},top=${(screen.height - h) / 2}`);
    if (!popup) { setError("Please allow pop-ups for this site, then try again."); return; }
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin || typeof e.data !== "string") return;
      if (e.data === "authorizing:github") { (e.source as Window | null)?.postMessage("authorizing:github", e.origin); return; }
      const m = e.data.match(/^authorization:github:(success|error):([\s\S]*)$/);
      if (!m) return;
      window.removeEventListener("message", onMessage);
      const payload = JSON.parse(m[2]);
      if (m[1] === "success" && payload.token) {
        store.set(payload.token);
        setToken(payload.token);
        setError("");
        load(payload.token);
      } else setError(payload.message ?? "Sign-in failed.");
    };
    window.addEventListener("message", onMessage);
  };

  const signOut = () => {
    if (dirtyKeys.length && !confirm("You have unpublished changes. Sign out anyway?")) return;
    store.clear(); setToken(null); setUser(null); setData(null); setOriginal(null); setPhase("signed-out");
  };

  /* ---------------- uploads */
  const uploadApi = useMemo(() => ({
    upload: async (file: File) => {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "file";
      const name = `${Date.now().toString(36)}-${base}.${ext}`;
      const url = `${UPLOAD_URL}/${name}`;
      uploads.current.set(url, { base64: await fileToBase64(file), objectUrl: URL.createObjectURL(file) });
      setUploadCount((n) => n + 1);
      return url;
    },
    preview: (url?: string) => (url ? uploads.current.get(url)?.objectUrl ?? url : undefined),
  }), []);

  /* ---------------- changes */
  const dirtyKeys = useMemo(
    () => (data && original ? CONTENT_FILES.filter((k) => JSON.stringify(data[k]) !== JSON.stringify(original[k])) : []),
    [data, original],
  );
  const pendingUploads = useMemo(() => {
    if (!data) return [] as string[];
    const text = JSON.stringify(data);
    return [...uploads.current.keys()].filter((u) => text.includes(u));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, uploadCount]);
  const dirty = dirtyKeys.length > 0;

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setKey = (k: ContentKey) => (v: any) => setData((d) => (d ? { ...d, [k]: v } : d));

  const discard = () => { if (original && confirm("Discard all unpublished changes?")) setData(structuredClone(original)); };

  const doPublish = async () => {
    if (!token || !data || !dirty) return;
    setPublish({ state: "saving" });
    try {
      // Make sure nobody changed these files elsewhere since we loaded them.
      for (const k of dirtyKeys) {
        const current = await fileSha(token, contentPath(k));
        if (current && shas[k] && current !== shas[k]) {
          setPublish({ state: "failed", message: `The ${k} content was changed somewhere else. Reload the page to get the latest version, then make your edit again.` });
          return;
        }
      }
      const files: CommitFile[] = dirtyKeys.map((k) => ({ path: contentPath(k), text: JSON.stringify(data[k], null, 2) + "\n" }));
      pendingUploads.forEach((url) => {
        files.push({ path: `${UPLOAD_DIR}/${url.slice(UPLOAD_URL.length + 1)}`, base64: uploads.current.get(url)!.base64 });
      });
      const names = dirtyKeys.map((k) => sections.find((s) => s.key === k)?.label ?? k);
      const sha = await commitFiles(token, files, `Update ${names.join(", ")} from the profile editor`);

      // Refresh shas for the files we just wrote.
      const fresh = await Promise.all(dirtyKeys.map((k) => fileSha(token, contentPath(k))));
      setShas((s) => { const n = { ...s }; dirtyKeys.forEach((k, i) => { if (fresh[i]) n[k] = fresh[i]!; }); return n; });
      setOriginal(structuredClone(data));
      pendingUploads.forEach((u) => { const x = uploads.current.get(u); if (x) uploads.current.set(u, { ...x, base64: "" }); });

      setPublish({ state: "deploying" });
      const started = Date.now();
      const poll = async () => {
        let state = "pending";
        try { state = await deploymentState(token, sha); } catch {}
        if (state === "success") return setPublish({ state: "live" });
        if (state === "failure") return setPublish({ state: "failed", message: "Your changes were saved, but the website failed to rebuild. Open Vercel to see why." });
        if (Date.now() - started > 4 * 60_000) return setPublish({ state: "slow" });
        setTimeout(poll, 6000);
      };
      setTimeout(poll, 8000);
    } catch (e: any) {
      setPublish({ state: "failed", message: e?.message ?? "Publishing failed. Please try again." });
    }
  };

  /* ---------------- screens */
  if (phase === "checking" || phase === "loading") {
    return <Center><Loader2 className="animate-spin text-muted" size={28} aria-hidden="true" /><p className="mt-4 text-sm text-muted">{phase === "loading" ? "Loading your profile…" : ""}</p></Center>;
  }
  if (phase === "signed-out") {
    return (
      <Center>
        <div className="w-full max-w-sm rounded-3xl bg-elevated p-8 text-center ring-1 ring-line/[0.08] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3)]">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-fg text-lg font-bold text-bg">VY</span>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">Profile editor</h1>
          <p className="mt-2 text-[15px] text-muted">Sign in to update your portfolio. Changes go live on your site in about a minute.</p>
          <button type="button" onClick={signIn} className="btn-primary mt-8 w-full !py-3"><GitHubIcon size={18} /> Continue with GitHub</button>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      </Center>
    );
  }
  if (phase === "no-access") {
    return <Center><Message icon="warn" title="This account can't edit the site" body={`You're signed in as ${user?.login}, which doesn't have write access to ${REPO_OWNER}/${REPO_NAME}. Sign out and use the right GitHub account.`} action={<button className="btn-secondary mt-6" onClick={signOut}>Sign out</button>} /></Center>;
  }
  if (phase === "error" || !data) {
    return <Center><Message icon="warn" title="Couldn't load your profile" body={error} action={<button className="btn-secondary mt-6" onClick={() => token && load(token)}>Try again</button>} /></Center>;
  }

  const count = dirtyKeys.length;
  return (
    <UploadContext.Provider value={uploadApi}>
      <div className="min-h-screen bg-surface pb-28 lg:pb-12">
        {/* top bar */}
        <header className="sticky top-0 z-40 border-b border-line/[0.07] bg-elevated/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-fg text-[11px] font-bold text-bg">{data.profile.initials}</span>
            <span className="hidden font-semibold sm:inline">Profile editor</span>
            <span className={`ml-2 hidden rounded-full px-2.5 py-1 text-xs font-medium md:inline ${dirty ? "bg-amber-500/15 text-amber-700 dark:text-amber-400" : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}`}>
              {dirty ? `${count} section${count > 1 ? "s" : ""} changed` : "All changes published"}
            </span>
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost !px-2 text-sm"><span className="hidden sm:inline">View site</span> <ExternalLink size={15} aria-hidden="true" /></a>
              <ThemeToggle />
              {dirty && <button type="button" onClick={discard} className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted hover:bg-line/[0.06] hover:text-fg lg:inline-flex"><RotateCcw size={15} aria-hidden="true" /> Discard</button>}
              <button type="button" onClick={doPublish} disabled={!dirty || publish.state === "saving"} className="btn-primary hidden disabled:cursor-not-allowed disabled:opacity-40 lg:inline-flex">
                {publish.state === "saving" ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Send size={15} aria-hidden="true" />} Publish
              </button>
              {user && (
                <button type="button" onClick={signOut} title={`Signed in as ${user.login}. Click to sign out.`} className="flex items-center gap-2 rounded-full p-1 hover:bg-line/[0.06]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full" />
                  <LogOut size={15} className="mr-1.5 text-muted" aria-label="Sign out" />
                </button>
              )}
            </div>
          </div>
        </header>

        <PublishBanner publish={publish} siteUrl={siteUrl} onClose={() => setPublish({ state: "idle" })} />

        <div className="mx-auto grid max-w-6xl gap-6 px-4 pt-6 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10 lg:pt-10">
          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="sticky top-24 space-y-0.5">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex items-center justify-between rounded-xl px-3 py-2 text-[15px] text-fg/70 transition hover:bg-elevated hover:text-fg">
                    {s.label}
                    {dirtyKeys.includes(s.key) && <span className="h-2 w-2 rounded-full bg-amber-500" aria-label="changed" />}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <main className="mx-auto w-full max-w-3xl space-y-6">
            <IntroSection value={data.profile} set={setKey("profile")} />
            <SkillsSection value={data.skills} set={setKey("skills")} />
            <ExperienceSection value={data.experience} set={setKey("experience")} />
            <ProjectsSection value={data.projects} set={setKey("projects")} />
            <CertificationsSection value={data.certifications} set={setKey("certifications")} />
            <EducationSection value={data.education} set={setKey("education")} />
            <AboutSection value={data.about} set={setKey("about")} />
            <SummarySection value={data.summary} set={setKey("summary")} />
            <ResumeSection value={data.resume} set={setKey("resume")} />
            <p className="pb-4 text-center text-xs text-muted">Edits stay on this page until you click Publish.</p>
          </main>
        </div>

        {/* mobile publish bar */}
        <AnimatePresence>
          {dirty && (
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} className="fixed inset-x-0 bottom-0 z-40 border-t border-line/[0.08] bg-elevated/95 p-3 backdrop-blur-xl lg:hidden">
              <div className="mx-auto flex max-w-3xl items-center gap-3">
                <p className="flex-1 text-sm"><span className="font-medium">{count} section{count > 1 ? "s" : ""} changed</span><br /><button onClick={discard} className="text-xs text-muted underline">Discard</button></p>
                <button type="button" onClick={doPublish} disabled={publish.state === "saving"} className="btn-primary !px-6 !py-3">
                  {publish.state === "saving" ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Send size={15} aria-hidden="true" />} Publish
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </UploadContext.Provider>
  );
}

function PublishBanner({ publish, siteUrl, onClose }: { publish: Publish; siteUrl: string; onClose: () => void }) {
  const map = {
    saving: { tone: "info", icon: <Loader2 size={18} className="animate-spin" />, text: "Saving your changes…" },
    deploying: { tone: "info", icon: <Loader2 size={18} className="animate-spin" />, text: "Saved. Updating your website, this takes about a minute…" },
    live: { tone: "ok", icon: <CheckCircle2 size={18} />, text: "Your changes are live." },
    slow: { tone: "info", icon: <CheckCircle2 size={18} />, text: "Saved. The website is still updating; refresh it in a minute or two." },
    failed: { tone: "bad", icon: <TriangleAlert size={18} />, text: publish.message ?? "Publishing failed." },
  } as const;
  const item = publish.state === "idle" ? null : map[publish.state];
  return (
    <div aria-live="polite" className="mx-auto max-w-6xl px-4 sm:px-6">
      <AnimatePresence>
        {item && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className={`mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm ring-1 ${
              item.tone === "ok" ? "bg-emerald-500/10 text-emerald-800 ring-emerald-500/20 dark:text-emerald-300"
              : item.tone === "bad" ? "bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-300"
              : "bg-accent/10 text-fg ring-accent/20"}`}>
            {item.icon}
            <span className="flex-1">{item.text}</span>
            {publish.state === "live" && <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="font-medium underline">View site</a>}
            {publish.state !== "saving" && publish.state !== "deploying" && <button onClick={onClose} className="text-xs underline opacity-70">Dismiss</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <main className="grid min-h-screen place-items-center bg-surface px-4"><div className="flex w-full flex-col items-center">{children}</div></main>;
}

function Message({ title, body, action }: { icon: "warn"; title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-3xl bg-elevated p-8 text-center ring-1 ring-line/[0.08]">
      <TriangleAlert className="mx-auto text-amber-500" size={30} aria-hidden="true" />
      <h1 className="mt-4 text-xl font-semibold">{title}</h1>
      <p className="mt-2 text-[15px] text-muted">{body}</p>
      {action}
    </div>
  );
}
