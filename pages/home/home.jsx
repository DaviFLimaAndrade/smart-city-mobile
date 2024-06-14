import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import MapView, { Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './styles';



export default function Home() {
  const initialRegion = {
    latitude: -22.9140639,
    longitude: -47.068686,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  };
  
  const [location, setLocation] = useState(null);
  const [sensores, setSensores] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Obtém o token do AsyncStorage
    AsyncStorage.getItem('token')
      .then((token) => {
        if (token != null) {
          setToken(token);
          // Chama a função fetchToken assim que o token for obtido
          fetchToken(token);
        }
      })
      .catch((erro) => {
        console.error("Erro: ", erro);
      })
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 100,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation.coords);
        }
      );

      return () => {
        locationSubscription.remove();
      };
    })();
  }, []);

  const fetchToken = async (token) => {
    try {
      const response = await axios.get('http://192.168.56.1:8000/api/sensores/', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setSensores(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Deu Erro:", error);
    }
  }

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={initialRegion}
      >
        {sensores && sensores.map(sensor => (
          <Marker
            key={sensor.id}
            coordinate={{ latitude: sensor.latitude, longitude: sensor.longitude }}
            pinColor="blue" 
            title={`Sensor ${sensor.id}`}
          />
        ))}
        {location && (
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            pinColor="red" 
          />
        )}
      </MapView>
      <Text>Latitude: {location?.latitude}, Longitude: {location?.longitude}</Text>
      <FlatList
        data={sensores}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>{`Sensor ${item.id}`}</Text>
            <Text>{`Latitude: ${item.latitude}, Longitude: ${item.longitude}`}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}  
