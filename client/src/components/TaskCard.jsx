import { Calendar, Trash2, Eye, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const TaskCard = ({ task, refresh }) => {
  const priorityMap = {
    High: 'bg-[#FF4D4D]',
    Medium: 'bg-[#FFB020]',
    Low: 'bg-[#2EB85C]'
  };

  const toggleStatus = async () => {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    await api.patch(`/tasks/${task._id}`, { status: newStatus });
    refresh();
    toast.success(`Task ${newStatus}`);
  };

  const deleteHandler = async () => {
    if (window.confirm("Requirement #5: Are you sure you want to delete this task?")) {
      await api.delete(`/tasks/${task._id}`);
      refresh();
      toast.success("Task Deleted");
    }
  };

  const changePriority = async (newPriority) => {
    await api.patch(`/tasks/${task._id}`, { priority: newPriority });
    refresh();
  };

  return (
    <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
      {/* Requirement #9: Visual color coding */}
      <div className="flex justify-between items-start mb-4">
        {/* FIX: Yahan tag theek kiya gaya hai */}
        <div className={`px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider ${priorityMap[task.priority]}`}>
          {task.priority}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link to={`/task/${task._id}`} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Eye size={16} />
          </Link>
          <button onClick={deleteHandler} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Requirement #2: Title & Status */}
      <div className="mb-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className={`font-bold text-[16px] text-[#1E293B] mb-1 leading-tight flex-1 ${task.status === 'completed' ? 'line-through text-gray-300' : ''}`}>
            {task.title}
          </h3>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${task.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
            {task.status}
          </span>
        </div>
        <p className="text-[#64748B] text-[13px] line-clamp-2 mt-1 italic">
          {task.description}
        </p>
      </div>

      {/* Requirement #2: Due Date & Assigned User Names */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400">
          <Calendar size={13} className="text-indigo-400" />
          <span>Due: {new Date(task.dueDate).toLocaleDateString('en-GB')}</span>
        </div>
        
        <div className="flex items-center gap-2 border-t border-gray-50 pt-3">
          <div className="flex -space-x-2">
            {task.assignedTo?.length > 0 ? (
              task.assignedTo.slice(0, 3).map((u, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-500 uppercase">
                  {u.name.charAt(0)}
                </div>
              ))
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[10px] text-gray-400">
                <User size={10}/>
              </div>
            )}
          </div>
          <span className="text-[10px] font-medium text-gray-500 truncate italic">
            {task.assignedTo?.length > 0 
              ? `Assigned to: ${task.assignedTo.map(u => u.name).join(', ')}` 
              : 'Self Assigned'}
          </span>
        </div>
      </div>

      {/* Bottom Actions: Requirement #8 & #6 */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
        <select 
          value={task.priority} 
          onChange={(e) => changePriority(e.target.value)}
          className="text-[11px] font-bold text-gray-500 bg-[#F8F9FB] border-none rounded-lg px-2 py-1.5 focus:ring-0 cursor-pointer"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button 
          onClick={toggleStatus}
          className={`px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all shadow-sm ${
            task.status === 'completed' 
            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
          }`}
        >
          {task.status === 'completed' ? 'Reopen' : 'Mark Done'}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;