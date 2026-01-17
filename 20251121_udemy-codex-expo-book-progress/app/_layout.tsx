import { Stack } from 'expo-router';
import { BookStoreProvider } from '../src/state/BookStoreProvider';

export default function RootLayout() {
  return (
    <BookStoreProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/book-form"
          options={{
            presentation: 'modal',
            title: '書籍を追加',
          }}
        />
        <Stack.Screen
          name="book/[id]"
          options={{
            title: '書籍詳細',
          }}
        />
      </Stack>
    </BookStoreProvider>
  );
}
