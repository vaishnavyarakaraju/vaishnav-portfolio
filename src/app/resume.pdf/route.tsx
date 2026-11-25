/**
 * /resume.pdf — the resume, generated from the portfolio content at build time.
 * Every publish from the editor triggers a new build, so the PDF is always current.
 */
import { renderToBuffer } from "@react-pdf/renderer";
import { ResumeDocument } from "@/resume/ResumeDocument";
import { resumeSettings } from "@/content/resume";

export const dynamic = "force-static";

export async function GET() {
  const pdf = await renderToBuffer(<ResumeDocument />);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${resumeSettings.fileName}"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
