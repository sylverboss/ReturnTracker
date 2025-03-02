import { View, Text, StyleSheet } from 'react-native';

export default function AddScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>This screen is a placeholder for the Add tab.</Text>
      <Text style={styles.subText}>The actual add functionality is implemented as a modal.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});