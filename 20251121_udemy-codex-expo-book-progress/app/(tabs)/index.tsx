import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { DimensionValue, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';

import { BookWithProgress } from '../../src/domain/types';
import { useBookStore, useBookStoreState } from '../../src/state/BookStoreProvider';

type StatusFilter = {
  label: string;
  value: 'all' | 'unread' | 'reading' | 'completed';
};

const STATUS_FILTERS: StatusFilter[] = [
  { label: 'すべて', value: 'all' },
  { label: '未読', value: 'unread' },
  { label: '読書中', value: 'reading' },
  { label: '読了済み', value: 'completed' },
];

function formatProgress(progress: number): string {
  return `${Math.round(progress * 100)}%`;
}

function BookCard({ item, onPress }: { item: BookWithProgress; onPress: () => void }) {
  const progressPercentage = formatProgress(item.progress);
  const progressWidth: DimensionValue = `${Math.min(
    Math.max(item.progress * 100, 0),
    100
  )}%`;
  const progressStyle: ViewStyle = { width: progressWidth };

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: `${item.category.color}1A` },
          ]}
        >
          <Text style={[styles.categoryBadgeLabel, { color: item.category.color }]}>
            {item.category.name}
          </Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>現在</Text>
          <Text style={styles.metricValue}>
            {item.currentPages} / {item.maxPages}ページ
          </Text>
        </View>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>進捗</Text>
          <Text style={styles.metricValue}>進捗 {progressPercentage}</Text>
        </View>
        <View style={styles.progressTrack}>
        <View style={[styles.progressFill, progressStyle]} />
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const store = useBookStore();
  const state = useBookStoreState();
  const [searchKeyword, setSearchKeyword] = useState(state.filters.searchKeyword);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setSearchKeyword(state.filters.searchKeyword);
  }, [state.filters.searchKeyword]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchKeyword !== state.filters.searchKeyword) {
        store.applyFilters({ searchKeyword });
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchKeyword, state.filters.searchKeyword, store]);

  const statusFilters = STATUS_FILTERS;
  const categories = useMemo(
    () => [{ id: -1, name: '全カテゴリ', color: '#111827' }, ...state.categories],
    [state.categories]
  );

  const handleStatusPress = (status: StatusFilter['value']) => {
    store.applyFilters({ status });
  };

  const handleCategoryPress = (categoryId: number | undefined) => {
    store.applyFilters({
      categoryId: categoryId === -1 ? undefined : categoryId,
    });
  };

  const handleAddBook = () => {
    router.push('/(modals)/book-form' as never);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await store.refresh();
    setIsRefreshing(false);
  };

  const handlePressBook = (bookId: string) => {
    router.push({ pathname: '/book/[id]', params: { id: bookId } } as never);
  };

  const renderBookItem = ({ item }: ListRenderItemInfo<BookWithProgress>) => (
    <BookCard item={item} onPress={() => handlePressBook(item.id)} />
  );

  const showEmptyState = !state.loading && state.books.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>読書の進捗</Text>
          <Text style={styles.headerSubtitle}>
            登録 {state.summary.totalBooks} 冊 ・ 読書中{' '}
            {state.summary.readingBooks} 冊 ・ 読了 {state.summary.completedBooks} 冊
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={handleAddBook}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
        >
          <Text style={styles.addButtonLabel}>書籍を追加</Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          placeholder="タイトルで検索"
          style={styles.searchInput}
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statusChipsContainer}
      >
        {statusFilters.map((filter) => {
          const selected = state.filters.status === filter.value;
          return (
            <Pressable
              key={filter.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => handleStatusPress(filter.value)}
              style={({ pressed }) => [
                styles.statusChip,
                selected && styles.statusChipActive,
                pressed && styles.statusChipPressed,
              ]}
            >
              <Text
                style={[
                  styles.statusChipLabel,
                  selected && styles.statusChipLabelActive,
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryChipsContainer}
      >
        {categories.map((category) => {
          const isAll = category.id === -1;
          const selected = isAll
            ? state.filters.categoryId === undefined
            : state.filters.categoryId === category.id;

          return (
            <Pressable
              key={category.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() =>
                handleCategoryPress(isAll ? undefined : category.id)
              }
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
      </ScrollView>

      {state.loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color="#2563EB" />
        </View>
      )}

      {showEmptyState ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>書籍がまだ登録されていません</Text>
          <Text style={styles.emptyDescription}>
            右下のボタンから新しい書籍を追加してください。
          </Text>
        </View>
      ) : (
        <FlatList
          data={state.books}
          keyExtractor={(item) => item.id}
          renderItem={renderBookItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
          }
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          ListFooterComponent={<View style={{ height: 24 }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#4B5563',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#2563EB',
  },
  addButtonPressed: {
    opacity: 0.85,
  },
  addButtonLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statusChipsContainer: {
    gap: 8,
    paddingBottom: 8,
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  statusChipActive: {
    backgroundColor: '#2563EB',
  },
  statusChipPressed: {
    opacity: 0.85,
  },
  statusChipLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusChipLabelActive: {
    color: '#FFFFFF',
  },
  categoryChipsContainer: {
    gap: 8,
    paddingBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  categoryChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  categoryChipPressed: {
    opacity: 0.85,
  },
  categoryChipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  categoryChipLabelActive: {
    color: '#4338CA',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  cardPressed: {
    transform: [{ translateY: 1 }],
    opacity: 0.95,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginRight: 12,
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
  cardBody: {
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#2563EB',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
