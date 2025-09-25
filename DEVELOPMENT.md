# Development Guide - Number System Converter

## 🔧 Development Environment Setup

### Prerequisites
- Node.js 18+ with npm
- Git for version control
- Visual Studio Code (recommended)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Quick Start
```bash
# 1. Clone and setup
git clone <your-repo-url>
cd number-system-converter
npm install

# 2. Start development
npm run dev

# 3. For mobile development
npx cap add ios android
npm run build
npx cap sync
```

## 📁 Project Structure Deep Dive

### Core Architecture
```
├── capacitor.config.ts     # Mobile app configuration
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components (shadcn)
│   │   ├── BottomNavigation.tsx
│   │   ├── ConverterScreen.tsx
│   │   ├── ConversionScreen.tsx
│   │   └── HistoryScreen.tsx
│   ├── pages/             # Main application pages
│   │   └── NumberConverterApp.tsx
│   ├── utils/             # Business logic
│   │   └── numberConverter.ts
│   ├── App.tsx            # App entry point
│   ├── index.css          # Global styles & design system
│   └── main.tsx           # React bootstrap
├── tailwind.config.ts     # Tailwind configuration
└── vite.config.ts         # Build configuration
```

### Component Responsibilities

#### NumberConverterApp.tsx (Main Controller)
- **State Management**: Controls active tab, conversion history, current result
- **Navigation Logic**: Handles tab switching and screen transitions
- **Data Persistence**: Manages localStorage for conversion history
- **Event Handling**: Coordinates between child components

#### ConverterScreen.tsx (Input Interface)
- **User Input**: Number entry and validation
- **System Selection**: Dropdown for source number system
- **Conversion Trigger**: Convert button with error handling
- **Input Validation**: Real-time feedback for invalid inputs

#### ConversionScreen.tsx (Results Display)
- **Result Presentation**: Formatted display of all conversions
- **Copy Functionality**: Clipboard integration for results
- **Result Navigation**: Back to converter or view history

#### HistoryScreen.tsx (History Management)
- **History Display**: Scrollable list of past conversions
- **Item Selection**: Tap to reopen previous conversions
- **History Management**: Clear all history functionality
- **Empty States**: User guidance when no history exists

#### numberConverter.ts (Business Logic)
- **Validation Functions**: Input validation for each number system
- **Conversion Algorithms**: Core mathematical conversions
- **Type Definitions**: TypeScript interfaces and types
- **Utility Functions**: Formatting and helper functions

## 🎨 Design System Implementation

### CSS Custom Properties (index.css)
```css
:root {
  /* Core gradient */
  --app-gradient: linear-gradient(135deg, #6a11cb, #2575fc);
  
  /* Semantic colors */
  --card-background: hsl(0, 0%, 100%);
  --text-primary: hsl(224, 30%, 25%);
  --text-secondary: hsl(220, 9%, 46%);
}
```

### Tailwind Configuration (tailwind.config.ts)
- **Color Extensions**: Custom color tokens
- **Component Classes**: Utility classes for common patterns
- **Responsive Breakpoints**: Mobile-first design approach

### Component Styling Strategy
- **Semantic Tokens**: Use CSS custom properties instead of hardcoded colors
- **Utility Classes**: Leverage Tailwind for layout and spacing
- **Component Variants**: Create reusable component variations
- **Mobile Optimization**: Responsive design with touch-friendly targets

## 🔄 State Management Pattern

### Data Flow Architecture
```
User Input → Validation → Conversion → State Update → UI Re-render
     ↓
History Storage (localStorage) → Persistence → App Restart → State Recovery
```

### State Structure
```typescript
interface AppState {
  activeTab: 'converter' | 'conversion' | 'history';
  conversionHistory: ConversionResult[];
  currentResult: ConversionResult | null;
}
```

### Persistence Strategy
- **localStorage**: Client-side persistence for conversion history
- **JSON Serialization**: Convert Date objects for storage
- **Error Handling**: Graceful fallback for storage failures
- **Capacity Management**: Limit to 100 most recent conversions

## 🧮 Conversion Algorithm Details

### Number System Conversion Process
1. **Input Validation**: Regex patterns for each system
2. **Decimal Conversion**: All inputs converted to decimal first
3. **Target Conversion**: Decimal converted to all target systems
4. **Result Formatting**: Consistent formatting (uppercase hex)

### Validation Patterns
```typescript
const patterns = {
  binary: /^[01]+$/,
  decimal: /^[0-9]+$/,
  octal: /^[0-7]+$/,
  hexadecimal: /^[0-9a-fA-F]+$/,
};
```

