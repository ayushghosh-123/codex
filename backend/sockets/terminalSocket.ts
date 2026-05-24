import { Server, Socket } from 'socket.io';
import * as pty from 'node-pty';
import os from 'os';
import path from 'path';
import fs from 'fs';

export const setupTerminalSocket = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        let ptyProcess: pty.IPty | null = null;

        socket.on('join-terminal', (roomId: string) => {
            if (ptyProcess) return;

            const workspaceDir = path.join(process.cwd(), 'workspace', roomId);
            if (!fs.existsSync(workspaceDir)) {
                fs.mkdirSync(workspaceDir, { recursive: true });
            }

            const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

            ptyProcess = pty.spawn(shell, [], {
                name: 'xterm-color',
                cols: 80,
                rows: 24,
                cwd: workspaceDir,
                env: process.env as Record<string, string>
            });

            ptyProcess.onData((data) => {
                socket.emit('terminal-output', data);
            });

            socket.on('terminal-input', (data: string) => {
                if (ptyProcess) {
                    ptyProcess.write(data);
                }
            });

            socket.on('terminal-resize', (size: { cols: number, rows: number }) => {
                if (ptyProcess) {
                    try {
                        ptyProcess.resize(size.cols, size.rows);
                    } catch (e) {
                        console.error('Resize error:', e);
                    }
                }
            });

            socket.on('disconnect', () => {
                if (ptyProcess) {
                    ptyProcess.kill();
                }
            });
        });
    });
};
