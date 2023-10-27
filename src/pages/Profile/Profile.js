import { View, Text, TouchableOpacity, StatusBar, Image, TextInput, ScrollView, ActivityIndicator, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker from 'react-native-document-picker'
import axios from 'axios';
import Toast from 'react-native-toast-message'
import { connect } from 'react-redux';
import { userActions } from '../../_actions';

const Profile = props => {
  const [isData, setisData] = useState(null)
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState()
  const [id, setid] = useState()
  const [Token, setToken] = useState()
  const [image, setimage] = useState()
  const [profile, setprofile] = useState()


  const [email, setemail] = useState()
  const [currentPassword, setcurrentPassword] = useState("")
  const [password, setpassword] = useState("")
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const isPasswordValid = (password) => {
    return password.length >= 4;
  };

  useEffect(() => {
    ProfileDAta()
    const {users}=props;
  let {registerToken, registerData}=users
  setName(registerData&&registerData.name?registerData.name:"-")
  setemail(registerData&&registerData.email?registerData.email:"-")


  }, [])

  



  const handleRegistration = () => {

    setPasswordError("");
    setConfirmPasswordError("");

    let isValid = true;



    if (!isPasswordValid(password)) {
      setPasswordError("Please Enter Password");
      isValid = false;
    }

    if (password !== currentPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    }

    if (isValid) {

      const registrationResult = { success: true };
      return registrationResult;
    } else {

      return { success: false };
    }
  };

  const ProfileUpdated = () => {
    const registrationResult = handleRegistration();

    setLoading(true)
    setTimeout(() => { setLoading(false) }, 1500)
    if (registrationResult.success) {

      let data = new FormData();

      data.append('name', name);
      data.append('password', password);
      {
        image && image[0] ?
        data.append('avatar', {
          uri: image && image[0].uri,
          name: image && image[0].name,
          type: image && image[0].type,
        }) : null
      }
      props.dispatch(userActions.ProfileUpdated(data,props));

      
    }
  }



  const ProfileDAta=async()=>{
  props.dispatch(userActions.getProfile())
    
  }
  

  const UplaordDocument = async () => {
    try {

      const doc = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],

      })

      console.log("sssss", doc);
      setimage(doc)

    } catch (err) {
      if (DocumentPicker.isCancel(err))
        console.log(err);
      else
        console.log(err);

    }


  }





  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView>


        <View style={{ marginHorizontal: 20, marginTop: 20 }}>

          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => props.navigation.pop()}>
            <Image style={{ alignSelf: 'center', height: 22, width: 22, marginRight: 10 }} source={require('../../Images/back.png')} />
            <Text style={{ color: '#000', fontSize: 15, fontWeight: '400' }}>Account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, marginHorizontal: 20 }}>


          {image && image[0].uri ?
            <TouchableOpacity onPress={() => UplaordDocument()}>

              <Image style={{ alignSelf: 'center', height: 100, width: 100, marginTop: 50, borderRadius: 50 }} source={{ uri: image && image[0].uri }} />
            </TouchableOpacity>

            : <TouchableOpacity onPress={() => UplaordDocument()}>

              <Image style={{ alignSelf: 'center', height: 100, width: 100, marginTop: 50,borderRadius: 50,resizeMode:'contain' }} source={require('../../Images/userImg.png')} />
            </TouchableOpacity>
          }

          <View style={{ flex: 1, }}>
            <Text style={{ marginTop: 20, marginLeft: 15, fontWeight: '500', fontSize: 12 }}>Name</Text>
            <TextInput
              placeholder='name'

              placeholderTextColor="black"
              value={name}
              onChangeText={(text) => setName(text)}
              style={{ borderWidth: 1, borderColor: '#000266', width: '90%', alignSelf: 'center', color: '#000', margin: 5, padding: 10, borderRadius: 5 }}
            />
            <Text style={{ marginTop: 10, marginLeft: 15, fontWeight: '500', fontSize: 12 }}>Email Address</Text>
          <TextInput
            placeholder='E-mail Id'
            placeholderTextColor="black"
            value={email}
            style={{ borderWidth: 1, borderColor: '#000266', width: '90%', alignSelf: 'center',color:'#000', margin: 5, padding: 10, borderRadius: 5 }}
          />

            <Modal
              animationType="fade"
              transparent={true}
              visible={loading}
            >
              <View
                style={{
                  marginTop: 240,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(231, 231, 231,0)', backfaceVisibility: 'visible'
                }}>
                <ActivityIndicator color={"#6CC417"} size={'large'} />
                <Text style={{ color: "#6CC417", fontSize: 13, }}>
                  Loading....
                </Text>
              </View>
            </Modal>
            <Text style={{ marginTop: 10, marginLeft: 15, fontWeight: '500', fontSize: 12 }}>Password</Text>
            <TextInput
              placeholder='Enter new password'
              placeholderTextColor="black"
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setpassword(text)}
              style={{ borderWidth: 1, borderColor: '#000266', width: '90%', alignSelf: 'center', color: '#000', margin: 5, padding: 10, borderRadius: 5 }}
            />
            {passwordError !== "" && <Text style={{ color: 'red', marginHorizontal: 20 }}>{passwordError}</Text>}
            <Text style={{ marginTop: 10, marginLeft: 15, fontWeight: '500', fontSize: 12 }}>Confirm  New Password</Text>
            <TextInput
              placeholder='Confirm  password'
              placeholderTextColor="black"
              value={currentPassword}
              secureTextEntry={true}
              onChangeText={(text) => setcurrentPassword(text)}
              style={{ borderWidth: 1, borderColor: '#000266', width: '90%', alignSelf: 'center', color: '#000', margin: 5, padding: 10, borderRadius: 5 }}
            />
            {confirmPasswordError !== "" && <Text style={{ color: 'red', marginHorizontal: 20 }}>{confirmPasswordError}</Text>}






          </View>

        </View>
        <TouchableOpacity style={{ width: '80%', alignSelf: 'center', borderRadius: 20, backgroundColor: '#000266', padding: 8, marginTop: 70 }}
          onPress={() => ProfileUpdated()}
        //  onPress={() => props.navigation.navigate('Home')}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Save</Text>
        </TouchableOpacity>
      </ScrollView>

    </View>
  )
}

function mapStateToProps(state) {
  // const { loggingIn } = state.authentication;
  const { users, } = state;
  return {
    // loggingIn,
    users,
  };
}
export default connect(mapStateToProps)(Profile);