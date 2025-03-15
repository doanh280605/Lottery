import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Key for storing user ID in AsyncStorage
const USER_ID_KEY = 'app_user_id';
const API_URL = 'http://192.168.1.52:3000/api/createUser';

// Get the user ID from AsyncStorage, or generate a new one if it doesn't exist
export const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem(USER_ID_KEY);
    
    if (userId) {
      return userId;
    } else {
      // Generate a new UUID
      const newUserId = uuidv4();
      // Save it to AsyncStorage
      await AsyncStorage.setItem(USER_ID_KEY, newUserId);
      return newUserId;
    }
  } catch (error) {
    console.error('Error accessing user ID:', error);
    return null;
  }
};

// Save user ID to database
export const saveUserToDatabase = async (userId) => {
  try {
    const response = await axios.post(API_URL, { id: userId });
    return response.data;
  } catch (error) {
    console.error('Error saving user to database:', error);
    return null;
  }
};
