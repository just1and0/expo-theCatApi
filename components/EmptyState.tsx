import en from '@/constants/en';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export function EmptyState({ onUpload }: { onUpload: () => void }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{en.EMPTY_STATE.TITLE}</Text>
      <Text style={styles.message}>{en.EMPTY_STATE.SUBTITLE}</Text>
      <Pressable onPress={onUpload} style={styles.button}>
        <Text style={styles.buttonText}>{en.EMPTY_STATE.BUTTON}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  }, 
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ff7f50',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
