import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getSessionId() {
  let sid = sessionStorage.getItem("visitor_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("visitor_sid", sid);
  }
  return sid;
}

function parseUserAgent(ua: string) {
  let browser = "Unknown";
  let os = "Unknown";
  let deviceType = "desktop";

  if (/Mobile|Android|iPhone|iPad/.test(ua)) deviceType = "mobile";
  if (/Tablet|iPad/.test(ua)) deviceType = "tablet";

  if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Edg")) browser = "Edge";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac OS")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

  return { browser, os, deviceType };
}

export function useVisitorTracking() {
  const location = useLocation();

  useEffect(() => {
    const ua = navigator.userAgent;
    const { browser, os, deviceType } = parseUserAgent(ua);

    supabase.from("visitor_logs").insert({
      session_id: getSessionId(),
      page_path: location.pathname,
      page_title: document.title,
      referrer: document.referrer || null,
      user_agent: ua,
      browser,
      os,
      device_type: deviceType,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      language: navigator.language,
    }).then(() => {});
  }, [location.pathname]);
}
