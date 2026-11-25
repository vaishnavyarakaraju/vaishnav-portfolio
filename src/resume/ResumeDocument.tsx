/**
 * The downloadable resume, generated from the site content.
 * Layout mirrors the original Word resume: A4, Times, centered name,
 * underlined section headings, bold keywords, dates on the right.
 */
import { Document, Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { certifications } from "@/content/certifications";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { resumeSettings } from "@/content/resume";
import { site } from "@/content/site";
import { skillGroups } from "@/content/skills";

// Word does not hyphenate; keep whole words on a line.
Font.registerHyphenationCallback((word) => [word]);

const BODY = 11;
const s = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 36, paddingHorizontal: 36, fontFamily: "Times-Roman", fontSize: BODY, lineHeight: 1.2, color: "#000" },
  name: { fontFamily: "Times-Bold", fontSize: 12, textAlign: "center", textTransform: "uppercase" },
  contact: { fontSize: 10, textAlign: "center", marginTop: 2 },
  link: { color: "#1155CC", textDecoration: "underline" },
  section: { marginTop: 14 },
  heading: { fontFamily: "Times-Bold", fontSize: 12, textTransform: "uppercase", borderBottomWidth: 0.9, borderBottomColor: "#000", paddingBottom: 0, marginBottom: 2, lineHeight: 1.1 },
  justify: { textAlign: "justify" },
  bold: { fontFamily: "Times-Bold" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  bulletRow: { flexDirection: "row", paddingLeft: 18 },
  bulletDot: { width: 18 },
  bulletText: { flex: 1, textAlign: "justify" },
  block: { marginTop: 12 },
});

/**
 * Turns "plain **bold** plain" into styled runs. Punctuation right after a bold
 * phrase ("**Sentry**,") is kept in the same run so it never wraps onto its own line.
 */
function Rich({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p.startsWith("**") && p.endsWith("**")) {
      const next = parts[i + 1] ?? "";
      const glue = next.match(/^[^\s]+/)?.[0] ?? "";
      if (glue) parts[i + 1] = next.slice(glue.length);
      out.push(
        <Text key={i} style={s.bold}>
          {p.slice(2, -2) + glue}
        </Text>,
      );
    } else if (p) {
      out.push(<Text key={i}>{p}</Text>);
    }
  }
  return <>{out}</>;
}

function Bullets({ items }: { items: string[] }) {
  return (
    <View>
      {items.filter(Boolean).map((b, i) => (
        <View key={i} style={s.bulletRow} wrap={false}>
          <Text style={s.bulletDot}>•</Text>
          <Text style={s.bulletText}><Rich text={b} /></Text>
        </View>
      ))}
    </View>
  );
}

function Heading({ children }: { children: string }) {
  return <Text style={s.heading}>{children}</Text>;
}

const display = (url: string) => url;

export function ResumeDocument() {
  const resumeSkills = skillGroups.filter((g) => g.resume && g.skills.length);
  const resumeProjects = projects.filter((p) => p.onResume);
  const contact = [
    { text: site.email, href: `mailto:${site.email}` },
    resumeSettings.phone ? { text: resumeSettings.phone } : null,
    site.linkedin ? { text: display(site.linkedin), href: site.linkedin } : null,
  ].filter(Boolean) as { text: string; href?: string }[];

  return (
    <Document title={`${site.fullName} – Resume`} author={site.fullName} subject="Resume" creator={site.url}>
      <Page size="A4" style={s.page}>
        <Text style={s.name}>{site.fullName}</Text>
        <Text style={s.contact}>
          {contact.map((c, i) => (
            <Text key={i}>
              {i > 0 && <Text> | </Text>}
              {c.href ? <Link src={c.href} style={s.link}>{c.text}</Link> : <Text>{c.text}</Text>}
            </Text>
          ))}
        </Text>

        {resumeSettings.summary ? (
          <View style={s.section}>
            <Heading>{resumeSettings.summaryHeading}</Heading>
            <Text style={s.justify}><Rich text={resumeSettings.summary} /></Text>
          </View>
        ) : null}

        {resumeSkills.length > 0 && (
          <View style={s.section}>
            <Heading>Technical Skills</Heading>
            {resumeSkills.map((g) => (
              <Text key={g.title}><Text style={s.bold}>{g.title}: </Text>{g.skills.join(", ")}</Text>
            ))}
          </View>
        )}

        {experience.length > 0 && (
          <View style={s.section}>
            <Heading>Experience</Heading>
            {experience.map((job, i) => {
              const place = job.location && !/usa|united states/i.test(job.location) ? `, ${job.location}` : "";
              return (
                <View key={i} style={i > 0 ? s.block : undefined}>
                  <View style={s.row} wrap={false}>
                    <Text style={s.bold}>{job.role} - {job.company}{place}</Text>
                    <Text style={s.bold}>{job.start} – {job.end}</Text>
                  </View>
                  <Bullets items={job.responsibilities} />
                </View>
              );
            })}
          </View>
        )}

        {resumeProjects.length > 0 && (
          <View style={s.section}>
            <Heading>Projects</Heading>
            {resumeProjects.map((p, i) => (
              <View key={p.slug} style={i > 0 ? s.block : undefined}>
                <Text style={s.bold}>{p.title}</Text>
                <Bullets items={p.resumeBullets.length ? p.resumeBullets : [...p.contribution, ...p.results]} />
              </View>
            ))}
          </View>
        )}

        {certifications.length > 0 && (
          <View style={s.section} wrap={false}>
            <Heading>Certifications</Heading>
            {certifications.map((c) => <Text key={c.title} style={s.bold}>{c.title}</Text>)}
          </View>
        )}

        {education.length > 0 && (
          <View style={s.section} wrap={false}>
            <Heading>Education</Heading>
            {education.map((e, i) => (
              <View key={i} style={i > 0 ? { marginTop: 4 } : undefined}>
                <View style={s.row}>
                  <Text style={s.bold}>{e.institution}{e.location ? `, ${e.location.split(",")[0].trim()}` : ""}</Text>
                  <Text>{e.start} – {e.end}</Text>
                </View>
                <Text>{e.degree}{e.concentration ? ` (Concentration in ${e.concentration})` : ""}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
