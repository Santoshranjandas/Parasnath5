import { User, Expense, Issue, Vendor, Notice, PaymentRecord, Task, AGMSession, SystemLog } from '../types';

// --- MOCK API IMPLEMENTATION ---
const MOCK_DELAY = 600;
const wait = () => new Promise(resolve => setTimeout(resolve, MOCK_DELAY));

// Helper to simulate a database using LocalStorage
const getStoredUsers = (): any[] => {
  try {
    const stored = localStorage.getItem('parasnath_users_db');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUserToDb = (user: User, mpin: string) => {
  const users = getStoredUsers();
  // Remove if exists (update)
  const filtered = users.filter(u => u.phone !== user.phone);
  filtered.push({ ...user, mpin });
  localStorage.setItem('parasnath_users_db', JSON.stringify(filtered));
};

// Hardcoded Admin
const MOCK_ADMIN: User = {
  id: 'admin',
  fullName: 'Society Admin',
  phone: 'admin', // Acts as username
  role: 'admin',
  flatId: 'Office'
};

// Mock Data Generators
const MOCK_NOTICES: Notice[] = [
  { id: '1', title: 'Water Supply Maintenance', content: 'Water supply will be cut off tomorrow from 10 AM to 2 PM.', type: 'Announcement', postedAt: '2 hours ago', postedBy: 'Secretary', tags: ['Water', 'Maintenance'], isRead: false, isNew: true },
  { id: '2', title: 'Diwali Celebration', content: 'Join us for the Grand Diwali Celebration in the clubhouse on Sunday.', type: 'Event', postedAt: '1 day ago', postedBy: 'Cultural Committee', tags: ['Event', 'Celebration'], isRead: true }
];

const MOCK_ISSUES: Issue[] = [
  { id: '101', userId: 'u1', title: 'Street Light Flickering', category: 'Electrical', description: 'The street light near B-wing entrance is flickering.', status: 'Pending', createdAt: '10 Jun 2024' },
  { id: '102', userId: 'u1', title: 'Gym AC Not Working', category: 'Maintenance', description: 'AC in the gym is blowing warm air.', status: 'In Progress', createdAt: '08 Jun 2024' }
];

const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', name: 'Metro Electricals', service: 'Electrical', status: 'Active', contractStart: '01 Jan 2024', contractEnd: '31 Dec 2024', contactPerson: 'Rajesh Kumar', phone: '9876543210', email: 'rajesh@metro.com' },
  { id: 'v2', name: 'CleanCity Services', service: 'Housekeeping', status: 'Expiring', contractStart: '01 Jan 2024', contractEnd: '30 Jun 2024', expiresInDays: 15, contactPerson: 'Sunita Patil' }
];

const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', title: 'Generator Diesel', category: 'Utilities', amount: 5000, date: '2024-06-01', proofUrl: '', recordedBy: 'Secretary' },
  { id: 'e2', title: 'Security Guard Salary', category: 'Salaries', amount: 45000, date: '2024-06-05', proofUrl: '', recordedBy: 'Treasurer' },
  { id: 'e3', title: 'Lift Maintenance', category: 'Maintenance', amount: 12000, date: '2024-05-20', proofUrl: '', recordedBy: 'Secretary' }
];

const MOCK_PAYMENTS: PaymentRecord[] = [
  { id: 'pay1', amount: 2500, date: 'June 2025', method: 'UPI', status: 'Pending', type: 'Maintenance' },
  { id: 'pay2', amount: 2500, date: 'May 2025', method: 'UPI', status: 'Paid', type: 'Maintenance' }
];

const MOCK_TASKS: Task[] = [
  { id: 't1', title: 'Submit Identity Proof', description: 'PAN/Aadhar for records.', dueDate: '30 Jun 2024', status: 'Pending', priority: 'High' }
];

