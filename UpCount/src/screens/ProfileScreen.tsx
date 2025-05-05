import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabScreenProps } from '../navigation/types';
import Button from '../components/Button';

type Props = MainTabScreenProps<'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<Props['navigation']>();

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {/* Placeholder avatar - replace with actual user image */}
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JS</Text>
          </View>
        </View>
        <Text style={styles.username}>John Smith</Text>
        <Text style={styles.email}>john.smith@example.com</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Active Goals</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>23</Text>
          <Text style={styles.statLabel}>Log Entries</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuItem}>
          <Text style={styles.menuItemText}>Edit Profile</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuItemText}>Notifications</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuItemText}>Privacy Settings</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.menuItem}>
          <Text style={styles.menuItemText}>About</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuItemText}>Help & Support</Text>
        </View>
      </View>

      <Button
        title="Sign Out"
        onPress={() => console.log('Sign out pressed')}
        buttonStyle={styles.signOutButton}
        textStyle={styles.signOutText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333333',
  },
  signOutButton: {
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    marginTop: 10,
  },
  signOutText: {
    color: '#FF3B30',
  },
});

export default ProfileScreen;
