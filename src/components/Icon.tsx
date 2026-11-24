import {
  Activity, AppWindow, Cloud, Code2, Container, Database, Layers, Plug, Server, ShieldCheck, Workflow,
  type LucideIcon,
} from "lucide-react";

/** Register icons by name so content files can reference them as strings. */
const icons: Record<string, LucideIcon> = {
  Activity, AppWindow, Cloud, Code2, Container, Database, Layers, Plug, Server, ShieldCheck, Workflow,
};

export function Icon({ name, size = 20, className }: { name: string; size?: number; className?: string }) {
  const Cmp = icons[name] ?? Code2;
  return <Cmp size={size} className={className} aria-hidden="true" strokeWidth={1.6} />;
}
