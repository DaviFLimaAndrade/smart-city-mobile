// App.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { MapView } from 'react-native-maps'


const { width, height } = Dimensions.get('window');

export default class App extends Component {
  render() {
   return (
    <View style={styles.container}>
     // Adicionar o MapView 
     <MapView
      style={styles.map}
      loadingEnabled={true}
      region={{
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
      }}
     >
     </MapView>
    </View>
    );
   }
  }

  const styles = StyleSheet.create(
    {
      map:{
  
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
        
      }
    }
  )