import {
  Activity, Bell, Boxes, CalendarClock, CheckCircle2, Cloud, Database, FileBarChart, FileCode2, KeyRound,
  LayoutDashboard, Rocket, Server, ShieldCheck, TriangleAlert, Webhook, Zap, type LucideIcon,
} from "lucide-react";
import type { DiagramKey } from "@/content/projects";

type Node = { icon: LucideIcon; label: string; sub?: string };
type Spec = { main: Node[]; side?: { title: string; nodes: Node[] } };

/** Architecture illustrations drawn from the components named in the resume. */
const specs: Record<DiagramKey, Spec> = {
  etl: {
    main: [
      { icon: Boxes, label: "Data sources", sub: "Infrastructure records" },
      { icon: CalendarClock, label: "EventBridge", sub: "On asset change" },
      { icon: Zap, label: "Lambda", sub: "Python ETL + validation" },
      { icon: Database, label: "DynamoDB", sub: "Reconciled records" },
    ],
    side: { title: "Observability", nodes: [{ icon: Activity, label: "CloudWatch" }, { icon: Bell, label: "SNS alerts" }] },
  },
  monitoring: {
    main: [
      { icon: Server, label: "Backend workflows", sub: "Production records" },
      { icon: FileCode2, label: "Python checks", sub: "Validation rules" },
      { icon: TriangleAlert, label: "Exceptions", sub: "Missing / inconsistent" },
      { icon: FileBarChart, label: "Downstream", sub: "Reporting" },
    ],
    side: { title: "Dashboards", nodes: [{ icon: Activity, label: "CloudWatch" }, { icon: LayoutDashboard, label: "Grafana" }] },
  },
  deploy: {
    main: [
      { icon: Rocket, label: "Release", sub: "New deployment" },
      { icon: Activity, label: "Health checks", sub: "Python" },
      { icon: CheckCircle2, label: "Validation", sub: "Python scripts" },
      { icon: Cloud, label: "Live on AWS", sub: "Cloud-hosted app" },
    ],
    side: { title: "Monitoring", nodes: [{ icon: LayoutDashboard, label: "Grafana" }, { icon: TriangleAlert, label: "Sentry" }] },
  },
  identity: {
    main: [
      { icon: Server, label: "Client app", sub: "Integrated service" },
      { icon: KeyRound, label: "Identity", sub: "OAuth 2.0 · OIDC · SAML" },
      { icon: ShieldCheck, label: "REST API", sub: "Token validated" },
      { icon: Webhook, label: "Webhooks", sub: "Connected services" },
    ],
    side: { title: "Debugging", nodes: [{ icon: FileCode2, label: "Postman" }, { icon: FileCode2, label: "curl" }] },
  },
  reconcile: {
    main: [
      { icon: Boxes, label: "12,000+ resources", sub: "Managed IT estate" },
      { icon: FileCode2, label: "Python", sub: "Reconcile + validate" },
      { icon: Database, label: "SQL Server", sub: "Relational data" },
      { icon: FileBarChart, label: "SSRS", sub: "Reports" },
    ],
  },
};

export function Diagram({ kind, compact = false }: { kind: DiagramKey; compact?: boolean }) {
  const spec = specs[kind];
  return (
    <figure
      className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-surface to-bg p-5 ring-1 ring-line/[0.06] sm:p-8"
      aria-label={`Architecture diagram: ${spec.main.map((n) => n.label).join(" → ")}`}
    >
      <div className="grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className={`relative flex items-stretch ${compact ? "flex-row gap-3 sm:gap-4" : "flex-col gap-4 sm:flex-row sm:gap-5"}`}>
        {spec.main.map((n, i) => (
          <div key={n.label} className="relative flex min-w-0 flex-1 basis-0">
            <NodeBox node={n} compact={compact} />
            {i < spec.main.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute ${
                  compact
                    ? "flow-x left-full top-1/2 h-[2px] w-3 sm:w-4"
                    : "flow-y left-9 top-full h-4 w-[2px] sm:flow-x sm:left-full sm:top-1/2 sm:h-[2px] sm:w-5"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      {spec.side && !compact && (
        <div className="relative mt-6 flex flex-wrap items-center gap-3 border-t border-dashed border-line/10 pt-5">
          <span className="eyebrow mr-1">{spec.side.title}</span>
          {spec.side.nodes.map((n) => (
            <span key={n.label} className="chip gap-1.5 bg-elevated">
              <n.icon size={14} aria-hidden="true" /> {n.label}
            </span>
          ))}
        </div>
      )}
    </figure>
  );
}

function NodeBox({ node, compact }: { node: Node; compact: boolean }) {
  return (
    <div className={`flex w-full items-center rounded-2xl bg-elevated ring-1 ring-line/[0.07] ${compact ? "flex-col justify-center px-1.5 py-3 text-center" : "flex-row gap-3 px-4 py-3 text-left sm:flex-col sm:justify-center sm:gap-0 sm:px-3 sm:py-4 sm:text-center"}`}>
      <span className={`grid shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ${compact ? "h-8 w-8" : "h-10 w-10"}`}>
        <node.icon size={compact ? 16 : 19} aria-hidden="true" strokeWidth={1.7} />
      </span>
      <span className={compact ? "" : "sm:contents"}>
        <span className={`block font-medium leading-tight ${compact ? "mt-2 text-[11px]" : "text-sm sm:mt-2"}`}>{node.label}</span>
        {node.sub && !compact && <span className="mt-0.5 block text-xs leading-snug text-muted sm:mt-1">{node.sub}</span>}
      </span>
    </div>
  );
}
