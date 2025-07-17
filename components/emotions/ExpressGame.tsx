import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Camera, Palette, Mic, FileText } from 'lucide-react-native';

interface Props {
  age: number;
  config: any;
  sessionData: any;
  onComplete: (data: any) => void;
}

export function ExpressGame({ age, config, onComplete }: Props) {
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [expression, setExpression] = useState<any>(null);

  const expressionModes = [
    {
      id: 'draw',
      title: 'Draw It',
      icon: Palette,
      color: '#8B5CF6',
      description: 'Draw how you feel',
      ageMin: 8
    },
    {
      id: 'photo',
      title: 'Photo Story',
      icon: Camera,
      color: '#059669',
      description: 'Take a picture that shows your mood',
      ageMin: 10
    },
    {
      id: 'voice',
      title: 'Voice Note',
      icon: Mic,
      color: '#DC2626',
      description: 'Record how you feel',
      ageMin: 12
    },
    {
      id: 'write',
      title: 'Write It',
      icon: FileText,
      color: '#EA580C',
      description: 'Write about your feelings',
      ageMin: 13
    }
  ];

  const availableModes = expressionModes.filter(mode => age >= mode.ageMin);

  const handleModeSelect = (mode: any) => {
    setSelectedMode(mode.id);
    
    // Simulate different expression activities
    switch (mode.id) {
      case 'draw':
        simulateDrawing();
        break;
      case 'photo':
        simulatePhoto();
        break;
      case 'voice':
        simulateVoiceRecording();
        break;
      case 'write':
        simulateWriting();
        break;
    }
  };

  const simulateDrawing = () => {
    // In a real app, this would open a drawing canvas
    setTimeout(() => {
      setExpression({
        type: 'drawing',
        data: 'drawing_data_placeholder',
        timestamp: new Date().toISOString()
      });
    }, 2000);
  };

  const simulatePhoto = () => {
    // In a real app, this would open camera
    Alert.alert(
      'Camera Access',
      'This would open the camera to take a mood photo',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Take Photo',
          onPress: () => {
            setExpression({
              type: 'photo',
              data: 'photo_data_placeholder',
              timestamp: new Date().toISOString()
            });
          }
        }
      ]
    );
  };

  const simulateVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setExpression({
        type: 'voice',
        data: 'voice_data_placeholder',
        duration: 15,
        timestamp: new Date().toISOString()
      });
    }, 3000);
  };

  const simulateWriting = () => {
    // In a real app, this would open a text input
    setExpression({
      type: 'text',
      data: 'Sample text about feelings...',
      timestamp: new Date().toISOString()
    });
  };

  const handleComplete = () => {
    if (expression) {
      onComplete({
        mode: selectedMode,
        expression,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: age <= 12 ? 20 : 18 }]}>
        Express Your Feelings
      </Text>
      
      <Text style={styles.subtitle}>
        Choose how you'd like to share what's in your heart
      </Text>

      {!selectedMode ? (
        <View style={styles.modeGrid}>
          {availableModes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeCard, { borderColor: mode.color }]}
              onPress={() => handleModeSelect(mode)}
            >
              <View style={[styles.modeIcon, { backgroundColor: `${mode.color}15` }]}>
                <mode.icon size={32} color={mode.color} />
              </View>
              <Text style={styles.modeTitle}>{mode.title}</Text>
              <Text style={styles.modeDescription}>{mode.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.expressionArea}>
          {selectedMode === 'draw' && (
            <View style={styles.drawingArea}>
              <Text style={styles.activityTitle}>Drawing Canvas</Text>
              <View style={styles.canvasPlaceholder}>
                <Palette size={48} color="#8B5CF6" />
                <Text style={styles.placeholderText}>
                  {expression ? 'Drawing completed!' : 'Drawing in progress...'}
                </Text>
              </View>
            </View>
          )}

          {selectedMode === 'photo' && (
            <View style={styles.photoArea}>
              <Text style={styles.activityTitle}>Photo Story</Text>
              <View style={styles.photoPlaceholder}>
                <Camera size={48} color="#059669" />
                <Text style={styles.placeholderText}>
                  {expression ? 'Photo captured!' : 'Tap to take photo'}
                </Text>
              </View>
            </View>
          )}

          {selectedMode === 'voice' && (
            <View style={styles.voiceArea}>
              <Text style={styles.activityTitle}>Voice Note</Text>
              <View style={styles.voicePlaceholder}>
                <Mic size={48} color={isRecording ? '#DC2626' : '#6B7280'} />
                <Text style={styles.placeholderText}>
                  {isRecording ? 'Recording...' : 
                   expression ? 'Recording completed!' : 'Tap to record'}
                </Text>
                {isRecording && (
                  <View style={styles.recordingIndicator}>
                    <View style={styles.recordingDot} />
                  </View>
                )}
              </View>
            </View>
          )}

          {selectedMode === 'write' && (
            <View style={styles.writeArea}>
              <Text style={styles.activityTitle}>Write Your Feelings</Text>
              <View style={styles.writePlaceholder}>
                <FileText size={48} color="#EA580C" />
                <Text style={styles.placeholderText}>
                  {expression ? 'Writing completed!' : 'Start writing...'}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                setSelectedMode(null);
                setExpression(null);
              }}
            >
              <Text style={styles.backText}>Choose Different</Text>
            </TouchableOpacity>
            
            {expression && (
              <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
                <Text style={styles.completeText}>Continue</Text>
              </TouchableOpacity>
            )}
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
  title: {
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modeGrid: {
    gap: 16,
  },
  modeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  modeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  expressionArea: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  drawingArea: {
    flex: 1,
  },
  canvasPlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  photoArea: {
    flex: 1,
  },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  voiceArea: {
    flex: 1,
  },
  voicePlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  writeArea: {
    flex: 1,
  },
  writePlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },
  recordingIndicator: {
    marginTop: 16,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#DC2626',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  completeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});