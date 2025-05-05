# Development Environment Setup Guide

This guide will help you set up your development environment for working on UpCount.

## System Requirements

- macOS, Windows, or Linux operating system
- Node.js v14 or higher
- npm v6 or higher (comes with Node.js) or yarn
- Git
- Xcode (for iOS development on macOS)
- Android Studio (for Android development)
- VS Code (recommended) or your preferred IDE

## Setting Up Your Development Environment

### 1. Install Node.js and npm

Download and install Node.js from [nodejs.org](https://nodejs.org/). This will also install npm.

Verify the installation:

```bash
node --version
npm --version
```

### 2. Install Development Tools

#### For iOS Development (macOS only):

1. Install Xcode from the Mac App Store
2. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
3. Install CocoaPods:
   ```bash
   sudo gem install cocoapods
   ```

#### For Android Development:

1. Download and install [Android Studio](https://developer.android.com/studio)
2. Install the Android SDK through Android Studio
3. Set up Android environment variables (ANDROID_HOME)
4. Create and set up an Android Virtual Device (AVD)

### 3. Install Expo CLI

```bash
npm install -g expo-cli
```

### 4. IDE Setup

We recommend using Visual Studio Code with the following extensions:

- ESLint
- Prettier
- React Native Tools
- TypeScript and JavaScript Language Features

### 5. Clone and Set Up the Project

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/UpCount.git
   cd UpCount/UpCount
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

### 6. Running the Application

#### For iOS (macOS only):

```bash
npm run ios
# or
yarn ios
```

#### For Android:

```bash
npm run android
# or
yarn android
```

## Troubleshooting Common Issues

### iOS Build Issues

- Clean the build:
  ```bash
  cd ios && pod deintegrate
  pod install
  cd ..
  ```
- Reset Metro cache:
  ```bash
  npm start -- --reset-cache
  ```

### Android Build Issues

- Clean the Gradle build:
  ```bash
  cd android
  ./gradlew clean
  cd ..
  ```
- Update Android SDK tools through Android Studio

## Code Style and Linting

We use ESLint and Prettier to maintain code quality. Before committing:

```bash
npm run lint
# or
yarn lint
```

To automatically fix linting issues:

```bash
npm run lint:fix
# or
yarn lint:fix
```

## Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

For test coverage:

```bash
npm run test:coverage
# or
yarn test:coverage
```

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## Need Help?

If you encounter any issues not covered in this guide:

1. Check the [troubleshooting section](#troubleshooting-common-issues)
2. Search existing GitHub issues
3. Create a new issue with detailed information about your problem
