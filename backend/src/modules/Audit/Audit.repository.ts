import { mongoProvider } from '../../infra/database/MongoProvider.js';

export interface AuditLog {
  userId?: string;
  userEmail?: string;
  action: string;
  method: string;
  path: string;
  payload: Record<string, unknown>;
  statusCode: number;
  timestamp: Date;
  ip?: string;
}

export class AuditRepository {
  private static collectionName = 'audit_logs';

  static async create(log: AuditLog) {
    const db = mongoProvider.getDb();
    const collection = db.collection(this.collectionName);
    
    await collection.insertOne({
      ...log,
      timestamp: log.timestamp || new Date()
    });
  }

  static async listAll() {
    const db = mongoProvider.getDb();
    return db.collection(this.collectionName).find().sort({ timestamp: -1 }).toArray();
  }
}
