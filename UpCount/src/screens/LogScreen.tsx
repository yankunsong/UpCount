import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabScreenProps } from '../navigation/types';
import Button from '../components/Button';

type Props = MainTabScreenProps<'Log'>;

const LogScreen: React.FC = () => {
  const navigation = useNavigation<Props['navigation']>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Log</Text>
      <Text style={styles.subtitle}>Record your progress toward goals</Text>

      <ScrollView style={styles.logList} contentContainerStyle={styles.logListContent}>
        {/* Placeholder log entries */}
        <TouchableOpacity style={styles.logItem}>
          <View style={styles.logHeader}>
            <Text style={styles.logTitle}>Exercise 3 times a week</Text>
            <Text style={styles.logDate}>May 5, 2024</Text>
          </View>
          <Text style={styles.logValue}>Completed: 1 session</Text>
          <Text style={styles.logNotes}>Morning jog for 30 minutes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logItem}>
          <View style={styles.logHeader}>
            <Text style={styles.logTitle}>Read 20 pages daily</Text>
            <Text style={styles.logDate}>May 4, 2024</Text>
          </View>
          <Text style={styles.logValue}>Completed: 25 pages</Text>
          <Text style={styles.logNotes}>Finished chapter 3 of "Atomic Habits"</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logItem}>
          <View style={styles.logHeader}>
            <Text style={styles.logTitle}>Exercise 3 times a week</Text>
            <Text style={styles.logDate}>May 3, 2024</Text>
          </View>
          <Text style={styles.logValue}>Completed: 1 session</Text>
          <Text style={styles.logNotes}>Gym workout - strength training</Text>
        </TouchableOpacity>
      </ScrollView>

      <Button
        title="Add New Log Entry"
        onPress={() => console.log('Add log pressed')}
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
  logList: {
    width: '100%',
    flex: 1,
  },
  logListContent: {
    paddingBottom: 20,
  },
  logItem: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  logDate: {
    fontSize: 14,
    color: '#666666',
  },
  logValue: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
    color: '#007AFF',
  },
  logNotes: {
    fontSize: 14,
    color: '#444444',
  },
  addButton: {
    marginTop: 16,
    width: '100%',
  },
});

export default LogScreen;
