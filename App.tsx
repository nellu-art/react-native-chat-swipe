import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import AppChat from './src/AppChat/AppChat';

export default function App() {
  return (
    <View style={styles.container}>
      <AppChat />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
