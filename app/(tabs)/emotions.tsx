import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Heart, Palette, Camera, Chrome as Home, Brain, BookOpen, Settings } from 'lucide-react-native';
import { MoodSelector } from '@/components/emotions/MoodSelector';
import { ColorCloudPicker } from '@/components/emotions/ColorCloudPicker';
import { ExpressGame } from '@/components/emotions/ExpressGame';
import { SafeSpaceBuilder } from '@/components/emotions/SafeSpaceBuilder';
import { AdaptivePrompts } from '@/components/emotions/AdaptivePrompts';
import { MoodJournal } from '@/components/emotions/MoodJournal';
import { AgeConfig } from '@/components/emotions/AgeConfig';

const { width } = Dimensions.get('window');

export default function EmotionCheckIn() {
  const [currentAge, setCurrentAge] = useState(8); // Default age
  const [activeFeature, setActiveFeature] = useState('mood');
  const [currentMood, setCurrentMood] = useState(null);
  const [sessionData, setSessionData] = useState({
    mood: null,
    colors: [],
    expression: null,
    safeSpace: null,
    responses: []
  });

  // Age-based feature configuration
  const getAgeConfig = () => {
    if (currentAge <= 7) {
      return {
        features: ['mood', 'colors', 'journal'],
        complexity: 'simple',
        iconSize: 48,
        maxColors: 3,
        promptStyle: 'visual'
      };
    } else if (currentAge <= 12) {
      return {
        features: ['mood', 'colors', 'express', 'space', 'journal'],
        complexity: 'medium',
        iconSize: 40,
        maxColors: 5,
        promptStyle: 'interactive'
      };
    } else {
      return {
        features: ['mood', 'colors', 'express', 'space', 'prompts', 'journal'],
        complexity: 'advanced',
        iconSize: 36,
        maxColors: 8,
        promptStyle: 'conversational'
      };
    }
  };

  const config = getAgeConfig();

  const features = [
    {
      id: 'mood',
      title: 'How I Feel',
      icon: Heart,
      color: '#EF4444',
      ageRange: '4-16',
      component: MoodSelector
    },
    {
      id: 'colors',
      title: 'Mood Colors',
      icon: Palette,
      color: '#8B5CF6',
      ageRange: '4-16',
      component: ColorCloudPicker
    },
    {
      id: 'express',
      title: 'Express It',
      icon: Camera,
      color: '#059669',
      ageRange: '8-16',
      component: ExpressGame
    },
    {
      id: 'space',
      title: 'Safe Space',
      icon: Home,
      color: '#2563EB',
      ageRange: '8-16',
      component: SafeSpaceBuilder
    },
    {
      id: 'prompts',
      title: 'Let\'s Talk',
      icon: Brain,
      color: '#DC2626',
      ageRange: '13-16',
      component: AdaptivePrompts
    },
    {
      id: 'journal',
      title: 'My Journey',
      icon: BookOpen,
      color: '#EA580C',
      ageRange: '4-16',
      component: MoodJournal
    }
  ];

  const availableFeatures = features.filter(feature => 
    config.features.includes(feature.id)
  );

  const handleFeatureComplete = (featureId, data) => {
    setSessionData(prev => ({
      ...prev,
      [featureId]: data
    }));
    
    // Auto-advance for younger children
    if (currentAge <= 7 && featureId === 'mood') {
      setActiveFeature('colors');
    }
  };

  const ActiveComponent = features.find(f => f.id === activeFeature)?.component;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { fontSize: config.iconSize - 8 }]}>
            Emotion Check-In
          </Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setActiveFeature('settings')}
          >
            <Settings size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          {currentAge <= 7 ? 'How are you feeling today?' : 
           currentAge <= 12 ? 'Let\'s explore your emotions together' :
           'Take a moment to check in with yourself'}
        </Text>
      </View>

      {activeFeature === 'settings' ? (
        <AgeConfig 
          currentAge={currentAge}
          onAgeChange={setCurrentAge}
          onBack={() => setActiveFeature('mood')}
        />
      ) : (
        <>
          {/* Feature Navigation */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.featureNav}
            contentContainerStyle={styles.featureNavContent}
          >
            {availableFeatures.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.featureButton,
                  activeFeature === feature.id && styles.activeFeatureButton,
                  { width: config.iconSize + 32 }
                ]}
                onPress={() => setActiveFeature(feature.id)}
              >
                <View style={[
                  styles.featureIcon,
                  { backgroundColor: `${feature.color}15` },
                  activeFeature === feature.id && { backgroundColor: feature.color }
                ]}>
                  <feature.icon 
                    size={config.iconSize - 16} 
                    color={activeFeature === feature.id ? '#FFFFFF' : feature.color} 
                  />
                </View>
                <Text style={[
                  styles.featureText,
                  { fontSize: config.complexity === 'simple' ? 12 : 11 },
                  activeFeature === feature.id && styles.activeFeatureText
                ]}>
                  {feature.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Active Feature Component */}
          <View style={styles.content}>
            {ActiveComponent && (
              <ActiveComponent
                age={currentAge}
                config={config}
                sessionData={sessionData}
                onComplete={(data) => handleFeatureComplete(activeFeature, data)}
                onMoodChange={setCurrentMood}
              />
            )}
          </View>
        </>
      )}
    </View>
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
  title: {
    fontWeight: '600',
    color: '#1F2937',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  featureNav: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  featureNavContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  featureButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeFeatureButton: {
    // Active state styling handled by individual elements
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  activeFeatureText: {
    color: '#1F2937',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});