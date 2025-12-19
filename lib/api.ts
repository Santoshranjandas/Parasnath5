
import { User, Expense, Issue, Vendor, Notice, PaymentRecord, Task, AGMSession } from '../types';

/**
 * Parasnath Nagari API Client
 * Integrated with FastAPI Backend.
 */

// If we are in the Aistudio environment, BASE_URL should be empty so rewrites in vercel.json work
// If we are local, we might need localhost:8000
const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
const BASE_URL = isProduction ? '' : 'http://localhost:8000'; 

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  
  if (!response.ok) {
    let errorDetail = 'API request failed';
    try {
      const error = await response.json();
      errorDetail = error.detail || errorDetail;
    } catch (e) {
      // Not JSON
    }
    throw new Error(errorDetail);
  }
  
  return response.json();
}

export const api = {
  auth: {
    login: async (email: string, password: string): Promise<{ user: User, access_token: string }> => {
      const data = await request<{ user: User, access_token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    },
    logout: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  expenses: {
    list: async (): Promise<Expense[]> => {
      return request<Expense[]>('/api/expenses');
    },
    create: async (data: Omit<Expense, 'id'>): Promise<Expense> => {
      return request<Expense>('/api/expenses', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  },

  notices: {
    list: async (): Promise<Notice[]> => {
      const notices = await request<any[]>('/api/notices');
      // Map database snake_case or standard fields to frontend camelCase
      return notices.map(n => ({
        id: String(n.id),
        title: n.title,
        content: n.content,
        type: n.type || 'Announcement',
        postedAt: n.posted_at ? new Date(n.posted_at).toLocaleDateString() : 'Just now',
        postedBy: n.posted_by || 'Admin',
        tags: ['Society'],
        isRead: false
      }));
    },
    markRead: async (id: string): Promise<void> => {
      console.log('Marking read:', id);
    }
  },

  issues: {
    list: async (): Promise<Issue[]> => {
      return request<Issue[]>('/api/issues');
    },
    create: async (data: Omit<Issue, 'id' | 'status' | 'createdAt'>): Promise<Issue> => {
      return request<Issue>('/api/issues', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    }
  },

  payments: {
    list: async (): Promise<PaymentRecord[]> => {
      return [
        { id: 'pay1', amount: 2500, date: 'June 2025', method: 'UPI', status: 'Pending', type: 'Maintenance' },
        { id: 'pay2', amount: 2500, date: 'May 2025', method: 'UPI', status: 'Paid', type: 'Maintenance' }
      ];
    },
    uploadProof: async (paymentId: string, fileName: string): Promise<void> => {
      console.log('Proof uploaded:', fileName);
    }
  },

  tasks: {
    list: async (): Promise<Task[]> => {
       return [
        { id: 't1', title: 'Submit Identity Proof', description: 'PAN/Aadhar for records.', dueDate: '30 Jun 2024', status: 'Pending', priority: 'High' }
      ];
    },
    toggle: async (id: string): Promise<void> => {
      console.log('Task toggled:', id);
    }
  },

  agm: {
    get: async (year: number): Promise<AGMSession | null> => {
      return { id: 'agm1', year: 2024, date: '3rd March 2024', time: '10:00 AM', venue: 'Clubhouse Hall', status: 'Completed', quorum: 'Reached', present: 54, absent: 18, agenda: [] };
    }
  },

  vendors: {
    list: async (): Promise<Vendor[]> => {
      return [
        { id: '1', name: 'Metro Electricals', service: 'Electrical', status: 'Active', contractStart: '01 Jan 2024', contractEnd: '01 Jan 2025' }
      ];
    },
    create: async (data: Omit<Vendor, 'id' | 'status'>): Promise<Vendor> => {
      return { ...data, id: 'new', status: 'Active' } as Vendor;
    }
  }
};
