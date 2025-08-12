"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocket = void 0;
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const setupSocket = (io) => {
    // Production-ready JWT authentication
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication token required'));
            }
            // Remove 'Bearer ' prefix if present
            const cleanToken = token.replace('Bearer ', '');
            // Verify JWT token using NextAuth secret
            const secret = process.env.NEXTAUTH_SECRET;
            if (!secret) {
                console.error('NEXTAUTH_SECRET not configured');
                return next(new Error('Server configuration error'));
            }
            try {
                // Decode the JWT token
                const decoded = jsonwebtoken_1.default.verify(cleanToken, secret);
                // Get user from database to ensure they still exist and get latest info
                const user = await db_1.db.user.findUnique({
                    where: { id: decoded.sub || decoded.userId },
                    select: { id: true, name: true, email: true, role: true }
                });
                if (!user) {
                    return next(new Error('User not found'));
                }
                // Attach user info to socket
                socket.userId = user.id;
                socket.userRole = user.role;
                socket.userName = user.name || user.email;
                console.log(`✅ User authenticated: ${socket.userId} (${socket.userName})`);
                next();
            }
            catch (jwtError) {
                console.error('JWT verification failed:', jwtError);
                return next(new Error('Invalid authentication token'));
            }
        }
        catch (error) {
            console.error('Socket authentication error:', error);
            next(new Error('Authentication failed'));
        }
    });
    io.on('connection', (socket) => {
        console.log(`🔌 Client connected: ${socket.id} (User: ${socket.userId})`);
        // Join user-specific room for notifications
        socket.join(`user:${socket.userId}`);
        // Handle joining conversation rooms
        socket.on('conversation:join', async (conversationId) => {
            try {
                // Verify user has access to this conversation
                const participant = await db_1.db.conversationParticipant.findFirst({
                    where: {
                        conversationId,
                        userId: socket.userId,
                        leftAt: null // User hasn't left the conversation
                    },
                    include: {
                        conversation: {
                            include: {
                                participants: {
                                    where: { leftAt: null },
                                    include: { user: { select: { id: true, name: true, email: true } } }
                                }
                            }
                        }
                    }
                });
                if (!participant) {
                    socket.emit('error', { message: 'Access denied: Not a participant in this conversation' });
                    return;
                }
                socket.join(`conversation:${conversationId}`);
                console.log(`👥 User ${socket.userId} joined conversation ${conversationId}`);
                // Get recent messages from database
                const messages = await db_1.db.message.findMany({
                    where: { conversationId },
                    include: {
                        sender: { select: { id: true, name: true, email: true, image: true } }
                    },
                    orderBy: { createdAt: 'asc' },
                    take: 50 // Limit to recent 50 messages
                });
                // Update last read timestamp
                await db_1.db.conversationParticipant.update({
                    where: {
                        id: participant.id
                    },
                    data: {
                        lastReadAt: new Date()
                    }
                });
                socket.emit('conversation:messages', {
                    conversationId,
                    messages: messages.map(msg => ({
                        id: msg.id,
                        conversationId: msg.conversationId,
                        senderId: msg.senderId,
                        content: msg.content,
                        createdAt: msg.createdAt.toISOString(),
                        readAt: msg.readAt?.toISOString(),
                        sender: {
                            id: msg.sender.id,
                            name: msg.sender.name || msg.sender.email,
                            image: msg.sender.image
                        }
                    })),
                    participants: participant.conversation.participants.map(p => ({
                        id: p.user.id,
                        name: p.user.name || p.user.email,
                        role: p.role,
                        joinedAt: p.joinedAt.toISOString()
                    }))
                });
            }
            catch (error) {
                console.error('Error joining conversation:', error);
                socket.emit('error', { message: 'Failed to join conversation' });
            }
        });
        // Handle leaving conversation rooms
        socket.on('conversation:leave', (conversationId) => {
            socket.leave(`conversation:${conversationId}`);
            console.log(`👋 User ${socket.userId} left conversation ${conversationId}`);
        });
        // Handle sending messages
        socket.on('message:send', async (data) => {
            try {
                const { conversationId, content, senderId } = data;
                // Verify sender is the authenticated user
                if (senderId !== socket.userId) {
                    socket.emit('error', { message: 'Unauthorized: Cannot send as another user' });
                    return;
                }
                // Verify user is a participant in the conversation
                const participant = await db_1.db.conversationParticipant.findFirst({
                    where: {
                        conversationId,
                        userId: socket.userId,
                        leftAt: null
                    }
                });
                if (!participant) {
                    socket.emit('error', { message: 'Access denied: Not a participant in this conversation' });
                    return;
                }
                // Store message in database
                const message = await db_1.db.message.create({
                    data: {
                        conversationId,
                        senderId,
                        content
                    },
                    include: {
                        sender: { select: { id: true, name: true, email: true, image: true } }
                    }
                });
                // Update conversation timestamp
                await db_1.db.conversation.update({
                    where: { id: conversationId },
                    data: { updatedAt: new Date() }
                });
                // Prepare message for broadcasting
                const messageData = {
                    id: message.id,
                    conversationId: message.conversationId,
                    senderId: message.senderId,
                    content: message.content,
                    createdAt: message.createdAt.toISOString(),
                    readAt: message.readAt?.toISOString(),
                    sender: {
                        id: message.sender.id,
                        name: message.sender.name || message.sender.email,
                        image: message.sender.image
                    }
                };
                // Broadcast message to all participants in the conversation
                io.to(`conversation:${conversationId}`).emit('message:received', {
                    conversationId,
                    message: messageData
                });
                console.log(`💬 Message sent in conversation ${conversationId} by ${socket.userId}`);
            }
            catch (error) {
                console.error('Error sending message:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });
        // Handle typing indicators
        socket.on('typing:start', (data) => {
            socket.to(`conversation:${data.conversationId}`).emit('typing:update', {
                conversationId: data.conversationId,
                userId: socket.userId,
                isTyping: true
            });
        });
        socket.on('typing:stop', (data) => {
            socket.to(`conversation:${data.conversationId}`).emit('typing:update', {
                conversationId: data.conversationId,
                userId: socket.userId,
                isTyping: false
            });
        });
        // Handle marking messages as read
        socket.on('message:read', async (data) => {
            try {
                // Verify user is a participant
                const participant = await db_1.db.conversationParticipant.findFirst({
                    where: {
                        conversationId: data.conversationId,
                        userId: socket.userId,
                        leftAt: null
                    }
                });
                if (!participant) {
                    socket.emit('error', { message: 'Access denied: Not a participant in this conversation' });
                    return;
                }
                // Update message read status
                await db_1.db.message.update({
                    where: { id: data.messageId },
                    data: { readAt: new Date() }
                });
                // Update participant's last read timestamp
                await db_1.db.conversationParticipant.update({
                    where: { id: participant.id },
                    data: { lastReadAt: new Date() }
                });
                // Broadcast read receipt to other participants
                socket.to(`conversation:${data.conversationId}`).emit('message:read_update', {
                    conversationId: data.conversationId,
                    messageId: data.messageId,
                    readBy: socket.userId,
                    readAt: new Date().toISOString()
                });
            }
            catch (error) {
                console.error('Error marking message as read:', error);
                socket.emit('error', { message: 'Failed to mark message as read' });
            }
        });
        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`🔌 Client disconnected: ${socket.id} (User: ${socket.userId})`);
        });
        // Send welcome message to authenticated user
        socket.emit('connection:success', {
            message: 'Connected to real-time messaging',
            userId: socket.userId,
            timestamp: new Date().toISOString()
        });
    });
};
exports.setupSocket = setupSocket;
