import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertStoreSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Signup endpoint
  app.post("/api/signup", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const { email, password, name, address } = result.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
        address,
        role: "user"
      });

      const { password: _, ...userWithoutPassword } = user;
      return res.status(201).json({ 
        message: "User created successfully", 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const { email, password } = result.data;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json({ 
        message: "Login successful", 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all users (Admin only)
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      return res.status(200).json(usersWithoutPasswords);
    } catch (error) {
      console.error("Get users error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user by ID (Admin only)
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create user (Admin only)
  app.post("/api/users", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const { email, password, name, address, role } = result.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await storage.createUser({
        email,
        password: hashedPassword,
        name,
        address,
        role: role || "user"
      });

      const { password: _, ...userWithoutPassword } = user;
      return res.status(201).json({ 
        message: "User created successfully", 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Create user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update user (Admin only)
  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const user = await storage.updateUser(req.params.id, updates);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json({ 
        message: "User updated successfully", 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Update user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete user (Admin only)
  app.delete("/api/users/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteUser(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all stores
  app.get("/api/stores", async (req, res) => {
    try {
      const stores = await storage.getAllStores();
      const storesWithoutPasswords = stores.map(({ password, ...store }) => store);
      return res.status(200).json(storesWithoutPasswords);
    } catch (error) {
      console.error("Get stores error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get store by ID
  app.get("/api/stores/:id", async (req, res) => {
    try {
      const store = await storage.getStore(req.params.id);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      const { password, ...storeWithoutPassword } = store;
      return res.status(200).json(storeWithoutPassword);
    } catch (error) {
      console.error("Get store error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create store (Admin only)
  app.post("/api/stores", async (req, res) => {
    try {
      const result = insertStoreSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const { email, password, name, address } = result.data;

      const existingStore = await storage.getStoreByEmail(email);
      if (existingStore) {
        return res.status(400).json({ message: "Store with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const store = await storage.createStore({
        email,
        password: hashedPassword,
        name,
        address
      });

      const { password: _, ...storeWithoutPassword } = store;
      return res.status(201).json({ 
        message: "Store created successfully", 
        store: storeWithoutPassword 
      });
    } catch (error) {
      console.error("Create store error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update store (Admin only)
  app.put("/api/stores/:id", async (req, res) => {
    try {
      const updates = req.body;
      
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }

      const store = await storage.updateStore(req.params.id, updates);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }

      const { password: _, ...storeWithoutPassword } = store;
      return res.status(200).json({ 
        message: "Store updated successfully", 
        store: storeWithoutPassword 
      });
    } catch (error) {
      console.error("Update store error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete store (Admin only)
  app.delete("/api/stores/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteStore(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Store not found" });
      }
      return res.status(200).json({ message: "Store deleted successfully" });
    } catch (error) {
      console.error("Delete store error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get dashboard stats (Admin only)
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      return res.status(200).json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
