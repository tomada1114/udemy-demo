import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useBookStore, useBookStoreState } from '../../src/state/BookStoreProvider';

type FormState = {
  title: string;
  maxPages: string;
  categoryId?: number;
};

const INITIAL_FORM: FormState = {
  title: '',
  maxPages: '',
  categoryId: undefined,
};

export default function BookFormModal() {
  const router = useRouter();
  const store = useBookStore();
  const state = useBookStoreState();
  const params = useLocalSearchParams<{ id?: string }>();
  const editingId = params?.id ? String(params.id) : undefined;
  const editingBook = useMemo(
    () => state.books.find((book) => book.id === editingId),
    [editingId, state.books]
  );

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingBook) {
      setForm({
        title: editingBook.title,
        maxPages: String(editingBook.maxPages),
        categoryId: editingBook.categoryId,
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [editingBook]);

  const handleChange = (key: keyof FormState, value: string | number | undefined) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const validate = (): { title: string; maxPages: number; categoryId: number } | null => {
    const trimmedTitle = form.title.trim();
    if (trimmedTitle.length === 0) {
      setError('タイトルを入力してください');
      return null;
    }
    if (trimmedTitle.length > 100) {
      setError('タイトルは100文字以内で入力してください');
      return null;
    }
    const parsedMaxPages = Number(form.maxPages);
    if (!Number.isInteger(parsedMaxPages) || parsedMaxPages <= 0) {
      setError('最大ページ数は1以上の整数で入力してください');
      return null;
    }
    if (!form.categoryId) {
      setError('カテゴリを選択してください');
      return null;
    }
    setError(null);
    return {
      title: trimmedTitle,
      maxPages: parsedMaxPages,
      categoryId: form.categoryId,
    };
  };

  const handleSubmit = async () => {
    const payload = validate();
    if (!payload) {
      return;
    }
    setSubmitting(true);
    try {
      const success = editingId
        ? await store.updateBook(editingId, payload)
        : await store.addBook(payload);
      if (success) {
        router.back();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (editingId && !editingBook) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>書籍が見つかりません</Text>
        <Text style={styles.description}>
          指定された書籍は存在しません。リストから再度操作してください。
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={handleCancel}
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && styles.cancelButtonPressed,
          ]}
        >
          <Text style={styles.cancelButtonLabel}>閉じる</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{editingId ? '書籍を編集' : '書籍を追加'}</Text>
        <Text style={styles.description}>
          タイトル・ページ数・カテゴリを入力して保存してください。全ての項目が必須です。
        </Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>タイトル</Text>
          <TextInput
            accessibilityLabel="タイトル"
            placeholder="タイトルを入力"
            placeholderTextColor="#9CA3AF"
            value={form.title}
            onChangeText={(text) => handleChange('title', text)}
            style={styles.textInput}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>最大ページ数</Text>
          <TextInput
            accessibilityLabel="最大ページ数"
            placeholder="最大ページ数"
            placeholderTextColor="#9CA3AF"
            keyboardType="number-pad"
            value={form.maxPages}
            onChangeText={(text) => handleChange('maxPages', text.replace(/[^0-9]/g, ''))}
            style={styles.textInput}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>カテゴリ</Text>
          <View style={styles.categoryChips}>
            {state.categories.map((category) => {
              const selected = form.categoryId === category.id;
              return (
                <Pressable
                  key={category.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => handleChange('categoryId', category.id)}
                  style={({ pressed }) => [
                    styles.categoryChip,
                    selected && styles.categoryChipActive,
                    pressed && styles.categoryChipPressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipLabel,
                      selected && styles.categoryChipLabelActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <Pressable
            accessibilityRole="button"
            onPress={handleCancel}
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && styles.cancelButtonPressed,
            ]}
          >
            <Text style={styles.cancelButtonLabel}>キャンセル</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={handleSubmit}
            disabled={submitting}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.saveButtonPressed,
              submitting && styles.saveButtonDisabled,
            ]}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonLabel}>保存</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  fieldGroup: {
    gap: 12,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  textInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  categoryChipActive: {
    borderColor: '#2563EB',
    backgroundColor: '#DBEAFE',
  },
  categoryChipPressed: {
    opacity: 0.85,
  },
  categoryChipLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryChipLabelActive: {
    color: '#1D4ED8',
  },
  errorBox: {
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    padding: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelButtonPressed: {
    opacity: 0.85,
  },
  cancelButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#2563EB',
  },
  saveButtonPressed: {
    opacity: 0.85,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
