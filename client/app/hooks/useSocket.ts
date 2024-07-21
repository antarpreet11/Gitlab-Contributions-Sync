import { useEffect, useState } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_BACKEND_URL_PROD;
// const WS_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(WS_URL as string);

        ws.onopen = () => {
            setSocket(ws);      
        };

        ws.onclose = () => {
            setSocket(null);
        };

        return () => {
          ws.close();
        };
    }, []);

    return socket;
}