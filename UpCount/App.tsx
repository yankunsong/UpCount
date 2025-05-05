import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/context/AppContext';
import { AuthProvider } from './src/context/AuthContext';
import { GoalsProvider } from './src/context/GoalsContext';
import AppNavigator from './src/navigation/AppNavigator';

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
