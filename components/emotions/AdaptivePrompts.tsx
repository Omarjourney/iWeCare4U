import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, Heart } from 'lucide-react-native';

interface Prompt {
  id: string;
  question: string;
  type: 'choice' | 'scale' | 'text' | 'reflection';
  options?: string[];
  followUp?: string;
}

interface Props {
  age: number;
  config: any;
  sessionData: any;
  onComplete: (data: any) => void;
}

export function AdaptivePrompts({ age, config, sessionData, onComplete }: Props) {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [responses, setResponses] = useState<any[]>([]);
  const [currentResponse, setCurrentResponse] = useState<any>(null);

  // Generate adaptive prompts based on previous session data
  const generatePrompts = (): Prompt[] => {
    const basePrompts: Prompt[] = [
      {
        id: 'feeling_intensity',
        question: 'How strong is this feeling right now?',
        type: 'scale',
        followUp: 'That helps me understand better.'
      },
      {
        id: 'trigger_reflection',
        question: 'What do you think might have caused this feeling?',
        type: 'text',
        followUp: 'Thank you for sharing that with me.'
      },
      {
        id: 'coping_strategy',
        question: 'What usually helps you feel better?',
        type: 'choice',
        options: ['Talk to someone', 'Listen to music', 'Go outside', 'Draw or write', 'Take deep breaths'],
        followUp: 'That sounds like a good strategy.'
      },
      {
        id: 'support_need',
        question: 'Would you like to talk to someone about how you\'re feeling?',
        type: 'choice',
        options: ['Yes, right now', 'Maybe later', 'No, I\'m okay'],
        followUp: 'I understand, and that\'s perfectly okay.'
      }
    ];

    // Adapt prompts based on mood data
    if (sessionData.mood) {
      const moodBasedPrompts = getMoodSpecificPrompts(sessionData.mood);
      return [...moodBasedPrompts, ...basePrompts];
    }

    return basePrompts;
  };

  const getMoodSpecificPrompts = (moodData: any): Prompt[] => {
    const moodId = moodData.mood || moodData;
    
    switch (moodId) {
      case 'sad':
        return [{
          id: 'sad_support',
          question: 'When you feel sad, what makes you feel a little better?',
          type: 'choice',
          options: ['Hugs', 'Favorite music', 'Talking', 'Being alone for a bit', 'Doing something creative'],
          followUp: 'Those are really good ways to take care of yourself.'
        }];
      
      case 'angry':
        return [{
          id: 'anger_management',
          question: 'When you feel angry, what helps you calm down?',
          type: 'choice',
          options: ['Count to 10', 'Take deep breaths', 'Go for a walk', 'Talk it out', 'Listen to music'],
          followUp: 'Those are excellent ways to handle anger.'
        }];
      
      case 'worried':
        return [{
          id: 'worry_thoughts',
          question: 'What are you most worried about right now?',
          type: 'text',
          followUp: 'Thank you for trusting me with your worries.'
        }];
      
      case 'happy':
        return [{
          id: 'happiness_share',
          question: 'What made you feel happy today?',
          type: 'text',
          followUp: 'I\'m so glad you\'re feeling happy!'
        }];
      
      default:
        return [];
    }
  };

  const [prompts] = useState<Prompt[]>(generatePrompts());
  const currentPrompt = prompts[currentPromptIndex];

  const handleResponse = (response: any) => {
    setCurrentResponse(response);
  };

  const handleNext = () => {
    if (currentResponse !== null) {
      const newResponses = [...responses, {
        promptId: currentPrompt.id,
        question: currentPrompt.question,
        response: currentResponse,
        timestamp: new Date().toISOString()
      }];
      
      setResponses(newResponses);
      setCurrentResponse(null);

      if (currentPromptIndex < prompts.length - 1) {
        setCurrentPromptIndex(prev => prev + 1);
      } else {
        // Complete the session
        onComplete({
          responses: newResponses,
          totalPrompts: prompts.length,
          completionRate: 100,
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const handleSkip = () => {
    if (currentPromptIndex < prompts.length - 1) {
      setCurrentPromptIndex(prev => prev + 1);
      setCurrentResponse(null);
    } else {
      onComplete({
        responses,
        totalPrompts: prompts.length,
        completionRate: (responses.length / prompts.length) * 100,
        timestamp: new Date().toISOString()
      });
    }
  };

  const renderPromptInput = () => {
    switch (currentPrompt.type) {
      case 'choice':
        return (
          <View style={styles.choiceContainer}>
            {currentPrompt.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.choiceButton,
                  currentResponse === option && styles.selectedChoice
                ]}
                onPress={() => handleResponse(option)}
              >
                <Text style={[
                  styles.choiceText,
                  currentResponse === option && styles.selectedChoiceText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'scale':
        return (
          <View style={styles.scaleContainer}>
            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>Not at all</Text>
              <Text style={styles.scaleLabel}>Very much</Text>
            </View>
            <View style={styles.scaleSlider}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.scaleDot,
                    currentResponse === value && styles.selectedScaleDot
                  ]}
                  onPress={() => handleResponse(value)}
                />
              ))}
            </View>
            <View style={styles.scaleNumbers}>
              <Text style={styles.scaleNumber}>1</Text>
              <Text style={styles.scaleNumber}>10</Text>
            </View>
          </View>
        );

      case 'text':
        return (
          <View style={styles.textContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Share your thoughts here..."
              multiline
              numberOfLines={4}
              value={currentResponse || ''}
              onChangeText={handleResponse}
              textAlignVertical="top"
            />
          </View>
        );

      default:
        return null;
    }
  };

  if (!currentPrompt) {
    return (
      <View style={styles.completionContainer}>
        <Heart size={48} color="#059669" />
        <Text style={styles.completionTitle}>Thank you for sharing!</Text>
        <Text style={styles.completionText}>
          Your responses help us understand how you're feeling and how we can better support you.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentPromptIndex + 1) / prompts.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentPromptIndex + 1} of {prompts.length}
        </Text>
      </View>

      {/* Current Prompt */}
      <View style={styles.promptContainer}>
        <View style={styles.promptHeader}>
          <MessageCircle size={24} color="#2563EB" />
          <Text style={styles.promptQuestion}>{currentPrompt.question}</Text>
        </View>

        {renderPromptInput()}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.nextButton,
              currentResponse === null && styles.disabledButton
            ]}
            onPress={handleNext}
            disabled={currentResponse === null}
          >
            <Text style={[
              styles.nextText,
              currentResponse === null && styles.disabledText
            ]}>
              {currentPromptIndex === prompts.length - 1 ? 'Finish' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Follow-up Message */}
        {currentResponse !== null && currentPrompt.followUp && (
          <View style={styles.followUpContainer}>
            <Text style={styles.followUpText}>{currentPrompt.followUp}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  promptContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    flex: 1,
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  promptQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
    flex: 1,
    lineHeight: 24,
  },
  choiceContainer: {
    gap: 12,
    marginBottom: 24,
  },
  choiceButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  selectedChoice: {
    backgroundColor: '#EBF4FF',
    borderColor: '#2563EB',
  },
  choiceText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  selectedChoiceText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  scaleContainer: {
    marginBottom: 24,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  scaleLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  scaleSlider: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scaleDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  selectedScaleDot: {
    backgroundColor: '#2563EB',
  },
  scaleNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleNumber: {
    fontSize: 12,
    color: '#6B7280',
  },
  textContainer: {
    marginBottom: 24,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    minHeight: 120,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  skipText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  followUpContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
  },
  followUpText: {
    fontSize: 14,
    color: '#059669',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  completionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 12,
  },
  completionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});