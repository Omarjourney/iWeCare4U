import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { Send, Search, Shield, Clock } from 'lucide-react-native';

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);

  const conversations = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Primary Care Physician',
      lastMessage: 'Your lab results are ready for review. Everything looks good!',
      timestamp: '2 hours ago',
      unread: true,
      avatar: '👩‍⚕️',
    },
    {
      id: 2,
      name: 'Case Manager - Lisa',
      role: 'Case Manager',
      lastMessage: 'Please upload your updated insurance card when you have a chance.',
      timestamp: '1 day ago',
      unread: false,
      avatar: '👩‍💼',
    },
    {
      id: 3,
      name: 'Dr. Michael Chen',
      role: 'Cardiologist',
      lastMessage: 'Great progress on your heart health! Keep up the good work.',
      timestamp: '3 days ago',
      unread: false,
      avatar: '👨‍⚕️',
    },
  ];

  const messages = [
    {
      id: 1,
      sender: 'Dr. Sarah Johnson',
      message: 'Hi Sarah! I wanted to let you know that your recent lab work came back and everything looks great. Your cholesterol levels have improved significantly.',
      timestamp: '2:30 PM',
      isFromPatient: false,
    },
    {
      id: 2,
      sender: 'You',
      message: 'That\'s wonderful news! Thank you for letting me know. Should I continue with my current medication?',
      timestamp: '2:45 PM',
      isFromPatient: true,
    },
    {
      id: 3,
      sender: 'Dr. Sarah Johnson',
      message: 'Yes, please continue with your current dosage. We\'ll recheck in 3 months during your next visit.',
      timestamp: '3:00 PM',
      isFromPatient: false,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.secureIndicator}>
          <Shield size={16} color="#059669" />
          <Text style={styles.secureText}>HIPAA Secure</Text>
        </View>
      </View>

      {!selectedConversation ? (
        <View style={styles.conversationList}>
          <View style={styles.searchContainer}>
            <Search size={16} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView style={styles.conversations}>
            {conversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.id}
                style={styles.conversationItem}
                onPress={() => setSelectedConversation(conversation)}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{conversation.avatar}</Text>
                </View>
                <View style={styles.conversationContent}>
                  <View style={styles.conversationHeader}>
                    <Text style={styles.conversationName}>{conversation.name}</Text>
                    <Text style={styles.timestamp}>{conversation.timestamp}</Text>
                  </View>
                  <Text style={styles.role}>{conversation.role}</Text>
                  <Text style={[styles.lastMessage, conversation.unread && styles.unreadMessage]}>
                    {conversation.lastMessage}
                  </Text>
                </View>
                {conversation.unread && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.messageView}>
          <View style={styles.messageHeader}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => setSelectedConversation(null)}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <View style={styles.conversationInfo}>
              <Text style={styles.conversationName}>{selectedConversation.name}</Text>
              <Text style={styles.role}>{selectedConversation.role}</Text>
            </View>
          </View>

          <ScrollView style={styles.messagesList}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageItem,
                  message.isFromPatient ? styles.patientMessage : styles.providerMessage,
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.isFromPatient ? styles.patientMessageText : styles.providerMessageText,
                ]}>
                  {message.message}
                </Text>
                <View style={styles.messageFooter}>
                  <Clock size={12} color="#6B7280" />
                  <Text style={styles.messageTime}>{message.timestamp}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.messageInput}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message..."
              multiline
            />
            <TouchableOpacity style={styles.sendButton}>
              <Send size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  secureIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  secureText: {
    fontSize: 12,
    color: '#059669',
    marginLeft: 4,
    fontWeight: '600',
  },
  conversationList: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
  },
  conversations: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  role: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#1F2937',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginLeft: 8,
  },
  messageView: {
    flex: 1,
  },
  messageHeader: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: '#2563EB',
  },
  conversationInfo: {
    alignItems: 'center',
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messageItem: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  patientMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563EB',
  },
  providerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  patientMessageText: {
    color: '#FFFFFF',
  },
  providerMessageText: {
    color: '#1F2937',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});