import { useMemo } from "react";

import bitcoin from "@/assets/illustrations/bitcoin.svg?raw";
import bitcoinP2p from "@/assets/illustrations/bitcoin_p2p.svg?raw";
import wallet from "@/assets/illustrations/wallet.svg?raw";
import transferMoney from "@/assets/illustrations/transfer_money.svg?raw";
import investing from "@/assets/illustrations/investing.svg?raw";
import financialData from "@/assets/illustrations/financial_data.svg?raw";
import dataTrends from "@/assets/illustrations/data_trends.svg?raw";
import charts from "@/assets/illustrations/charts.svg?raw";
import analytics from "@/assets/illustrations/analytics.svg?raw";
import businessAnalytics from "@/assets/illustrations/business_analytics.svg?raw";
import growthAnalytics from "@/assets/illustrations/growth_analytics.svg?raw";
import predictiveAnalytics from "@/assets/illustrations/predictive_analytics.svg?raw";
import robotics from "@/assets/illustrations/robotics.svg?raw";
import insertBlock from "@/assets/illustrations/insert_block.svg?raw";
import security from "@/assets/illustrations/security.svg?raw";
import securityOn from "@/assets/illustrations/security_on.svg?raw";
import secureData from "@/assets/illustrations/secure_data.svg?raw";
import secureServer from "@/assets/illustrations/secure_server.svg?raw";
import server from "@/assets/illustrations/server.svg?raw";
import cloudHosting from "@/assets/illustrations/cloud_hosting.svg?raw";
import cloudSync from "@/assets/illustrations/cloud_sync.svg?raw";
import sync from "@/assets/illustrations/sync.svg?raw";
import devices from "@/assets/illustrations/devices.svg?raw";
import webDevices from "@/assets/illustrations/web_devices.svg?raw";
import windows from "@/assets/illustrations/windows.svg?raw";
import mobileApp from "@/assets/illustrations/mobile_app.svg?raw";
import dashboard from "@/assets/illustrations/dashboard.svg?raw";
import codeReview from "@/assets/illustrations/code_review.svg?raw";
import codeTyping from "@/assets/illustrations/code_typing.svg?raw";
import data from "@/assets/illustrations/data.svg?raw";
import dataReport from "@/assets/illustrations/data_report.svg?raw";
import visualData from "@/assets/illustrations/visual_data.svg?raw";
import pieChart from "@/assets/illustrations/pie_chart.svg?raw";
import community from "@/assets/illustrations/community.svg?raw";
import groupChat from "@/assets/illustrations/group_chat.svg?raw";
import workChat from "@/assets/illustrations/work_chat.svg?raw";
import instantSupport from "@/assets/illustrations/instant_support.svg?raw";
import activeSupport from "@/assets/illustrations/active_support.svg?raw";
import knowledge from "@/assets/illustrations/knowledge.svg?raw";
import learning from "@/assets/illustrations/learning.svg?raw";
import goal from "@/assets/illustrations/goal.svg?raw";
import target from "@/assets/illustrations/target.svg?raw";
import launching from "@/assets/illustrations/launching.svg?raw";
import login from "@/assets/illustrations/login.svg?raw";
import payments from "@/assets/illustrations/payments.svg?raw";
import creditCardPayment from "@/assets/illustrations/credit_card_payment.svg?raw";
import successfulPurchase from "@/assets/illustrations/successful_purchase.svg?raw";
import clickHere from "@/assets/illustrations/click_here.svg?raw";
import inProgress from "@/assets/illustrations/in_progress.svg?raw";

const PRIMARY = "#10b981";
const DARK = "#065f46";
const LIGHT = "#d1fae5";

function paint(svg: string): string {
  return svg
    .replace(/#3f3d56/gi, DARK)
    .replace(/#2f2e41/gi, DARK)
    .replace(/#e6e6e6/gi, LIGHT)
    .replace(/#f2f2f2/gi, "#ecfdf5")
    .replace(/#ffb8b8|#ffd1dc|#ff6584|#fbaaa2|#a0616a|#8d5524|#ffb9b9/gi, "#fcd9c0")
    .replace(/#6c63ff|#5f5fd6|#3a3a7a|#4d4dff|#6c5ce7|#3a0ca3|#4361ee|#4895ef/gi, PRIMARY)
    .replace(/#0bcea6|#00b894|#00cec9|#06d6a0/gi, PRIMARY)
    .replace(/#f9c5d1|#f9c5d0/gi, "#a7f3d0")
    .replace(/#ccc/gi, "#a7f3d0");
}

const LIBRARY: Record<string, string> = {
  bitcoin,
  "bitcoin-p2p": bitcoinP2p,
  wallet,
  "transfer-money": transferMoney,
  investing,
  "financial-data": financialData,
  "data-trends": dataTrends,
  charts,
  analytics,
  "business-analytics": businessAnalytics,
  "growth-analytics": growthAnalytics,
  "predictive-analytics": predictiveAnalytics,
  robotics,
  "insert-block": insertBlock,
  security,
  "security-on": securityOn,
  "secure-data": secureData,
  "secure-server": secureServer,
  server,
  "cloud-hosting": cloudHosting,
  "cloud-sync": cloudSync,
  sync,
  devices,
  "web-devices": webDevices,
  windows,
  "mobile-app": mobileApp,
  dashboard,
  "code-review": codeReview,
  "code-typing": codeTyping,
  data,
  "data-report": dataReport,
  "visual-data": visualData,
  "pie-chart": pieChart,
  community,
  "group-chat": groupChat,
  "work-chat": workChat,
  "instant-support": instantSupport,
  "active-support": activeSupport,
  knowledge,
  learning,
  goal,
  target,
  launching,
  login,
  payments,
  "credit-card-payment": creditCardPayment,
  "successful-purchase": successfulPurchase,
  "click-here": clickHere,
  "in-progress": inProgress,
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
  bitcoin,
  wallet,
  investing,
  financialData,
  dataTrends,
  analytics,
  businessAnalytics,
  growthAnalytics,
  predictiveAnalytics,
  robotics,
  security,
  securityOn,
  secureData,
  cloudSync,
  dashboard,
  community,
  groupChat,
  instantSupport,
  activeSupport,
  knowledge,
  learning,
  launching,
  payments,
  windows,
  devices,
  target,
  goal,
};
