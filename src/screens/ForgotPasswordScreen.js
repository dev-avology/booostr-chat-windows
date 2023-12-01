import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from "react-native";
import { Card, Button as PaperButton } from "react-native-paper";
import bgImg from "../assets/chat-bg.png";

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = () => {
    // Add your logic for handling "Forgot your password?" here
    console.log("Email:", email);
    // You can replace the console.log with your password reset logic
  };
  const handleGooglesignIn = () => {
    // Implement your logic for handling "Forgot your password?" here
    // This can include sending a password reset email or navigating to a password reset screen
    navigation.navigate("Login");
  };
  const imgProps = Image.resolveAssetSource(bgImg).uri;
  const image = { uri: imgProps };

  return (
    <View style={[styles.top_main]} contentContainerStyle={{ flexGrow: 1 }}>
      <ImageBackground style={styles.img_top} source={image} resizeMode="cover">
        <View style={styles.container}>
          <View style={styles.card}>
            <Image
              source={require("../assets/logo.png")} // Replace with your logo image
              style={styles.logo}
            />
            <Text style={styles.title}>Forgot Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={(text) => setEmail(text)} // Bind to email state
              value={email}
            />
            <PaperButton
              mode="contained"
              style={styles.button}
              onPress={handleForgotPassword}
            >
              <Text style={styles.buttonText}>Reset Password</Text>
            </PaperButton>
            <TouchableOpacity
              onPress={handleGooglesignIn}
              style={styles.forgotPasswordMain}
            >
              <Text style={styles.forgotPassword}>
                Remember your password? Log in
              </Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  img_top: {
    height: "100%",
  },
  logo: {
    marginBottom: 20,
    maxWidth: 200,
    width: "100%",
    height: 80,
  },
  card: {
    width: "80%",
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "white",
    //shadowColor: '#000',
    // shadowOffset: { width: 0, height: 0 },
    //shadowOpacity: 0.5,
    // shadowRadius: 25,
    borderRadius: 5,
    // elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    textTransform: "capitalize",
  },
  input: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#00c0ff",
    borderRadius: 6,
    fontSize: 15,
    backgroundColor: "#e7effc",
    lineHeight: 19,
    fontWeight: "400",
    fontStyle: "normal",
    color: "#515151",
    maxWidth: "100%",
    padding: 13,
  },
  button: {
    width: "100%",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#00c0ff",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#00c0ff",
    textTransform: "uppercase",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
  buttonText1: {
    fontSize: 18,
    color: "#000",
    fontWeight: "700",
  },
  googleButton: {
    width: "100%",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#d1d8dc",
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
    textTransform: "uppercase",
  },
  forgotPasswordMain: {
    color: "#a9a9a9",
    fontSize: 20,
    marginVertical: 15,
  },
  forgotPassword: {
    color: "#a9a9a9",
    fontSize: 18,
  },
});

export default ForgotPasswordScreen;
