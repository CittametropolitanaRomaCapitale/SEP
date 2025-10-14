import Dexie, { Table } from 'dexie';
import { DBError } from './tables/DBError';

export class DexieDB extends Dexie {
  errors!: Table<DBError>;

  constructor() {
    super('cmrc');
    this.version(1).stores({
      errors: '++id, createdDate, message, *type, resolved'
    });
    this.version(2).stores({
      errors: '++id, createdDate, message, *type, arguments, stack, resolved'
    });
  }
}

export const db = new DexieDB();
