import {
  IconReceipt2,
  IconBuildingStore,
  IconClick,
  IconShieldLock,
  IconBook2,
  IconHeadset,
  IconMessageCircle2,
  IconDeviceDesktop,
  IconClockHour4,
  IconBrain,
  IconBolt,
  IconSettingsAutomation,
  IconRobot,
  IconApi,
  IconAdjustmentsHorizontal,
  IconPlayerPlay,
  IconTrendingUp,
  IconChartDots3,
  IconTargetArrow,
  IconRocket,
  IconCoins,
  IconGauge,
  IconLock,
  IconSparkles,
  IconCpu,
  IconWorld,
  IconUsersGroup,
  IconLifebuoy,
  IconFileText,
  IconWallet,
  IconActivity,
  type Icon,
} from "@tabler/icons-react";

export const ICON_MAP: Record<string, Icon> = {
  "badge-dollar-sign": IconReceipt2,
  "building-2": IconBuildingStore,
  "mouse-pointer-click": IconClick,
  "shield-check": IconShieldLock,
  "book-open": IconBook2,
  headset: IconHeadset,
  "message-circle": IconMessageCircle2,
  monitor: IconDeviceDesktop,
  clock: IconClockHour4,
  brain: IconBrain,
  zap: IconBolt,
  workflow: IconSettingsAutomation,
  bot: IconRobot,
  plug: IconApi,
  settings: IconAdjustmentsHorizontal,
  play: IconPlayerPlay,
  "trending-up": IconTrendingUp,
  "line-chart": IconChartDots3,
  target: IconTargetArrow,
  rocket: IconRocket,
  coins: IconCoins,
  gauge: IconGauge,
  lock: IconLock,
  sparkles: IconSparkles,
  cpu: IconCpu,
  globe: IconWorld,
  users: IconUsersGroup,
  lifebuoy: IconLifebuoy,
  "file-text": IconFileText,
  wallet: IconWallet,
  activity: IconActivity,
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
  fallback: Icon;
  index?: number;
  size?: number;
  className?: string;
}

export function IconTile({ name, fallback, index = 0, size = 22, className = "" }: IconTileProps) {
  const key = String(name ?? "").toLowerCase().trim();
  const TablerIcon = (key && ICON_MAP[key]) || fallback;
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
      <TablerIcon
        size={size}
        stroke={1.9}
        className="relative text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)]"
      />
    </div>
  );
}