### Error Handling
- **Input Validation**: Real-time feedback during typing
- **Conversion Errors**: Graceful handling of invalid numbers
- **UI Feedback**: Toast notifications for user guidance
- **Fallback States**: Default values for error conditions

## 📱 Mobile Development Workflow

### Capacitor Integration
1. **Configuration**: App ID, name, and server settings
2. **Platform Addition**: iOS and Android platform setup
3. **Sync Process**: Web to native code synchronization
4. **Build Pipeline**: Production builds for app stores

### Development vs Production
- **Development**: Hot reload with Lovable preview URL
- **Production**: Built static files with native packaging
- **Testing**: Device testing with development builds
- **Deployment**: App store distribution builds

### Platform-Specific Considerations
- **iOS**: Xcode project configuration, signing certificates
- **Android**: Gradle build system, SDK versions
- **Permissions**: App permissions for clipboard access
- **Icons/Splash**: Platform-specific asset generation

## 🔍 Debugging and Testing

### Development Tools
- **Browser DevTools**: Component inspection and debugging
- **React DevTools**: Component state and props inspection
- **Capacitor DevTools**: Native bridge debugging
- **Console Logging**: Strategic logging for data flow

### Testing Checklist
- [ ] Input validation for each number system
- [ ] Conversion accuracy across all systems
- [ ] History persistence and recovery
- [ ] Navigation state management
- [ ] Mobile touch interactions
- [ ] Cross-platform compatibility
- [ ] Performance with large numbers
- [ ] Edge case handling (empty inputs, invalid data)

### Common Debug Scenarios
1. **Conversion Errors**: Check input validation and parsing logic
2. **History Issues**: Verify localStorage read/write operations
3. **Navigation Problems**: Debug state transitions
4. **Mobile Issues**: Use device debugging tools
5. **Styling Problems**: Inspect CSS custom properties and Tailwind classes

## 🚀 Build and Deployment

### Development Build
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Test production build
```

### Mobile Build Process
```bash
# 1. Web build
npm run build

# 2. Sync to native
npx cap sync

# 3. Open in native IDE
npx cap open ios
npx cap open android

# 4. Build in native IDE
# iOS: Product > Archive in Xcode
# Android: Build > Generate Signed Bundle in Android Studio
```

### Production Deployment Checklist
- [ ] Version bump in package.json
- [ ] Update capacitor.config.ts for production
- [ ] Run production build and test
- [ ] Sync native platforms
- [ ] Test on physical devices
- [ ] Generate signed builds
- [ ] Submit to app stores

## 🔧 Customization Guide

### Adding New Number Systems
1. Update `NumberSystem` type in `numberConverter.ts`
2. Add validation pattern
3. Implement conversion logic
4. Update UI components for new system
5. Test conversion accuracy

### UI Customization
1. Modify CSS custom properties in `index.css`
2. Update Tailwind config for new colors
3. Create component variants as needed
4. Test across all screens

### Feature Extensions
1. **Export/Import**: Add file handling capabilities
2. **Cloud Sync**: Integrate with backend services
3. **Themes**: Implement dark/light mode
4. **Analytics**: Add usage tracking
5. **Notifications**: Add conversion reminders

## 📚 Code Standards

### TypeScript Guidelines
- Use strict type checking
- Define interfaces for all data structures
- Avoid `any` types
- Use proper error handling with try/catch

### React Best Practices
- Functional components with hooks
- Proper dependency arrays for useEffect
- Memoization for expensive calculations
- Clean component separation of concerns

### Styling Conventions
- Use semantic design tokens
- Mobile-first responsive design
- Consistent spacing and typography
- Accessible color contrast ratios

### Git Workflow
- Feature branches for new functionality
- Descriptive commit messages
- Regular commits with small changes
- Code review before merging

## 🐛 Troubleshooting Common Issues

### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Capacitor cache
npx cap clean
npx cap sync
```

### Mobile Sync Issues
```bash
# Force sync
npx cap sync --force

# Rebuild native project
npx cap clean
npx cap add ios android
npx cap sync
```

### Development Server Issues
```bash
# Check port availability
lsof -ti:5173

# Use different port
npm run dev -- --port 3000
```

## 📈 Performance Optimization

### Bundle Size Optimization
- Tree shaking for unused code
- Dynamic imports for code splitting
- Optimize images and assets
- Minimize third-party dependencies

### Runtime Performance
- Memoize expensive calculations
- Debounce user input handling
- Optimize re-renders with React.memo
- Use efficient data structures

### Mobile Performance
- Minimize JavaScript bundle size
- Optimize for slower mobile networks
- Use native platform optimizations
- Test on actual devices

This development guide provides comprehensive information for maintaining and extending the Number System Converter mobile application.