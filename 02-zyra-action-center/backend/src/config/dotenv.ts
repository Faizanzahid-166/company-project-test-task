// src/config/dotenv.ts

import dotenv from "dotenv";
import path from "path";
import dns from "dns";

// Use process.cwd() so this works with CommonJS and ts-node-dev
dotenv.config({
  path: path.join(process.cwd(), ".env"), // points to your project root
});

// FIX: Override DNS servers (CRITICAL for mongodb+srv)
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
  console.log("🌐 DNS override enabled (dev only)");
}

console.log("✅ .env loaded");