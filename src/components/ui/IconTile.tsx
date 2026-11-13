import {
  BadgeDollarSign,
  Building2,
  MousePointerClick,
  ShieldCheck,
  BookOpen,
  Headset,
  MessageCircle,
  Monitor,
  Clock,
  Brain,
  Zap,
  Workflow,
  Bot,
  Cable,
  SlidersHorizontal,
  Play,
  TrendingUp,
  LineChart,
  Target,
  Rocket,
  Coins,
  Gauge,
  Lock,
  Sparkles,
  Cpu,
  Globe2,
  Users,
  LifeBuoy,
  FileText,
  Wallet,
  Activity,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  "badge-dollar-sign": BadgeDollarSign,
  "building-2": Building2,
  "mouse-pointer-click": MousePointerClick,
  "shield-check": ShieldCheck,
  "book-open": BookOpen,
  headset: Headset,
  "message-circle": MessageCircle,
  monitor: Monitor,
  clock: Clock,
  brain: Brain,
  zap: Zap,
  workflow: Workflow,
  bot: Bot,
  plug: Cable,
  settings: SlidersHorizontal,
  play: Play,
  "trending-up": TrendingUp,
  "line-chart": LineChart,
  target: Target,
  rocket: Rocket,
  coins: Coins,
  gauge: Gauge,
  lock: Lock,
  sparkles: Sparkles,
  cpu: Cpu,
  globe: Globe2,
  users: Users,
  lifebuoy: LifeBuoy,
  "file-text": FileText,
  wallet: Wallet,
  activity: Activity,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

const GRADIENTS = [
  "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
  "linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)",
  "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
  "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
  "linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)",
  "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
];

export function gradientFor(index: number): string {
  return GRADIENTS[index % GRADIENTS.length];
}

interface IconTileProps {
  name?: string;
  fallback: LucideIcon;
  index?: number;
  size?: number;
  className?: string;
}

export function IconTile({ name, fallback, index = 0, size = 22, className = "" }: IconTileProps) {
  const key = String(name ?? "").toLowerCase().trim();
  const Icon = (key && ICON_MAP[key]) || fallback;
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-2xl ${className}`}
      style={{ background: gradientFor(index) }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl opacity-40"
        style={{ background: "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.55), transparent 60%)" }}
      />
      <Icon size={size} strokeWidth={2.2} className="relative text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]" />
    </div>
  );
}
