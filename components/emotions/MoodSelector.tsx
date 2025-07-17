import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';

const { width } = Dimensions.get('window');

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  color: string;
  intensity: number;
}

const moodOptions: MoodOption[] = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: '#FEF3C7', intensity: 8 },
  { id: 'excited', emoji: '🤩', label: 'Excited', color: '#DBEAFE', intensity: 9 },
  { id: 'calm', emoji: '😌', label: 'Calm', color: '#D1FAE5', intensity: 6 },
  { id: 'sad', emoji: '😢', label: 'Sad', color: '#E0E7FF', intensity: 3 },
  { id: 'angry', emoji: '😠', label: 'Angry', color: '#FEE2E2', intensity: 2 },
  { id: 'worried', emoji: '😰', label: 'Worried', color: '#FEF3C7', intensity: 4 },
  { id: 'tired', emoji: '😴', label: 'Tired', color: '#F3F4F6', intensity: 5 },
  { id: 'confused', emoji: '😕', label: 'Confused', color: '#E0E7FF', intensity: 4 },
];

interface Props {
  age: number;
  config: any;
  sessionData: any;
  onComplete: (data: any) => void;
  onMoodChange: (mood: any) => void;
}

export function MoodSelector({ age, config, onComplete, onMoodChange }: Props) {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [intensity, setIntensity] = useState(5);

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood);
    setIntensity(mood.intensity);
    onMoodChange(mood);
    
    // Auto-complete for younger children
    if (age <= 7) {
      setTimeout(() => {
        onComplete({
          mood: mood.id,
          label: mood.label,
          intensity: mood.intensity,
          timestamp: new Date().toISOString()
        });
      }, 500);
    }
  };

  const handleIntensityChange = (newIntensity: number) => {
    setIntensity(newIntensity);
  };

  const handleConfirm = () => {
    if (selectedMood) {
      onComplete({
        mood: selectedMood.id,
        label: selectedMood.label,
        intensity,
        timestamp: new Date().toISOString()
      });
    }
  };

  const itemsPerRow = age <= 7 ? 2 : age <= 12 ? 3 : 4;
  const itemSize = (width - 48 - (itemsPerRow - 1) * 12) / itemsPerRow;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: age <= 7 ? 20 : 18 }]}>
        {age <= 7 ? 'Tap how you feel!' : 'How are you feeling right now?'}
      </Text>

      <View style={[styles.moodGrid, { gap: 12 }]}>
        {moodOptions.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodItem,
              {
                width: itemSize,
                height: itemSize,
                backgroundColor: selectedMood?.id === mood.id ? mood.color : '#FFFFFF'
              }
            ]}
            onPress={() => handleMoodSelect(mood)}
          >
            <Text style={[styles.moodEmoji, { fontSize: config.iconSize }]}>
              {mood.emoji}
            </Text>
            {(age > 7 || selectedMood?.id === mood.id) && (
              <Text style={[styles.moodLabel, { fontSize: age <= 7 ? 14 : 12 }]}>
                {mood.label}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {selectedMood && age > 7 && (
        <View style={styles.intensitySection}>
          <Text style={styles.intensityTitle}>
            How {selectedMood.label.toLowerCase()} do you feel?
          </Text>
          <View style={styles.intensitySlider}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.intensityDot,
                  intensity >= level && styles.activeDot
                ]}
                onPress={() => handleIntensityChange(level)}
              />
            ))}
          </View>
          <View style={styles.intensityLabels}>
            <Text style={styles.intensityLabel}>A little</Text>
            <Text style={styles.intensityLabel}>Very much</Text>
          </View>
        </View>
      )}

      {selectedMood && age > 7 && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Continue</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 28,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
  },
  moodItem: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  moodEmoji: {
    marginBottom: 4,
  },
  moodLabel: {
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  intensitySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  intensityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  intensitySlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  intensityDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  activeDot: {
    backgroundColor: '#2563EB',
  },
  intensityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  intensityLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  confirmButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});