import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Notices from './pages/Notices';
import NoticeDetail from './pages/NoticeDetail';
import Payments from './pages/Payments';
import AGM from './pages/AGM';
import Vendors from './pages/Vendors';
import VendorDetail from './pages/VendorDetail';
import VendorNew from './pages/VendorNew';
import Issues from './pages/Issues';
import IssueNew from './pages/IssueNew';
import IssueDetail from './pages/IssueDetail';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import Preferences from './pages/Preferences';
import Expenses from './pages/Expenses';
import ExpenseNew from './pages/ExpenseNew';
import ExpenseDetail from './pages/ExpenseDetail';
import Feedback from './pages/Feedback';
import Layout from './components/Layout';
import { User, Notice, Issue, Vendor, Expense, PaymentRecord, Task, AGMSession } from './types';
import { api } from './lib/api';

const INITIAL_NOTICES: Notice[] = [
  {
    id: '1', title: 'Water Supply Maintenance Tomorrow', content: 'Water shutdown tomorrow 2am-6am.', type: 'Announcement', postedAt: '10 min ago', postedBy: 'Secretary', tags: ['Maintenance'], isNew: true, isRead: false
  }
];

const INITIAL_PAYMENTS: PaymentRecord[] = [
  { id: 'pay1', amount: 2500, date: 'June 2025', method: 'UPI', status: 'Pending', type: 'Maintenance' },
  { id: 'pay2', amount: 2500, date: 'May 2025', method: 'UPI', status: 'Paid', type: 'Maintenance' }
];

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Submit Identity Proof', description: 'PAN/Aadhar for records.', dueDate: '30 Jun 2024', status: 'Pending', priority: 'High' }
];

const INITIAL_AGM: AGMSession[] = [
  { id: 'agm1', year: 2024, date: '3rd March 2024', time: '10:00 AM', venue: 'Clubhouse Hall', status: 'Completed', quorum: 'Reached', present: 54, absent: 18, agenda: [] }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  
  const [notices, setNotices] = useState<Notice[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const refreshData = useCallback(async () => {
    if (!localStorage.getItem('access_token')) return;
    
    try {
      const [n, i, v, e, p, t, a] = await Promise.all([
        api.notices.list(),
        api.issues.list(),
        api.vendors.list(),
        api.expenses.list(),
        api.payments.list(),
        api.tasks.list(),
        api.agm.get(2024)
      ]);

      if (n.length === 0) { localStorage.setItem('notices', JSON.stringify(INITIAL_NOTICES)); setNotices(INITIAL_NOTICES); } else setNotices(n);
      if (p.length === 0) localStorage.setItem('payments', JSON.stringify(INITIAL_PAYMENTS));
      if (t.length === 0) localStorage.setItem('tasks', JSON.stringify(INITIAL_TASKS));
      if (!a) localStorage.setItem('agm_data', JSON.stringify(INITIAL_AGM));
      
      setExpenses(e);
      setIssues(i);
      setVendors(v);
    } catch (err) {
      console.error("Sync error:", err);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      refreshData();
    }
    setLoading(false);
  }, [refreshData]);

  const handleLogin = (u: User, isNew: boolean = false) => { 
    setUser(u); 
    setIsNewUser(isNew);
    refreshData(); 
  };
  
  const handleLogout = () => { api.auth.logout(); setUser(null); setIsNewUser(false); };

  if (loading) return <div className="h-screen flex items-center justify-center font-serif text-[#6B8E6B]">Loading Parasnath Nagari...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard user={user!} notices={notices} setNotices={setNotices} refreshData={refreshData} isNewUser={isNewUser} onWelcomeSeen={() => setIsNewUser(false)} />} />
          <Route path="/notices" element={<Notices notices={notices} setNotices={setNotices} />} />
          <Route path="/notices/:id" element={<NoticeDetail notices={notices} setNotices={setNotices} />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/expenses" element={<Expenses expenses={expenses} user={user!} />} />
          <Route path="/expenses/new" element={<ExpenseNew setExpenses={setExpenses} user={user!} />} />
          <Route path="/expenses/:id" element={<ExpenseDetail expenses={expenses} />} />
          <Route path="/agm" element={<AGM />} />
          <Route path="/vendors" element={<Vendors vendors={vendors} />} />
          <Route path="/vendors/new" element={<VendorNew setVendors={setVendors} />} />
          <Route path="/vendors/:id" element={<VendorDetail vendors={vendors} />} />
          <Route path="/issues" element={<Issues issues={issues} />} />
          <Route path="/issues/new" element={<IssueNew setIssues={setIssues} user={user!} />} />
          <Route path="/issues/:id" element={<IssueDetail issues={issues} />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/settings" element={<Settings user={user!} />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/feedback" element={<Feedback />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;