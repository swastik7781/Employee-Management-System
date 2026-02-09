import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';

interface SocketUser {
    userId: string;
    socketId: string;
}

const onlineUsers: Map<string, string> = new Map();

export const initializeSocket = (io: SocketIOServer) => {
    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded: any = jwt.verify(
                token,
                process.env.JWT_SECRET || 'default-secret'
            );
            socket.data.userId = decoded.id;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        logger.info(`User connected: ${userId}`);

        // Store online user
        onlineUsers.set(userId, socket.id);

        // Emit online users
        io.emit('users:online', Array.from(onlineUsers.keys()));

        // Join user's personal room
        socket.join(`user:${userId}`);

        // Handle chat messages
        socket.on('chat:message', (data) => {
            io.to(`chat:${data.chatId}`).emit('chat:newMessage', data);
        });

        // Handle typing indicator
        socket.on('chat:typing', (data) => {
            socket.to(`chat:${data.chatId}`).emit('chat:userTyping', {
                userId,
                chatId: data.chatId,
            });
        });

        // Handle notifications
        socket.on('notification:send', (data) => {
            io.to(`user:${data.recipientId}`).emit('notification:new', data);
        });

        // Handle attendance updates
        socket.on('attendance:update', (data) => {
            io.emit('attendance:changed', data);
        });

        // Handle leave updates
        socket.on('leave:update', (data) => {
            io.emit('leave:changed', data);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            logger.info(`User disconnected: ${userId}`);
            onlineUsers.delete(userId);
            io.emit('users:online', Array.from(onlineUsers.keys()));
        });
    });

    logger.info('Socket.IO initialized');
};

export const getOnlineUsers = () => {
    return Array.from(onlineUsers.keys());
};

export const emitToUser = (io: SocketIOServer, userId: string, event: string, data: any) => {
    io.to(`user:${userId}`).emit(event, data);
};
