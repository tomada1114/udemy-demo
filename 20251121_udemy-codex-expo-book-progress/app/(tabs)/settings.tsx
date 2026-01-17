import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useBookStore, useBookStoreState } from '../../src/state/BookStoreProvider';

const VALIDATION_ERROR_MESSAGE = '日次目標は1以上の整数で入力してください';

export default function SettingsScreen() {
  const store = useBookStore();
  const { dailyGoal, error } = useBookStoreState((state) => ({
    dailyGoal: state.dailyGoal,
    error: state.error,
  }));

  const [input, setInput] = useState(() =>
    dailyGoal.targetPages ? String(dailyGoal.targetPages) : ''
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canClear = useMemo(() => dailyGoal.targetPages !== null, [dailyGoal.targetPages]);

  useEffect(() => {
    setInput(dailyGoal.targetPages ? String(dailyGoal.targetPages) : '');
  }, [dailyGoal.targetPages]);

  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);

  const resetFeedback = () => {
    if (formError) {
      setFormError(null);
    }
    if (statusMessage) {
      setStatusMessage(null);
    }
  };

  const handleInputChange = (text: string) => {
    const sanitized = text.replace(/[^0-9]/g, '');
    setInput(sanitized);
    resetFeedback();
    store.clearError();
  };

  const parseInputValue = () => {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      return null;
    }
    const value = Number(trimmed);
    if (!Number.isInteger(value) || value <= 0) {
      return undefined;
    }
    return value;
  };

  const handleSave = async () => {
    const parsed = parseInputValue();
    if (parsed === null || parsed === undefined) {
      setFormError(VALIDATION_ERROR_MESSAGE);
      return;
    }

    setSaving(true);
    resetFeedback();

    const success = await store.setDailyGoal(parsed);
    setSaving(false);

    if (success) {
      setStatusMessage('日次目標を更新しました');
    }
  };

  const handleClear = async () => {
    if (!canClear) {
      return;
    }
    setSaving(true);
    resetFeedback();

    const success = await store.setDailyGoal(null);
    setSaving(false);

    if (success) {
      setInput('');
      setStatusMessage('日次目標をリセットしました');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>設定</Text>
      <Text style={styles.subtitle}>
        読書体験を自分らしくカスタマイズしましょう。ここでは日次の読書目標ページ数を設定できます。
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>1日の目標ページ数</Text>
        <Text style={styles.cardDescription}>
          目標を設定すると、統計タブで達成状況を確認できます。実現可能な数値からスタートしましょう。
        </Text>

        <TextInput
          value={input}
          onChangeText={handleInputChange}
          inputMode="numeric"
          keyboardType="number-pad"
          placeholder="例: 60"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          accessibilityLabel="1日に読みたいページ数"
          maxLength={4}
          returnKeyType="done"
        />

        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
        {statusMessage ? (
          <Text style={styles.successText}>{statusMessage}</Text>
        ) : null}

        <View style={styles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            onPress={handleSave}
            disabled={saving}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && !saving ? styles.primaryButtonPressed : null,
              saving ? styles.buttonDisabled : null,
            ]}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>保存</Text>
            )}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={handleClear}
            disabled={saving || !canClear}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && !saving && canClear ? styles.secondaryButtonPressed : null,
              (saving || !canClear) ? styles.buttonDisabledSecondary : null,
            ]}
          >
            <Text style={styles.secondaryButtonText}>リセット</Text>
          </Pressable>
        </View>

        {dailyGoal.targetPages !== null ? (
          <Text style={styles.currentTarget}>
            現在の目標: {dailyGoal.targetPages} ページ
          </Text>
        ) : (
          <Text style={styles.currentTargetHint}>
            目標を設定すると、今日の読書量との比較がわかりやすくなります。
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  cardDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
  },
  successText: {
    color: '#047857',
    fontSize: 13,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#E0E7FF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonPressed: {
    opacity: 0.85,
  },
  secondaryButtonText: {
    color: '#1D4ED8',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonDisabledSecondary: {
    backgroundColor: '#E5E7EB',
    opacity: 0.7,
  },
  currentTarget: {
    fontSize: 13,
    color: '#1F2937',
  },
  currentTargetHint: {
    fontSize: 13,
    color: '#6B7280',
  },
});
