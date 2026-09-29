import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import BackgroundGrid from './src/components/map/BackgroundGrid';
import FloorPlan from './src/components/map/FloorPlan';
import { FLOORS } from './src/data/floors/floor';
import { theme } from './src/theme';

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const floor = FLOORS[0];

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <View style={styles.mapArea}>
          <BackgroundGrid>
            <FloorPlan
              floor={floor}
              selectedId={selectedId}
              onRoomPress={setSelectedId}
            />
          </BackgroundGrid>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.gridBackground },
  mapArea: { flex: 1 },
});