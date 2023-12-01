import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkUserData = async () => {
  const value = await AsyncStorage.getItem('user');
  if (value !== null) {
    return JSON.parse(value);
  }
  return null; // Return null if user data is not found
};
