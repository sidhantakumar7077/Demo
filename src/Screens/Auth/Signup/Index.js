import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'

const Index = () => {

    const navigation = useNavigation()
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const createuser = async () => {

        const data = {
            name: name,
            email: email,
            password: password
        }

        try {
            if (name === "") {
                Alert.alert("User Name", 'Please Enter Your Valid User Name');
                return false;
            }
            if (email === "") {
                Alert.alert("User Email", 'Please Enter Your Valid Email');
                return false;
            }
            if (password === "" || password.length < 6) {
                Alert.alert("Password", 'Please Enter Your Valid Password');
                return false;
            }
            console.log("Login Data--", data)
            await AsyncStorage.setItem('user_details', JSON.stringify(data));
            navigation.navigate('Login')
        } catch (error) {
            console.log("error", error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.logintext}>SIGNUP HERE</Text>
            </View>
            <View style={{ width: '90%', alignSelf: 'center' }}>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        typy='text'
                        value={name}
                        onChangeText={setName}
                        placeholder='Enter Name'
                        underlineColorAndroid='transparent'
                    />
                </View>
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
                    <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
                        <Text style={{ color: '#2352de', fontSize: 15, }}>Login</Text>
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