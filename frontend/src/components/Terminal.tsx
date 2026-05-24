import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { io, Socket } from 'socket.io-client';

interface TerminalProps {
    roomId: string;
}

const Terminal = ({ roomId }: TerminalProps) => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!terminalRef.current) return;

        const term = new XTerm({
            theme: {
                background: '#0a0a0c',
                foreground: '#ffffff',
                cursor: '#ffffff',
                selectionBackground: 'rgba(255, 255, 255, 0.3)',
                black: '#000000',
                red: '#ff5555',
                green: '#50fa7b',
                yellow: '#f1fa8c',
                blue: '#bd93f9',
                magenta: '#ff79c6',
                cyan: '#8be9fd',
                white: '#bfbfbf',
                brightBlack: '#4d4d4d',
                brightRed: '#ff6e6e',
                brightGreen: '#69ff94',
                brightYellow: '#ffffa5',
                brightBlue: '#d6acff',
                brightMagenta: '#ff92df',
                brightCyan: '#a4ffff',
                brightWhite: '#ffffff'
            },
            fontFamily: "'Fira Code', monospace",
            fontSize: 13,
            cursorBlink: true,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        const socket = io('http://localhost:3000');
        socketRef.current = socket;

        socket.on('connect', () => {
            socket.emit('join-terminal', roomId);
        });

        socket.on('terminal-output', (data: string) => {
            term.write(data);
        });

        term.onData((data) => {
            socket.emit('terminal-input', data);
        });

        const handleResize = () => {
            fitAddon.fit();
            socket.emit('terminal-resize', { cols: term.cols, rows: term.rows });
        };

        window.addEventListener('resize', handleResize);
        
        // Initial resize
        const timeoutId = setTimeout(() => handleResize(), 100);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
            socket.disconnect();
            term.dispose();
        };
    }, [roomId]);

    return (
        <div className="w-full h-full p-2 bg-[#0a0a0c] overflow-hidden border-t border-zinc-800">
            <div ref={terminalRef} className="w-full h-full" />
        </div>
    );
};

export default Terminal;
