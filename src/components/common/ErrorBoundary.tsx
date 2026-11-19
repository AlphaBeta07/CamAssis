import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AlertTriangle, RotateCcw } from 'lucide-react-native';
import { colors, fonts, shadows } from '../../theme';
import { logError } from '../../services/error/errorHandler';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected rendering error occurred.',
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError('BACKEND', error, `UI Crash Caught by ErrorBoundary: ${errorInfo.componentStack}`);
  }

  private handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView edges={['top']} style={styles.container}>
          <StatusBar style="dark" hidden={false} />
          <View style={styles.card}>
            <View style={styles.iconWrap}>
              <AlertTriangle size={32} color={colors.inkPrimary} strokeWidth={2.5} />
            </View>
            <Text style={styles.title}>SOMETHING WENT WRONG</Text>
            <Text style={styles.subtitle}>
              CamAssis encountered a temporary interface issue. Your local photographs and poses remain safe.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.retryBtn,
                pressed && styles.pressed,
              ]}
              onPress={this.handleReset}
              accessibilityRole="button"
              accessibilityLabel="Recover and restart view"
            >
              <RotateCcw size={16} color={colors.inkPrimary} strokeWidth={2.5} />
              <Text style={styles.btnText}>RETRY VIEW</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    padding: 24,
    alignItems: 'center',
    maxWidth: 380,
    width: '100%',
    ...shadows.hard,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 2,
    backgroundColor: colors.pixelYellow,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...shadows.hardXs,
  },
  title: {
    fontSize: 14,
    fontFamily: fonts.pixel,
    color: colors.inkPrimary,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: fonts.mono,
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.pixelYellow,
    borderWidth: 2,
    borderColor: colors.borderPrimary,
    borderRadius: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    ...shadows.hardXs,
  },
  pressed: {
    transform: [{ translate: [2, 2] }],
  },
  btnText: {
    fontSize: 11,
    fontFamily: fonts.monoBold,
    color: colors.inkPrimary,
    letterSpacing: 0.5,
  },
});
