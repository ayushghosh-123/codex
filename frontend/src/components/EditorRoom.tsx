import { Editor } from '@monaco-editor/react';
import { UserButton } from '@clerk/clerk-react';
import Terminal from './Terminal';

interface EditorRoomProps {
  roomId: string;
  selectedLang: string;
  activeUsers: any[];
  handleMount: (editor: any) => void;
  languages: string[];
  setLanguage: (lang: string) => void;
}

const EditorRoom = ({
  roomId,
  selectedLang,
  activeUsers,
  handleMount,
  languages,
  setLanguage
}: EditorRoomProps) => {
  return (
    <main className='bg-[#0a0a0c] h-screen text-white flex overflow-hidden font-sans'>
      {/* Sidebar */}
      <aside className='w-64 border-r border-zinc-800 bg-[#0f0f12] flex flex-col'>
        <div className='p-6 border-b border-zinc-800'>
          <h1 className='text-xl font-black italic tracking-tighter text-indigo-400'>COLLAB.EDIT</h1>
        </div>
        
        <div className='flex-1 overflow-y-auto p-4'>
          <p className='text-[10px] uppercase tracking-widest text-zinc-500 font-black mb-6 ml-2'>Active Developers — {activeUsers.length}</p>
          <div className='space-y-3'>
            {activeUsers.map((user, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 rounded-xl border border-zinc-800/50 group">
                <div className="w-2 h-2 rounded-full ring-4 ring-black/30" style={{ backgroundColor: user.color }}></div>
                <span className="text-xs text-zinc-300 font-bold truncate lowercase">
                  {user.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800">
          <button 
            onClick={() => window.location.search = ""} 
            className="w-full py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all"
          >
            Leave Workspace
          </button>
        </div>
      </aside>

      {/* Main Editor Section */}
      <section className='flex-1 flex flex-col relative'>
        <header className="h-14 bg-[#121214] border-b border-zinc-800 flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
             {/* Back to Dashboard Button */}
             <button 
               onClick={() => window.location.search = ""}
               className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-[10px] font-black uppercase tracking-widest transition-all group"
             >
               <span className="text-xs transition-transform group-hover:-translate-x-1 duration-200">←</span>
               Dashboard
             </button>
             
             <div className="h-4 w-[1px] bg-zinc-800"></div>

             <div className="flex items-center gap-3">
               <span className="text-[10px] text-zinc-500 font-black tracking-widest">LANG:</span>
               <select 
                  value={selectedLang} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-[#1a1a1c] border border-zinc-700 text-zinc-300 text-[10px] font-bold rounded-lg px-3 py-1 outline-none focus:border-indigo-500"
               >
                  {languages.map((lang) => <option key={lang} value={lang}>{lang.toUpperCase()}</option>)}
               </select>
             </div>
             
             <div className="h-4 w-[1px] bg-zinc-800"></div>
             <span className="text-[10px] font-mono text-indigo-400 font-bold uppercase tracking-widest">Room ID: {roomId}</span>
          </div>
          <UserButton />
        </header>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-[2] min-h-0">
            <Editor
              height="100%"
              theme='vs-dark'
              language={selectedLang}
              onMount={handleMount}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                padding: { top: 20 },
                fontFamily: "'Fira Code', monospace",
                cursorBlinking: "smooth",
                renderWhitespace: "selection",
                smoothScrolling: true,
              }}
            />
          </div>
          <div className="flex-[1] min-h-0 relative">
            <div className="absolute top-0 left-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-[#0a0a0c] z-10 border-b border-zinc-800">
              Terminal
            </div>
            <Terminal roomId={roomId} />
          </div>
        </div>

        <footer className='h-6 bg-indigo-600 px-6 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em]'>
          <div className='flex gap-6'>
            <span>Connected</span>
            <span className="opacity-50">|</span>
            <span>Members: {activeUsers.length}</span>
          </div>
          <span>{selectedLang}</span>
        </footer>
      </section>
    </main>
  );
};

export default EditorRoom;
