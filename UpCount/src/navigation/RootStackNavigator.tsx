import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList, RootStackParamList } from './types';
import MainTabNavigator from './MainTabNavigator';

// For now we'll just use the main tab navigator
// Later we'll add auth screens when implementing authentication

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();

// Placeholder for auth screens
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Auth screens will be added later */}
      {/* For now, we mock being authenticated */}
    </AuthStack.Navigator>
  );
};

const RootStackNavigator: React.FC = () => {
  // Mock authentication state
  const [isAuthenticated] = useState(true);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
