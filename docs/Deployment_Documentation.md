# Deployment Documentation - Number System Converter
## Deployment Guide, Release Management, and Operations Manual

**Document Version:** 1.0  
**Date:** September 25, 2025  
**Project:** Number System Converter Mobile App  
**Document Type:** Deployment Documentation  

---

## 1. DEPLOYMENT OVERVIEW

### 1.1 Deployment Scope
This document covers the complete deployment process for the Number System Converter mobile application across multiple environments and platforms.

### 1.2 Target Platforms
```
Mobile Platforms:
├── iOS App Store (iOS 12.0+)
├── Google Play Store (Android API 26+)
└── Web Distribution (Progressive Web App)

Development Environments:
├── Development (Local)
├── Staging (Testing)
├── UAT (User Acceptance)
└── Production (Live)
```

### 1.3 Deployment Architecture
```
Source Code (GitHub)
    ↓
Build Pipeline (CI/CD)
    ↓
┌─────────────────────────────────┐
│        Build Artifacts         │
├─────────────────────────────────┤
│ ├── Web Bundle (dist/)         │
│ ├── iOS App Bundle (.ipa)      │
│ ├── Android App Bundle (.aab)  │
│ └── APK Files (.apk)           │
└─────────────────────────────────┘
    ↓
Distribution Platforms
├── iOS App Store
├── Google Play Store
└── Web Hosting (Lovable/Custom)
```

---

## 2. BUILD CONFIGURATION

### 2.1 Environment Configuration

#### Development Environment
```typescript
// vite.config.development.ts
export default defineConfig({
  mode: 'development',
  define: {
    __DEV__: true,
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  build: {
    sourcemap: true,
    minify: false,
  },
  server: {
    port: 5173,
    host: true,
  }
});
```

#### Production Environment
```typescript
// vite.config.production.ts
export default defineConfig({
  mode: 'production',
  define: {
    __DEV__: false,
    __VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  build: {
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-select', '@radix-ui/react-toast']
        }
      }
    }
  }
});
```

### 2.2 Capacitor Configuration

#### Development Configuration
```typescript
// capacitor.config.dev.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cf2d0a4cb588438d94e960b4c6834285.dev',
  appName: 'Number Converter (Dev)',
  webDir: 'dist',
  server: {
    url: 'http://localhost:5173',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#6a11cb'
    }
  }
};

export default config;
```

#### Production Configuration
```typescript
// capacitor.config.prod.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cf2d0a4cb588438d94e960b4c6834285',
  appName: 'Number System Converter',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#6a11cb'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6a11cb',
      showSpinner: false
    }
  }
};

export default config;
```

---

## 3. BUILD PROCESS

### 3.1 Build Scripts Configuration

#### package.json Scripts
```json
{
  "scripts": {
    "dev": "vite --config vite.config.development.ts",
    "build": "tsc && vite build --config vite.config.production.ts",
    "build:dev": "tsc && vite build --config vite.config.development.ts",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    
    "cap:sync": "cap sync",
    "cap:build": "npm run build && cap sync",
    "cap:serve": "cap run web",
    
    "ios:dev": "cap run ios --configuration=Debug",
    "ios:prod": "cap run ios --configuration=Release",
    "android:dev": "cap run android --flavor=debug",
    "android:prod": "cap run android --flavor=release",
    
    "build:ios": "npm run build && cap sync ios && cap build ios",
    "build:android": "npm run build && cap sync android && cap build android",
    
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "test:e2e": "cypress run"
  }
}
```

### 3.2 Build Pipeline Stages

#### Stage 1: Code Quality Checks
```bash
#!/bin/bash
# build-stage-1.sh - Code Quality

echo "🔍 Running code quality checks..."

# Type checking
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ TypeScript type checking failed"
  exit 1
fi

# Linting
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint checks failed"
  exit 1
fi

# Unit tests
npm run test
if [ $? -ne 0 ]; then
  echo "❌ Unit tests failed"
  exit 1
fi

echo "✅ Code quality checks passed"
```

