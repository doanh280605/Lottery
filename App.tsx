import React, { useEffect, useState } from "react";
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import Navigation from "./src/screens/navigation/navigation";
import SplashScreen from "./src/screens/SplashScreen";
import { getUserId, saveUserToDatabase } from "./src/utils/userId";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Get or generate user ID
        const id = await getUserId();
        setUserId(id);
        
        // Save user to database
        if (id) {
          await saveUserToDatabase(id);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeUser();
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['bottom', 'left', 'right']}>
      <Navigation userId={userId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC',
  }
});