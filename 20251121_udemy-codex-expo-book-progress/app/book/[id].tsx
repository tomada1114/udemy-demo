import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useBookStore, useBookStoreState } from '../../src/state/BookStoreProvider';

function formatDate(value: string) {
  try {
    const date = new Date(value);
    return date.toLocaleString();
  } catch {
    return value;
  }
}

function formatProgress(progress: number) {
  return `${Math.round(progress * 100)}%`;
}

export default function BookDetailScreen() {
  const router = useRouter();
  const store = useBookStore();
  const state = useBookStoreState();
  const params = useLocalSearchParams<{ id: string }>();
  const bookId = params?.id ? String(params.id) : '';
  const book = useMemo(
    () => state.books.find((candidate) => candidate.id === bookId),
    [state.books, bookId]
  );

  const [currentPages, setCurrentPages] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setCurrentPages(String(book.currentPages));
    }
  }, [book]);

  const handleUpdateProgress = async () => {
    if (!book) {
      return;
    }
    const parsed = Number(currentPages);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > book.maxPages) {
      setError(`0 以上 ${book.maxPages} 以下の整数で入力してください`);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const success = await store.updateProgress(book.id, parsed);
      if (!success) {
        setError('進捗の更新に失敗しました');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async () => {
    if (!book) {
      return;
    }
    Alert.alert('書籍を削除', '本当に削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          const success = await store.deleteBook(book.id);
          if (success) {
            router.back();
          } else {
            setError('削除に失敗しました');
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    if (!book) {
      return;
    }
    router.push({
      pathname: '/(modals)/book-form',
      params: { id: book.id },
    } as never);
  };

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>書籍が見つかりません</Text>
        <Text style={styles.description}>
          指定された書籍は存在しません。前の画面に戻ってやり直してください。
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backButtonLabel}>戻る</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>{book.title}</Text>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: `${book.category.color}1A` },
          ]}
        >
          <Text style={[styles.categoryBadgeLabel, { color: book.category.color }]}>
            {book.category.name}
          </Text>
        </View>
      </View>
      <Text style={styles.metadata}>カテゴリ: {book.category.name}</Text>
      <Text style={styles.metadata}>
        進捗 {formatProgress(book.progress)} ・ 残り {book.remainingPages} ページ
      </Text>
      <Text style={styles.metadata}>登録日: {formatDate(book.createdAt)}</Text>
      <Text style={styles.metadata}>最終更新: {formatDate(book.updatedAt)}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>進捗を更新</Text>
        <Text style={styles.sectionDescription}>
          現在ページ数を入力して進捗を反映します。0 以上 {book.maxPages} 以下の整数を入力してください。
        </Text>
        <TextInput
          accessibilityLabel="現在ページ数"
          placeholder="現在ページ数を入力"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          value={currentPages}
          onChangeText={(text) => setCurrentPages(text.replace(/[^0-9]/g, ''))}
          style={styles.input}
        />
        <Pressable
          accessibilityRole="button"
          onPress={handleUpdateProgress}
          disabled={submitting}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
            submitting && styles.primaryButtonDisabled,
          ]}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonLabel}>進捗を更新</Text>
          )}
        </Pressable>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={handleEdit}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.secondaryButtonPressed,
          ]}
        >
          <Text style={styles.secondaryButtonLabel}>編集</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={handleDeleteBook}
          style={({ pressed }) => [
            styles.dangerButton,
            pressed && styles.dangerButtonPressed,
          ]}
        >
          <Text style={styles.dangerButtonLabel}>削除</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  categoryBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryBadgeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  metadata: {
    fontSize: 14,
    color: '#4B5563',
  },
  section: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 12,
    backgroundColor: '#F9FAFB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#2563EB',
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
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
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonPressed: {
    opacity: 0.85,
  },
  secondaryButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  dangerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#DC2626',
  },
  dangerButtonPressed: {
    opacity: 0.85,
  },
  dangerButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  backButtonPressed: {
    opacity: 0.85,
  },
  backButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 12,
  },
});
