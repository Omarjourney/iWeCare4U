import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';
import { Calendar, TrendingUp, Eye, Share } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface MoodEntry {
  id: string;
  date: string;
  mood: string;
  intensity: number;
  colors: string[];
  activities: string[];
  notes?: string;
}

// Mock data for demonstration
const mockMoodData: MoodEntry[] = [
  {
    id: '1',
    date: '2025-01-15',
    mood: 'happy',
    intensity: 8,
    colors: ['yellow', 'green'],
    activities: ['drawing', 'playing'],
    notes: 'Had a great day at school!'
  },
  {
    id: '2',
    date: '2025-01-14',
    mood: 'calm',
    intensity: 6,
    colors: ['blue', 'green'],
    activities: ['reading', 'music'],
  },
  {
    id: '3',
    date: '2025-01-13',
    mood: 'worried',
    intensity: 4,
    colors: ['gray', 'blue'],
    activities: ['talking', 'breathing'],
    notes: 'Felt better after talking to mom'
  },
  {
    id: '4',
    date: '2025-01-12',
    mood: 'excited',
    intensity: 9,
    colors: ['yellow', 'orange'],
    activities: ['playing', 'running'],
  },
  {
    id: '5',
    date: '2025-01-11',
    mood: 'sad',
    intensity: 3,
    colors: ['blue', 'gray'],
    activities: ['drawing', 'hugging'],
    notes: 'Missing grandma'
  },
];

const moodEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  worried: '😰',
  excited: '🤩',
  calm: '😌',
  tired: '😴',
  confused: '😕',
};

const colorMap: Record<string, string> = {
  yellow: '#FEF08A',
  blue: '#93C5FD',
  green: '#86EFAC',
  purple: '#C4B5FD',
  pink: '#F9A8D4',
  orange: '#FDBA74',
  red: '#FCA5A5',
  gray: '#D1D5DB',
};

interface Props {
  age: number;
  config: any;
  sessionData: any;
  onComplete: (data: any) => void;
}

