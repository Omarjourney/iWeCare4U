/**
 * ChatInterface.tsx - Main Messaging Interface
 * 
 * Wires together MessageComposer, MessageThread, and CareTeamList components
 * All interactions update UI state in-memory (no backend integration yet)
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MessageComposer } from './MessageComposer';
import { MessageThread, Message } from './MessageThread';
import { CareTeamList, CareTeamMember } from './CareTeamList';

interface ChatInterfaceProps {
  userId?: string;
  defaultThreadId?: string;
}

/**
 * Main ChatInterface Component
 * Coordinates all messaging sub-components and manages global state
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  userId = 'current-user',
  defaultThreadId 
}) => {
  // State: Current selected care team member for conversation
  const [selectedMemberId, setSelectedMemberId] = useState<string | undefined>(defaultThreadId);
  
  // State: Messages in the current thread
  const [messages, setMessages] = useState<Message[]>([
    // Sample initial messages for demonstration
    {
      id: 'msg-1',
      senderId: 'coach-1',
      senderName: 'Dr. Sarah Johnson',
      text: 'Hi! How are you feeling today?',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: 'msg-2',
      senderId: userId,
      senderName: 'You',
      text: 'Doing much better, thank you!',
      timestamp: new Date(Date.now() - 1800000),
    },
  ]);

  // State: Care team members list
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>([
    {
      id: 'coach-1',
      name: 'Dr. Sarah Johnson',
      role: 'Lead Coach',
      status: 'online',
      lastMessage: 'Hi! How are you feeling today?',
      unreadCount: 0,
    },
    {
      id: 'therapist-1',
      name: 'Michael Chen',
      role: 'Therapist',
      status: 'busy',
      lastMessage: 'Let\'s schedule our next session',
      unreadCount: 2,
    },
    {
      id: 'nurse-1',
      name: 'Emily Rodriguez',
      role: 'Care Coordinator',
      status: 'offline',
      lastMessage: 'I\'ve updated your care plan',
      unreadCount: 0,
    },
  ]);

  // Handler: Send message from MessageComposer
  // Adds the new message to the thread and updates UI
  const handleSendMessage = (messageText: string, attachment?: File) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: userId,
      senderName: 'You',
      text: messageText,
      timestamp: new Date(),
      attachmentName: attachment?.name,
    };

    // Add message to thread (in-memory update)
    setMessages(prev => [...prev, newMessage]);

    // TODO: Hook up to chatService.sendMessage() when backend is ready
    // await chatService.sendMessage(selectedMemberId, messageText, attachment);

    // Update care team member's last message
    if (selectedMemberId) {
      setCareTeam(prev => prev.map(member => 
        member.id === selectedMemberId 
          ? { ...member, lastMessage: messageText }
          : member
      ));
    }
  };

  // Handler: Reply to a message in MessageThread
  // Marks the message as replied (mocked behavior)
  const handleReplyToMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, replied: true }
        : msg
    ));

    // TODO: Hook up to chatService.replyToMessage() when backend is ready
    // await chatService.replyToMessage(messageId);
  };

  // Handler: Start conversation with a care team member
  // Switches to that member's message thread
  const handleMessageContact = (memberId: string) => {
    setSelectedMemberId(memberId);

    // Clear unread count for selected member
    setCareTeam(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, unreadCount: 0 }
        : member
    ));

    // TODO: Fetch messages for this member from backend
    // const threadMessages = await chatService.getThreadMessages(memberId);
    // setMessages(threadMessages);

    // For now, filter messages by sender (mock behavior)
    // In production, you'd fetch the actual thread from the backend
  };

  // Handler: View care team member profile
  const handleViewProfile = (memberId: string) => {
    // Mock behavior - log to console
    console.log('Viewing profile for member:', memberId);
    
    // TODO: Hook up to navigation or modal to show profile
    // navigation.navigate('Profile', { userId: memberId });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Care Team Messaging</Text>
        {selectedMemberId && (
          <Text style={styles.subtitle}>
            {careTeam.find(m => m.id === selectedMemberId)?.name || 'Select a contact'}
          </Text>
        )}
      </View>

      {/* Main layout: Care team list and chat area */}
      <View style={styles.content}>
        {/* Left sidebar: Care team list */}
        <View style={styles.sidebar}>
          <CareTeamList
            members={careTeam}
            onMessageContact={handleMessageContact}
            onViewProfile={handleViewProfile}
            selectedMemberId={selectedMemberId}
          />
        </View>

        {/* Right area: Message thread and composer */}
        <View style={styles.chatArea}>
          {selectedMemberId ? (
            <>
              {/* Message thread */}
              <MessageThread
                messages={messages}
                onReply={handleReplyToMessage}
                currentUserId={userId}
              />

              {/* Message composer */}
              <MessageComposer onSendMessage={handleSendMessage} />
            </>
          ) : (
            /* Empty state when no contact selected */
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>👋</Text>
              <Text style={styles.emptyTitle}>Welcome to Care Team Messaging</Text>
              <Text style={styles.emptySubtext}>
                Select a care team member from the list to start a conversation
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 320,
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
    backgroundColor: '#fff',
  },
  chatArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default ChatInterface;