export const api = {
  auth: {
    checkUser: async (phone: string): Promise<{ exists: boolean, full_name?: string }> => {
      await wait();
      // Check Admin (Allow 'admin' or the old number)
      if (phone.toLowerCase() === 'admin' || phone === '9876543210') {
        return { exists: true, full_name: 'Society Admin' };
      }

      // Check DB
      const users = getStoredUsers();
      const user = users.find(u => u.phone === phone);
      
      if (user) {
        return { exists: true, full_name: user.fullName };
      }
      return { exists: false };
    },
    loginMpin: async (phone: string, mpin: string): Promise<{ user: User, access_token: string }> => {
      await wait();
      
      // Admin Login
      if ((phone.toLowerCase() === 'admin' || phone === '9876543210') && mpin === '1234') {
        localStorage.setItem('saved_phone', phone);
        localStorage.setItem('access_token', 'mock-admin-token');
        localStorage.setItem('user', JSON.stringify(MOCK_ADMIN));
        return { user: MOCK_ADMIN, access_token: 'mock-admin-token' };
      }

      // User Login
      const users = getStoredUsers();
      const user = users.find(u => u.phone === phone);

      if (user && user.mpin === mpin) {
        const { mpin: _, ...safeUser } = user; // Remove MPIN from object
        localStorage.setItem('saved_phone', phone);
        localStorage.setItem('access_token', 'mock-user-token');
        localStorage.setItem('user', JSON.stringify(safeUser));
        return { user: safeUser, access_token: 'mock-user-token' };
      }

      throw new Error('Invalid MPIN');
    },
    register: async (fullName: string, phone: string, flatId: string, mpin: string): Promise<{ user: User, access_token: string }> => {
      await wait();
      const newUser: User = {
        id: Date.now().toString(),
        fullName,
        phone,
        flatId,
        role: 'member'
      };
      
      saveUserToDb(newUser, mpin);
      
      // Auto login after register
      localStorage.setItem('saved_phone', phone);
      localStorage.setItem('access_token', 'mock-user-token');
      localStorage.setItem('user', JSON.stringify(newUser));
      
      return { user: newUser, access_token: 'mock-user-token' };
    },
    logout: () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // We do NOT remove 'saved_phone' to remember the user for next time
    }
  },

  admin: {
    getStats: async () => {
      await wait();
      return {
        residents: 72,
        pending_issues: 4,
        monthly_collection: 180000,
        pending_approvals: 2
      };
    },
    getLogs: async (): Promise<SystemLog[]> => {
      await wait();
      return [
        { id: '1', action: 'Maintenance Payment', user: 'Flat 501', time: '10 min ago', type: 'success' },
        { id: '2', action: 'New Complaint: Water Leak', user: 'Flat 302', time: '1 hour ago', type: 'alert' },
        { id: '3', action: 'Visitor Entry', user: 'Security Gate', time: '2 hours ago', type: 'info' },
        { id: '4', action: 'Expense Recorded', user: 'Secretary', time: '5 hours ago', type: 'info' },
      ];
    },
    getPendingUsers: async (): Promise<User[]> => {
      await wait();
      return [
        { id: 'temp1', fullName: 'Rahul Verma', phone: '9898989898', role: 'member', flatId: 'B-202', isVerified: false },
        { id: 'temp2', fullName: 'Sneha Gupta', phone: '9797979797', role: 'member', flatId: 'A-405', isVerified: false },
      ];
    }
  },

  notices: {
    list: async (): Promise<Notice[]> => { await wait(); return [...MOCK_NOTICES]; },
    markRead: async (id: string): Promise<void> => { await wait(); console.log('Marked read', id); }
  },

  issues: {
    list: async (): Promise<Issue[]> => { await wait(); return [...MOCK_ISSUES]; },
    create: async (data: any): Promise<Issue> => { 
      await wait(); 
      return { ...data, id: String(Date.now()), status: 'Pending', createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }; 
    }
  },

  vendors: {
    list: async (): Promise<Vendor[]> => { await wait(); return [...MOCK_VENDORS]; },
    create: async (data: any): Promise<Vendor> => { 
      await wait(); 
      return { ...data, id: String(Date.now()), status: 'Active' }; 
    }
  },

  expenses: {
    list: async (): Promise<Expense[]> => { await wait(); return [...MOCK_EXPENSES]; },
    create: async (data: any): Promise<Expense> => { 
      await wait(); 
      return { ...data, id: String(Date.now()) }; 
    }
  },

  payments: {
    list: async (): Promise<PaymentRecord[]> => { await wait(); return [...MOCK_PAYMENTS]; },
    uploadProof: async (id: string, name: string): Promise<void> => { await wait(); console.log('Uploaded', name); }
  },

  tasks: {
    list: async (): Promise<Task[]> => { await wait(); return [...MOCK_TASKS]; },
    toggle: async (id: string): Promise<void> => { await wait(); console.log('Toggled', id); }
  },

  agm: {
    get: async (year: number): Promise<AGMSession | null> => {
      await wait();
      return { id: 'agm1', year: 2024, date: '3rd March 2024', time: '10:00 AM', venue: 'Clubhouse Hall', status: 'Completed', quorum: 'Reached', present: 54, absent: 18, agenda: [] };
    }
  }
};