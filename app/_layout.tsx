import { Colors } from '@/constants/Colors';
import en from '@/constants/en';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

const queryClient = new QueryClient();

export default function Layout() {
  const scheme = useColorScheme();
  const color = scheme === 'dark' ? Colors.dark : Colors.light;
  return (
    <QueryClientProvider client={queryClient}>
      <ActionSheetProvider>
        <Stack
          screenOptions={
            {
              headerStyle: {
                backgroundColor: color.surface,
              },
              headerTintColor: 'white',
              title: en.APP_TITLE
            }} />
      </ActionSheetProvider>
    </QueryClientProvider>
  );
}
