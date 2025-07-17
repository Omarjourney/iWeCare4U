import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Activity, Heart, Thermometer, Scale, Upload, Brain } from 'lucide-react-native';

export default function Health() {
  const [activeTab, setActiveTab] = useState('overview');

  const healthMetrics = [
    {
      icon: Heart,
      label: 'Heart Rate',
      value: '68 bpm',
      status: 'normal',
      color: '#DC2626',
      lastUpdated: '2 hours ago',
    },
    {
      icon: Activity,
      label: 'Steps',
      value: '8,432',
      status: 'good',
      color: '#059669',
      lastUpdated: '1 hour ago',
    },
    {
      icon: Scale,
      label: 'Weight',
      value: '145 lbs',
      status: 'stable',
      color: '#2563EB',
      lastUpdated: '3 days ago',
    },
    {
      icon: Thermometer,
      label: 'Temperature',
      value: '98.6°F',
      status: 'normal',
      color: '#EA580C',
      lastUpdated: '1 week ago',
    },
  ];

  const symptoms = [
    { id: 1, name: 'Headache', severity: 'mild', date: 'Jan 10' },
    { id: 2, name: 'Fatigue', severity: 'moderate', date: 'Jan 8' },
    { id: 3, name: 'Dizziness', severity: 'mild', date: 'Jan 6' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Tracking</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Upload size={16} color="#2563EB" />
          <Text style={styles.uploadText}>Sync Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'symptoms' && styles.activeTab]}
            onPress={() => setActiveTab('symptoms')}
          >
            <Text style={[styles.tabText, activeTab === 'symptoms' && styles.activeTabText]}>
              Symptoms
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'overview' && (
          <View>
            {/* Health Metrics */}
            <View style={styles.metricsGrid}>
              {healthMetrics.map((metric, index) => (
                <View key={index} style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricIcon, { backgroundColor: `${metric.color}15` }]}>
                      <metric.icon size={20} color={metric.color} />
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(metric.status) }]}>
                      <Text style={styles.statusText}>{metric.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={styles.lastUpdated}>Updated {metric.lastUpdated}</Text>
                </View>
              ))}
            </View>

            {/* AI Symptom Checker */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Brain size={20} color="#8B5CF6" />
                <Text style={styles.cardTitle}>AI Symptom Checker</Text>
              </View>
              <Text style={styles.cardDescription}>
                Describe any symptoms you're experiencing and get personalized insights
              </Text>
              <TouchableOpacity style={styles.symptomButton}>
                <Text style={styles.symptomButtonText}>Start Symptom Check</Text>
              </TouchableOpacity>
            </View>

            {/* Connected Devices */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Connected Devices</Text>
              <View style={styles.deviceList}>
                <View style={styles.deviceItem}>
                  <View style={styles.deviceIcon}>
                    <Text style={styles.deviceEmoji}>⌚</Text>
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>Apple Watch</Text>
                    <Text style={styles.deviceStatus}>Connected</Text>
                  </View>
                  <View style={styles.connectedDot} />
                </View>
                <View style={styles.deviceItem}>
                  <View style={styles.deviceIcon}>
                    <Text style={styles.deviceEmoji}>📱</Text>
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>iPhone Health</Text>
                    <Text style={styles.deviceStatus}>Connected</Text>
                  </View>
                  <View style={styles.connectedDot} />
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'symptoms' && (
          <View>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Recent Symptoms</Text>
                <TouchableOpacity style={styles.addSymptomButton}>
                  <Text style={styles.addSymptomText}>+ Add</Text>
                </TouchableOpacity>
              </View>
              
              {symptoms.map((symptom) => (
                <View key={symptom.id} style={styles.symptomItem}>
                  <View style={styles.symptomInfo}>
                    <Text style={styles.symptomName}>{symptom.name}</Text>
                    <Text style={styles.symptomDate}>{symptom.date}</Text>
                  </View>
                  <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(symptom.severity) }]}>
                    <Text style={styles.severityText}>{symptom.severity}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal': return '#F0FDF4';
    case 'good': return '#EBF4FF';
    case 'stable': return '#EBF4FF';
    default: return '#FEF3C7';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'mild': return '#FEF3C7';
    case 'moderate': return '#FED7AA';
    case 'severe': return '#FEE2E2';
    default: return '#F3F4F6';
  }
};

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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadText: {
    fontSize: 14,
    color: '#2563EB',
    marginLeft: 4,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#059669',
    textTransform: 'capitalize',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9CA3AF',
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
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  symptomButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  symptomButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deviceList: {
    marginTop: 16,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceEmoji: {
    fontSize: 20,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  deviceStatus: {
    fontSize: 14,
    color: '#6B7280',
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  addSymptomButton: {
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addSymptomText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  symptomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  symptomInfo: {
    flex: 1,
  },
  symptomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  symptomDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  severityBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D97706',
    textTransform: 'capitalize',
  },
});