import useColors from '@/hooks/useColor';
import { View, ActivityIndicator } from 'react-native';

export function Spinner() {
  const color = useColors();
  return (
    <ActivityIndicator
      size="large"
      color={color.surface} />
  );
}
