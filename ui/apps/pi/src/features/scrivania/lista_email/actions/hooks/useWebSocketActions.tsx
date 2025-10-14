import toast from "@cmrc/ui/components/Toast";
import { useRef, useState } from "react";
import { useGetQueryEmailList } from "../../hooks/useDataEmailList";
import { dictionary } from "../dictionary";

export const useWebSocketActions = () => {
  const { refetch } = useGetQueryEmailList();
  const [onSycnronyze, setOnSyncronize] = useState(false);
  const socket = useRef<WebSocket | null>(null);

  const connectWebSocket = (user_id: string) => {
    if ( (!user_id) || (socket && socket.current && socket.current.readyState === WebSocket.OPEN) ) return;
    
    const webSocketUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/Pec/${user_id}`;
    socket.current = new WebSocket(webSocketUrl);
    console.log(`Weysocket : after create- ${socket.current.url}`);

    socket.current.onopen = () => {
      console.log('Connected to the web socket');
    };

    socket.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.current.onclose = () => {
      console.log('Disconnected from the web socket');
    };
  }
  
  const sendMessageToWebSocket = async (user_id: string, message: string) => {

    console.log("user_id", user_id);
    if ( user_id && (!(socket.current && socket.current.readyState === WebSocket.OPEN)) ) {
      connectWebSocket(user_id);
      toast.warn(dictionary.get('reSync'));
      return;
    }

    socket.current.onmessage = (m) => {
      const message = JSON.parse(m.data);
      if (message.message === 'producer') {
        console.log('Received producer message', message);
        if (message.workDone) {
          refetch();
          toast.success(dictionary.get('syncSuccess'));
        }
        setOnSyncronize(false);
      }
    };

    setOnSyncronize(true);
    socket.current.send(message);
    console.log(`Sending message to WebSocket: ${message}`);
  };

  const disconnectWebSocket = () => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      setOnSyncronize(false);
      socket.current.close();
      console.log('Disconnected from the web socket');
    }
  };

  return { connectWebSocket, disconnectWebSocket, sendMessageToWebSocket, onSycnronyze };
}