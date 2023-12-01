import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import user1Img from "../assets/user1.png";
import bgImg from "../assets/chat-bg.png";
import Icon from "react-native-vector-icons/Ionicons";
import BottomNavBar from "../navigation/BottomNavBar";
import profileManager from "../assets/pm.png";

const UserProfile = ({ route, navigation }) => {
  const user = route.params?.user ? route.params?.user : [];
  const conversation = route.params?.conversation
    ? route.params?.conversation
    : [];

  const handleBack = () => {
    navigation.goBack();
  };

  const userList =
    conversation?.conversation_type == "group"
      ? conversation?.participants
      : [];

  if (Object.keys(user).length === 0) {
    navigation.goBack();
    return null;
  }

  return (
    <ImageBackground style={styles.img_top} source={bgImg} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon
              name="arrow-back"
              size={24}
              color="#000"
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <View style={styles.headerTextView}>
            <Text style={styles.headerText}>Info</Text>
          </View>
        </View>
        <View style={styles.card}>
          {conversation?.conversation_type == "group" ? (
            <>
              <Image source={user1Img} style={styles.userImage} />
              <Text style={styles.userName}>
                {conversation?.conversation_name}
              </Text>
              <Text style={styles.userStatus}>
                {conversation?.participants?.length} Members
              </Text>
            </>
          ) : (
            <>
              <Image source={user1Img} style={styles.userImage} />
              <Text style={styles.userName}>
                {user?.first_name} {user?.last_name}{" "}
                {user?.profile_manager ? (
                  <Image source={profileManager} style={styles.pmImg} />
                ) : null}
              </Text>
              <Text style={styles.userStatus}>{user?.status}</Text>
              {user?.user_email ? (
                <Text style={styles.emailText}>{user?.user_email}</Text>
              ) : null}
            </>
          )}
          <ScrollView style={styles.clubListContainer}>
            {userList?.map((club, index) => (
              <TouchableOpacity
                style={styles.clubListItem}
                key={index}
                onPress={() => {
                  alert(`Clicked on ${club?.user_details?.first_name}`);
                }}
              >
                <Text style={styles.clubName}>
                  {club?.user_details?.first_name}{" "}
                  {club?.user_details?.last_name}{" "}
                  {club?.user_details?.profile_manager ? (
                    <Image source={profileManager} style={styles.pmImg} />
                  ) : null}
                </Text>
                <Text style={styles.clubRole}>{club.role}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      <BottomNavBar />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "80%",
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
  },
  img_top: {
    height: "100%",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS == "ios" ? 40 : 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    backgroundColor: "#f7f7f7",
    zIndex: 1,
    width: "100%",
  },
  pmImg: {
    width: 20,
    height: 20,
    objectFit: "contain",
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: "#efefef",
    borderWidth: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  userStatus: {
    fontSize: 18,
    color: "#777",
    marginTop: 5,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  clubListContainer: {
    marginTop: 20,
    width: "100%",
    maxHeight: 270,
  },
  clubListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderColor: "#efefef",
    borderBottomWidth: 1,
  },
  clubName: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  clubRole: {
    color: "#777",
    fontSize: 16,
    textTransform: "capitalize",
  },
  backButton: {
    marginLeft: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  headerTextView: {
    flex: 1,
  },
});

export default UserProfile;
