import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const { isAuthenticated, accessToken } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        let newSocket;

        if (isAuthenticated && accessToken) {
            newSocket = io('http://localhost:5001', {
                auth: {
                    token: accessToken
                }
            });

            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Connected to socket server');
            });

            newSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err.message);
            });

            return () => {
                newSocket.disconnect();
                setSocket(null);
            };
        } else {
            setSocket(null);
        }
    }, [isAuthenticated, accessToken]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
