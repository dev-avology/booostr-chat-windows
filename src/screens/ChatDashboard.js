import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
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
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import bgImg from "../assets/chat-bg.png";
import userPlaceholder from "../assets/user1.png";
import groupPlaceholder from "../assets/group_icons.png";
import { useDispatch, useSelector } from "react-redux";
import { memoizedSelectUserData, memoizeduserMessages } from "../selectors";
import {
  fetchUserMessages,
  autofetchUserMessages,
  sendMessage,
  addMessage,
  sendFileMessage
} from "../reducers/chatMessagesSlice";
//import * as ImagePicker from "expo-image-picker";
import profileManager from "../assets/pm.png";
import Lightbox from "react-native-lightbox-v2";
//import { Video, ResizeMode } from "expo-av";

const WINDOW_WIDTH = Dimensions.get("window").width;
const BASE_PADDING = 10;

const YOUR_REFRESH_INTERVAL = 5000;

const ChatDashboard = ({ route, navigation }) => {
  const [messageText, setMessageText] = useState("");
  const flatlistRef = useRef(null);
  const dispatch = useDispatch();
  const userData = useSelector(memoizedSelectUserData);
  const messages = useSelector(memoizeduserMessages);
  const loading = useSelector((state) => state.userMessages.loading);

  const [isLoading, setIsLoading] = useState(false);

  const conversation = route.params.conversation;
  const AsUser = route.params.AsUser;
  const toggleState = route.params.toggleState;
  const club = route.params.club;
  const user = conversation?.participants.find(
    (participant) => participant.user_id != AsUser
  );
  const recipient_ids = conversation?.participants.map((item) => item.user_id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (AsUser) {
          dispatch(fetchUserMessages(conversation?.id, AsUser));
        }
      } catch (error) {
        //console.error("Error fetching data:", error);
      } finally {
      }
    };
    const autofetchData = async () => {
      try {
        if (AsUser) {
          dispatch(autofetchUserMessages(conversation?.id, AsUser));
        }
      } catch (error) {
        //console.error("Error fetching data:", error);
      } finally {
      }
    };

    fetchData();

    const refreshInterval = setInterval(() => {
      autofetchData();
    }, YOUR_REFRESH_INTERVAL);

    return () => {
      clearInterval(refreshInterval);
    };
  }, [dispatch, navigation, AsUser, conversation]);
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  
  const sendMessage1 = () => {
    if (messageText.trim() === "") {
      return;
    }

    setIsLoading(true);
    const newMessage = {
      content: messageText,
      sender_id: AsUser,
      conversation_id: conversation?.id,
      message_type: "text",
      recipient_ids: recipient_ids,
      media_url: "",
      mentioned_user_ids: [],
    };

    dispatch(sendMessage(newMessage))
      .then((data) => {
        dispatch(addMessage(data.data.data));
        setMessageText("");
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        setIsLoading(false);
      });

    flatlistRef.current.scrollToEnd();
  };

  const goToUserProfile = () => {
    navigation.navigate("UserProfile", {
      conversation,
      user,
      AsUser,
      toggleState,
      club,
    });
  };

  function determineMessageType(type) {
    if (type) {
      if (type.startsWith('image')) {
        return 'image';
      } else if (type.startsWith('video')) {
        return 'video';
      }
    }
    return 'file';
  }

  const pickImage = async () => {

    let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission to access media library is required to pick an image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      CameraType: "Back",
      quality: 0.5,
    });
    
    if (!result?.canceled) {
      setIsLoading(true);
      const newMessage = {
        content: messageText,
        sender_id: AsUser,
        conversation_id: conversation?.id,
        message_type: determineMessageType(result?.assets[0]?.type),
        media_url: "",
        mentioned_user_ids: [],
      };

    dispatch(sendFileMessage(newMessage, result, recipient_ids))
      .then((data) => {
        dispatch(addMessage(data?.data?.data));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        setIsLoading(false);
      });

    flatlistRef.current.scrollToEnd();

    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "#0F0";
      case "offline":
        return "#777";
      case "away":
        return "gray";
      default:
        return "#777";
    }
  };

  const renderStatusIndicator = (status) => (
    <View
      style={[
        styles.statusIndicator,
        { backgroundColor: getStatusColor(status) },
      ]}
    />
  );

  return (
    <ImageBackground style={styles.img_top} source={bgImg} resizeMode="cover">
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -466}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-back"
              size={24}
              color="#000"
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={goToUserProfile}
          >
            <View style={styles.statusContainer}>
              {user?.user_photo ? (
                <Image
                  source={{ uri: user?.user_photo }}
                  style={styles.userImage}
                />
              ) : (
                
                <Image source={conversation?.conversation_type == "group"?groupPlaceholder:userPlaceholder} style={styles.userImage} />
              )}
              {renderStatusIndicator(user?.status)}
            </View>
            <View style={styles.userInfo}>
               <View>
                  <Text style={styles.userName}>
                    {conversation?.conversation_type == "group"
                      ? conversation?.conversation_name
                      : user?.first_name + " " + user?.last_name}{" "}
                    {user?.profile_manager ? (
                      <Image source={profileManager} style={styles.pmImg} />
                    ) : null}
                  </Text>
                  <Text style={styles.chatType}>{conversation?.conversation_type == "group"? "(Group Chat)": "(Direct Chat)"}</Text>
              </View>
              {user?.status ? (
                <Text style={styles.userStatus}>{user?.status}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.messageContainer}>
          {loading ? (
            <View style={styles.containerLoader}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          ) : (
            <FlatList
              ref={flatlistRef}
              data={messages}
              keyExtractor={(item) => item.id}
              onContentSizeChange={() => {
                flatlistRef.current.scrollToEnd({ animated: true });
              }}
              onLayout={() => {
                flatlistRef.current.scrollToEnd({ animated: true });
              }}
              renderItem={({ item }) => (
                <View
                  style={{
                    alignSelf:
                      item.sender_id == AsUser ? "flex-end" : "flex-start",
                    marginBottom: 5,
                  }}
                >
                  <View
                    style={[
                      styles.message,
                      {
                        alignSelf:
                          item.sender_id == AsUser ? "flex-end" : "flex-start",
                        backgroundColor:
                          item.sender_id == AsUser ? "#00c0ff" : "#fff",
                      },
                    ]}
                  >
                    {item.message_type === "text" && (
                      <Text
                        style={[
                          styles.messageText,
                          {
                            color: item.sender_id === AsUser ? "#fff" : "#333",
                          },
                        ]}
                      >
                        {item.content}
                      </Text>
                    )}

                    {item.message_type === "image" && (
                      <Lightbox
                        underlayColor="white"
                        renderContent={() => (
                          <Image
                            source={{ uri: item.media_url }}
                            style={styles.lightboximageStyle}
                          />
                        )}
                      >
                        <Image
                          source={{ uri: item.media_url }}
                          style={styles.imageStyle}
                        />
                      </Lightbox>
                    )}

                    {item.message_type === "video" && (
                      <Lightbox
                        underlayColor="white"
                        renderContent={() => (
                          <Video
                            source={{ uri: item.media_url }}
                            style={styles.lightboximageStyle}
                            resizeMode="contain"
                            useNativeControls
                            autoplay={true}
                          />
                        )}
                      >
                        <Video
                          useNativeControls={false}
                          style={styles.videoPlayer}
                          source={{ uri: item.media_url }}
                          resizeMode="contain"
                        />
                      </Lightbox>
                    )}
                  </View>
                  {item.sender_id != AsUser ? (
                    <>
                      {item?.user_photo ? (
                        <Image
                          source={{ uri: item?.user_photo }}
                          style={styles.userProfileImage}
                        />
                      ) : (
                        <Image
                          source={userPlaceholder}
                          style={styles.userImage}
                        />
                      )}
                    </>
                  ) : null}
                </View>
              )}
            />
          )}
        </View>
        <View style={styles.inputContainer}>
          {/*<TouchableOpacity style={styles.iconButton}>
            <Icon name="ios-happy" size={24} color="#555" />
          </TouchableOpacity>*/}
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <MaterialIcons name="attach-file" size={24} color="#555" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            editable={!isLoading}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage1}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
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
    height: "100%",
  },
  containerLoader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: Platform.OS == "ios" ? 55 : 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    backgroundColor: "#f7f7f7",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  backButton: {
    marginLeft: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight:10
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderColor: "#efefef",
    borderWidth: 1,
    marginHorizontal: 0,
  },
  userProfileImage: {
    width: 20,
    height: 20,
    borderRadius: 25,
    borderColor: "#efefef",
    borderWidth: 1,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 17,
    fontWeight: "600",
  },
  pmImg: {
    width: 20,
    height: 20,
    objectFit: "contain",
  },
  statusContainer: {
    marginRight: 0,
    marginBottom: 0,
  },
  userStatus: {
    fontSize: 12,
    color: "#777",
  },
  chatType:{
    fontSize: 14,
    color: "#777",
  },
  messageContainer: {
    flex: 1,
  },
  message: {
    marginTop: 8,
    marginBottom: 2,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 6,
    maxWidth: "70%",
  },
  messageText: {
    fontSize: 17,
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderColor: "#efefef",
    borderWidth: 1,
    borderRadius: 30,
    paddingHorizontal: 16,
    marginRight: 10,
    paddingVertical: 10,
  },
  sendButton: {
    backgroundColor: "#00c0ff",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  iconButton: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    width: 200,
    height: 150,
    objectFit: "contain",
  },
  lightboximageStyle: {
    height: "100%",
    width: "100%",
  },
  videoPlayer: {
    width: 200,
    height: 150,
  },
});

export default ChatDashboard;
