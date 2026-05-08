import { SignInButton, SignUpButton } from '@clerk/clerk-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-black italic tracking-tighter">COLLAB.EDIT</h1>
        <SignInButton mode="modal">
          <button className="text-xs font-bold border border-zinc-800 px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-all uppercase">
            Sign In
          </button>
        </SignInButton>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="inline-block px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-400 mb-8 tracking-widest uppercase">
          Built for modern developers
        </div>
        <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-[1.1]">
          Build together. <br/>
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            In real-time.
          </span>
        </h2>
        <p className="text-zinc-500 max-w-xl mb-12 text-lg md:text-xl font-medium leading-relaxed">
          A high-performance collaborative code editor with instant synchronization, 
          multi-language support, and persistent workspaces.
        </p>
        <SignUpButton mode="modal">
          <button className="bg-white text-black px-12 py-5 rounded-full font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.15)]">
            Get Started Now — It's Free
          </button>
        </SignUpButton>
      </main>
    </div>
  );
};

export default LandingPage;
