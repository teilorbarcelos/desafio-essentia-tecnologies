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

const collectionName = 'audit_logs';

export const AuditRepository = {
  async create(log: AuditLog) {
    const db = mongoProvider.getDb();
    const collection = db.collection(collectionName);
    
    await collection.insertOne({
      ...log,
      timestamp: log.timestamp
    });
  },

  async listAll() {
    const db = mongoProvider.getDb();
    return db.collection(collectionName).find().sort({ timestamp: -1 }).toArray();
  }
};
