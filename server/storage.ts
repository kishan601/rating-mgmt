import { type User, type InsertUser, type Store, type InsertStore, type Rating, type InsertRating, users, stores, ratings } from "@shared/schema";
import { db } from "./db";
import { eq, sql, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  
  getStore(id: string): Promise<Store | undefined>;
  getStoreByEmail(email: string): Promise<Store | undefined>;
  getAllStores(): Promise<Store[]>;
  getAllStoresWithRatings(): Promise<any[]>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: string, store: Partial<InsertStore>): Promise<Store | undefined>;
  deleteStore(id: string): Promise<boolean>;
  
  submitRating(rating: InsertRating): Promise<Rating>;
  updateRating(id: string, ratingValue: number): Promise<Rating | undefined>;
  getRatingsByStore(storeId: string): Promise<Rating[]>;
  getRatingsByUser(userId: string): Promise<Rating[]>;
  getUserRatingForStore(userId: string, storeId: string): Promise<Rating | undefined>;
  getStoreAverageRating(storeId: string): Promise<number>;
  
  getStats(): Promise<{ totalUsers: number; totalStores: number; totalRatings: number }>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      ...insertUser,
      role: insertUser.role || "user",
    }).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async getStore(id: string): Promise<Store | undefined> {
    const result = await db.select().from(stores).where(eq(stores.id, id));
    return result[0];
  }

  async getStoreByEmail(email: string): Promise<Store | undefined> {
    const result = await db.select().from(stores).where(eq(stores.email, email));
    return result[0];
  }

  async getAllStores(): Promise<Store[]> {
    return db.select().from(stores);
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const result = await db.insert(stores).values(insertStore).returning();
    return result[0];
  }

  async updateStore(id: string, updates: Partial<InsertStore>): Promise<Store | undefined> {
    const result = await db.update(stores)
      .set(updates)
      .where(eq(stores.id, id))
      .returning();
    return result[0];
  }

  async deleteStore(id: string): Promise<boolean> {
    const result = await db.delete(stores).where(eq(stores.id, id)).returning();
    return result.length > 0;
  }

  async getStats(): Promise<{ totalUsers: number; totalStores: number; totalRatings: number }> {
    const [userCount] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    const [storeCount] = await db.select({ count: sql<number>`count(*)::int` }).from(stores);
    const [ratingCount] = await db.select({ count: sql<number>`count(*)::int` }).from(ratings);

    return {
      totalUsers: userCount.count || 0,
      totalStores: storeCount.count || 0,
      totalRatings: ratingCount.count || 0,
    };
  }

  async getAllStoresWithRatings(): Promise<any[]> {
    const allStores = await db.select().from(stores);
    
    const storesWithRatings = await Promise.all(
      allStores.map(async (store) => {
        const averageRating = await this.getStoreAverageRating(store.id);
        const { password, ...storeWithoutPassword } = store;
        return {
          ...storeWithoutPassword,
          averageRating,
        };
      })
    );

    return storesWithRatings;
  }

  async submitRating(insertRating: InsertRating): Promise<Rating> {
    const existing = await this.getUserRatingForStore(insertRating.userId, insertRating.storeId);
    
    if (existing) {
      const result = await db.update(ratings)
        .set({ 
          rating: insertRating.rating,
          updatedAt: new Date()
        })
        .where(eq(ratings.id, existing.id))
        .returning();
      return result[0];
    }

    const result = await db.insert(ratings).values(insertRating).returning();
    return result[0];
  }

  async updateRating(id: string, ratingValue: number): Promise<Rating | undefined> {
    const result = await db.update(ratings)
      .set({ 
        rating: ratingValue,
        updatedAt: new Date()
      })
      .where(eq(ratings.id, id))
      .returning();
    return result[0];
  }

  async getRatingsByStore(storeId: string): Promise<Rating[]> {
    return db.select().from(ratings).where(eq(ratings.storeId, storeId));
  }

  async getRatingsByUser(userId: string): Promise<Rating[]> {
    return db.select().from(ratings).where(eq(ratings.userId, userId));
  }

  async getUserRatingForStore(userId: string, storeId: string): Promise<Rating | undefined> {
    const result = await db.select()
      .from(ratings)
      .where(and(eq(ratings.userId, userId), eq(ratings.storeId, storeId)));
    return result[0];
  }

  async getStoreAverageRating(storeId: string): Promise<number> {
    const result = await db.select({ 
      avg: sql<number>`COALESCE(AVG(${ratings.rating}), 0)::float` 
    })
    .from(ratings)
    .where(eq(ratings.storeId, storeId));
    
    return result[0]?.avg || 0;
  }
}

export const storage = new DbStorage();
