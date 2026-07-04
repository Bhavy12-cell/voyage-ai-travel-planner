/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import crypto from "crypto";
import fs from "fs";
import { runOrchestrator } from "./src/agents/orchestrator";

// Load environment variables from .env file
dotenv.config();

const USERS_FILE = path.join(process.cwd(), "users.json");

interface User {
  email: string;
  name: string;
  salt: string;
  passwordHash: string;
}

interface Session {
  token: string;
  email: string;
  name: string;
  expiresAt: number;
}

let usersDb: Record<string, User> = {};
const sessionsDb: Record<string, Session> = {};

// Load users from users.json file on startup
try {
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    usersDb = JSON.parse(data);
    console.log(`[Auth] Loaded ${Object.keys(usersDb).length} users from users.json`);
  }
} catch (e) {
  console.error("[Auth] Failed to load users.json:", e);
}

// Function to save users to users.json file
function saveUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersDb, null, 2), "utf-8");
  } catch (e) {
    console.error("[Auth] Failed to save users.json:", e);
  }
}

// Helper to hash a password with pbkdf2
function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { salt, hash };
}

// Helper to verify a password
function verifyPassword(password: string, salt: string, hash: string): boolean {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return verifyHash === hash;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- AUTH ENDPOINTS ---

  // 1. Sign Up Route
  app.post("/api/auth/signup", (req, res) => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields (email, password, name)." });
      }

      const normalizedEmail = email.trim().toLowerCase();
      if (usersDb[normalizedEmail]) {
        return res.status(400).json({ error: "A user with this email already exists." });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
      }

      const { salt, hash } = hashPassword(password);
      usersDb[normalizedEmail] = {
        email: normalizedEmail,
        name: name.trim(),
        salt,
        passwordHash: hash
      };
      saveUsers();

      // Create session
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      sessionsDb[token] = {
        token,
        email: normalizedEmail,
        name: name.trim(),
        expiresAt
      };

      console.log(`[Auth] User signed up: ${normalizedEmail}`);
      return res.json({
        token,
        user: { email: normalizedEmail, name: name.trim() }
      });
    } catch (error: any) {
      console.error("[Signup Error]:", error);
      return res.status(500).json({ error: "Internal server error during signup." });
    }
  });

  // 2. Sign In Route
  app.post("/api/auth/signin", (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields (email, password)." });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const user = usersDb[normalizedEmail];
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const isValid = verifyPassword(password, user.salt, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      // Create session
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      sessionsDb[token] = {
        token,
        email: normalizedEmail,
        name: user.name,
        expiresAt
      };

      console.log(`[Auth] User signed in: ${normalizedEmail}`);
      return res.json({
        token,
        user: { email: normalizedEmail, name: user.name }
      });
    } catch (error: any) {
      console.error("[Signin Error]:", error);
      return res.status(500).json({ error: "Internal server error during signin." });
    }
  });

  // 3. Verify Session Route
  app.get("/api/auth/me", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized." });
      }

      const token = authHeader.split(" ")[1];
      const session = sessionsDb[token];
      if (!session || session.expiresAt < Date.now()) {
        if (session) delete sessionsDb[token];
        return res.status(401).json({ error: "Session expired or invalid." });
      }

      return res.json({
        user: { email: session.email, name: session.name }
      });
    } catch (error: any) {
      console.error("[Verify Session Error]:", error);
      return res.status(500).json({ error: "Internal server error during session verification." });
    }
  });

  // 4. Logout Route
  app.post("/api/auth/logout", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        delete sessionsDb[token];
      }
      return res.json({ success: true });
    } catch (error: any) {
      console.error("[Logout Error]:", error);
      return res.status(500).json({ error: "Internal server error during logout." });
    }
  });

  // API endpoint for multi-agent travel itinerary generation
  app.post("/api/plan-itinerary", async (req, res) => {
    try {
      // Validate session
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized. Please log in first." });
      }

      const token = authHeader.split(" ")[1];
      const session = sessionsDb[token];
      if (!session || session.expiresAt < Date.now()) {
        if (session) delete sessionsDb[token];
        return res.status(401).json({ error: "Session expired or invalid. Please log in again." });
      }

      const input = req.body;
      if (!input || !input.destination || !input.days || !input.budget) {
        return res.status(400).json({
          error: "Missing required parameters (destination, days, budget).",
        });
      }

      console.log(`[Server] Received plan request for ${input.destination}`);
      const result = await runOrchestrator({
        destination: input.destination,
        days: Number(input.days),
        budget: Number(input.budget),
        currency: input.currency || "USD",
        interests: input.interests || ["general"],
        travelers: Number(input.travelers || 1),
      });

      return res.json(result);
    } catch (error: any) {
      console.error("[Server API Error]:", error);
      
      const errorMessage = error.message || "";
      const isRateLimit = 
        error.status === 429 || 
        errorMessage.includes("429") || 
        errorMessage.toLowerCase().includes("quota") || 
        errorMessage.toLowerCase().includes("rate limit") || 
        errorMessage.includes("RESOURCE_EXHAUSTED");

      if (isRateLimit) {
        return res.status(429).json({
          error: "Daily API limit reached, please try again later.",
        });
      }

      return res.status(500).json({
        error:
          error.message ||
          "An unexpected error occurred. Please verify your GEMINI_API_KEY in Secrets.",
      });
    }
  });

  // Integrate Vite dev server or serve production bundle
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Running in DEVELOPMENT mode. Initializing Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Running in PRODUCTION mode. Serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
