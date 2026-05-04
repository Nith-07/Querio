import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "bot";
  createdAt: string;
}

export interface ChatThread {
  id: string;
  messages: ChatMessage[];
  title: string;
  createdAt: string;
}

interface ChatContextType {
  threads: ChatThread[];
  activeThreadId: string | null;
  createThread: () => string;
  setActiveThread: (id: string | null) => void;
  sendMessage: (threadId: string, content: string) => Promise<void>;
  getActiveThread: () => ChatThread | undefined;
  isLoadingHistory: boolean;
}

const ChatContext = createContext<ChatContextType>({
  threads: [],
  activeThreadId: null,
  createThread: () => "",
  setActiveThread: () => {},
  sendMessage: async () => {},
  getActiveThread: () => undefined,
  isLoadingHistory: false,
});

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { token, isAuthenticated } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      setIsLoadingHistory(true);
      fetch('/api/chat/history', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then((data: ChatThread[]) => {
        setThreads(data);
        if (data.length > 0 && !activeThreadId) {
          setActiveThreadId(data[0].id);
        }
        setIsLoadingHistory(false);
      })
      .catch(() => {
        setIsLoadingHistory(false);
      });
    } else {
      setThreads([]);
      setActiveThreadId(null);
    }
  }, [isAuthenticated, token]);

  const createThread = () => {
    const id = ""; // empty string signals backend to create a new session
    setActiveThreadId(id);
    return id;
  };

  const setActiveThread = (id: string | null) => setActiveThreadId(id);

  const sendMessage = async (threadId: string, content: string) => {
    // Optimistic UI update could go here, but let's keep it simple and just rely on the server response
    
    // Create a temporary ID for optimistic UI
    const tempUserMsgId = Date.now().toString();
    const tempMsg: ChatMessage = { id: tempUserMsgId, content, role: 'user', createdAt: new Date().toISOString() };
    
    setThreads(prev => {
      let threadExists = false;
      const newThreads = prev.map(t => {
        if (t.id === threadId) {
          threadExists = true;
          return { ...t, messages: [...t.messages, tempMsg] };
        }
        return t;
      });
      
      if (!threadExists) {
        return [{ id: threadId, title: "New Conversation", createdAt: new Date().toISOString(), messages: [tempMsg] }, ...newThreads];
      }
      return newThreads;
    });

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId: threadId || null, content })
      });
      const data = await res.json();
      
      // Update with real data from server
      setThreads(prev => {
        let threadExists = false;
        const newThreads = prev.map(t => {
          if (t.id === threadId || t.id === "") { // Replace the temp thread if it was new
            threadExists = true;
            const otherMessages = t.messages.filter(m => m.id !== tempUserMsgId);
            return { ...t, id: data.sessionId, messages: [...otherMessages, ...data.messages] };
          }
          return t;
        });
        
        if (!threadExists) {
           return [{ id: data.sessionId, title: content.substring(0, 50) + "...", createdAt: new Date().toISOString(), messages: data.messages }, ...newThreads];
        }
        return newThreads;
      });
      
      if (!threadId) {
        setActiveThreadId(data.sessionId);
      }
      
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const getActiveThread = () => threads.find((t) => t.id === activeThreadId);

  return (
    <ChatContext.Provider
      value={{ threads, activeThreadId, createThread, setActiveThread, sendMessage, getActiveThread, isLoadingHistory }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
