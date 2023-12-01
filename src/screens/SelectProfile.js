import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { Card, Button as PaperButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import bgImg from '../assets/chat-bg.png';

const SelectProfileScreen = () => {
  const navigation = useNavigation();

  const handleChatAsClub = () => {
    // Implement your logic for "Chat as a Club" here
    // This can include navigating to the club chat screen
  };

  const handleChatAsUser = () => {
    // Implement your logic for "Chat as a User" here
    // This can include navigating to the user chat screen
    navigation.navigate('ChatUserLists');
  };

  const imgProps = Image.resolveAssetSource(bgImg).uri;
  const image = { uri: imgProps };

  return (
    <View style={[styles.top_main]} contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground style={styles.img_top} source={image} resizeMode="cover">
        <View style={styles.container}>
          <View style={styles.card}>
            {/*<Image source={require('../assets/logo.png')} style={styles.logo} />*/}
            <Text style={styles.title}>Select Profile</Text>
            <TouchableOpacity onPress={handleChatAsClub} style={styles.button}>
              <Text style={styles.buttonText}>Chat as a Club</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleChatAsUser} style={styles.button1}>
              <Text style={styles.buttonText1}>Chat as a User</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img_top: {
    height: '100%',
  },
  logo: {
    marginBottom: 20,
    maxWidth: 200,
    width: '100%',
    height: 80,
  },
  card: {
    width: '80%',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  button: {
    width: '100%',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#00c0ff',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#00c0ff',
    textTransform: 'uppercase',
    
  },
  buttonText: {
    fontSize: 18,
    color:'#fff',
    fontWeight: '700',
    textAlign:'center',
  },
  button1:{
    backgroundColor:'#fff',
    borderWidth:2,
    borderColor:'#d1d8dc',
    width: '100%',
    marginTop: 10,
    padding: 8,
    borderRadius: 6,
    textTransform: 'uppercase',
  },
  buttonText1: {
    fontSize: 18,
    color:"#000",
    fontWeight: '700',
    textAlign:'center',
  },
});

export default SelectProfileScreen;
