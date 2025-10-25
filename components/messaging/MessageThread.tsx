import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

// Interface for a message in the thread
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  replied?: boolean;
  attachmentName?: string;
}

// Interface for component props
interface MessageThreadProps {
  messages: Message[];
  onReply: (messageId: string) => void;
  currentUserId?: string;
}

/**
 * MessageThread Component
 * Displays messages as a list with Reply buttons
 * Clicking Reply adds a 'replied' status to the message
 */
export const MessageThread: React.FC<MessageThreadProps> = ({ 
  messages, 
  onReply,
  currentUserId = 'current-user'
}) => {
  // Format timestamp for display
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  // Handler for Reply button - marks message as replied
  const handleReply = (messageId: string) => {
    onReply(messageId);
    // TODO: Hook up to chatService.replyToMessage() when backend is ready
  };

  return (
    <ScrollView style={styles.container}>
      {messages.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No messages yet</Text>
          <Text style={styles.emptySubtext}>Start a conversation!</Text>
        </View>
      ) : (
        messages.map((message) => {
          const isCurrentUser = message.senderId === currentUserId;
          
          return (
            <View 
              key={message.id} 
              style={[
                styles.messageContainer,
                isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage
              ]}
            >
              {/* Sender name (for other users' messages) */}
              {!isCurrentUser && (
                <Text style={styles.senderName}>{message.senderName}</Text>
              )}
              
              {/* Message bubble */}
              <View 
                style={[
                  styles.messageBubble,
                  isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
                ]}
              >
                {/* Message text */}
                <Text 
                  style={[
                    styles.messageText,
                    isCurrentUser ? styles.currentUserText : styles.otherUserText
                  ]}
                >
                  {message.text}
                </Text>

                {/* Attachment indicator */}
                {message.attachmentName && (
                  <View style={styles.attachmentBadge}>
                    <Text style={styles.attachmentBadgeText}>
                      📎 {message.attachmentName}
                    </Text>
                  </View>
                )}

                {/* Timestamp */}
                <Text style={styles.timestamp}>
                  {formatTime(message.timestamp)}
                </Text>

                {/* Replied status indicator */}
                {message.replied && (
                  <View style={styles.repliedBadge}>
                    <Text style={styles.repliedText}>✓ Replied</Text>
                  </View>
                )}
              </View>

              {/* Reply button */}
              {!isCurrentUser && (
                <TouchableOpacity
                  style={[
                    styles.replyButton,
                    message.replied && styles.repliedButton
                  ]}
                  onPress={() => handleReply(message.id)}
                  disabled={message.replied}
                  accessibilityLabel={`Reply to ${message.senderName}`}
                >
                  <Text style={styles.replyButtonText}>
                    {message.replied ? 'Replied ✓' : 'Reply'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 5,
  },
  messageContainer: {
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  currentUserMessage: {
    alignItems: 'flex-end',
  },
  otherUserMessage: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    marginLeft: 10,
    fontWeight: '600',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  currentUserBubble: {
    backgroundColor: '#007bff',
    borderBottomRightRadius: 4,
  },
  otherUserBubble: {
    backgroundColor: '#f1f3f5',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  currentUserText: {
    color: '#fff',
  },
  otherUserText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'right',
  },
  attachmentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 6,
    marginTop: 6,
  },
  attachmentBadgeText: {
    fontSize: 12,
    color: '#fff',
  },
  repliedBadge: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  repliedText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  replyButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
  repliedButton: {
    backgroundColor: '#28a745',
  },
  replyButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
