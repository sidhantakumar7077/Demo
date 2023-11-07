import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'

const Index = (props) => {

    const navigation = useNavigation()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const createuser = async () => {

        var userDetails = await AsyncStorage.getItem('user_details');
        const u_details = JSON.parse(userDetails);
        console.log("get user details--", u_details)

        const login_data = {
            email: email,
            password: password
        }

        try {
            if (email === "") {
                Alert.alert("User Email", 'Please Enter Your Valid Email');
                return false;
            }
            if (password === "") {
                Alert.alert("Password", 'Password Empty');
                return false;
            }
            console.log("Login Data--", login_data)

            if (login_data.email === u_details.email && login_data.password === u_details.password) {
                console.log("Success");
                await AsyncStorage.setItem('login_success', "Success");
                navigation.replace('Home')
            } else {
                console.log("Login failed");
                Alert.alert("Login Error", 'Email ID or Password Mismatched')
            }

        } catch (error) {
            console.log("error", error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.logintext}>LOGIN HERE</Text>
            </View>
            <View style={{ width: '90%', alignSelf: 'center' }}>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder='Enter Email'
                        keyboardType='email-address'
                        autoCapitalize='none'
                        underlineColorAndroid='transparent'
                    />
                </View>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        placeholder='Enter Password'
                        autoCapitalize='none'
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity onPress={createuser} style={styles.saveBtm}>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>Save</Text>
                </TouchableOpacity>
                <View style={{ marginTop: 6, alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Signup')}>
                        <Text style={{ color: '#2352de', fontSize: 15, }}>Signup</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Index

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor:'#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logintext: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000'
    },
    inputBox: {
        width: '100%',
        backgroundColor: '#fff',
        height: 50,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginTop: 20
    },
    input: {
        width: '100%',
        height: '100%',
    },
    saveBtm: {
        backgroundColor: '#d1de23',
        alignItems: 'center',
        paddingVertical: 10,
        marginTop: 20,
        borderRadius: 10
    }
})