import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';

const { width } = Dimensions.get('window');

interface ColorCloud {
  id: string;
  color: string;
  emotion: string;
  description: string;
}

const colorClouds: ColorCloud[] = [
  { id: 'yellow', color: '#FEF08A', emotion: 'Happy', description: 'Sunshine and joy' },
  { id: 'blue', color: '#93C5FD', emotion: 'Calm', description: 'Peaceful like the sky' },
  { id: 'green', color: '#86EFAC', emotion: 'Fresh', description: 'Growing and new' },
  { id: 'purple', color: '#C4B5FD', emotion: 'Creative', description: 'Imaginative and dreamy' },
  { id: 'pink', color: '#F9A8D4', emotion: 'Loving', description: 'Warm and caring' },
  { id: 'orange', color: '#FDBA74', emotion: 'Energetic', description: 'Full of energy' },
  { id: 'red', color: '#FCA5A5', emotion: 'Strong', description: 'Powerful feelings' },
  { id: 'gray', color: '#D1D5DB', emotion: 'Quiet', description: 'Peaceful and still' },
];

interface Props {
  age: number;
  config: any;
  sessionData: any;
  onComplete: (data: any) => void;
}

export function ColorCloudPicker({ age, config, onComplete }: Props) {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const handleColorSelect = (colorId: string) => {
    if (selectedColors.includes(colorId)) {
      setSelectedColors(prev => prev.filter(id => id !== colorId));
    } else if (selectedColors.length < config.maxColors) {
      setSelectedColors(prev => [...prev, colorId]);
    }
  };

  const handleComplete = () => {
    const selectedCloudData = colorClouds.filter(cloud => 
      selectedColors.includes(cloud.id)
    );
    
    onComplete({
      colors: selectedColors,
      emotions: selectedCloudData.map(cloud => cloud.emotion),
      timestamp: new Date().toISOString()
    });
  };

  const cloudSize = age <= 7 ? 80 : age <= 12 ? 70 : 60;
  const cloudsPerRow = age <= 7 ? 2 : 3;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: age <= 7 ? 20 : 18 }]}>
        {age <= 7 ? 'Pick your feeling colors!' : 'What colors match your mood?'}
      </Text>
      
      <Text style={[styles.subtitle, { fontSize: age <= 7 ? 16 : 14 }]}>
        {age <= 7 ? `Choose up to ${config.maxColors} colors` : 
         `Tap up to ${config.maxColors} color clouds that feel right`}
      </Text>

      <View style={styles.cloudContainer}>
        {colorClouds.map((cloud) => {
          const isSelected = selectedColors.includes(cloud.id);
          return (
            <TouchableOpacity
              key={cloud.id}
              style={[
                styles.colorCloud,
                {
                  width: cloudSize,
                  height: cloudSize,
                  backgroundColor: cloud.color,
                  opacity: isSelected ? 1 : 0.7,
                  transform: [{ scale: isSelected ? 1.1 : 1 }]
                }
              ]}
              onPress={() => handleColorSelect(cloud.id)}
              disabled={!isSelected && selectedColors.length >= config.maxColors}
            >
              <View style={styles.cloudContent}>
                {age > 7 && (
                  <Text style={[styles.emotionText, { fontSize: age <= 12 ? 12 : 11 }]}>
                    {cloud.emotion}
                  </Text>
                )}
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedColors.length > 0 && (
        <View style={styles.selectedSection}>
          <Text style={styles.selectedTitle}>
            {age <= 7 ? 'Your colors:' : 'Selected mood colors:'}
          </Text>
          <View style={styles.selectedColors}>
            {selectedColors.map((colorId) => {
              const cloud = colorClouds.find(c => c.id === colorId);
              return (
                <View key={colorId} style={styles.selectedColorItem}>
                  <View 
                    style={[
                      styles.selectedColorDot, 
                      { backgroundColor: cloud?.color }
                    ]} 
                  />
                  <Text style={styles.selectedColorText}>{cloud?.emotion}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {selectedColors.length > 0 && (
        <TouchableOpacity style={styles.continueButton} onPress={handleComplete}>
          <Text style={styles.continueText}>
            {age <= 7 ? 'Done!' : 'Continue'}
          </Text>
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
    marginBottom: 8,
    lineHeight: 28,
  },
  subtitle: {
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  cloudContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  colorCloud: {
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cloudContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emotionText: {
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  selectedSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  selectedColors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedColorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selectedColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  selectedColorText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});