#### Stage 2: Build Generation
```bash
#!/bin/bash
# build-stage-2.sh - Build Generation

echo "🏗️ Building application..."

# Clean previous builds
rm -rf dist/
rm -rf android/app/build/
rm -rf ios/App/build/

# Build web assets
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Web build failed"
  exit 1
fi

# Sync with native platforms
npx cap sync
if [ $? -ne 0 ]; then
  echo "❌ Capacitor sync failed"
  exit 1
fi

echo "✅ Build generation completed"
```

#### Stage 3: Native Builds
```bash
#!/bin/bash
# build-stage-3.sh - Native Builds

echo "📱 Building native applications..."

# iOS Build
if [ "$BUILD_IOS" = "true" ]; then
  echo "Building iOS..."
  cd ios/App
  xcodebuild -workspace App.xcworkspace \
             -scheme App \
             -configuration Release \
             -archivePath build/App.xcarchive \
             archive
  
  xcodebuild -exportArchive \
             -archivePath build/App.xcarchive \
             -exportPath build/ \
             -exportOptionsPlist ExportOptions.plist
  cd ../..
fi

# Android Build
if [ "$BUILD_ANDROID" = "true" ]; then
  echo "Building Android..."
  cd android
  ./gradlew assembleRelease
  ./gradlew bundleRelease
  cd ..
fi

echo "✅ Native builds completed"
```

---

## 4. DEPLOYMENT ENVIRONMENTS

### 4.1 Development Environment

#### Purpose:
- Active development and testing
- Feature development and debugging
- Integration testing

#### Configuration:
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - VITE_API_URL=http://localhost:3000
```

#### Deployment Commands:
```bash
# Local development
npm run dev

# Docker development
docker-compose -f docker-compose.dev.yml up
```

### 4.2 Staging Environment

#### Purpose:
- Pre-production testing
- QA validation
- Performance testing
- Integration testing

#### Configuration:
```yaml
# docker-compose.staging.yml
version: '3.8'
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=staging
      - VITE_API_URL=https://staging-api.example.com
```

#### Deployment Process:
```bash
# Build for staging
npm run build:dev

# Deploy to staging server
scp -r dist/ user@staging-server:/var/www/html/

# Or using Docker
docker-compose -f docker-compose.staging.yml up -d
```

### 4.3 Production Environment

#### Purpose:
- Live application serving end users
- High availability and performance
- Monitoring and analytics

#### Configuration:
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
    volumes:
      - ./ssl:/etc/ssl/certs
    restart: unless-stopped
```

---

## 5. MOBILE APP DEPLOYMENT

### 5.1 iOS App Store Deployment

#### Prerequisites:
- Apple Developer Account
- iOS Distribution Certificate
- App Store Provisioning Profile
- App Store Connect access

#### Deployment Steps:

##### Step 1: Configure iOS Project
```bash
# Open iOS project in Xcode
npx cap open ios

# Configure in Xcode:
# 1. Set Bundle Identifier
# 2. Configure Signing & Capabilities
# 3. Set App Store provisioning profile
# 4. Update version and build numbers
```

##### Step 2: Archive and Export
```bash
# Build archive
xcodebuild -workspace ios/App/App.xcworkspace \
           -scheme App \
           -configuration Release \
           -archivePath build/App.xcarchive \
           archive

# Export for App Store
xcodebuild -exportArchive \
           -archivePath build/App.xcarchive \
           -exportPath build/AppStore/ \
           -exportOptionsPlist ExportOptions.plist
```

##### Step 3: Upload to App Store Connect
```bash
# Using Xcode Organizer
# 1. Open Xcode → Window → Organizer
# 2. Select the archive
# 3. Click "Distribute App"
# 4. Choose "App Store Connect"
# 5. Follow the upload wizard

# Or using command line
xcrun altool --upload-app \
             --type ios \
             --file "build/AppStore/App.ipa" \
             --username "your-apple-id@email.com" \
             --password "@keychain:Application Loader: your-apple-id@email.com"
```

