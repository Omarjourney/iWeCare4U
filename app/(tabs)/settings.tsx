import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { User, Shield, Bell, Eye, Keyboard, LogOut, ChevronRight } from 'lucide-react-native';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  const [focusMode, setFocusMode] = useState(false);

  const settingsGroups = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Personal Information', action: () => {}, hasChevron: true },
        { label: 'Change Password', action: () => {}, hasChevron: true },
        { label: 'Two-Factor Authentication', action: () => {}, hasChevron: true },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      items: [
        {
          label: 'Biometric Login',
          action: () => setBiometrics(!biometrics),
          hasSwitch: true,
          switchValue: biometrics,
        },
        {
          label: 'Data Sharing',
          action: () => setDataSharing(!dataSharing),
          hasSwitch: true,
          switchValue: dataSharing,
        },
        { label: 'Privacy Policy', action: () => {}, hasChevron: true },
        { label: 'Terms of Service', action: () => {}, hasChevron: true },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Push Notifications',
          action: () => setNotifications(!notifications),
          hasSwitch: true,
          switchValue: notifications,
        },
        { label: 'Email Notifications', action: () => {}, hasChevron: true },
        { label: 'SMS Notifications', action: () => {}, hasChevron: true },
      ],
    },
    {
      title: 'Accessibility',
      icon: Eye,
      items: [
        {
          label: 'Focus Mode',
          action: () => setFocusMode(!focusMode),
          hasSwitch: true,
          switchValue: focusMode,
        },
        { label: 'Text Size', action: () => {}, hasChevron: true },
        { label: 'High Contrast', action: () => {}, hasChevron: true },
      ],
    },
    {
      title: 'Keyboard Shortcuts',
      icon: Keyboard,
      items: [
        { label: 'Customize Shortcuts', action: () => {}, hasChevron: true },
        { label: 'Reset to Default', action: () => {}, hasChevron: true },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitials}>SJ</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Sarah Johnson</Text>
            <Text style={styles.profileEmail}>sarah.johnson@email.com</Text>
            <Text style={styles.profileMRN}>MRN: 789456</Text>
          </View>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingsGroup}>
            <View style={styles.groupHeader}>
              <group.icon size={20} color="#6B7280" />
              <Text style={styles.groupTitle}>{group.title}</Text>
            </View>
            
            <View style={styles.groupItems}>
              {group.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingsItem,
                    itemIndex === group.items.length - 1 && styles.lastItem,
                  ]}
                  onPress={item.action}
                >
                  <Text style={styles.settingsItemLabel}>{item.label}</Text>
                  {item.hasSwitch && (
                    <Switch
                      value={item.switchValue}
                      onValueChange={item.action}
                      trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                      thumbColor={item.switchValue ? '#2563EB' : '#F3F4F6'}
                    />
                  )}
                  {item.hasChevron && (
                    <ChevronRight size={16} color="#6B7280" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* HIPAA Compliance Info */}
        <View style={styles.complianceCard}>
          <View style={styles.complianceHeader}>
            <Shield size={20} color="#059669" />
            <Text style={styles.complianceTitle}>HIPAA Compliance</Text>
          </View>
          <Text style={styles.complianceText}>
            Your health information is protected under HIPAA regulations. All data is encrypted
            and stored securely according to healthcare industry standards.
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.buildText}>Build 2025.01.15</Text>
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
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  profileMRN: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  groupItems: {
    padding: 0,
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingsItemLabel: {
    fontSize: 16,
    color: '#374151',
  },
  complianceCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  complianceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  complianceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginLeft: 8,
  },
  complianceText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  buildText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});