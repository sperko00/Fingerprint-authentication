import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Biometrics from 'react-native-biometrics';
import { AsyncStorage } from "react-native";

var SERVER_URL = "http://9e4c2f75.ngrok.io";

export class ScanFingerprint extends Component {
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
    this.state = {emails : []}
    this.verifyFingerprint = this.verifyFingerprint.bind(this);
  }
  retreiveEmails = async () => {
    try {
      const emails = await AsyncStorage.getItem('FING_AUTH_EMAILS');
        return emails;
     } catch (error) {
       // Error retrieving data
     }
  }
  async componentWillMount()
  {
    var retreivedEmails = await this.retreiveEmails();
   
    if(retreivedEmails){
      this.setState({emails : JSON.parse(retreivedEmails)});
    }
  }
  verifyFingerprint(item)
  {
      let payload = {email : item};
      Biometrics.createSignature('Confirm identity', JSON.stringify(payload))
      .then((signature) => {
        this.sendDataToServer({...payload,signature});
      });
  }
  async sendDataToServer(payload){
      payload = JSON.stringify(payload);
      await fetch(SERVER_URL+'/users/verifyFingerprint',
      {
        method:'POST',
        body: payload,
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then((data) => {
        //show alert with data.error message
      });
  }
  render() {
    var emails = this.state.emails;
    var active = emails.length > 0 ? 
    <View style={styles.container2}>
      {
        emails.map((item,id) => 
          <Text style={styles.textEmail} key = {id} onPress={() => this.verifyFingerprint(item)}>{item}</Text>
        )
      }
    </View>
    :
    <Text>
      Device is not associated with any account.
    </Text>
    return (
      <View style={styles.container}>
            {active}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container2: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
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
  textEmail: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#333333',
  },
 
});
