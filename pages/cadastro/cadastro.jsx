import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, TextInput } from 'react-native'
import styles from './styles'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Cadastro({ navigation }) {
    const [usuario, setUsuario] = useState('')
    const [password, setPassword] = useState('')
    const [erro, setErro] = useState(null)
    const [token, setToken] = useState(null)
    
    useEffect(() => {
        if (token !== null) {
            AsyncStorage.setItem('token', token)
                .then(() => {
                    console.log("Token SignUp: ", token)
                    console.log("Token sucesso!")
                })
                .catch((error) => {
                    console.error("Erro ao salvar token no AsyncStorage: ", error);
                })
        }
    }, [token])
    
    const createUser = async () => {
        console.log("Usuario: ", usuario);
        console.log("Senha: ", password);
        try {
            const response = await axios.post('http://192.168.56.1:8000/api/create_user', {
                username: usuario,
                password: password
            })
            const resp = await axios.post('http://192.168.56.1:8000/api/token/', {
                username: usuario,
                password: password
            })
            setToken(resp.data.access)
            navigation.navigate('login') 

        } catch (error) {
            setErro(error)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CREATE</Text>

            <View style={styles.campos}>
                <Text style={styles.texto2}>Nome:</Text>
                <TextInput
                    style={styles.textoNomeEmail}
                    onChangeText={setUsuario}
                    value={usuario}
                />
                <Text style={styles.texto2}>Senha:</Text>
                <TextInput
                    style={styles.addNew}
                    onChangeText={(e) => setPassword(e)}
                    value={password}
                    secureTextEntry={true}
                />
            </View>

            <View style={styles.btnBtn}>
                <Pressable
                    style={styles.btn}
                    onPress={() => createUser()} // Corrija a chamada de função aqui
                >
                    <Text style={styles.btnCadastrar}>CADASTRAR</Text>
                </Pressable>
            </View>

            <View style={{ width: "80%" }}>
                <Text style={styles.textoErro}>
                    {!erro ? '' : `Erro: ${erro.message}`} {/* Renderizar a mensagem de erro */}
                </Text>
            </View>
        </View>
    )
}
