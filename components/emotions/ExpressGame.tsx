import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, Palette, Mic, FileText, Sparkles } from 'lucide-react-native';

/*************************************************
 * Wow-factor utilities (lightweight, RN-friendly)
 *************************************************/
// Simple confetti burst using ephemeral emoji particles rendered absolutely.
// No native deps: renders a short-lived overlay of floating emojis.
const ConfettiBurst = ({ show, onEnd }: { show: boolean; onEnd?: () => void }) => {
  const [particles, setParticles] = useState<{ id: number; left: number; delay: number; emoji: string }[]>([]);

  useEffect(() => {
    if (!show) return;
    // create 24 particles with random positions/delays
    const emojis = ['🎉', '✨', '💫', '🌟', '🎊', '💖'];
    const ps = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: Math.random() * 80 + 10, // vw-ish percent for variety
      delay: Math.random() * 150,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setParticles(ps);
    const timer = setTimeout(() => {
      setParticles([]);
      onEnd?.();
    }, 1500);
    return () => clearTimeout(timer);
  }, [show, onEnd]);

  if (!show) return null;
  return (
    <View pointerEvents="none" style={styles.confettiContainer}>
      {particles.map((p) => (
        <Text
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: 0,
            fontSize: 22,
            transform: [{ translateY: 0 }],
            opacity: 0.95,
            // rudimentary float-down animation via inline transition-like trick
          }}
        >
          {p.emoji}
        </Text>
      ))}
    </View>
  );
};

// Mood-reactive gradient background (pure RN fallback using layered views)
const MoodBackdrop = ({ colorA, colorB }: { colorA: string; colorB: string }) => (
  <View style={[styles.gradientBase]}>
    <View style={[styles.gradientLayer, { backgroundColor: colorA, opacity: 0.9 }]} />
    <View style={[styles.gradientBlob, { backgroundColor: colorB }]} />
    <View style={[styles.gradientBlobSmall, { backgroundColor: colorA }]} />
  </View>
);

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
function useExpressionSimulations(
  setExpression: React.Dispatch<React.SetStateAction<Expression>>,
  setIsRecording: (v: boolean) => void
) {
  const simulateDrawing = useCallback(() => {
    setTimeout(() => {
      setExpression({ type: 'drawing', data: 'drawing_data_placeholder', timestamp: new Date().toISOString() });
    }, 1200);
  }, [setExpression]);

  const simulatePhoto = useCallback(() => {
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
      setExpression({ type: 'voice', data: 'voice_data_placeholder', duration: 12, timestamp: new Date().toISOString() });
    }, 1800);
  }, [setExpression, setIsRecording]);

  const simulateWriting = useCallback(() => {
    setExpression({ type: 'text', data: 'Sample text about feelings...', timestamp: new Date().toISOString() });
  }, [setExpression]);

  return { simulateDrawing, simulatePhoto, simulateVoiceRecording, simulateWriting };
}
/*************************************************
 * UI Subcomponents with animations/micro-interactions
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
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={`${title}. ${description}`}
    onPress={onPress}
    activeOpacity={0.85}
    style={[styles.modeCard, { borderColor: color }]}
  >
    <View style={[styles.modeIcon, { backgroundColor: `${color}10` }]}> {/* light tint */}
      <Icon color={color} size={32} />
    </View>
    <Text style={styles.modeTitle}>{title}</Text>
    <Text style={styles.modeDescription}>{description}</Text>
  </TouchableOpacity>
);

const PrimaryButton = ({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={title}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.9}
    style={[styles.completeButton, disabled && { opacity: 0.6 }]}
  >
    <Text style={styles.completeText}>{title}</Text>
  </TouchableOpacity>
);

const SecondaryButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <TouchableOpacity accessibilityRole="button" accessibilityLabel={title} onPress={onPress} style={styles.backButton}>
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
  const [confetti, setConfetti] = useState(false);

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

  // Mood-reactive theming (based on selected mode dominant color)
  const theme = useMemo(() => {
    const activeColor = modes.find((m) => m.id === selectedMode)?.color;
    if (!activeColor) return { a: '#E0F2FE', b: '#F5F3FF' }; // calm default
    // create a complementary pair by shifting toward white and a warm tint
    const warm = '#FFD6A5';
    return { a: `${activeColor}22`, b: warm };
  }, [selectedMode, modes]);

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

  // Continue to parent with captured expression and trigger confetti
  const handleComplete = useCallback(() => {
    if (expression) {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 1400);
      onComplete({ mode: selectedMode, expression, timestamp: new Date().toISOString() });
    }
  }, [expression, onComplete, selectedMode]);

  return (
    <View style={styles.container}>
      <MoodBackdrop colorA={theme.a} colorB={theme.b} />

      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Text style={[styles.title]}>Express Your Feelings</Text>
        <Text style={styles.subtitle}>Choose how you'd like to share what's in your heart</Text>
      </View>

      {/* Mode Picker or Activity Area */}
      {!selectedMode ? (
        <View style={[styles.modeGrid, { paddingHorizontal: 16 }]}>          
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
        <View style={[styles.expressionArea, { padding: 16 }]}>
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
                <Mic color={isRecording ? '#F59E0B' : '#DC2626'} size={48} />
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
            <PrimaryButton title="Celebrate & Continue" onPress={handleComplete} disabled={!expression} />
          </View>
        </View>
      )}

      {/* Confetti celebration overlay */}
      <ConfettiBurst show={confetti} />

      {/* Decorative sparkle in corner to add whimsy */}
      <View style={styles.sparkleBadge} accessibilityElementsHidden>
        <Sparkles color="#A78BFA" size={18} />
      </View>
    </View>
  );
}

/*************************************************
 * Styles
 *************************************************/
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  title: { fontWeight: '700', color: '#111827', textAlign: 'center', marginBottom: 6, fontSize: 20 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 18, lineHeight: 20 },
  modeGrid: { gap: 12 },
  modeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modeIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modeTitle: { fontWeight: '700', color: '#111827', marginBottom: 4 },
  modeDescription: { fontSize: 12, color: '#6B7280', textAlign: 'center' },
  expressionArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 14,
  },
  drawingArea: {},
  canvasPlaceholder: {
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  placeholderText: { color: '#6B7280', fontSize: 12 },
  photoArea: {},
  photoPlaceholder: {
    height: 180,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  voiceArea: {},
  voicePlaceholder: {
    height: 120,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  writeArea: {},
  writePlaceholder: {
    height: 140,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtons: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  backButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: '#111827', fontWeight: '600' },
  completeButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeText: { color: '#FFFFFF', fontWeight: '700' },
  sparkleBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 8,
  },
});
