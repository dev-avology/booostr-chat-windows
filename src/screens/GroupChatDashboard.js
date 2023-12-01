import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  BackHandler,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import bgImg from '../assets/chat-bg.png';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import useNavigation hook

const GroupChatDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const flatlistRef = useRef(null);
  const navigation = useNavigation(); // Initialize navigation
  const route = useRoute(); // Initialize route

  useEffect(() => {
    // Simulate initial messages
    const initialMessages = [
      // Initial chat messages...
    ];

    setMessages(initialMessages);

    // Add a back button listener
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  // Check if the group parameter is defined in the route
  const group = route.params?.group || { groupName: 'Group Name', groupStatus: 'Group Status', groupImage: require('../assets/user1.png') };

  const sendMessage = () => {
    if (messageText.trim() === '') {
      return;
    }

    const newMessage = {
      id: String(messages.length + 1),
      text: messageText,
      sender: 'user1', // Replace with the sender's ID or name
    };

    setMessages([...messages, newMessage]);
    setMessageText('');

    // Scroll to the bottom when a new message is sent
    flatlistRef.current.scrollToEnd();
  };

  // Function to navigate to the group profile page
  const goToGroupProfile = () => {
    navigation.navigate('GroupProfile', { group }); // Replace 'GroupProfile' with your actual group profile screen name
  };

  return (
    <ImageBackground style={styles.img_top} source={bgImg} resizeMode="cover">
      <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#000" style={styles.backIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToGroupProfile}>
            <View style={styles.groupInfo}>
              <Image source={group.groupImage} style={styles.groupImage} />
              <View>
                <Text style={styles.groupName}>{group.groupName}</Text>
                <Text style={styles.groupStatus}>{group.groupStatus}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.messageContainer}>
          <FlatList
            ref={flatlistRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.message,
                  {
                    alignSelf: item.sender === 'user1' ? 'flex-end' : 'flex-start',
                    backgroundColor: item.sender === 'user1' ? '#00c0ff' : '#efefef',
                  },
                ]}
              >
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="ios-happy" size={24} color="#555" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialIcons name="attach-file" size={24} color="#555" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img_top: {
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS == 'ios' ? 40 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    backgroundColor: '#fff',
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#efefef',
    borderWidth: 1,
    marginHorizontal: 10,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupStatus: {
    fontSize: 14,
    color: '#777',
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 10,
    maxWidth: '70%',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderColor: '#efefef',
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 16,
    marginRight: 10,
    paddingVertical: 16,
  },
  sendButton: {
    backgroundColor: '#00c0ff',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButton: {
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GroupChatDashboard;
