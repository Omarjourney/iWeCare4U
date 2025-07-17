import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useState } from 'react';

const { width } = Dimensions.get('window');

interface SpaceItem {
  id: string;
  emoji: string;
  name: string;
  category: 'furniture' | 'decoration' | 'nature' | 'comfort';
}

const spaceItems: SpaceItem[] = [
  // Furniture
  { id: 'bed', emoji: '🛏️', name: 'Cozy Bed', category: 'furniture' },
  { id: 'chair', emoji: '🪑', name: 'Comfy Chair', category: 'furniture' },
  { id: 'desk', emoji: '🪑', name: 'Study Desk', category: 'furniture' },
  
  // Decorations
  { id: 'lamp', emoji: '💡', name: 'Warm Light', category: 'decoration' },
  { id: 'books', emoji: '📚', name: 'Favorite Books', category: 'decoration' },
  { id: 'art', emoji: '🖼️', name: 'Pretty Picture', category: 'decoration' },
  
  // Nature
  { id: 'plant', emoji: '🪴', name: 'Green Plant', category: 'nature' },
  { id: 'flowers', emoji: '🌸', name: 'Flowers', category: 'nature' },
  { id: 'tree', emoji: '🌳', name: 'Big Tree', category: 'nature' },
  
  // Comfort
  { id: 'pillow', emoji: '🛋️', name: 'Soft Pillows', category: 'comfort' },
  { id: 'blanket', emoji: '🧸', name: 'Warm Blanket', category: 'comfort' },
  { id: 'toy', emoji: '🧸', name: 'Favorite Toy', category: 'comfort' },
];

interface Props {
  age: number;
  config: any;
  sessionData: any;
  onComplete: (data: any) => void;
}

export function SafeSpaceBuilder({ age, config, onComplete }: Props) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', emoji: '🏠' },
    { id: 'furniture', name: 'Furniture', emoji: '🪑' },
    { id: 'decoration', name: 'Decor', emoji: '🖼️' },
    { id: 'nature', name: 'Nature', emoji: '🌿' },
    { id: 'comfort', name: 'Comfort', emoji: '🛋️' },
  ];

  const filteredItems = currentCategory === 'all' 
    ? spaceItems 
    : spaceItems.filter(item => item.category === currentCategory);

  const maxItems = age <= 12 ? 6 : 8;

  const handleItemSelect = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    } else if (selectedItems.length < maxItems) {
      setSelectedItems(prev => [...prev, itemId]);
    }
  };

  const handleComplete = () => {
    const selectedItemData = spaceItems.filter(item => 
      selectedItems.includes(item.id)
    );
    
    onComplete({
      items: selectedItems,
      itemDetails: selectedItemData,
      spaceDescription: generateSpaceDescription(selectedItemData),
      timestamp: new Date().toISOString()
    });
  };

  const generateSpaceDescription = (items: SpaceItem[]) => {
    const categories = items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let description = "A safe space with ";
    const parts = [];
    
    if (categories.furniture) parts.push(`comfortable furniture`);
    if (categories.decoration) parts.push(`beautiful decorations`);
    if (categories.nature) parts.push(`natural elements`);
    if (categories.comfort) parts.push(`cozy comfort items`);
    
    return description + parts.join(', ');
  };

  const itemSize = (width - 48 - 24) / 3; // 3 items per row with gaps

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { fontSize: age <= 12 ? 20 : 18 }]}>
        Build Your Safe Space
      </Text>
      
      <Text style={styles.subtitle}>
        Choose up to {maxItems} things that make you feel safe and happy
      </Text>

      {/* Category Filter */}
      <View style={styles.categoryFilter}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              currentCategory === category.id && styles.activeCategoryButton
            ]}
            onPress={() => setCurrentCategory(category.id)}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={[
              styles.categoryText,
              currentCategory === category.id && styles.activeCategoryText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Items Grid */}
      <View style={styles.itemsGrid}>
        {filteredItems.map((item) => {
          const isSelected = selectedItems.includes(item.id);
          const isDisabled = !isSelected && selectedItems.length >= maxItems;
          
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                {
                  width: itemSize,
                  height: itemSize,
                  opacity: isDisabled ? 0.5 : 1,
                  backgroundColor: isSelected ? '#EBF4FF' : '#FFFFFF',
                  borderColor: isSelected ? '#2563EB' : '#E5E7EB'
                }
              ]}
              onPress={() => handleItemSelect(item.id)}
              disabled={isDisabled}
            >
              <Text style={[styles.itemEmoji, { fontSize: age <= 12 ? 32 : 28 }]}>
                {item.emoji}
              </Text>
              <Text style={[styles.itemName, { fontSize: age <= 12 ? 12 : 11 }]}>
                {item.name}
              </Text>
              {isSelected && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedCheck}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Items Preview */}
      {selectedItems.length > 0 && (
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Your Safe Space:</Text>
          <View style={styles.selectedPreview}>
            {selectedItems.map((itemId) => {
              const item = spaceItems.find(i => i.id === itemId);
              return (
                <View key={itemId} style={styles.previewItem}>
                  <Text style={styles.previewEmoji}>{item?.emoji}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {selectedItems.length > 0 && (
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeText}>
            {age <= 12 ? 'My Space is Ready!' : 'Complete Safe Space'}
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
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  categoryFilter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
  },
  categoryButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    minWidth: 50,
  },
  activeCategoryButton: {
    backgroundColor: '#EBF4FF',
  },
  categoryEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  itemCard: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 2,
    position: 'relative',
  },
  itemEmoji: {
    marginBottom: 4,
  },
  itemName: {
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  previewSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  selectedPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  previewItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewEmoji: {
    fontSize: 20,
  },
  completeButton: {
    backgroundColor: '#2563EB',
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