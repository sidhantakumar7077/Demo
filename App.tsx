import { StyleSheet, Text, View, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth
import Login from './src/Screens/Auth/Login/Index'
import Signup from './src/Screens/Auth/Signup/Index'

// Pages
import Home from './src/Screens/Home/Index'

const Stack = createNativeStackNavigator()

const App = () => {

  const [isValid, setIsValid] = useState<string | null>(null);

  const getData = async () => {
    const userDetails = await AsyncStorage.getItem('login_success');
    console.log("get user details--", userDetails)
    setIsValid(userDetails);
  }

  useEffect(() => {
    getData();
  }, [])


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isValid === "Success" ? <Stack.Screen name="Home" component={Home} /> : <Stack.Screen name="Login" component={Login} />}
        {!(isValid === "Success") ? <Stack.Screen name="Home" component={Home} /> : <Stack.Screen name="Login" component={Login} />}
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})