import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/context/AppContext';
import { AuthProvider } from './src/context/AuthContext';
import { GoalsProvider } from './src/context/GoalsContext';
import AppNavigator from './src/navigation/AppNavigator';
import { Amplify } from 'aws-amplify';
import '@react-native-async-storage/async-storage';

// Configure Amplify
Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_65jZmVv9N',
    userPoolWebClientId: '619sj90c9tule6r1o308skvm4i',
  }
});

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <GoalsProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </GoalsProvider>
      </AuthProvider>
    </AppProvider>
  );
}