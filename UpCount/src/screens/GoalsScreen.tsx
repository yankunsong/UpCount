import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabScreenProps } from '../navigation/types';
import Button from '../components/Button';

type Props = MainTabScreenProps<'Goals'>;

const GoalsScreen: React.FC = () => {
  const navigation = useNavigation<Props['navigation']>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Goals</Text>
      <Text style={styles.subtitle}>Track your progress on different goals</Text>

      <View style={styles.goalsContainer}>
        {/* Placeholder for goal items */}
        <TouchableOpacity style={styles.goalItem} onPress={() => console.log('Goal pressed')}>
          <Text style={styles.goalTitle}>Exercise 3 times a week</Text>
          <Text style={styles.goalProgress}>Progress: 2/3</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.goalItem} onPress={() => console.log('Goal pressed')}>
          <Text style={styles.goalTitle}>Read 20 pages daily</Text>
          <Text style={styles.goalProgress}>Progress: 12/20</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Add New Goal"
        onPress={() => console.log('Add goal pressed')}
        buttonStyle={styles.addButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    color: '#666666',
    alignSelf: 'flex-start',
  },
  goalsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  goalItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  goalProgress: {
    fontSize: 14,
    color: '#007AFF',
  },
  addButton: {
    marginTop: 12,
    width: '100%',
  },
});

export default GoalsScreen;
