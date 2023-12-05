import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import user1Img from "../assets/user1.png";
import bgImg from "../assets/chat-bg.png";
import Icon from "react-native-vector-icons/Ionicons";
import BottomNavBar from "../navigation/BottomNavBar";
import profileManager from "../assets/pm.png";
import { hideGroupConversation } from "../reducers/groupListSlice";
import { useDispatch,useSelector } from "react-redux";
import {memoizedSelectUserData, memoizedSelectclubList } from "../selectors";
const UserProfile = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const currentUserData = useSelector(memoizedSelectUserData);
  const currentClubData = useSelector(memoizedSelectclubList);

  const clubList = (route.params == undefined && route.path == undefined) ? currentClubData?.clubs : [];
  const clubCount = (route.params == undefined && route.path == undefined) ? currentClubData?.count: 0;


  const user = route.params?.user ? route.params?.user : currentUserData;

  const AsUser = route.params?.user ? route.params?.AsUser : null;
  const club = route.params?.club ? route.params?.club : [];
  //const toggleState = route.params?.user ? route.params?.toggleState : null;
  const conversation = route.params?.conversation
    ? route.params?.conversation
    : [];

  const is_group_admin =
    conversation?.conversation_type === "group"
      ? conversation.participants.some(
          (participant) =>
            participant.user_id == AsUser && participant.role == "club"
        )
      : false;

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

  const handleRemoveGroup = () => {
    setIsLoading(true);
    let payload = {
      club_id: conversation?.club_id,
      group_id: conversation?.contact_group_id,
    };
    dispatch(hideGroupConversation(payload))
      .then((data) => {
        navigation.navigate("ChatUserLists", { club });
        setIsLoading(false);
      })
      .catch((error) => {
        //console.log(error);
        setIsLoading(false);
      });
  };

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
              {user?.user_photo ? (
                  <Image source={{uri:user.user_photo}} style={styles.userImage} />
                ) : (<Image source={user1Img} style={styles.userImage} />)}

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
               {clubCount != 0 ? <Text style={styles.clubCount}>
                {clubCount} Clubs
              </Text> : null}
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
          <ScrollView style={styles.clubListContainer}>
            {clubList?.map((club, index) => (
              <TouchableOpacity
                style={styles.clubListItem}
                key={index}
                onPress={() => {
                  alert(`Clicked on`);
                }}
              >
                <Text style={styles.clubName}>
                  {club?.post_title}{" "}
                </Text>
                <Text style={styles.clubRole}>{club?.role}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>


        </View>
        {is_group_admin ? (
          <TouchableOpacity
            onPress={handleRemoveGroup}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>
              Remove Group{" "}
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : null}
            </Text>
          </TouchableOpacity>
        ) : null}
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
    paddingTop: Platform.OS == "ios" ? 55 : 30,
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
    width: 80,
    height: 80,
    borderRadius: 50,
    borderColor: "#efefef",
    borderWidth: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  userStatus: {
    fontSize: 15,
    color: "#777",
    marginTop: 0,
  },
  emailText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  clubListContainer: {
    marginTop: 20,
    width: "100%",
    maxHeight: 170,
  },
  clubListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderColor: "#efefef",
    borderBottomWidth: 1,
  },
  clubName: {
    color: "#000",
    fontSize: 14,
    fontWeight: "bold",
  },
  clubRole: {
    color: "#777",
    fontSize: 16,
    textTransform: "capitalize",
  },
  backButton: {
    marginLeft: 10,
    marginRight: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  headerTextView: {
    flex: 1,
  },
  removeButton: {
    backgroundColor: "red",
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 3,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserProfile;
