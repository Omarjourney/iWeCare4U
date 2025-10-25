import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

// Interface for component props
interface MessageComposerProps {
  onSendMessage: (message: string, attachment?: File) => void;
}

/**
 * MessageComposer Component
 * Provides text input, Send button, and Attach button for composing messages
 */
export const MessageComposer: React.FC<MessageComposerProps> = ({ onSendMessage }) => {
  const [messageText, setMessageText] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for Send button - adds message to thread
  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText, attachedFile || undefined);
      // Clear input after sending
      setMessageText('');
      setAttachedFile(null);
      // TODO: Hook up to chatService.sendMessage() when backend is ready
    }
  };

  // Handler for Attach button - opens file dialog (mocked for now)
  const handleAttach = () => {
    // Mock file dialog for now
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
    // TODO: Integrate with actual file upload service
  };

  // Handler for file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile(file);
      // TODO: Validate file type and size before accepting
    }
  };

  return (
    <View style={styles.container}>
      {/* Hidden file input for attachment */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Attachment indicator */}
      {attachedFile && (
        <View style={styles.attachmentIndicator}>
          <Text style={styles.attachmentText}>📎 {attachedFile.name}</Text>
          <TouchableOpacity onPress={() => setAttachedFile(null)}>
            <Text style={styles.removeButton}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.composerRow}>
        {/* Text input for message */}
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={1000}
        />

        {/* Attach button */}
        <TouchableOpacity
          style={styles.attachButton}
          onPress={handleAttach}
          accessibilityLabel="Attach file"
        >
          <Text style={styles.buttonText}>📎</Text>
        </TouchableOpacity>

        {/* Send button */}
        <TouchableOpacity
          style={[styles.sendButton, !messageText.trim() && styles.disabledButton]}
          onPress={handleSend}
          disabled={!messageText.trim()}
          accessibilityLabel="Send message"
        >
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 100,
  },
  attachButton: {
    backgroundColor: '#6c757d',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  attachmentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentText: {
    flex: 1,
    fontSize: 14,
  },
  removeButton: {
    fontSize: 18,
    color: '#dc3545',
    paddingHorizontal: 8,
  },
});