##### Step 4: App Store Connect Configuration
```
1. App Information:
   ├── Name: "Number System Converter"
   ├── Bundle ID: app.lovable.cf2d0a4cb588438d94e960b4c6834285
   ├── SKU: NSC-2025-001
   └── Language: English (Primary)

2. Pricing and Availability:
   ├── Price: Free
   ├── Availability: All Territories
   └── App Store Distribution: Yes

3. App Store Information:
   ├── Category: Education
   ├── Content Rating: 4+
   ├── Description: [App description]
   ├── Keywords: number converter, binary, hexadecimal
   └── Screenshots: [Upload screenshots]

4. Build Information:
   ├── Select uploaded build
   ├── Export Compliance: No encryption
   └── Submit for Review
```

### 5.2 Google Play Store Deployment

#### Prerequisites:
- Google Play Console Account
- Upload Key and Key Store
- Google Play App Signing enrolled

#### Deployment Steps:

##### Step 1: Configure Android Project
```bash
# Generate release keystore (first time only)
keytool -genkey -v \
        -keystore release-key.keystore \
        -alias my-key-alias \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000

# Configure gradle.properties
echo "MYAPP_UPLOAD_STORE_FILE=release-key.keystore" >> android/gradle.properties
echo "MYAPP_UPLOAD_KEY_ALIAS=my-key-alias" >> android/gradle.properties
echo "MYAPP_UPLOAD_STORE_PASSWORD=password" >> android/gradle.properties
echo "MYAPP_UPLOAD_KEY_PASSWORD=password" >> android/gradle.properties
```

##### Step 2: Build Release APK/AAB
```bash
# Build AAB (recommended)
cd android
./gradlew bundleRelease

# Build APK (alternative)
./gradlew assembleRelease

# Generated files:
# ├── app/build/outputs/bundle/release/app-release.aab
# └── app/build/outputs/apk/release/app-release.apk
```

##### Step 3: Upload to Google Play Console
```
1. Create New App:
   ├── App Name: "Number System Converter"
   ├── Default Language: English
   ├── App or Game: App
   └── Free or Paid: Free

2. App Content:
   ├── Content Rating: Everyone
   ├── Target Audience: General audience
   ├── Ads: Contains ads (if applicable)
   └── Store Listing: [Complete all fields]

3. Release Management:
   ├── App Releases → Production
   ├── Upload AAB file
   ├── Release Notes: [Version notes]
   └── Review and Rollout

4. Store Listing:
   ├── Title: "Number System Converter"
   ├── Short Description: [50 chars max]
   ├── Full Description: [4000 chars max]
   ├── Screenshots: [Upload all required]
   └── App Icon: [512x512 PNG]
```

---

## 6. WEB DEPLOYMENT

### 6.1 Lovable Platform Deployment

#### Automatic Deployment:
```bash
# Lovable automatically deploys when changes are pushed to main branch
# No manual steps required for Lovable hosting

# Preview URL:
https://cf2d0a4c-b588-438d-94e9-60b4c6834285.lovableproject.com

# Custom domain can be configured in Lovable settings
```

### 6.2 Custom Web Hosting

#### Static File Hosting (Netlify/Vercel):
```bash
# Build for production
npm run build

# Deploy to Netlify
npx netlify-cli deploy --prod --dir=dist

# Deploy to Vercel
npx vercel --prod
```

#### Self-Hosted Deployment:
```bash
# Build application
npm run build

# Copy to web server
rsync -avz dist/ user@server:/var/www/html/

# Nginx configuration
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 7. CONTINUOUS INTEGRATION/DEPLOYMENT

### 7.1 GitHub Actions Workflow

#### CI/CD Pipeline:
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
      - run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  build-web:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to staging
        if: github.ref == 'refs/heads/develop'
        run: |
          # Deploy to staging environment
          
      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: |
          # Deploy to production environment

  build-mobile:
    needs: test
    runs-on: macos-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      - run: npx cap sync
      
      - name: Build iOS
        run: |
          cd ios/App
          xcodebuild -workspace App.xcworkspace \
                     -scheme App \
                     -configuration Release \
                     -archivePath build/App.xcarchive \
                     archive
      
      - name: Setup Android SDK
        uses: android-actions/setup-android@v2
      
      - name: Build Android
        run: |
          cd android
          ./gradlew assembleRelease
          ./gradlew bundleRelease
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: mobile-builds
          path: |
            ios/App/build/
            android/app/build/outputs/
```

