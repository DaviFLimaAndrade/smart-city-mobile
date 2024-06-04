import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable  } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const initialRegion = {
    latitude: -22.9140639,
    longitude: -47.068686,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  };

  const fixedPoints = [
    {
      id: 1,
      latitude: -22.9140639, 
      longitude: -47.068065, 
    },
    {
      id: 2,
      latitude: -22.9141804, 
      longitude: -47.0683294, 
    }
  ];

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
          timeInterval: 1000,
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

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        <Marker coordinate={{ latitude: -22.915, longitude: -47.0678 }} />
        {fixedPoints.map(point => (
          <Marker
            key={point.id}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            pinColor="red" // Cor do marcador para os pontos fixos
          />
        ))}
        {location && (
        <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            pinColor="red" // Cor do marcador para a localização atual
        />
        )}

      </MapView>
      <Text>{text}</Text>

      <Pressable
                        style={styles.btn}
                        onPress={()=>criar(dados, token)}
                    >
                        <Text style={styles.btnCadastrar}>DETALHES</Text>
        </Pressable>

        

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: width - 40,
    height: height / 2,
    borderRadius: 10,
  },
  btn: {
    backgroundColor: 'blue',
    width: 120,
    height: 30,
    display: "flex",
    justifyContent: 'center',
    marginTop: 30, 
    borderRadius: 10
  },
  btnCadastrar: {
    color: 'white',
    textAlign: "center",
    fontWeight: '700'
  }
});