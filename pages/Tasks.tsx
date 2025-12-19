
import React, { useState, useEffect } from 'react';
import { ListTodo, CheckCircle2, Circle, Clock, Loader2 } from 'lucide-react';
import { Task } from '../types';
import { api } from '../lib/api';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      const data = await api.tasks.list();
      setTasks(data);
      setLoading(false);
    };
    loadTasks();
  }, []);

  const handleToggle = async (id: string) => {
    await api.tasks.toggle(id);
    const updated = await api.tasks.list();
    setTasks(updated);
  };

  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  if (loading) return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#6B8E6B]" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="space-y-4">
        <h4 className="text-lg font-serif font-bold text-[#3D4F3D] dark:text-[#E6E9E0]">Pending Tasks</h4>
        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <div 
              key={task.id} 
              onClick={() => handleToggle(task.id)}
              className="glass-card rounded-[24px] p-5 shadow-sm border border-white/70 dark:border-white/10 cursor-pointer active:scale-[0.98] transition-all"
            >
              <div className="flex gap-4">
                <Circle size={20} className="text-[#8C9A8C] mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-[#3D4F3D] dark:text-[#E6E9E0]">{task.title}</h5>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-500 uppercase">{task.priority}</span>
                  </div>
                  <p className="text-xs text-[#8C9A8C] mt-1">{task.description}</p>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8C9A8C] uppercase mt-3">
                    <Clock size={12} /> Due: {task.dueDate}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {pendingTasks.length === 0 && <p className="text-center py-10 text-[#8C9A8C] italic">No pending tasks.</p>}
        </div>
      </div>

      {completedTasks.length > 0 && (
        <div className="space-y-4 opacity-60">
          <h4 className="text-sm font-bold text-[#8C9A8C] uppercase tracking-widest pl-2">Completed</h4>
          {completedTasks.map((task) => (
            <div 
              key={task.id} 
              onClick={() => handleToggle(task.id)}
              className="glass-card rounded-[20px] p-4 flex items-center gap-4 cursor-pointer"
            >
              <CheckCircle2 size={20} className="text-[#6B8E6B]" />
              <span className="text-sm font-semibold line-through text-[#3D4F3D] dark:text-[#E6E9E0]">{task.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tasks;
