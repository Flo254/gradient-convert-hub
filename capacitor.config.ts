import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cf2d0a4cb588438d94e960b4c6834285',
  appName: 'Number System Converter',
  webDir: 'dist',
  server: {
    url: 'https://cf2d0a4c-b588-438d-94e9-60b4c6834285.lovableproject.com?forceHideBadge=true',
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