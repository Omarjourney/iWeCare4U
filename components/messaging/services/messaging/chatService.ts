/**
 * chatService.ts - Messaging Service: Real-time Transport
 * PURPOSE: Abstract real-time messaging (Socket.io/Firebase) with a consistent API.
 * STATUS: 🚧 PLACEHOLDER - scaffolding only
 */

export type Message = {
  id: string;
  threadId: string;
  senderId: string;
  text: string;
  createdAt: number; // epoch ms
  readBy?: string[];
};

let connectedUserId: string | null = null;

export async function connect(userId: string) {
  connectedUserId = userId;
  // TODO: init websocket or Firebase here
  return true;
}

export async function disconnect() {
  // TODO: close connections
  connectedUserId = null;
}

export function onMessage(cb: (msg: Message) => void) {
  // TODO: subscribe to real-time events
  // Return unsubscribe
  return () => {};
}

export async function sendMessage(threadId: string, text: string): Promise<Message> {
  if (!connectedUserId) throw new Error('Not connected');
  // TODO: send via transport
  return {
    id: Math.random().toString(36).slice(2),
    threadId,
    senderId: connectedUserId,
    text,
    createdAt: Date.now(),
  };
}

export async function listThreads(userId: string) {
  // TODO: fetch from backend
  return [] as { id: string; members: string[]; lastMessage?: Message }[];
}

/* Next steps:
- Add encryption.ts and integrate E2EE
- Implement retries, backoff, and offline queue
- Wire to push notifications
*/
