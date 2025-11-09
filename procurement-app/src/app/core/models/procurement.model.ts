// Inventory Models
export interface InventoryItem {
  id: string;
  name: string;
  type: string;
  specifications: Record<string, any>;
  availableQuantity: number;
  bookValue: number;
}

export interface InventoryStats {
  totalItems: number;
  totalQuantity: number;
  totalValue: number;
  itemsByType: Record<string, number>;
}

// Purchase Order Models
export interface PurchaseOrder {
  poNumber: string;
  itemName: string;
  itemType: string;
  specifications?: Record<string, any>;
  quantity: number;
  amount: number;
  requesterEmail: string;
  requesterRole: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
}

export interface ProcurementStats {
  totalOrders: number;
  totalAmount: number;
  ordersByStatus: Record<string, number>;
  ordersByType: Record<string, number>;
}

// General Ledger Models
export interface GLEntry {
  id: number;
  transactionType: 'ALLOCATION' | 'PURCHASE';
  accountDebit: string;
  accountCredit: string;
  amount: number;
  referenceNumber: string;
  requesterEmail: string;
  transactionDate: string;
  description: string;
}

export interface GLStats {
  totalEntries: number;
  totalAmount: number;
  entriesByType: Record<string, number>;
  amountByType: Record<string, number>;
}
