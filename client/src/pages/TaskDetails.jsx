import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Save, Trash2, Calendar, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await api.get(`/tasks/${id}`);
        setTask(data.data);
      } catch (err) { navigate('/dashboard'); }
    };
    fetchTask();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/tasks/${id}`, task);
      toast.success("Task Updated Successfully");
      setIsEditing(false);
    } catch (err) { toast.error("Update failed"); }
  };

  const handleDelete = async () => {
    if (window.confirm("Requirement #5: Delete this task forever?")) {
      await api.delete(`/tasks/${id}`);
      toast.success("Task Deleted");
      navigate('/dashboard');
    }
  };

  if (!task) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 mb-8 hover:text-indigo-600 transition">
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Task Details</h2>
            <div className="flex gap-3">
              <button onClick={() => setIsEditing(!isEditing)} className="p-2 text-gray-400 hover:text-indigo-600">
                <Save size={20} />
              </button>
              <button onClick={handleDelete} className="p-2 text-gray-400 hover:text-red-500">
                <Trash2 size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <input 
              readOnly={!isEditing}
              className={`w-full text-2xl font-bold bg-transparent border-none focus:ring-0 ${isEditing ? 'border-b border-indigo-200' : ''}`}
              value={task.title}
              onChange={(e) => setTask({...task, title: e.target.value})}
              placeholder="Task Title"
            />

            <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 w-fit px-4 py-1.5 rounded-full text-sm font-bold">
              <Calendar size={16} />
              <input 
                type="date"
                readOnly={!isEditing}
                className="bg-transparent border-none focus:ring-0 p-0 text-xs font-bold uppercase"
                value={task.dueDate?.split('T')[0]}
                onChange={(e) => setTask({...task, dueDate: e.target.value})}
              />
            </div>

            <textarea 
              readOnly={!isEditing}
              rows="5"
              className={`w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 text-gray-600 ${!isEditing ? 'cursor-default' : ''}`}
              value={task.description}
              onChange={(e) => setTask({...task, description: e.target.value})}
              placeholder="No description provided..."
            />

            {isEditing && (
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100">
                Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
export default TaskDetails;