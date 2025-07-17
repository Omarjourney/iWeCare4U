import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { ArrowLeft, Settings, User, Palette, Camera, Chrome as Home, Brain, BookOpen } from 'lucide-react-native';

interface Props {
  currentAge: number;
  onAgeChange: (age: number) => void;
  onBack: () => void;
}

export function AgeConfig({ currentAge, onAgeChange, onBack }: Props) {
  const [selectedAge, setSelectedAge] = useState(currentAge);

  const ageGroups = [
    {
      range: '4-7',
      title: 'Early Childhood',
      description: 'Simple, visual interactions with large buttons and emojis',
      features: ['Mood Selector', 'Color Clouds', 'Visual Journal'],
      complexity: 'Simple',
      iconSize: 48,
      maxColors: 3
    },
    {
      range: '8-12',
      title: 'Middle Childhood',
      description: 'Interactive games and creative expression tools',
      features: ['Mood Selector', 'Color Clouds', 'Express Game', 'Safe Space', 'Visual Journal'],
      complexity: 'Medium',
      iconSize: 40,
      maxColors: 5
    },
    {
      range: '13-16',
      title: 'Adolescence',
      description: 'Advanced prompts and detailed emotional exploration',
      features: ['All Features', 'Adaptive Prompts', 'Detailed Analytics', 'Guardian Sharing'],
      complexity: 'Advanced',
      iconSize: 36,
      maxColors: 8
    }
  ];

  const getAgeFromRange = (range: string) => {
    const [min] = range.split('-').map(Number);
    return min + 2; // Middle of range
  };

  const getCurrentAgeGroup = () => {
    if (selectedAge <= 7) return ageGroups[0];
    if (selectedAge <= 12) return ageGroups[1];
    return ageGroups[2];
  };

  const handleSave = () => {
    onAgeChange(selectedAge);
    onBack();
  };

  const featureIcons = {
    'Mood Selector': User,
    'Color Clouds': Palette,
    'Express Game': Camera,
    'Safe Space': Home,
    'Adaptive Prompts': Brain,
    'Visual Journal': BookOpen,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text style={styles.title}>Age Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Customize the experience based on age to ensure appropriate complexity and engagement
        </Text>

        {/* Age Selector */}
        <View style={styles.ageSelector}>
          <Text style={styles.sectionTitle}>Select Age</Text>
          <View style={styles.ageButtons}>
            {Array.from({ length: 13 }, (_, i) => i + 4).map((age) => (
              <TouchableOpacity
                key={age}
                style={[
                  styles.ageButton,
                  selectedAge === age && styles.selectedAgeButton
                ]}
                onPress={() => setSelectedAge(age)}
              >
                <Text style={[
                  styles.ageButtonText,
                  selectedAge === age && styles.selectedAgeButtonText
                ]}>
                  {age}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Age Group Info */}
        <View style={styles.ageGroupCard}>
          <View style={styles.ageGroupHeader}>
            <Text style={styles.ageGroupTitle}>
              {getCurrentAgeGroup().title}
            </Text>
            <Text style={styles.ageGroupRange}>
              Ages {getCurrentAgeGroup().range}
            </Text>
          </View>
          
          <Text style={styles.ageGroupDescription}>
            {getCurrentAgeGroup().description}
          </Text>

          <View style={styles.configDetails}>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Complexity:</Text>
              <Text style={styles.configValue}>{getCurrentAgeGroup().complexity}</Text>
            </View>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Icon Size:</Text>
              <Text style={styles.configValue}>{getCurrentAgeGroup().iconSize}px</Text>
            </View>
            <View style={styles.configItem}>
              <Text style={styles.configLabel}>Max Colors:</Text>
              <Text style={styles.configValue}>{getCurrentAgeGroup().maxColors}</Text>
            </View>
          </View>
        </View>

        {/* Available Features */}
        <View style={styles.featuresCard}>
          <Text style={styles.sectionTitle}>Available Features</Text>
          <View style={styles.featuresList}>
            {getCurrentAgeGroup().features.map((feature, index) => {
              const IconComponent = featureIcons[feature as keyof typeof featureIcons];
              return (
                <View key={index} style={styles.featureItem}>
                  {IconComponent && (
                    <IconComponent size={20} color="#2563EB" />
                  )}
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Age Group Comparison */}
        <View style={styles.comparisonCard}>
          <Text style={styles.sectionTitle}>Age Group Comparison</Text>
          {ageGroups.map((group, index) => (
            <View 
              key={index} 
              style={[
                styles.comparisonItem,
                getCurrentAgeGroup().range === group.range && styles.activeComparisonItem
              ]}
            >
              <View style={styles.comparisonHeader}>
                <Text style={styles.comparisonTitle}>{group.title}</Text>
                <Text style={styles.comparisonRange}>Ages {group.range}</Text>
              </View>
              <Text style={styles.comparisonDescription}>{group.description}</Text>
              <View style={styles.comparisonFeatures}>
                <Text style={styles.comparisonFeaturesText}>
                  {group.features.length} features • {group.complexity} complexity
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Privacy & Safety Note */}
        <View style={styles.privacyCard}>
          <Text style={styles.privacyTitle}>Privacy & Safety</Text>
          <Text style={styles.privacyText}>
            All emotional data is stored securely and can only be accessed by authorized guardians 
            and healthcare providers. Age-appropriate features ensure a safe and supportive environment 
            for emotional expression and learning.
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 36,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  ageSelector: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  ageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAgeButton: {
    backgroundColor: '#EBF4FF',
    borderColor: '#2563EB',
  },
  ageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  selectedAgeButtonText: {
    color: '#2563EB',
  },
  ageGroupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  ageGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ageGroupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  ageGroupRange: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ageGroupDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  configDetails: {
    gap: 8,
  },
  configItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configLabel: {
    fontSize: 14,
    color: '#374151',
  },
  configValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  featuresCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  comparisonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  comparisonItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeComparisonItem: {
    backgroundColor: '#EBF4FF',
    borderColor: '#2563EB',
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  comparisonRange: {
    fontSize: 12,
    color: '#6B7280',
  },
  comparisonDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  comparisonFeatures: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
  },
  comparisonFeaturesText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  privacyCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});