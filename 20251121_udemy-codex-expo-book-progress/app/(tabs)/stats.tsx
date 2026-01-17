import { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useBookStore, useBookStoreState } from '../../src/state/BookStoreProvider';

const SUMMARY_CARDS: {
  key: 'totalBooks' | 'readingBooks' | 'completedBooks' | 'totalCompletedPages';
  title: string;
  unit: string;
}[] = [
  { key: 'totalBooks', title: '登録冊数', unit: '冊' },
  { key: 'readingBooks', title: '読書中冊数', unit: '冊' },
  { key: 'completedBooks', title: '読了冊数', unit: '冊' },
  { key: 'totalCompletedPages', title: '読了ページ数', unit: 'ページ' },
];

export default function StatsScreen() {
  const store = useBookStore();
  const state = useBookStoreState();
  const [refreshing, setRefreshing] = useState(false);

  const targetPages = state.dailyGoal.targetPages;
  const pagesReadToday = state.dailyGoal.pagesReadToday;
  const progressRatio = targetPages
    ? Math.min(pagesReadToday / targetPages, 1)
    : 0;
  const progressPercent = targetPages ? Math.round(progressRatio * 100) : 0;
  const remainingPages = targetPages
    ? Math.max(targetPages - pagesReadToday, 0)
    : 0;

  const handleRefresh = async () => {
    setRefreshing(true);
    await store.refresh();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text style={styles.title}>統計</Text>
      <Text style={styles.subtitle}>
        読書状況のサマリーを確認し、カテゴリ別の進捗を把握しましょう。
      </Text>

      <View style={styles.dailyGoalCard}>
        <Text style={styles.sectionTitle}>日次目標</Text>
        {targetPages ? (
          <>
            <View style={styles.dailyGoalRow}>
              <View style={styles.dailyGoalItem}>
                <Text style={styles.dailyGoalLabel}>目標</Text>
                <Text style={styles.dailyGoalValue}>{targetPages} ページ</Text>
              </View>
              <View style={styles.dailyGoalItem}>
                <Text style={styles.dailyGoalLabel}>今日</Text>
                <Text style={styles.dailyGoalValue}>{pagesReadToday} ページ</Text>
              </View>
              <View style={styles.dailyGoalItem}>
                <Text style={styles.dailyGoalLabel}>達成率</Text>
                <Text style={styles.dailyGoalValue}>{progressPercent}%</Text>
              </View>
            </View>
            <Text style={styles.dailyGoalHint}>
              {remainingPages === 0
                ? '目標を達成しました！'
                : `達成まで残り ${remainingPages} ページです。`}
            </Text>
          </>
        ) : (
          <Text style={styles.dailyGoalEmpty}>
            日次目標がまだ設定されていません。設定タブから目標を登録しましょう。
          </Text>
        )}
      </View>

      {state.loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#2563EB" />
        </View>
      )}

      {state.error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      )}

      <View style={styles.summaryGrid}>
        {SUMMARY_CARDS.map((card) => (
          <View key={card.key} style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{card.title}</Text>
            <Text style={styles.summaryValue}>
              {state.summary[card.key]} {card.unit}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>カテゴリ別統計</Text>
        {state.categoryStats.length === 0 ? (
          <Text style={styles.emptyMessage}>
            まだカテゴリ別の統計データがありません。書籍を登録して進捗を記録しましょう。
          </Text>
        ) : (
          <View style={styles.categoryTable}>
            <View style={styles.categoryHeaderRow}>
              <Text style={[styles.categoryHeaderCell, styles.cellName]}>
                カテゴリ
              </Text>
              <Text style={styles.categoryHeaderCell}>登録</Text>
              <Text style={styles.categoryHeaderCell}>読了</Text>
            </View>
            {state.categoryStats.map((stat) => (
              <View style={styles.categoryRow} key={stat.categoryId}>
                <Text style={[styles.categoryCell, styles.cellName]}>
                  {stat.categoryName}
                </Text>
                <Text style={styles.categoryCell}>{stat.bookCount} 冊</Text>
                <Text style={styles.categoryCell}>{stat.completedBooks} 冊</Text>
              </View>
            ))}
          </View>
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
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flexBasis: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 12,
  },
  dailyGoalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  categoryTable: {
    gap: 8,
  },
  categoryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryHeaderCell: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    flex: 1,
    textAlign: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  categoryCell: {
    fontSize: 14,
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  cellName: {
    textAlign: 'left',
  },
  dailyGoalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dailyGoalItem: {
    flex: 1,
    gap: 4,
  },
  dailyGoalLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  dailyGoalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  dailyGoalHint: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
  dailyGoalEmpty: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});
