import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Bell, FileText, Shield, Moon, Sun, Calendar, MessageCircle, Activity } from 'lucide-react-native';

export default function Dashboard() {
  const [focusMode, setFocusMode] = useState(false);

  const toggleFocusMode = () => {
    setFocusMode(!focusMode);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Good morning, Sarah</Text>
          <TouchableOpacity onPress={toggleFocusMode} style={styles.focusButton}>
            {focusMode ? (
              <Moon size={20} color="#2563EB" />
            ) : (
              <Sun size={20} color="#2563EB" />
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>How are you feeling today?</Text>
      </View>

      <View style={[styles.content, focusMode && styles.focusContent]}>
        {/* Patient Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Your Information</Text>
            <Shield size={16} color="#059669" />
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>MRN</Text>
              <Text style={styles.infoValue}>MRN-789456</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Account #</Text>
              <Text style={styles.infoValue}>ACC-123789</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <Calendar size={24} color="#2563EB" />
              <Text style={styles.actionText}>Schedule Appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <FileText size={24} color="#2563EB" />
              <Text style={styles.actionText}>Upload Documents</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle size={24} color="#2563EB" />
              <Text style={styles.actionText}>Message Care Team</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Activity size={24} color="#2563EB" />
              <Text style={styles.actionText}>Symptom Checker</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Pending Items */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Pending Items</Text>
            <Bell size={16} color="#EA580C" />
          </View>
          <View style={styles.pendingItem}>
            <View style={styles.pendingDot} />
            <Text style={styles.pendingText}>Upload insurance card</Text>
          </View>
          <View style={styles.pendingItem}>
            <View style={styles.pendingDot} />
            <Text style={styles.pendingText}>Complete health questionnaire</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text style={styles.activityEmoji}>✅</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Appointment scheduled for Jan 15</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Text style={styles.activityEmoji}>✅</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Lab results reviewed</Text>
              <Text style={styles.activityTime}>1 day ago</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  focusButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EBF4FF',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    padding: 16,
  },
  focusContent: {
    backgroundColor: '#FAFBFC',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  pendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EA580C',
    marginRight: 12,
  },
  pendingText: {
    fontSize: 16,
    color: '#374151',
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
  },
});