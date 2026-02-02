const { Server } = require('socket.io');
const { verifyAccessToken } = require('./jwt');

let io;
const userSockets = new Map(); // userId -> Set of socketIds

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            credentials: true
        }
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        try {
            const decoded = verifyAccessToken(token);
            socket.userId = decoded.userId;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.userId;
        console.log(`User connected: ${userId} (Socket: ${socket.id})`);

        // Join a room specifically for this user
        socket.join(`user:${userId}`);

        // Track user sockets
        if (!userSockets.has(userId)) {
            userSockets.set(userId, new Set());
        }
        userSockets.get(userId).add(socket.id);

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId} (Socket: ${socket.id})`);
            const sockets = userSockets.get(userId);
            if (sockets) {
                sockets.delete(socket.id);
                if (sockets.size === 0) {
                    userSockets.delete(userId);
                }
            }
        });
    });

    return io;
};

const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

// Emit event to a specific user
const emitToUser = (userId, event, data) => {
    if (io) {
        io.to(`user:${userId}`).emit(event, data);
    }
};

module.exports = {
    initSocket,
    getIO,
    emitToUser
};
