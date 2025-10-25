import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, Palette, Mic, FileText } from 'lucide-react-native';

/*************************************************
 * Types
 *************************************************/
export type ExpressionModeId = 'draw' | 'photo' | 'voice' | 'write';

export interface ExpressionBase {
  timestamp: string;
  type: ExpressionModeId | 'text' | 'drawing' | 'photo' | 'voice';
}

export interface DrawingExpression extends ExpressionBase {
  type: 'drawing';
  data: string; // could be base64 or vector data reference
}

export interface PhotoExpression extends ExpressionBase {
  type: 'photo';
  data: string; // asset uri or base64 placeholder
}

export interface VoiceExpression extends ExpressionBase {
  type: 'voice';
  data: string; // audio clip reference
  duration: number; // seconds
}

export interface TextExpression extends ExpressionBase {
  type: 'text';
  data: string;
}

export type Expression = DrawingExpression | PhotoExpression | VoiceExpression | TextExpression | null;

// Config for enabling/disabling modes or overriding labels/colors
export interface ExpressGameConfig {
  enabledModes?: Partial<Record<ExpressionModeId, boolean>>;
  labels?: Partial<Record<ExpressionModeId, string>>;
  descriptions?: Partial<Record<ExpressionModeId, string>>;
  colors?: Partial<Record<ExpressionModeId, string>>;
}

// Session metadata that may be useful for analytics or storage
export interface SessionData {
  sessionId: string;
  userId?: string;
  startedAt?: string;
  // Extend as needed with app-specific fields
}

interface Props {
  age: number;
  config: ExpressGameConfig;
  sessionData?: SessionData;
  onComplete: (data: { mode: ExpressionModeId | null; expression: Exclude<Expression, null>; timestamp: string }) => void;
}

/*************************************************
 * Constants
 *************************************************/
interface ModeMeta {
  id: ExpressionModeId;
  title: string;
  icon: React.ComponentType<{ color?: string; size?: number }>;
  color: string;
  description: string;
  ageMin: number;
}

const DEFAULT_MODES: ModeMeta[] = [
  { id: 'draw', title: 'Draw It', icon: Palette, color: '#8B5CF6', description: 'Draw how you feel', ageMin: 8 },
  { id: 'photo', title: 'Photo Story', icon: Camera, color: '#059669', description: 'Take a picture that shows your mood', ageMin: 10 },
  { id: 'voice', title: 'Voice Note', icon: Mic, color: '#DC2626', description: 'Record how you feel', ageMin: 12 },
  { id: 'write', title: 'Write It', icon: FileText, color: '#EA580C', description: 'Write about your feelings', ageMin: 13 },
];

/*************************************************
 * Hook: useExpressionSimulations
 * - Encapsulates the demo/simulation flows for each mode
 *************************************************/
function useExpressionSimulations(setExpression: React.Dispatch<React.SetStateAction<Expression>>, setIsRecording: (v: boolean) => void) {
  const simulateDrawing = useCallback(() => {
    // In a real app, this would open a drawing canvas
    setTimeout(() => {
      setExpression({ type: 'drawing', data: 'drawing_data_placeholder', timestamp: new Date().toISOString() });
    }, 2000);
  }, [setExpression]);

  const simulatePhoto = useCallback(() => {
    // In a real app, this would open camera
    Alert.alert(
      'Camera Access',
      'This would open the camera to take a mood photo',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Take Photo',
          onPress: () => {
            setExpression({ type: 'photo', data: 'photo_data_placeholder', timestamp: new Date().toISOString() });
          },
        },
      ]
    );
  }, [setExpression]);

  const simulateVoiceRecording = useCallback(() => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setExpression({ type: 'voice', data: 'voice_data_placeholder', duration: 15, timestamp: new Date().toISOString() });
    }, 3000);
  }, [setExpression, setIsRecording]);

  const simulateWriting = useCallback(() => {
    // In a real app, this would open a text input
    setExpression({ type: 'text', data: 'Sample text about feelings...', timestamp: new Date().toISOString() });
  }, [setExpression]);

  return { simulateDrawing, simulatePhoto, simulateVoiceRecording, simulateWriting };
}

/*************************************************
 * UI Subcomponents
 *************************************************/
const ModeCard = ({
  title,
  description,
  color,
  Icon,
  onPress,
}: {
  title: string;
  description: string;
  color: string;
  Icon: React.ComponentType<{ color?: string; size?: number }>;
  onPress: () => void;
}) => (
  <TouchableOpacity style={[styles.modeCard, { borderColor: color }]} onPress={onPress}>
    <View style={[styles.modeIcon, { backgroundColor: `${color}1A` }]}> {/* 10% opacity bg */}
      <Icon color={color} size={32} />
    </View>
    <Text style={styles.modeTitle}>{title}</Text>
    <Text style={styles.modeDescription}>{description}</Text>
  </TouchableOpacity>
);

const PrimaryButton = ({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) => (
  <TouchableOpacity style={[styles.completeButton, disabled && { opacity: 0.6 }]} onPress={onPress} disabled={disabled}>
    <Text style={styles.completeText}>{title}</Text>
  </TouchableOpacity>
);

const SecondaryButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.backButton} onPress={onPress}>
    <Text style={styles.backText}>{title}</Text>
  </TouchableOpacity>
);