### 7.2 Automated Testing in CI

#### Test Configuration:
```yaml
# vitest.config.ci.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/test/**'
      ]
    },
    reporters: ['default', 'junit'],
    outputFile: 'test-results.xml'
  }
});
```

---

## 8. RELEASE MANAGEMENT

### 8.1 Version Management

#### Semantic Versioning:
```
Version Format: MAJOR.MINOR.PATCH
├── MAJOR: Breaking changes
├── MINOR: New features (backward compatible)
└── PATCH: Bug fixes (backward compatible)

Examples:
├── 1.0.0: Initial release
├── 1.1.0: Added new conversion features
├── 1.1.1: Fixed calculation bug
└── 2.0.0: Major UI redesign
```

#### Version Update Process:
```bash
# Update version in package.json
npm version patch  # or minor, major

# Update version in Capacitor config
# Update version in native projects (iOS/Android)

# Tag release
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0
```

### 8.2 Release Checklist

#### Pre-Release Checklist:
- [ ] All tests passing
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] Release notes prepared
- [ ] Staging deployment tested
- [ ] Performance metrics verified
- [ ] Security scan completed

#### Release Process:
- [ ] Merge release branch to main
- [ ] Deploy to production
- [ ] Submit to app stores
- [ ] Monitor deployment
- [ ] Verify functionality
- [ ] Update documentation
- [ ] Notify stakeholders

#### Post-Release Checklist:
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify app store approvals
- [ ] Update support documentation
- [ ] Plan next release
- [ ] Archive release artifacts

### 8.3 Rollback Procedures

#### Web Rollback:
```bash
# Rollback to previous version
git revert HEAD
npm run build
# Deploy previous build

# Or restore from backup
cp -r backup/dist-v1.0.0/* dist/
```

#### Mobile App Rollback:
```
iOS App Store:
1. Cannot rollback published versions
2. Submit new version with fixes
3. Use phased releases to limit impact

Google Play Store:
1. Can rollback to previous published version
2. Use "Release management" → "App releases"
3. Select previous version and activate
```

---

## 9. MONITORING AND MAINTENANCE

### 9.1 Application Monitoring

#### Performance Monitoring:
```typescript
// monitoring.ts
interface PerformanceMetric {
  timestamp: Date;
  metric: string;
  value: number;
  context?: any;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  
  trackConversionTime(startTime: number): void {
    const duration = performance.now() - startTime;
    this.metrics.push({
      timestamp: new Date(),
      metric: 'conversion_duration',
      value: duration
    });
  }
  
  trackMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.metrics.push({
        timestamp: new Date(),
        metric: 'memory_usage',
        value: memory.usedJSHeapSize,
        context: {
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit
        }
      });
    }
  }
}
```

#### Error Tracking:
```typescript
// error-tracking.ts
interface ErrorReport {
  timestamp: Date;
  error: string;
  stack?: string;
  userAgent: string;
  url: string;
  userId?: string;
}

class ErrorTracker {
  private errors: ErrorReport[] = [];
  
  trackError(error: Error): void {
    this.errors.push({
      timestamp: new Date(),
      error: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href
    });
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(this.errors[this.errors.length - 1]);
    }
  }
  
  private sendToMonitoringService(error: ErrorReport): void {
    // Implementation for external monitoring service
  }
}
```

### 9.2 Health Checks

