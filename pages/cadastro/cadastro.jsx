import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import styles from './styles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cadastro({ navigation }) {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [erro, setErro] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        if (token !== null) {
            AsyncStorage.setItem('token', token)
                .then(() => {
                    console.log("Token SignUp: ", token);
                    console.log("Token sucesso!");
                })
                .catch((error) => {
                    console.error("Erro ao salvar token no AsyncStorage: ", error);
                });
        }
    }, [token]);

    const createUser = async () => {
        console.log("Usuario: ", usuario);
        console.log("Senha: ", password);

        try {
            const response = await axios.post('https://daviflandrade.pythonanywhere.com/api/create_user/', {
                username: usuario,
                password: password
            });
            console.log("Response data from create_user:", response.data);

            const resp = await axios.post('https://daviflandrade.pythonanywhere.com/api/token/', {
                username: usuario,
                password: password
            });
            console.log("Token response data:", resp.data);

            setToken(resp.data.access);
            navigation.navigate('login');

        } catch (error) {
            console.error("Erro ao criar usuário ou obter token:", error);
            if (error.response) {
                // O servidor respondeu com um status fora do 2xx
                console.error("Erro no servidor:", error.response.data);
                setErro(error.response.data);
            } else if (error.request) {
                // A solicitação foi feita, mas nenhuma resposta foi recebida
                console.error("Erro na solicitação:", error.request);
                setErro({ message: "Sem resposta do servidor" });
            } else {ac
                // Outro erro ocorreu
                console.error("Erro:", error.message);
                setErro({ message: error.message });
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CREATE</Text>

            <View style={styles.campos}>

                <TextInput
                    placeholder='Username'
                    style={styles.caixa}
                    onChangeText={setUsuario}
                    value={usuario}
                />
                <TextInput
                    placeholder='Password'
                    style={styles.caixa}
                    onChangeText={(e) => setPassword(e)}
                    value={password}
                    secureTextEntry={true}
                />
            </View>

            <View style={styles.btnOk}>
                <Pressable
                    style={styles.btn}
                    onPress={createUser} 
                >
                    <Text style={{ fontSize: 25 }}>CADASTRAR</Text>
                </Pressable>
            </View>

            <View style={{ width: "80%" }}>
            </View>
        </View>
    );
}
