import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, Button } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Biometrics from 'react-native-biometrics'
import { AsyncStorage } from "react-native";

var SERVER_URL = "http://9e4c2f75.ngrok.io";

export class RegisterDevice extends Component {
  static navigationOptions = {
    title: 'Fingerprint Autheticator',
    headerLeft:null,
    headerStyle: { 
      backgroundColor: '#0F2944',
      height:80,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    headerTitleStyle: { 
      color: '#FFF',
      fontSize: 18,
      fontWeight: 'normal',
    },
  }
  constructor(props)
  {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
    this.generateSignature = this.generateSignature.bind(this);
    this.registerDevice = this.registerDevice.bind(this);
    this.sendDataToServer = this.sendDataToServer.bind(this);
  }
  
  onSuccess(e){
    let dataFromQR = JSON.parse(e.data);
    this.generateSignature(dataFromQR);
  }
  generateSignature(dataFromQR){
    Biometrics.isSensorAvailable()
      .then((biometryType) => {
      if (biometryType === Biometrics.TouchID) {
        Biometrics.createKeys('Generate keys')
          .then((publicKey) => {
            this.registerDevice({...dataFromQR, publicKey : publicKey});
          })
      } 
      else {
        console.log('Biometrics not supported')
      }
    })
  }
  registerDevice(data)
  {
      let payload = {...data, timestamp : Math.round((new Date()).getTime() / 1000).toString()};
      Biometrics.createSignature('Sign request', JSON.stringify(payload))
      .then((signature) => {
        this.sendDataToServer({...payload,signature});
      });
  }
  async sendDataToServer(payload){
      var bodyPayload = {...payload};
      bodyPayload = JSON.stringify(bodyPayload);
      await fetch(SERVER_URL+'/users/registerDevice',
      {
        method:'POST',
        body: bodyPayload,
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then((data) => {
        this.storeEmail(payload.email);
      });
  }
  storeEmail = async (email) => {
    var retreivedEmails = await this.retreiveEmails();
    var newEmailArray = [];
    if(retreivedEmails)
    {
      newEmailArray = JSON.parse(retreivedEmails);
    }
    newEmailArray.push(email);
    try {
      await AsyncStorage.setItem('FING_AUTH_EMAILS', JSON.stringify(newEmailArray));
    } catch (error) {
      console.log(error);
    }
  }
  retreiveEmails = async () => {
    try {
      const emails = await AsyncStorage.getItem('FING_AUTH_EMAILS');
        return emails;
     } catch (error) {
       // Error retrieving data
     }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner 
        onRead={this.onSuccess}
        bottomContent={
          <View style={styles.centerText}>
            <Text style={styles.textCenter}>Please scan QR code given on signup.</Text>
          </View>
        }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : "#212121"
  },
  shadow : {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  centerText: {
    flex: 1,
    width:'100%',
    justifyContent:'center',
    alignItems : 'center',
    backgroundColor : '#212121'
  },
  textCenter:{
    fontSize: 17,
    color: '#FFF',
  },
});
