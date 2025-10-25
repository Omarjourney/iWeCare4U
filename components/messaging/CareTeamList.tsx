import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Interface for a care team member/contact
export interface CareTeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  lastMessage?: string;
  unreadCount?: number;
}

// Interface for component props
interface CareTeamListProps {
  members: CareTeamMember[];
  onMessageContact: (memberId: string) => void;
  onViewProfile: (memberId: string) => void;
  selectedMemberId?: string;
}

/**
 * CareTeamList Component
 * Shows a contact/user list with message/contact action buttons
 */
export const CareTeamList: React.FC<CareTeamListProps> = ({
  members,
  onMessageContact,
  onViewProfile,
  selectedMemberId,
}) => {
  // Render status indicator
  const renderStatusIndicator = (status: CareTeamMember['status']) => {
    const colors = {
      online: '#28a745',
      offline: '#6c757d',
      busy: '#ffc107',
    };

    return (
      <View style={[styles.statusIndicator, { backgroundColor: colors[status] }]} />
    );
  };

  // Handler for message button
  const handleMessage = (memberId: string) => {
    onMessageContact(memberId);
    // TODO: Hook up to chatService.startConversation() when backend is ready
  };

  // Handler for view profile button
  const handleViewProfile = (memberId: string) => {
    onViewProfile(memberId);
    // TODO: Hook up to userService.getProfile() when backend is ready
  };

  // Render individual care team member
  const renderMember = ({ item }: { item: CareTeamMember }) => {
    const isSelected = item.id === selectedMemberId;

    return (
      <View 
        style={[
          styles.memberContainer,
          isSelected && styles.selectedMember
        ]}
      >
        {/* Avatar section */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          {renderStatusIndicator(item.status)}
        </View>

        {/* Member info section */}
        <View style={styles.memberInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.memberName}>{item.name}</Text>
            {item.unreadCount && item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={styles.memberRole}>{item.role}</Text>
          {item.lastMessage && (
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          )}
        </View>

        {/* Action buttons section */}
        <View style={styles.actionsContainer}>
          {/* Message button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleMessage(item.id)}
            accessibilityLabel={`Message ${item.name}`}
          >
            <Text style={styles.actionButtonText}>💬</Text>
          </TouchableOpacity>

          {/* View profile button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => handleViewProfile(item.id)}
            accessibilityLabel={`View ${item.name}'s profile`}
          >
            <Text style={styles.actionButtonText}>👤</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Care Team</Text>
        <Text style={styles.headerSubtitle}>
          {members.length} {members.length === 1 ? 'member' : 'members'}
        </Text>
      </View>

      {/* Members list */}
      {members.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No care team members yet</Text>
        </View>
      ) : (
        <FlatList
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 2,
  },
  listContent: {
    paddingVertical: 8,
  },
  memberContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  selectedMember: {
    backgroundColor: '#e7f3ff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  memberInfo: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  memberRole: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 12,
    color: '#adb5bd',
    fontStyle: 'italic',
  },
  unreadBadge: {
    backgroundColor: '#dc3545',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    backgroundColor: '#007bff',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
  },
  actionButtonText: {
    fontSize: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#adb5bd',
    textAlign: 'center',
  },
});
