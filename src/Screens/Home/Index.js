import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Modal, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'demo',
    location: 'default',
  },
  () => {
    console.log("Database connected!")
  },
  error => { console.log("error", error) }
)

const Index = (props) => {

  // For Add 
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => { setModalVisible(false); }
  const openModal = () => { setModalVisible(true); }
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [allData, setAllData] = useState([]);
  // For Update
  const [updateModal, setUpdateModal] = useState(false);
  const closeUpdateModal = () => { setUpdateModal(false); }
  const openUpdateModal = () => { setUpdateModal(true); }
  const [updateId, setUpdateId] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');
  const [updatePhone, setUpdatePhone] = useState('');

  // Create Table
  const createUserTable = () => {
    db.executeSql("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR, name VARCHAR, phone INTEGER)", [], (result) => {
      console.log("Table created successfully");
    }, (error) => {
      console.log("Create table error", error)
    })
  }

  //insert a new user record
  const createUser = () => {
    let sql = "INSERT INTO users (email, name, phone) VALUES (?, ?, ?)";
    let params = [email, name, phone]; //storing user data in an array
    db.executeSql(sql, params, (result) => {
      Alert.alert("Success", "User created successfully.");
      listUsers();
      closeModal();
      console.log("User created successfully.");
    }, (error) => {
      console.log("Create user error", error);
      Alert.alert("Create user error", error);
    });
  }

  //list all the users
  const listUsers = async () => {
    let sql = "SELECT * FROM users";
    const usersArray = [];
    db.transaction((tx) => {
      tx.executeSql(sql, [], (tx, resultSet) => {
        var length = resultSet.rows.length;
        for (var i = 0; i < length; i++) {
          const user = resultSet.rows.item(i);
          usersArray.push(user);
        }
        console.log("Fetched users:", usersArray); // Debugging line
        setAllData(usersArray);
      }, (error) => {
        console.log("List user error", error);
      })
    })
  }

  //update user record
  const updateUser = () => {
    let sql = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
    let params = [updateName, updateEmail, updatePhone, updateId];
    db.executeSql(sql, params, (resultSet) => {
      listUsers();
      closeUpdateModal();
      Alert.alert("Success", "Record updated successfully");
    }, (error) => {
      console.log(error);
    });
  }

  //findByID
  const findByID = async (id) => {
    setUpdateId(id);
    openUpdateModal();
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM users WHERE ID=${id}`,
        [],
        (tx, result) => {
          var len = result.rows.length;
          if (len > 0) {
            setUpdateName(result.rows.item(0).name);
            setUpdateEmail(result.rows.item(0).email);
            setUpdatePhone(result.rows.item(0).phone);
            
            var userName = result.rows.item(0).name;
            var userEmail = result.rows.item(0).email;
            var userPhone = result.rows.item(0).phone;
            console.log("FindByID----", userName + " " + userEmail + " " + userPhone)
          }
        }
      )
    })
  }

  //delete user record
  const deleteUser = (id) => {
    let sql = "DELETE FROM users WHERE id = ?";
    let params = [id];
    db.executeSql(sql, params, (resultSet) => {
      listUsers();
      Alert.alert("Success", "User deleted successfully");
    }, (error) => {
      console.log("Delete user error", error);
    })
  }

  useEffect(() => {
    createUserTable();
    listUsers();
  }, [])


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerPart}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* <Feather name="chevron-left" color={'#555454'} size={30} /> */}
          <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginBottom: 3, marginLeft: 5 }}>Profile</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ marginTop: 10, alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={openModal} style={styles.addbtm}>
            <Text style={{ color: '#fff' }}>Add User</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: '95%', alignSelf: 'center' }}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={allData}
            keyExtractor={(key) => {
              return key.id
            }}
            renderItem={({ item }) => {
              return (
                <View style={styles.addressBox}>
                  <View style={{ marginBottom: 5, width: '85%' }}>
                    <Text style={{ fontSize: 17, fontWeight: '500' }}>{item.name}</Text>
                    <Text style={{ color: '#000', fontSize: 17, marginTop: 8, }}>{item.email}</Text>
                    <Text style={{ marginTop: 8, color: '#7a7979' }}>{item.phone}</Text>
                  </View>
                  <View style={{ marginBottom: 5, width: '15%' }}>
                    <TouchableOpacity onPress={() => findByID(item.id)} style={{ marginBottom: 20 }}>
                      <Feather name="edit" color={'#555454'} size={20} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteUser(item.id)}>
                      <AntDesign name="delete" color={'#555454'} size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              )
            }}
          />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => { setModalVisible(false) }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.headerPart}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginBottom: 3, marginLeft: 5 }}>Add User</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" color={'#555454'} size={30} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
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
                  value={phone}
                  onChangeText={setPhone}
                  placeholder='Enter Phone Number'
                  keyboardType='number-pad'
                />
              </View>
              <TouchableOpacity onPress={createUser} style={styles.saveBtm}>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={updateModal}
        onRequestClose={() => { setUpdateModal(false) }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.headerPart}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#000', fontSize: 16, fontWeight: '500', marginBottom: 3, marginLeft: 5 }}>Update User</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeUpdateModal}>
              <Ionicons name="close" color={'#555454'} size={30} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ width: '90%', alignSelf: 'center' }}>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  typy='text'
                  value={updateName}
                  onChangeText={setUpdateName}
                  placeholder='Enter Name'
                  underlineColorAndroid='transparent'
                />
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={updateEmail}
                  onChangeText={setUpdateEmail}
                  placeholder='Enter Email'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  underlineColorAndroid='transparent'
                />
              </View>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={updatePhone}
                  onChangeText={setUpdatePhone}
                  placeholder='Enter Phone Number'
                  keyboardType='number-pad'
                />
              </View>
              <TouchableOpacity onPress={() => updateUser(updateId)} style={styles.saveBtm}>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:'#fff',
  },
  headerPart: {
    width: '100%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 13,
    elevation: 5
  },
  addbtm: {
    backgroundColor: '#3dc461',
    marginRight: 10,
    padding: 7,
    borderRadius: 7
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e8e4e3',
    bottom: 0,
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 10
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
  },
  addressBox: {
    width: '100%',
    padding: 15,
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 13,
    elevation: 2
  }
})