/*************************************************
 * Component
 *************************************************/
export function ExpressGame({ age, config, onComplete }: Props) {
  const [selectedMode, setSelectedMode] = useState<ExpressionModeId | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [expression, setExpression] = useState<Expression>(null);

  // Encapsulated simulations
  const { simulateDrawing, simulatePhoto, simulateVoiceRecording, simulateWriting } = useExpressionSimulations(
    setExpression,
    setIsRecording
  );

  // Merge defaults with config overrides (labels, descriptions, colors) and filter by age + enabledModes
  const modes = useMemo<ModeMeta[]>(() => {
    return DEFAULT_MODES.map((m) => ({
      ...m,
      title: config?.labels?.[m.id] ?? m.title,
      description: config?.descriptions?.[m.id] ?? m.description,
      color: config?.colors?.[m.id] ?? m.color,
    }));
  }, [config]);

  // Derived: visible modes based on age and enabled flags
  const availableModes = useMemo(() => {
    return modes.filter((m) => age >= m.ageMin && (config?.enabledModes?.[m.id] ?? true));
  }, [age, modes, config]);

  // Handle mode selection and trigger simulations
  const handleModeSelect = useCallback(
    (mode: ModeMeta) => {
      setSelectedMode(mode.id);
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
    },
    [simulateDrawing, simulatePhoto, simulateVoiceRecording, simulateWriting]
  );

  // Continue to parent with captured expression
  const handleComplete = useCallback(() => {
    if (expression) {
      onComplete({ mode: selectedMode, expression, timestamp: new Date().toISOString() });
    }
  }, [expression, onComplete, selectedMode]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={[styles.title, { fontSize: 20 }]}>Express Your Feelings</Text>
      <Text style={styles.subtitle}>Choose how you'd like to share what's in your heart</Text>

      {/* Mode Picker or Activity Area */}
      {!selectedMode ? (
        <View style={styles.modeGrid}>
          {availableModes.map((mode) => (
            <ModeCard
              key={mode.id}
              title={mode.title}
              description={mode.description}
              color={mode.color}
              Icon={mode.icon}
              onPress={() => handleModeSelect(mode)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.expressionArea}>
          {/* Drawing */}
          {selectedMode === 'draw' && (
            <View style={styles.drawingArea}>
              <Text style={styles.activityTitle}>Drawing Canvas</Text>
              <View style={styles.canvasPlaceholder}>
                <Palette color="#8B5CF6" size={48} />
                <Text style={styles.placeholderText}>{expression ? 'Drawing completed!' : 'Drawing in progress...'}</Text>
              </View>
            </View>
          )}

          {/* Photo */}
          {selectedMode === 'photo' && (
            <View style={styles.photoArea}>
              <Text style={styles.activityTitle}>Photo Story</Text>
              <View style={styles.photoPlaceholder}>
                <Camera color="#059669" size={48} />
                <Text style={styles.placeholderText}>{expression ? 'Photo captured!' : 'Tap to take photo'}</Text>
              </View>
            </View>
          )}

          {/* Voice */}
          {selectedMode === 'voice' && (
            <View style={styles.voiceArea}>
              <Text style={styles.activityTitle}>Voice Note</Text>
              <View style={styles.voicePlaceholder}>
                <Mic color={isRecording ? '#DC2626' : '#9CA3AF'} size={48} />
                <Text style={styles.placeholderText}>
                  {isRecording ? 'Recording...' : expression ? 'Recording completed!' : 'Tap to record'}
                </Text>
                {isRecording && (
                  <View style={styles.recordingIndicator}>
                    <View style={styles.recordingDot} />
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Write */}
          {selectedMode === 'write' && (
            <View style={styles.writeArea}>
              <Text style={styles.activityTitle}>Write Your Feelings</Text>
              <View style={styles.writePlaceholder}>
                <FileText color="#EA580C" size={48} />
                <Text style={styles.placeholderText}>{expression ? 'Writing completed!' : 'Start writing...'}</Text>
              </View>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actionButtons}>
            <SecondaryButton
              title="Choose Different"
              onPress={() => {
                setSelectedMode(null);
                setExpression(null);
              }}
            />
            {expression && <PrimaryButton title="Continue" onPress={handleComplete} />}
          </View>
        </View>
      )}
    </View>
  );
}

/*************************************************
 * Styles
 *************************************************/
const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontWeight: '600', color: '#1F2937', textAlign: 'center', marginBottom: 8, lineHeight: 28 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  modeGrid: { gap: 16 },
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
  modeTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  modeDescription: { fontSize: 14, color: '#6B7280', textAlign: 'center' },
  expressionArea: { flex: 1 },
  activityTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', textAlign: 'center', marginBottom: 20 },
  drawingArea: { flex: 1 },
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
  photoArea: { flex: 1 },
  photoPlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  voiceArea: { flex: 1 },
  voicePlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  writeArea: { flex: 1 },
  writePlaceholder: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  placeholderText: { fontSize: 16, color: '#6B7280', marginTop: 12, textAlign: 'center' },
  recordingIndicator: { marginTop: 16 },
  recordingDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#DC2626' },
  actionButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  backButton: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  backText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  completeButton: { flex: 1, backgroundColor: '#059669', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  completeText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
