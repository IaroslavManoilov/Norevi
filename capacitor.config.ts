import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.norevi.app",
  appName: "Norevi",
  webDir: "public",
  server: {
    // Use deployed URL for Android app (WebView)
    url: "https://norevi.vercel.app",
    cleartext: false,
  },
};

export default config;
