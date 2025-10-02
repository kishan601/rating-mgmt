import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertStoreSchema, insertRatingSchema } from "@shared/schema";
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

  // Login endpoint (for both users and stores)
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

      // First, try to find user
      const user = await storage.getUserByEmail(email);
      if (user) {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ 
          message: "Login successful", 
          user: userWithoutPassword 
        });
      }

      // If not found in users, try stores
      const store = await storage.getStoreByEmail(email);
      if (store) {
        const isPasswordValid = await bcrypt.compare(password, store.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const { password: _, ...storeWithoutPassword } = store;
        return res.status(200).json({ 
          message: "Login successful", 
          user: { 
            ...storeWithoutPassword, 
            role: "store"
          } 
        });
      }

      return res.status(401).json({ message: "Invalid email or password" });
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

  // Get all stores with ratings
  app.get("/api/stores-with-ratings", async (req, res) => {
    try {
      const stores = await storage.getAllStoresWithRatings();
      return res.status(200).json(stores);
    } catch (error) {
      console.error("Get stores with ratings error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Submit or update rating
  app.post("/api/ratings", async (req, res) => {
    try {
      const result = insertRatingSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: result.error.flatten().fieldErrors 
        });
      }

      const rating = await storage.submitRating(result.data);
      return res.status(201).json({ 
        message: "Rating submitted successfully", 
        rating 
      });
    } catch (error) {
      console.error("Submit rating error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update rating
  app.put("/api/ratings/:id", async (req, res) => {
    try {
      const { rating: ratingValue } = req.body;
      
      if (typeof ratingValue !== 'number' || ratingValue < 1 || ratingValue > 5) {
        return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
      }

      const rating = await storage.updateRating(req.params.id, ratingValue);
      if (!rating) {
        return res.status(404).json({ message: "Rating not found" });
      }

      return res.status(200).json({ 
        message: "Rating updated successfully", 
        rating 
      });
    } catch (error) {
      console.error("Update rating error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get ratings for a store with user details
  app.get("/api/stores/:id/ratings", async (req, res) => {
    try {
      const ratings = await storage.getRatingsByStore(req.params.id);
      
      const ratingsWithUserDetails = await Promise.all(
        ratings.map(async (rating) => {
          const user = await storage.getUser(rating.userId);
          return {
            ...rating,
            userName: user?.name || "Unknown",
            userEmail: user?.email || "Unknown",
          };
        })
      );

      return res.status(200).json(ratingsWithUserDetails);
    } catch (error) {
      console.error("Get store ratings error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get ratings by user
  app.get("/api/users/:userId/ratings", async (req, res) => {
    try {
      const ratings = await storage.getRatingsByUser(req.params.userId);
      return res.status(200).json(ratings);
    } catch (error) {
      console.error("Get user ratings error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get user's rating for a specific store
  app.get("/api/users/:userId/stores/:storeId/rating", async (req, res) => {
    try {
      const rating = await storage.getUserRatingForStore(req.params.userId, req.params.storeId);
      return res.status(200).json(rating || null);
    } catch (error) {
      console.error("Get user store rating error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
