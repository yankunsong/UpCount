import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Main tab navigator types
export type MainTabParamList = {
  Home: undefined;
  Goals: undefined;
  Log: undefined;
  Profile: undefined;
};

// Auth stack navigator types
export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

// Goal detail stack navigator types
export type GoalStackParamList = {
  GoalsList: undefined;
  GoalDetail: { goalId: string };
  AddGoal: undefined;
  EditGoal: { goalId: string };
};

// Log stack navigator types
export type LogStackParamList = {
  LogsList: undefined;
  AddLog: { goalId?: string };
  LogDetail: { logId: string };
};

// Profile stack navigator types
export type ProfileStackParamList = {
  UserProfile: undefined;
  Settings: undefined;
  EditProfile: undefined;
};

// Root stack navigator types
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  GoalStack: NavigatorScreenParams<GoalStackParamList>;
  LogStack: NavigatorScreenParams<LogStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// Navigation prop types
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = BottomTabScreenProps<
  MainTabParamList,
  T
>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type GoalStackScreenProps<T extends keyof GoalStackParamList> = NativeStackScreenProps<
  GoalStackParamList,
  T
>;

export type LogStackScreenProps<T extends keyof LogStackParamList> = NativeStackScreenProps<
  LogStackParamList,
  T
>;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = NativeStackScreenProps<
  ProfileStackParamList,
  T
>;

// Utility type to get the navigation object type from any screen
export type RootNavigationType = RootStackScreenProps<keyof RootStackParamList>['navigation'];

// Declare global type augmentation for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
