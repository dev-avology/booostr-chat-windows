import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import bgImg from "../assets/chat-bg.png";
import user1 from "../assets/user1.png";
import Icon from "react-native-vector-icons/Ionicons";
import BottomNavBar from "../navigation/BottomNavBar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/auth";
import { fetchUserData} from "../reducers/loginReducer";
import { memoizedSelectUserData } from "../selectors";

const SettingsPage = ({ navigation }) => {
  const CurrentUserID = useSelector(
    (state) => JSON.parse(state.auth.userData)?.user_id
  );
  const loading = useSelector((state) => state.auth.loading);
  const userData = useSelector(memoizedSelectUserData);
  const dispatch = useDispatch();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (CurrentUserID) {
          dispatch(fetchUserData(CurrentUserID));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [dispatch, navigation]);

  const handleChangePassword = () => {};

  const handleLogout = () => {
    dispatch(logout(CurrentUserID)).then((response) => {
      if (response.status === "success") {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    });
  };

  const handleBack = () => {
    navigation.goBack();
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
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>Settings</Text>
          </View>
        </View>

        {userData && !loading ? (
          <View style={styles.card}>
            <View style={styles.statusContainer}>
            <Image
              source={
                userData?.user_photo
                  ? { uri: userData?.user_photo }
                  : user1
              }
              style={styles.userImage}
            />
              {renderStatusIndicator(userData?.status)}
            </View>
            <Text style={styles.userName}>
              {userData?.first_name} {userData?.last_name}
            </Text>
            <Text style={styles.userStatus}>{userData.user_email}</Text>

            <View style={styles.mainBox}>
              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.optionButtonText}>Change Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleLogout}
              >
                <Text style={styles.optionButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#000" />
        )}
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
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  statusContainer: {
    marginRight: 8,
    marginBottom: 8,
  },
  mainBox: {
    backgroundColor: "#f4f4f4",
    width: "100%",
    marginTop: 15,
  },
  headerText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
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
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderColor: "#efefef",
    borderBottomWidth: 1,
    width: "100%",
  },
  optionButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  backButton: {
    marginLeft: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
});

export default SettingsPage;