export function MoodJournal({ age, config, sessionData, onComplete }: Props) {
  const [viewMode, setViewMode] = useState<'timeline' | 'trends' | 'guardian'>('timeline');
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

  const viewModes = [
    { id: 'timeline', title: 'My Journey', icon: Calendar },
    { id: 'trends', title: 'Patterns', icon: TrendingUp },
    { id: 'guardian', title: 'Share View', icon: Eye },
  ];

  const getWeeklyTrend = () => {
    const weekData = mockMoodData.slice(0, 7);
    const avgIntensity = weekData.reduce((sum, entry) => sum + entry.intensity, 0) / weekData.length;
    const mostCommonMood = weekData.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topMood = Object.entries(mostCommonMood).sort(([,a], [,b]) => b - a)[0];
    
    return {
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      topMood: topMood ? topMood[0] : 'calm',
      totalEntries: weekData.length
    };
  };

  const renderTimelineView = () => (
    <ScrollView style={styles.timelineContainer}>
      {mockMoodData.map((entry) => (
        <TouchableOpacity
          key={entry.id}
          style={styles.timelineEntry}
          onPress={() => setSelectedEntry(entry)}
        >
          <View style={styles.entryDate}>
            <Text style={styles.dateText}>
              {new Date(entry.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          
          <View style={styles.entryContent}>
            <View style={styles.entryHeader}>
              <Text style={styles.moodEmoji}>
                {moodEmojis[entry.mood]} 
              </Text>
              <Text style={styles.moodLabel}>{entry.mood}</Text>
              <View style={styles.intensityBar}>
                <View 
                  style={[
                    styles.intensityFill, 
                    { width: `${entry.intensity * 10}%` }
                  ]} 
                />
              </View>
            </View>
            
            <View style={styles.entryColors}>
              {entry.colors.map((color, index) => (
                <View
                  key={index}
                  style={[
                    styles.colorDot,
                    { backgroundColor: colorMap[color] }
                  ]}
                />
              ))}
            </View>
            
            {entry.notes && (
              <Text style={styles.entryNotes} numberOfLines={2}>
                {entry.notes}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTrendsView = () => {
    const trends = getWeeklyTrend();
    
    return (
      <ScrollView style={styles.trendsContainer}>
        <View style={styles.trendCard}>
          <Text style={styles.trendTitle}>This Week's Summary</Text>
          
          <View style={styles.trendStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trends.totalEntries}</Text>
              <Text style={styles.statLabel}>Check-ins</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {moodEmojis[trends.topMood]} {trends.topMood}
              </Text>
              <Text style={styles.statLabel}>Most Common</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{trends.avgIntensity}/10</Text>
              <Text style={styles.statLabel}>Average Intensity</Text>
            </View>
          </View>
        </View>

        <View style={styles.trendCard}>
          <Text style={styles.trendTitle}>Mood Pattern</Text>
          <View style={styles.moodChart}>
            {mockMoodData.slice(0, 7).map((entry, index) => (
              <View key={entry.id} style={styles.chartBar}>
                <View 
                  style={[
                    styles.chartBarFill,
                    { 
                      height: `${entry.intensity * 10}%`,
                      backgroundColor: colorMap[entry.colors[0]] || '#E5E7EB'
                    }
                  ]}
                />
                <Text style={styles.chartLabel}>
                  {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.trendCard}>
          <Text style={styles.trendTitle}>Helpful Activities</Text>
          <View style={styles.activitiesList}>
            {['drawing', 'talking', 'music', 'playing', 'breathing'].map((activity) => {
              const count = mockMoodData.filter(entry => 
                entry.activities.includes(activity)
              ).length;
              
              return (
                <View key={activity} style={styles.activityItem}>
                  <Text style={styles.activityName}>{activity}</Text>
                  <View style={styles.activityBar}>
                    <View 
                      style={[
                        styles.activityBarFill,
                        { width: `${(count / mockMoodData.length) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.activityCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderGuardianView = () => (
    <ScrollView style={styles.guardianContainer}>
      <View style={styles.guardianHeader}>
        <Text style={styles.guardianTitle}>Guardian/Therapist View</Text>
        <Text style={styles.guardianSubtitle}>
          Weekly emotional wellness summary for Sarah
        </Text>
      </View>

      <View style={styles.guardianCard}>
        <Text style={styles.cardTitle}>Weekly Overview</Text>
        <View style={styles.overviewGrid}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>7</Text>
            <Text style={styles.overviewLabel}>Total Check-ins</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>6.2/10</Text>
            <Text style={styles.overviewLabel}>Avg. Mood</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>😊 Happy</Text>
            <Text style={styles.overviewLabel}>Most Frequent</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>3</Text>
            <Text style={styles.overviewLabel}>Concerning Days</Text>
          </View>
        </View>
      </View>

      <View style={styles.guardianCard}>
        <Text style={styles.cardTitle}>Emotional Patterns</Text>
        <View style={styles.patternsList}>
          <View style={styles.patternItem}>
            <View style={styles.patternIcon}>
              <Text>📈</Text>
            </View>
            <View style={styles.patternContent}>
              <Text style={styles.patternTitle}>Positive Trend</Text>
              <Text style={styles.patternDescription}>
                Mood improved significantly after Tuesday's low point
              </Text>
            </View>
          </View>
          
          <View style={styles.patternItem}>
            <View style={styles.patternIcon}>
              <Text>🎨</Text>
            </View>
            <View style={styles.patternContent}>
              <Text style={styles.patternTitle}>Effective Coping</Text>
              <Text style={styles.patternDescription}>
                Drawing and talking consistently help improve mood
              </Text>
            </View>
          </View>
          
          <View style={styles.patternItem}>
            <View style={styles.patternIcon}>
              <Text>⚠️</Text>
            </View>
            <View style={styles.patternContent}>
              <Text style={styles.patternTitle}>Watch Point</Text>
              <Text style={styles.patternDescription}>
                Worry levels increased mid-week, resolved with support
              </Text>
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.shareButton}>
        <Share size={20} color="#FFFFFF" />
        <Text style={styles.shareText}>Share Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* View Mode Selector */}
      <View style={styles.modeSelector}>
        {viewModes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.modeButton,
              viewMode === mode.id && styles.activeModeButton
            ]}
            onPress={() => setViewMode(mode.id as any)}
          >
            <mode.icon 
              size={16} 
              color={viewMode === mode.id ? '#FFFFFF' : '#6B7280'} 
            />
            <Text style={[
              styles.modeText,
              viewMode === mode.id && styles.activeModeText
            ]}>
              {mode.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {viewMode === 'timeline' && renderTimelineView()}
      {viewMode === 'trends' && renderTrendsView()}
      {viewMode === 'guardian' && renderGuardianView()}

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {new Date(selectedEntry.date).toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            
            <View style={styles.modalMood}>
              <Text style={styles.modalMoodEmoji}>
                {moodEmojis[selectedEntry.mood]}
              </Text>
              <Text style={styles.modalMoodText}>
                {selectedEntry.mood} ({selectedEntry.intensity}/10)
              </Text>
            </View>
            
            <View style={styles.modalColors}>
              <Text style={styles.modalSectionTitle}>Colors:</Text>
              <View style={styles.modalColorList}>
                {selectedEntry.colors.map((color, index) => (
                  <View
                    key={index}
                    style={[
                      styles.modalColorDot,
                      { backgroundColor: colorMap[color] }
                    ]}
                  />
                ))}
              </View>
            </View>
            
            <View style={styles.modalActivities}>
              <Text style={styles.modalSectionTitle}>Activities:</Text>
              <Text style={styles.modalActivitiesText}>
                {selectedEntry.activities.join(', ')}
              </Text>
            </View>
            
            {selectedEntry.notes && (
              <View style={styles.modalNotes}>
                <Text style={styles.modalSectionTitle}>Notes:</Text>
                <Text style={styles.modalNotesText}>{selectedEntry.notes}</Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setSelectedEntry(null)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
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
  },
  modeSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  activeModeButton: {
    backgroundColor: '#2563EB',
  },
  modeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeModeText: {
    color: '#FFFFFF',
  },
  
  // Timeline View
  timelineContainer: {
    flex: 1,
  },
  timelineEntry: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  entryDate: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  entryContent: {
    flex: 1,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 12,
    textTransform: 'capitalize',
  },
  intensityBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  intensityFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  entryColors: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  entryNotes: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  
  // Trends View
  trendsContainer: {
    flex: 1,
  },
  trendCard: {
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
  trendTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  trendStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  moodChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginTop: 16,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarFill: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  activitiesList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityName: {
    fontSize: 14,
    color: '#374151',
    width: 80,
    textTransform: 'capitalize',
  },
  activityBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
  activityBarFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  activityCount: {
    fontSize: 12,
    color: '#6B7280',
    width: 20,
    textAlign: 'right',
  },
  
  // Guardian View
  guardianContainer: {
    flex: 1,
  },
  guardianHeader: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  guardianTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  guardianSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  guardianCard: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  overviewItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  patternsList: {
    gap: 16,
  },
  patternItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  patternIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  patternContent: {
    flex: 1,
  },
  patternTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  patternDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  shareText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalMood: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalMoodEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  modalMoodText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalColors: {
    marginBottom: 16,
  },
  modalColorList: {
    flexDirection: 'row',
    gap: 8,
  },
  modalColorDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  modalActivities: {
    marginBottom: 16,
  },
  modalActivitiesText: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  modalNotes: {
    marginBottom: 20,
  },
  modalNotesText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  modalCloseButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});