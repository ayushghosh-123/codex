import { Server } from 'socket.io';
import { YSocketIO } from 'y-socket.io/dist/server';
import * as Y from 'yjs';
import { RoomModel } from '../models/Room';

export const setupYSocket = (io: Server) => {
    const ysocketIo = new YSocketIO(io);

    ysocketIo.on('document-loaded', async (doc: Y.Doc, roomName: string) => {
        const room = await RoomModel.findOne({ roomId: roomName });
        if (room?.content) {
            Y.applyUpdate(doc, room.content);
        }

        doc.on('update', async () => {
            const state = Y.encodeStateAsUpdate(doc);
            await RoomModel.findOneAndUpdate(
                { roomId: roomName },
                { content: Buffer.from(state), lastUpdated: new Date() },
                { upsert: true }
            );
        });
    });

    ysocketIo.initialize();
};
