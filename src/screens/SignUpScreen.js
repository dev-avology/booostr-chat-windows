import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Card, Button as PaperButton } from 'react-native-paper';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    // Add your sign-up logic here
    console.log('Email:', email);
    console.log('Username:', username);
    console.log('Name:', name);
    console.log('Phone:', phone);
    console.log('Password:', password);
    // You can replace the console.log with your sign-up logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone"
          onChangeText={(text) => setPhone(text)}
          value={phone}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <PaperButton
          mode="contained"
          style={styles.button}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </PaperButton>
        <TouchableOpacity onPress={handleSignUp} style={styles.forgotPasswordMain}>
          <Text style={styles.forgotPassword}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    width: '80%',
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    borderRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#00c0ff',
    borderRadius: 6,
    fontSize: 15,
    backgroundColor: '#e7effc',
    lineHeight: 19,
    fontWeight: '400',
    fontStyle: 'normal',
    color: '#515151',
    maxWidth: '100%',
    padding: 13,
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
    color: '#fff',
    fontWeight: '700',
  },
  forgotPasswordMain: {
    color: '#a9a9a9',
    fontSize: 20,
    marginVertical: 15,
  },
  forgotPassword: {
    color: '#a9a9a9',
    fontSize: 18,
  },
});

export default SignUpScreen;
