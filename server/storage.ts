import { type User, type InsertUser, type Store, type InsertStore, type Rating } from "@shared/schema";
import { randomUUID } from "crypto";

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
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: string, store: Partial<InsertStore>): Promise<Store | undefined>;
  deleteStore(id: string): Promise<boolean>;
  
  getStats(): Promise<{ totalUsers: number; totalStores: number; totalRatings: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private stores: Map<string, Store>;
  private ratings: Map<string, Rating>;

  constructor() {
    this.users = new Map();
    this.stores = new Map();
    this.ratings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      role: insertUser.role || "user",
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...updates,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getStore(id: string): Promise<Store | undefined> {
    return this.stores.get(id);
  }

  async getStoreByEmail(email: string): Promise<Store | undefined> {
    return Array.from(this.stores.values()).find(
      (store) => store.email === email,
    );
  }

  async getAllStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const id = randomUUID();
    const store: Store = {
      ...insertStore,
      id,
      createdAt: new Date()
    };
    this.stores.set(id, store);
    return store;
  }

  async updateStore(id: string, updates: Partial<InsertStore>): Promise<Store | undefined> {
    const store = this.stores.get(id);
    if (!store) return undefined;

    const updatedStore: Store = {
      ...store,
      ...updates,
    };
    this.stores.set(id, updatedStore);
    return updatedStore;
  }

  async deleteStore(id: string): Promise<boolean> {
    return this.stores.delete(id);
  }

  async getStats(): Promise<{ totalUsers: number; totalStores: number; totalRatings: number }> {
    return {
      totalUsers: this.users.size,
      totalStores: this.stores.size,
      totalRatings: this.ratings.size,
    };
  }
}

export const storage = new MemStorage();
