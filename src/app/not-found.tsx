import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main id="main" className="relative grid min-h-screen place-items-center overflow-hidden px-6 text-center">
      <div className="grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative">
        <p className="font-mono text-sm text-muted">404</p>
        <h1 className="mt-3 text-5xl font-semibold tracking-tightest sm:text-7xl">This page didn&apos;t deploy.</h1>
        <p className="lead mx-auto mt-5 max-w-md">The link may be outdated, or the page has moved. Everything else is still up and running.</p>
        <Link href="/" className="btn-primary mt-9"><ArrowLeft size={15} aria-hidden="true" /> Back to home</Link>
      </div>
    </main>
  );
}
