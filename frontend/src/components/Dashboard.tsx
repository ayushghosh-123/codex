import { UserButton } from '@clerk/clerk-react';

interface DashboardProps {
  user: any;
  history: any[];
  roomId: string;
  setRoomId: (id: string) => void;
  selectedLang: string;
  setSelectedLang: (lang: string) => void;
  handleJoin: (id: string, lang: string) => void;
  languages: string[];
}

const Dashboard = ({ 
  user, 
  history, 
  roomId, 
  setRoomId, 
  selectedLang, 
  setSelectedLang, 
  handleJoin, 
  languages 
}: DashboardProps) => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 font-sans">
      <header className="max-w-6xl mx-auto flex justify-between items-center h-20 mb-16">
        <h1 className="text-xl font-black italic tracking-tighter">DASHBOARD</h1>
        <UserButton afterSignOutUrl="/"/>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Create Room */}
        <div className="lg:col-span-4">
          <div className="p-8 bg-[#121214] border border-zinc-800 rounded-[2.5rem] sticky top-10">
            <h3 className="text-2xl font-bold mb-8">Create Workspace</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] text-zinc-500 font-black tracking-widest uppercase ml-1">Environment</label>
                <select 
                  value={selectedLang} 
                  onChange={(e) => setSelectedLang(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium appearance-none"
                >
                  {languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                </select>
              </div>
              <button 
                onClick={() => handleJoin(Math.random().toString(36).substring(7), selectedLang)}
                className="w-full bg-indigo-600 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
              >
                Create New Room
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-zinc-800">
              <h4 className="text-sm font-bold mb-4">Join via ID</h4>
              <div className="flex gap-2">
                <input 
                  value={roomId} onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter ID..." 
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 outline-none"
                />
                <button onClick={() => handleJoin(roomId, 'typescript')} className="bg-zinc-800 px-4 rounded-xl font-bold border border-zinc-700 hover:bg-zinc-700">Join</button>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="lg:col-span-8 space-y-8">
          <h3 className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px] ml-1">Recent Sessions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {history.map((room, i) => (
              <div 
                key={i} 
                onClick={() => handleJoin(room.roomId, room.language)} 
                className="p-8 bg-[#121214] border border-zinc-800 rounded-3xl hover:border-indigo-500/50 cursor-pointer transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="text-8xl font-black uppercase">{room.language[0]}</span>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 mb-2 block tracking-widest font-bold">#{room.roomId}</span>
                <h4 className="font-bold text-2xl mb-6">{room.language.toUpperCase()}</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 group-hover:text-white transition-colors">
                  CONTINUE CODING <span className="text-lg">→</span>
                </div>
              </div>
            ))}
            {history.length === 0 && (
               <div className="col-span-2 py-20 border border-dashed border-zinc-800 rounded-3xl text-center text-zinc-600 italic">
                  You haven't joined any rooms yet.
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