#### Application Health Check:
```typescript
// health-check.ts
interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  checks: {
    localStorage: boolean;
    performance: boolean;
    functionality: boolean;
  };
}

class HealthChecker {
  async performHealthCheck(): Promise<HealthStatus> {
    const checks = {
      localStorage: this.checkLocalStorage(),
      performance: await this.checkPerformance(),
      functionality: this.checkFunctionality()
    };
    
    const healthy = Object.values(checks).every(check => check);
    
    return {
      status: healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date(),
      checks
    };
  }
  
  private checkLocalStorage(): boolean {
    try {
      localStorage.setItem('health-check', 'test');
      localStorage.removeItem('health-check');
      return true;
    } catch {
      return false;
    }
  }
  
  private async checkPerformance(): Promise<boolean> {
    const start = performance.now();
    // Perform a simple calculation
    const result = parseInt('1010', 2);
    const duration = performance.now() - start;
    return duration < 10; // Should be very fast
  }
  
  private checkFunctionality(): boolean {
    try {
      // Test core conversion functionality
      const result = parseInt('255', 10).toString(16);
      return result.toUpperCase() === 'FF';
    } catch {
      return false;
    }
  }
}
```

### 9.3 Maintenance Procedures

#### Regular Maintenance Tasks:

##### Daily:
```bash
# Check application health
curl -f https://your-app.com/health || echo "Health check failed"

# Monitor error rates
# Check performance metrics
# Review user feedback
```

##### Weekly:
```bash
# Update dependencies
npm audit
npm outdated

# Review logs
# Check storage usage
# Performance analysis
```

##### Monthly:
```bash
# Security updates
npm audit fix

# Platform updates
npx cap update

# Review and optimize performance
# Update documentation
```

#### Emergency Procedures:

##### Critical Issue Response:
```
1. Immediate Assessment (0-15 minutes):
   ├── Identify scope and impact
   ├── Determine if rollback is needed
   └── Notify stakeholders

2. Containment (15-30 minutes):
   ├── Implement temporary fix or rollback
   ├── Monitor for improvement
   └── Update status page

3. Resolution (30 minutes - 4 hours):
   ├── Develop permanent fix
   ├── Test fix thoroughly
   ├── Deploy fix to production
   └── Verify resolution

4. Post-Incident (24-48 hours):
   ├── Conduct post-mortem
   ├── Document lessons learned
   ├── Update procedures
   └── Implement preventive measures
```

---

## 10. DEPLOYMENT TROUBLESHOOTING

### 10.1 Common Issues and Solutions

#### Build Failures:

**Issue:** TypeScript compilation errors
```bash
# Solution:
npm run type-check
# Fix type errors in reported files
```

**Issue:** Dependency conflicts
```bash
# Solution:
rm -rf node_modules package-lock.json
npm install
```

**Issue:** Out of memory during build
```bash
# Solution:
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### Mobile Build Issues:

**Issue:** iOS code signing errors
```bash
# Solution:
# 1. Check certificate validity
# 2. Verify provisioning profile
# 3. Clean build folder
# 4. Rebuild project
```

**Issue:** Android Gradle build failures
```bash
# Solution:
cd android
./gradlew clean
./gradlew assembleRelease
```

#### Deployment Issues:

**Issue:** App Store rejection
```
Common Reasons:
├── Missing privacy policy
├── Insufficient app description
├── Screenshot issues
└── Binary upload problems

Solution:
├── Review rejection details
├── Fix identified issues
├── Resubmit for review
```

**Issue:** Google Play rejection
```
Common Reasons:
├── Target SDK version too low
├── Permission usage not justified
├── Content policy violations
└── Technical issues

Solution:
├── Update target SDK
├── Review permission usage
├── Fix policy violations
├── Resubmit app
```

### 10.2 Debugging Deployment Issues

#### Debug Commands:
```bash
# Check build output
npm run build -- --verbose

# Verify Capacitor sync
npx cap doctor

# Check native project configuration
npx cap open ios
npx cap open android

# Test production build locally
npm run preview
```

#### Log Analysis:
```bash
# Web deployment logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Mobile development logs
# iOS: Use Xcode console
# Android: Use adb logcat
adb logcat | grep NumberConverter
```

---

**Document Control:**
- Author: DevOps Engineer / Release Manager
- Technical Reviewer: Senior Developer
- Operations Reviewer: System Administrator
- Final Approver: Technical Lead
- Document Version: 1.0
- Last Updated: September 25, 2025
- Next Review: December 25, 2025