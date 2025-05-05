# UpCount

A React Native mobile application for tracking personal goals and habits with a focus on quantifiable progress.

## Features

- 📱 Cross-platform (iOS & Android) support
- 🎯 Create and manage personal goals
- 📊 Track progress with detailed logs
- 🌙 Light/Dark theme support
- 🔄 Offline mode capability
- 🔔 Push notifications
- 🔒 Secure user authentication

## Project Structure

```
UpCount/
├── UpCount/           # Main application code
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── screens/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── App.tsx
│   └── .env.example
├── .github/          # GitHub templates and configurations
├── docs/            # Additional documentation
├── CONTRIBUTING.md  # Contribution guidelines
└── README.md       # This file
```

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for Mac) or Android Studio (for Android development)

## Installation

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

3. Create a `.env` file in the UpCount directory:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` with your actual configuration values.

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

## Development

- Run on iOS:

  ```bash
  npm run ios
  # or
  yarn ios
  ```

- Run on Android:
  ```bash
  npm run android
  # or
  yarn android
  ```

## Testing

```bash
npm test
# or
yarn test
```

## Environment Variables

See `.env.example` in the UpCount directory for all required environment variables.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

UpCount/
├── src/
│ ├── components/ # Reusable UI components
│ ├── context/ # React Context providers
│ ├── navigation/ # Navigation configuration
│ ├── screens/ # Screen components
│ ├── services/ # API and other services
│ ├── types/ # TypeScript interfaces
│ └── utils/ # Utility functions
├── assets/ # Images, fonts, etc.
├── App.tsx # Root component
└── babel.config.js # Babel configuration

````

## Environment Setup

The application uses the following environment variables:

- `API_BASE_URL`: Base URL for the backend API

Create a `.env` file in the project root and add these variables. See `.env.example` for reference.

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Start the iOS simulator
- `npm run android` - Start the Android emulator
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Testing

The project uses Jest for testing. Run tests with:

```bash
npm test
````

## Built With

- [React Native](https://reactnative.dev/) - Mobile framework
- [Expo](https://expo.dev/) - Development platform
- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [React Navigation](https://reactnavigation.org/) - Navigation library
- [Axios](https://axios-http.com/) - HTTP client

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped shape UpCount
- Special thanks to the React Native and Expo communities
