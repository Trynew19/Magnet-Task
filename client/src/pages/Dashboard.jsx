import { useEffect, useState } from 'react';
import api from '../api/axios';
import { LayoutDashboard, CheckCircle, Clock, Plus, LogOut, ChevronLeft, ChevronRight, Trello, Grid,Search } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import UserProfile from '../components/UserProfile'; // User details requirement
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('grid'); // 'grid' or 'board'
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  const fetchTasks = async () => {
    try {
      // Board view ke liye humein saare tasks chahiye hote hain filters ke liye
      const limit = view === 'board' ? 100 : 6;
      const { data } = await api.get(`/tasks?page=${page}&limit=${limit}`);
      setTasks(data.data);
      if (view === 'grid') setTotalPages(Math.ceil(data.total / 6));
      
      setStats({
        total: data.total,
        completed: data.data.filter(t => t.status === 'completed').length,
        pending: data.data.filter(t => t.status === 'pending').length
      });
    } catch (err) { toast.error("Fetch failed"); }
  };

  useEffect(() => { fetchTasks(); }, [page, view]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const filterByPriority = (priority) => tasks.filter(t => t.priority === priority);

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] text-[#1E293B]">
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-6">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold italic">M</div>
          <span className="text-xl font-extrabold tracking-tight">Magnet</span>
        </div>
        
        {/* Requirement: User click to see profile details */}
        <UserProfile />

        <nav className="flex-1 space-y-2">
          <button onClick={() => setView('grid')} className={`flex items-center gap-3 w-full p-3 rounded-xl font-medium transition ${view === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}>
            <Grid size={20} /> Grid View
          </button>
          <button onClick={() => setView('board')} className={`flex items-center gap-3 w-full p-3 rounded-xl font-medium transition ${view === 'board' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500'}`}>
            <Trello size={20} /> Priority Board
          </button>
        </nav>
        
        <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 text-gray-500 hover:text-red-600 transition font-medium">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
  <div className="flex items-center gap-4">
    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
      <LayoutDashboard size={24} />
    </div>
    <div>
      <h1 className="text-xl font-bold text-gray-800">Add Task</h1>
      <p className="text-xs text-green-500 font-medium flex items-center gap-1">
      </p>
    </div>
  </div>
  
  <div className="flex items-center gap-3">
 
    <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl shadow-lg transition-all">
      <Plus size={20} />
    </button>
  </div>
</header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Tasks" count={stats.total} icon={<LayoutDashboard className="text-blue-500" />} />
          <StatCard title="Completed" count={stats.completed} icon={<CheckCircle className="text-green-500" />} />
          <StatCard title="Pending" count={stats.pending} icon={<Clock className="text-amber-500" />} />
        </div>

        {view === 'grid' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {tasks.map(t => <TaskCard key={t._id} task={t} refresh={fetchTasks} />)}
            </div>
            <div className="mt-12 flex justify-center items-center gap-3">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 bg-white border rounded-lg disabled:opacity-30 hover:bg-gray-50"><ChevronLeft /></button>
              <span className="text-sm font-semibold">Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-2 bg-white border rounded-lg disabled:opacity-30 hover:bg-gray-50"><ChevronRight /></button>
            </div>
          </>
        ) : (
          /* Kanban Board - Requirement #8 & #9 */
          <div className="flex gap-6 overflow-x-auto pb-4">
            <PriorityColumn title="High" color="bg-red-500" tasks={filterByPriority('High')} refresh={fetchTasks} />
            <PriorityColumn title="Medium" color="bg-amber-500" tasks={filterByPriority('Medium')} refresh={fetchTasks} />
            <PriorityColumn title="Low" color="bg-green-500" tasks={filterByPriority('Low')} refresh={fetchTasks} />
          </div>
        )}
      </main>
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} refresh={fetchTasks} />
    </div>
  );
};

const PriorityColumn = ({ title, color, tasks, refresh }) => (
  <div className="min-w-[320px] flex-1 bg-gray-100/40 rounded-[24px] p-4">
    <div className="flex items-center gap-2 mb-6 px-2">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
      <h2 className="font-bold text-gray-600 uppercase text-[11px] tracking-[0.1em]">{title} Priority</h2>
      <span className="ml-auto text-[10px] bg-white px-2 py-0.5 rounded-md text-gray-400 font-bold">{tasks.length}</span>
    </div>
    <div className="space-y-4">
      {tasks.map(t => <TaskCard key={t._id} task={t} refresh={refresh} />)}
    </div>
  </div>
);

const StatCard = ({ title, count, icon }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
    <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
  </div>
);

export default Dashboard;