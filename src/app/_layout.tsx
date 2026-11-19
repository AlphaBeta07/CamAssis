import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { useAuthStore } from '../store/useAuthStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { colors } from '../theme';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  const initializeAuth = useAuthStore((s) => s.initialize);
  const initializeSettings = useSettingsStore((s) => s.initialize);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    async function prepare() {
      try {
        await initializeAuth();
        await initializeSettings(user?.id);
      } finally {
        if (fontsLoaded) {
          await SplashScreen.hideAsync().catch(() => {});
        }
      }
    }
    if (fontsLoaded) {
      prepare();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.cream }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <StatusBar style="dark" hidden={false} />
            <Stack
              screenOptions={{
                headerShown: false,
                statusBarHidden: false,
                statusBarStyle: 'dark',
                statusBarBackgroundColor: colors.cream,
                statusBarTranslucent: false,
                contentStyle: { backgroundColor: colors.cream },
                animation: 'slide_from_right',
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="auth/login" options={{ headerShown: false }} />
              <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
              <Stack.Screen name="auth/forgot-password" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="search" options={{ headerShown: false }} />
              <Stack.Screen name="category/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="collection/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="pose/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="pose/prepare" options={{ headerShown: false }} />
              <Stack.Screen name="my-pose/index" options={{ headerShown: false }} />
              <Stack.Screen name="my-pose/preview" options={{ headerShown: false }} />
              <Stack.Screen
                name="camera/index"
                options={{
                  headerShown: false,
                  animation: 'fade',
                  presentation: 'card',
                  statusBarHidden: false,
                  statusBarStyle: 'dark',
                  statusBarBackgroundColor: colors.cream,
                }}
              />
              <Stack.Screen
                name="camera/feedback"
                options={{
                  presentation: 'modal',
                  headerShown: false,
                  statusBarHidden: false,
                  statusBarStyle: 'dark',
                  statusBarBackgroundColor: colors.cream,
                }}
              />
              <Stack.Screen name="settings/index" options={{ headerShown: false }} />
              <Stack.Screen name="settings/privacy" options={{ headerShown: false }} />
              <Stack.Screen name="settings/help" options={{ headerShown: false }} />
            </Stack>
          </QueryClientProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
