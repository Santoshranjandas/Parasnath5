
import { User, Expense, Issue, Vendor, Notice, PaymentRecord, Task, AGMSession } from '../types';

/**
 * Parasnath Nagari API Client
 * Optimized for Vercel Deployment.
 */

// If we are on Vercel, we use relative paths (/api). 
// If we are local, we use our local dev server.
const isProduction = window.location.hostname !== 'localhost';
const BASE_URL = isProduction ? '/api' : 'http://localhost:8000'; 

const SIMULATE_DELAY = 600;

// Simulation helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<{ user: User, access_token: string }> => {
      await delay(SIMULATE_DELAY);
      const mockUser: User = {
        id: '1',
        fullName: 'Abhishek Jha',
        email,
        role: 'admin',
        flatId: '501'
      };
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { user: mockUser, access_token: token };
    },
    logout: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  expenses: {
    list: async (): Promise<Expense[]> => {
      await delay(SIMULATE_DELAY);
      const saved = localStorage.getItem('expenses');
      return saved ? JSON.parse(saved) : [];
    },
    create: async (data: Omit<Expense, 'id'>): Promise<Expense> => {
      await delay(SIMULATE_DELAY);
      const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
      const newExpense = { ...data, id: `EXP-${Date.now()}` };
      expenses.unshift(newExpense);
      localStorage.setItem('expenses', JSON.stringify(expenses));
      return newExpense;
    }
  },

  notices: {
    list: async (): Promise<Notice[]> => {
      await delay(SIMULATE_DELAY);
      const saved = localStorage.getItem('notices');
      return saved ? JSON.parse(saved) : [];
    },
    markRead: async (id: string): Promise<void> => {
      const notices = JSON.parse(localStorage.getItem('notices') || '[]');
      const updated = notices.map((n: Notice) => n.id === id ? { ...n, isRead: true, isNew: false } : n);
      localStorage.setItem('notices', JSON.stringify(updated));
    }
  },

  issues: {
    list: async (): Promise<Issue[]> => {
      await delay(SIMULATE_DELAY);
      const saved = localStorage.getItem('issues');
      return saved ? JSON.parse(saved) : [];
    },
    create: async (data: Omit<Issue, 'id' | 'status' | 'createdAt'>): Promise<Issue> => {
      await delay(SIMULATE_DELAY);
      const issues = JSON.parse(localStorage.getItem('issues') || '[]');
      const newIssue: Issue = {
        ...data,
        id: `TKT-${Math.floor(100 + Math.random() * 899)}`,
        status: 'Pending',
        createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      issues.unshift(newIssue);
      localStorage.setItem('issues', JSON.stringify(issues));
      return newIssue;
    }
  },

  payments: {
    list: async (): Promise<PaymentRecord[]> => {
      await delay(SIMULATE_DELAY);
      const saved = localStorage.getItem('payments');
      return saved ? JSON.parse(saved) : [];
    },
    uploadProof: async (paymentId: string, fileName: string): Promise<void> => {
      await delay(SIMULATE_DELAY);
      const payments = JSON.parse(localStorage.getItem('payments') || '[]');
      const updated = payments.map((p: PaymentRecord) => 
        p.id === paymentId ? { ...p, status: 'Paid', proofUrl: fileName } : p
      );
      localStorage.setItem('payments', JSON.stringify(updated));
    }
  },

  tasks: {
    list: async (): Promise<Task[]> => {
      await delay(SIMULATE_DELAY);
      const saved = localStorage.getItem('tasks');
      return saved ? JSON.parse(saved) : [];
    },
    toggle: async (id: string): Promise<void> => {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const updated = tasks.map((t: Task) => 
        t.id === id ? { ...t, status: t.status === 'Pending' ? 'Completed' : 'Pending' } : t
      );
      localStorage.setItem('tasks', JSON.stringify(updated));
    }
  },

  agm: {
    get: async (year: number): Promise<AGMSession | null> => {
      await delay(SIMULATE_DELAY);
      const saved = localStorage.getItem('agm_data');
      const allAgm = saved ? JSON.parse(saved) : [];
      return allAgm.find((a: AGMSession) => a.year === year) || null;
    }
  },

  vendors: {
    list: async (): Promise<Vendor[]> => {
      await delay(SIMULATE_DELAY);
      const saved = localStorage.getItem('vendors');
      return saved ? JSON.parse(saved) : [];
    },
    create: async (data: Omit<Vendor, 'id' | 'status'>): Promise<Vendor> => {
      await delay(SIMULATE_DELAY);
      const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
      const newVendor: Vendor = {
        ...data,
        id: `${Math.floor(100 + Math.random() * 899)}`,
        status: 'Active'
      };
      vendors.unshift(newVendor);
      localStorage.setItem('vendors', JSON.stringify(vendors));
      return newVendor;
    }
  }
};
