# Number System Converter Mobile App

A beautiful cross-platform mobile application for converting numbers between different number systems (Binary, Decimal, Octal, Hexadecimal).

## 📱 Features

- **Multi-System Conversion**: Convert between Binary, Decimal, Octal, and Hexadecimal number systems
- **Beautiful Gradient UI**: Purple-to-blue gradient background (#6a11cb → #2575fc)
- **Conversion History**: Persistent storage of conversion history with localStorage
- **Cross-Platform**: Works on both iOS and Android using Capacitor
- **Responsive Design**: Mobile-optimized interface with modern UI components

## 🏗️ Architecture

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI (shadcn/ui)
- **Mobile Framework**: Capacitor for native iOS/Android deployment
- **State Management**: React hooks with localStorage persistence

### Project Structure
```
src/
├── components/
│   ├── ui/                     # Reusable UI components (shadcn/ui)
│   ├── BottomNavigation.tsx    # Bottom tab navigation
│   ├── ConverterScreen.tsx     # Main conversion input screen
│   ├── ConversionScreen.tsx    # Detailed conversion results
│   └── HistoryScreen.tsx       # Conversion history list
├── pages/
│   └── NumberConverterApp.tsx  # Main app component with state management
├── utils/
│   └── numberConverter.ts      # Core conversion logic and types
├── App.tsx                     # App entry point
├── index.css                   # Global styles and design system
└── main.tsx                    # React app bootstrap
```

## 🎨 Design System

### Color Palette (HSL)
- **Primary Gradient**: `linear-gradient(135deg, #6a11cb, #2575fc)`
- **Background**: `hsl(258, 84%, 43%)` to `hsl(214, 97%, 59%)`
- **Card Background**: `hsl(0, 0%, 100%)` (white)
- **Text Primary**: `hsl(224, 30%, 25%)` (dark blue)
- **Text Secondary**: `hsl(220, 9%, 46%)` (muted)

### Components
- **Cards**: White background with rounded corners and subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Navigation**: Bottom tab bar with white icons
- **Input Fields**: White background with blue text

## 🔧 Core Components

### NumberConverterApp.tsx
Main application component that manages:
- Navigation state between screens
- Conversion history with localStorage persistence
- Result sharing between screens

### ConverterScreen.tsx
Primary conversion interface featuring:
- Input field for number entry
- Dropdown for source number system selection
- Real-time input validation
- Convert button with gradient styling

### ConversionScreen.tsx
Detailed results display showing:
- Original input with source system
- All converted results in organized cards
- Copy-to-clipboard functionality

### HistoryScreen.tsx
Conversion history management:
- Scrollable list of past conversions
- Click to reopen previous results
- Clear history functionality
- Empty state handling

### numberConverter.ts
Core business logic containing:
- Input validation for each number system
- Conversion algorithms between all systems
- Type definitions and interfaces
- Utility functions for formatting

## 📱 User Interface Flow

1. **Converter Screen** (Default)
   - User enters a number
   - Selects source number system
   - Presses convert button
   - Navigates to Conversion Screen with results

2. **Conversion Screen**
   - Displays detailed conversion results
   - Shows all four number systems
   - Provides copy functionality

3. **History Screen**
   - Lists all previous conversions
   - Allows selection to view past results
   - Provides clear history option

## 🔄 Data Flow

1. User input → Validation → Conversion calculation
2. Results → State update → History storage → Navigation
3. History persistence → localStorage read/write
4. Navigation → State management → Screen rendering

## 🚀 Development Process

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- For mobile deployment: Android Studio (Android) or Xcode (iOS)

### Setup and Installation
```bash
# Clone the repository
git clone <repository-url>
cd number-system-converter

# Install dependencies
npm install

# Start development server
npm run dev
```

### Mobile Development Setup
```bash
# Add mobile platforms
npx cap add ios
npx cap add android

# Build the project
npm run build

# Sync with native platforms
npx cap sync

# Run on device/emulator
npx cap run ios     # For iOS
npx cap run android # For Android
```

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npx cap sync` - Sync changes to native platforms

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] Number input validation for each system
- [ ] Conversion accuracy verification
- [ ] History persistence across app restarts
- [ ] Navigation between all screens
- [ ] Mobile responsiveness
- [ ] Cross-platform compatibility

### Validation Rules
- **Binary**: Only 0 and 1 characters
- **Decimal**: Only 0-9 digits
- **Octal**: Only 0-7 digits
- **Hexadecimal**: Only 0-9 and A-F characters (case insensitive)

## 📦 Deployment Process

### Web Deployment
1. Run `npm run build`
2. Deploy `dist/` folder to web hosting service
3. Configure routing for SPA

### Mobile App Deployment

#### iOS App Store
1. Open project in Xcode: `npx cap open ios`
2. Configure app signing and provisioning profiles
3. Build and archive for distribution
4. Upload to App Store Connect

#### Google Play Store
1. Open project in Android Studio: `npx cap open android`
2. Generate signed APK or Bundle
3. Upload to Google Play Console

## 🔧 Configuration

### Capacitor Configuration
```typescript
// capacitor.config.ts
{
  appId: 'app.lovable.cf2d0a4cb588438d94e960b4c6834285',
  appName: 'Number System Converter',
  webDir: 'dist',
  server: {
    url: 'https://cf2d0a4c-b588-438d-94e9-60b4c6834285.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
}
```

### Tailwind Configuration
Custom design system tokens defined in:
- `src/index.css` - CSS custom properties
- `tailwind.config.ts` - Tailwind theme extensions

## 📋 Future Enhancements

### Potential Features
- [ ] Scientific notation support
- [ ] Floating-point number conversion
- [ ] Bulk conversion from file import
- [ ] Export history to CSV/JSON
- [ ] Dark/light theme toggle
- [ ] Custom number system support
- [ ] Calculation step-by-step explanation
- [ ] Cloud sync with user accounts

### Technical Improvements
- [ ] Unit test coverage
- [ ] E2E testing with Playwright
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Offline functionality
- [ ] Push notifications
- [ ] Analytics integration

## 🐛 Troubleshooting

### Common Issues
1. **Build Errors**: Ensure all dependencies are installed with correct versions
2. **Mobile Sync Issues**: Run `npx cap sync` after code changes
3. **History Not Persisting**: Check localStorage availability in browser
4. **Styling Issues**: Verify Tailwind classes and design system tokens

### Debug Mode
Enable development mode to access:
- Browser developer tools
- Console logging
- Network request monitoring
- Component state inspection

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com)

## 📄 License

This project is built with Lovable and follows standard web application licensing practices.