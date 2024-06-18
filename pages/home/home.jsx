import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import styles from './styles';

export default function Home() {
  const [initialRegion, setInitialRegion] = useState(null);
  const [location, setLocation] = useState(null);
  const [sensores, setSensores] = useState(null);
  const [token, setToken] = useState(null);
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then((token) => {
        if (token != null) {
          setToken(token);
          fetchToken(token);
        }
      })
      .catch((error) => {
        console.error("Erro ao obter token: ", error);
      });
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão para acessar localização negada');
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
          setInitialRegion({
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            latitudeDelta: 0.001,
            longitudeDelta: 0.001,
          });
        }
      );

      return () => {
        locationSubscription.remove();
      };
    })();
  }, []);

  const fetchToken = async (token) => {
    try {
      const response = await axios.get('https://daviflandrade.pythonanywhere.com/api/sensores/', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setSensores(response.data);
    } catch (error) {
      console.error("Erro ao buscar sensores: ", error);
    }
  }

  // Função para calcular a distância entre dois pontos geográficos
  const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Raio da Terra em km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distância em Metros
    return distance;
  }

  const toRad = (value) => {
    return value * Math.PI / 180;
  }

  // Ordena os sensores com base na distância do mais próximo ao mais distante
  const ordenarSensoresPorDistancia = () => {
    if (!location || !sensores) return sensores;

    const sensoresComDistancia = sensores.map(sensor => {
      const distancia = calcularDistancia(
        location.latitude, location.longitude,
        sensor.latitude, sensor.longitude
      );
      return { ...sensor, distancia };
    });

    return sensoresComDistancia.sort((a, b) => a.distancia - b.distancia);
  }

  // Filtra os sensores com base no tipo selecionado
  const filteredSensors = selectedType
    ? ordenarSensoresPorDistancia().filter(sensor => sensor.tipo === selectedType)
    : ordenarSensoresPorDistancia();

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={initialRegion ? initialRegion : {
          latitude: -22.9140639,
          longitude: -47.068686,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        }}
      >
        {filteredSensors && filteredSensors.map(sensor => (
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

      <View style={{ flexDirection: 'row', marginVertical: 10, justifyContent: 'space-around', paddingHorizontal: 10 }}>
        <Button title="Umidade" onPress={() => setSelectedType('Umidade')} />
        <Button title="Temperatura" onPress={() => setSelectedType('Temperatura')} />
        <Button title="Luminosidade" onPress={() => setSelectedType('Luminosidade')} />
      </View>

      <FlatList
        data={filteredSensors}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>{`Sensor ${item.id}`}</Text>
            <Text>{`Tipo: ${item.tipo}`}</Text>
            <Text>{`Latitude: ${item.latitude}, Longitude: ${item.longitude}`}</Text>
            {Number.isFinite(item.distancia) ? (
              <Text>{`Distância: ${item.distancia.toFixed(2)} `}</Text>
            ) : (
              <Text>Distância: Indisponível</Text>
            )}
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}
