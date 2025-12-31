import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const TaskModal = ({ isOpen, onClose, refresh }) => {
  const [formData, setFormData] = useState({ 
    title: '', description: '', dueDate: '', priority: 'High', assignedTo: [] 
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const { data } = await api.get('/auth/users');
          setUsers(data.data);
        } catch (err) { toast.error("Users load nahi ho paye"); }
      };
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUserToggle = (userId) => {
    const isSelected = formData.assignedTo.includes(userId);
    setFormData({
      ...formData,
      assignedTo: isSelected 
        ? formData.assignedTo.filter(id => id !== userId) 
        : [...formData.assignedTo, userId]
    });
  };

  return (
    <div className="fixed inset-0 bg-[#0F172A]/20 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
      {/* Modal Container: Max-width ko 440px kiya hai compact look ke liye */}
      <div className="bg-white w-full max-w-[440px] rounded-[24px] p-6 shadow-2xl animate-in fade-in zoom-in duration-150">
        
        <h2 className="text-xl font-bold mb-5 text-[#1E293B] px-1">Assign New Task</h2>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            await api.post('/tasks', formData);
            toast.success("Task Assigned!");
            onClose();
            refresh();
          } catch (err) { toast.error("Error!"); }
        }} className="space-y-3.5">
          
          <input required type="text" placeholder="What needs to be done?" 
            className="w-full h-[48px] px-4 bg-[#F8F9FB] border-none rounded-[12px] focus:ring-2 focus:ring-indigo-500 outline-none placeholder-[#94A3B8] text-[14px]" 
            value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          
          <textarea placeholder="Describe the task details..." rows="2" 
            className="w-full p-4 bg-[#F8F9FB] border-none rounded-[12px] focus:ring-2 focus:ring-indigo-500 outline-none resize-none placeholder-[#94A3B8] text-[14px]" 
            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          
          <input required 
            type={formData.dueDate ? "date" : "text"}
            placeholder="Due Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => !formData.dueDate && (e.target.type = "text")}
            className="w-full h-[48px] px-4 bg-[#F8F9FB] border-none rounded-[12px] focus:ring-2 focus:ring-indigo-500 text-[#64748B] outline-none placeholder-[#94A3B8] text-[14px]" 
            value={formData.dueDate} 
            onChange={e => setFormData({...formData, dueDate: e.target.value})} 
          />
          
          {/* Team Members List - Section ko chhota aur scrollable rakha hai */}
          <div className="bg-[#F8F9FB] p-4 rounded-[12px] border border-gray-50">
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Assign to Team Members</p>
            <div className="max-h-[100px] overflow-y-auto space-y-2 pr-1 scrollbar-hide">
              {users.map(user => (
                <label key={user._id} className="flex items-center gap-2.5 cursor-pointer group">
                  <input 
                    type="checkbox"
                    className="w-4 h-4 rounded border-[#CBD5E1] text-indigo-600 focus:ring-indigo-500 transition-all"
                    checked={formData.assignedTo.includes(user._id)}
                    onChange={() => handleUserToggle(user._id)}
                  />
                  <span className="text-[13px] text-[#475569] group-hover:text-indigo-600 transition-colors">{user.name}</span>
                </label>
              ))}
            </div>
          </div>

          <select className="w-full h-[48px] px-4 bg-[#F8F9FB] border border-indigo-50 rounded-[12px] text-[#64748B] text-[14px] font-medium outline-none appearance-none cursor-pointer hover:bg-white transition-colors" 
            value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="flex gap-4 justify-end items-center pt-4">
            <button type="button" onClick={onClose} className="text-[#94A3B8] font-bold text-[14px] hover:text-[#64748B]">Cancel</button>
            <button type="submit" className="px-8 h-[44px] bg-[#4F46E5] text-white rounded-[12px] font-bold text-[14px] hover:bg-[#4338CA] shadow-md shadow-indigo-100 transition-all active:scale-95">
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;