import { Server } from 'socket.io';
import { YSocketIO } from 'y-socket.io/dist/server';
import * as Y from 'yjs';
import { RoomModel } from '../models/Room';
import fs from 'fs';
import path from 'path';

const getExtension = (lang: string) => {
    const map: Record<string, string> = {
        javascript: 'js', typescript: 'ts', python: 'py',
        java: 'java', cpp: 'cpp', html: 'html', css: 'css', json: 'json'
    };
    return map[lang] || 'txt';
};

export const setupYSocket = (io: Server) => {
    const ysocketIo = new YSocketIO(io);

    ysocketIo.on('document-loaded', async (doc: Y.Doc, roomName: string) => {
        const room = await RoomModel.findOne({ roomId: roomName });
        if (room?.content) {
            Y.applyUpdate(doc, room.content);
        }

        const lang = room?.language || 'typescript';
        const ext = getExtension(lang);
        const workspaceDir = path.join(process.cwd(), 'workspace', roomName);
        if (!fs.existsSync(workspaceDir)) {
            fs.mkdirSync(workspaceDir, { recursive: true });
        }

        doc.on('update', async () => {
            const state = Y.encodeStateAsUpdate(doc);
            await RoomModel.findOneAndUpdate(
                { roomId: roomName },
                { content: Buffer.from(state), lastUpdated: new Date() },
                { upsert: true }
            );

            // Sync editor content to physical file for the terminal
            try {
                const text = doc.getText('monaco').toString();
                fs.writeFileSync(path.join(workspaceDir, `index.${ext}`), text);
            } catch (err) {
                console.error("Failed to write to disk", err);
            }
        });
    });

    ysocketIo.initialize();
};
