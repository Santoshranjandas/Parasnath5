
export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  flatId: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'Announcement' | 'Event' | 'Reminder';
  tags: string[];
  postedBy: string;
  postedAt: string;
  isNew?: boolean;
  isRead?: boolean;
}

export type IssueStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Closed';

export interface Issue {
  id: string;
  userId: string;
  title: string;
  category: 'Plumbing' | 'Electrical' | 'Security' | 'Maintenance' | 'Other';
  description: string;
  status: IssueStatus;
  createdAt: string;
  resolution?: string;
  resolvedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
}

export interface PaymentRecord {
  id: string;
  amount: number;
  date: string;
  method: 'UPI' | 'Cash' | 'Cheque';
  status: 'Paid' | 'Pending' | 'Partially Paid';
  proofUrl?: string;
  type?: string;
}

export interface Vendor {
  id: string;
  name: string;
  service: string;
  status: 'Active' | 'Expiring' | 'Expired';
  contractStart: string;
  contractEnd: string;
  expiresInDays?: number;
  phone?: string;
  email?: string;
  contactPerson?: string;
  description?: string;
}

export interface AGMSession {
  id: string;
  year: number;
  date: string;
  time: string;
  venue: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  quorum: string;
  present: number;
  absent: number;
  agenda: {
    title: string;
    proposedDate: string;
    status: 'Approved' | 'Rejected' | 'Deferred';
    yesVotes: number;
    noVotes: number;
  }[];
}

export interface Expense {
  id: string;
  title: string;
  category: 'Utility' | 'Salary' | 'Maintenance' | 'Security' | 'Event' | 'Other';
  amount: number;
  date: string;
  proofUrl: string;
  recordedBy: string;
}
