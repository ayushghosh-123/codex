import { useState, useRef, useMemo, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import * as Y from 'yjs';
import { SocketIOProvider } from 'y-socket.io';
import { MonacoBinding } from 'y-monaco';
import axios from 'axios';

// Import our new components
import LandingPage from '../components/LandingPage';
import Dashboard from '../components/Dashboard';
import EditorRoom from '../components/EditorRoom';

import './App.css';

const API_BASE = "http://localhost:3000/api";
const LANGUAGES = ['javascript', 'typescript', 'python', 'java', 'cpp', 'html', 'css', 'json'];

function App() {
  const { user } = useUser();
  const [roomId, setRoomId] = useState("");
  const [selectedLang, setSelectedLang] = useState("typescript");
  const [isInRoom, setIsInRoom] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);

  const editerRef = useRef<any>(null);
  const ydoc = useMemo(() => new Y.Doc(), []);
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc]);

  // Load history and check URL for room session
  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE}/user-history/${user.id}`)
        .then(res => {
          const uniqueHistory: any[] = [];
          const seenIds = new Set();
          // Reverse first so the most recent ones come first
          const reversedData = [...res.data].reverse();
          for (const entry of reversedData) {
            if (!seenIds.has(entry.roomId)) {
              uniqueHistory.push(entry);
              seenIds.add(entry.roomId);
            }
          }
          setHistory(uniqueHistory);
        })
        .catch(err => console.error("History error", err));
    }
    
    const params = new URLSearchParams(window.location.search);

    // room - give the user room 
    const room = params.get("room");

    // language of params 
    const lang = params.get("lang");

    // 
    if (room) {
      setRoomId(room);
      if (lang) setSelectedLang(lang);
      setIsInRoom(true);
    }
  }, [user]);

  const handleJoin = async (id: string, lang: string) => {
    if (!id || !user) return;
    try {
      await axios.post(`${API_BASE}/rooms/join`, { clerkId: user.id, roomId: id, language: lang });
    } catch (err) {
      console.error("Join log error", err);
    } finally {
      window.location.search = `?room=${id}&lang=${lang}`;
    }
  };

  const handleMount = (editor: any) => {
    editerRef.current = editor;
    const provider = new SocketIOProvider("http://localhost:3000", roomId, ydoc, { autoConnect: true });

    provider.awareness.setLocalStateField('user', {
      name: user?.fullName || user?.username || "Developer",
      color: '#' + Math.floor(Math.random() * 16777215).toString(16)
    });

    provider.awareness.on('change', () => {
      const states = provider.awareness.getStates();
      const userList: any[] = [];
      states.forEach((state: any) => { if (state.user) userList.push(state.user); });
      setActiveUsers(userList);
    });

    new MonacoBinding(yText, editor.getModel(), new Set([editor]), provider.awareness);
  };

  // 1. LOGGED OUT STATE
  if (!user) {
    return <LandingPage />;
  }

  // 2. LOGGED IN - LOBBY STATE
  if (!isInRoom) {
    return (
      <Dashboard 
        user={user}
        history={history}
        roomId={roomId}
        setRoomId={setRoomId}
        selectedLang={selectedLang}
        setSelectedLang={setSelectedLang}
        handleJoin={handleJoin}
        languages={LANGUAGES}
      />
    );
  }

  // 3. LOGGED IN - EDITOR STATE
  return (
    <EditorRoom 
      roomId={roomId}
      selectedLang={selectedLang}
      activeUsers={activeUsers}
      handleMount={handleMount}
      languages={LANGUAGES}
      setLanguage={setSelectedLang}
    />
  );
}

export default App;
