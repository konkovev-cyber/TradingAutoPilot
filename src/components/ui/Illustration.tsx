import { useMemo } from "react";

import subscriptions from "undraw-svg/business-deal.svg?raw";
import businessShop from "undraw-svg/business-shop.svg?raw";
import clickInteraction from "undraw-svg/click-interaction.svg?raw";
import securityOn from "undraw-svg/security-on.svg?raw";
import sharingKnowledge from "undraw-svg/sharing-knowledge.svg?raw";
import instantSupport from "undraw-svg/instant-support.svg?raw";
import chatBot from "undraw-svg/chat-bot.svg?raw";
import windows from "undraw-svg/windows.svg?raw";
import investing from "undraw-svg/investing.svg?raw";
import dataAnalysis from "undraw-svg/data-analysis.svg?raw";
import robot from "undraw-svg/robotics.svg?raw";
import api from "undraw-svg/cloud-sync.svg?raw";
import strategy from "undraw-svg/adjust-settings.svg?raw";
import launch from "undraw-svg/launching.svg?raw";

const PRIMARY = "#10b981";
const SECONDARY = "#a7f3d0";
const TEXT = "#065f46";

function paint(svg: string): string {
  return svg
    .replace(/#3f3d56/gi, TEXT)
    .replace(/#2f2e41/gi, TEXT)
    .replace(/#e6e6e6/gi, "#d1fae5")
    .replace(/#f2f2f2/gi, "#ecfdf5")
    .replace(/#ffb8b8|#ffd1dc|#ff6584|#fbaaa2/gi, "#fcd9c0")
    .replace(/#6c63ff|#5f5fd6|#3a3a7a|#4d4dff|#6c5ce7/gi, PRIMARY)
    .replace(/#0bcea6|#00b894|#00cec9/gi, PRIMARY)
    .replace(/#ccc/gi, "#a7f3d0");
}

const LIBRARY: Record<string, string> = {
  subscriptions,
  "business-shop": businessShop,
  "click-interaction": clickInteraction,
  "security-on": securityOn,
  "sharing-knowledge": sharingKnowledge,
  "instant-support": instantSupport,
  "chat-bot": chatBot,
  windows,
  investing,
  "data-analysis": dataAnalysis,
  robotics: robot,
  "cloud-sync": api,
  "adjust-settings": strategy,
  launching: launch,
};

export const ILLUSTRATION_NAMES = Object.keys(LIBRARY);

interface IllustrationProps {
  name?: string;
  fallback: string;
  className?: string;
  title?: string;
}

export function Illustration({ name, fallback, className = "", title }: IllustrationProps) {
  const key = String(name ?? "").toLowerCase().trim();
  const raw = LIBRARY[key] || fallback;
  const html = useMemo(() => paint(raw), [raw]);
  return (
    <div
      role="img"
      aria-label={title}
      className={`illustration [&>svg]:h-auto [&>svg]:w-full [&>svg]:max-h-full ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export {
  subscriptions,
  businessShop,
  clickInteraction,
  securityOn,
  sharingKnowledge,
  instantSupport,
  chatBot,
  windows,
  investing,
  dataAnalysis,
  robot,
  api,
  strategy,
  launch,
};
