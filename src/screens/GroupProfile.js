import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import groupImg from '../assets/user1.png'; // Replace with your group image asset
import bgImg from '../assets/chat-bg.png'; // Replace with your background image asset
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import BottomNavBar from '../navigation/BottomNavBar';

const GroupProfile = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  // Sample group information
  const groupInfo = {
    groupName: 'Test Group',
    groupImage: groupImg, // Replace with your group image
    //groupStatus: 'Active',
    groupEmail: '15 participants',
  };

  // Sample user details
  const groupMembers = [
    { name: 'Member 1', userImage: require('../assets/user1.png'), userStatus: 'Active' },
    { name: 'Member 2', userImage: require('../assets/user2.png'), userStatus: 'Active' },
    { name: 'Member 3', userImage: require('../assets/user3.png'), userStatus: 'Inactive' },
    { name: 'Member 4', userImage: require('../assets/user4.png'), userStatus: 'Active' },
    { name: 'Member 5', userImage: require('../assets/user5.png'), userStatus: 'Inactive' },
  ];

  return (
    <ImageBackground style={styles.img_top} source={bgImg} resizeMode="cover">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color="#000" style={styles.backIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <Image source={groupInfo.groupImage} style={styles.groupImage} />
          <Text style={styles.groupName}>{groupInfo.groupName}</Text>
        {/* <Text style={styles.groupStatus}>{groupInfo.groupStatus}</Text>*/}
          <Text style={styles.emailText}>{groupInfo.groupEmail}</Text>
          <View style={styles.memberListContainer}>
            {/* Mapping the group members */}
            {groupMembers.map((member, index) => (
              <View style={styles.memberListItem} key={index}>
                <Image source={member.userImage} style={styles.userImage} />
                <View style={styles.userInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <View style={styles.userStatusContainer}>
                    <Icon
                      name={member.userStatus === 'Active' ? 'ios-checkmark-circle' : 'ios-close-circle'}
                      size={16}
                      color={member.userStatus === 'Active' ? 'green' : 'red'}
                    />
                    <Text style={styles.userStatus}>{member.userStatus}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
      <BottomNavBar />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '80%',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  img_top: {
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS == 'ios' ? 55 : 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#efefef",
    backgroundColor: "#f7f7f7",
    zIndex: 1,
    width: '100%',
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#efefef',
    borderWidth: 1,
  },
  groupName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  groupStatus: {
    fontSize: 18,
    color: '#777',
    marginTop: 5,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  memberListContainer: {
    marginTop: 20,
    width: '100%',
    maxHeight: 200,
  },
  memberListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderColor: '#efefef',
    borderBottomWidth: 1,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor: '#efefef',
    borderWidth: 1,
  },
  userInfo: {
    marginLeft: 10,
  },
  memberName: {
    color: '#000',
    fontSize: 16,
  },
  userStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userStatus: {
    color: '#777',
    fontSize: 14,
    marginLeft: 5,
  },
  backButton: {
    marginLeft: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
});

export default GroupProfile;
