import { Db, MongoClient } from 'mongodb';
import { CONFIG } from '../../shared/config/env.js';

class MongoProvider {
  private client: MongoClient;
  private db: Db | null = null;

  constructor() {
    this.client = new MongoClient(CONFIG.MONGO_URL);
  }

  async connect(): Promise<Db> {
    if (this.db) return this.db;

    try {
      await this.client.connect();
      this.db = this.client.db();
      console.log('[mongodb]: Connected successfully');
      return this.db;
    } catch (err) {
      console.error('[mongodb]: Connection error', err);
      throw err;
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error('Mongo database not initialized. Call connect() first.');
    }
    return this.db;
  }

  async disconnect(): Promise<void> {
    await this.client.close();
    this.db = null;
  }
}

export const mongoProvider = new MongoProvider();
