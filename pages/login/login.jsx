import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import styles from './styles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

export default function Login({ navigation }) {
    const [user, setUser] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken] = useState(null)

    useEffect(() => {
        if(token){
            AsyncStorage.setItem('token', token)
                .then(() => {
                    if (token != null) {
                        console.log("Token SignIn: ", token)
                        console.log("Token sucesso!")
                    }
                })
                .catch((erro) => {
                    console.error("Erro: ", erro);
                })
        }
    }, [token])

    const fetchToken = async () => {
        try{
            const response = await axios.post(
                'https://daviflandrade.pythonanywhere.com/api/token/',
                {
                    username: user,
                    password: password
                }
            )
            console.log(response.data.access)
            setToken(response.data.access)
            navigation.navigate('home')

        } catch (erro){
            console.error("Deu Erro:", erro);
        }
        
    }


    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>LOGIN</Text>
            </View>
            <TextInput
                placeholder='user'
                onChangeText={setUser}
                value={user}
                style={styles.caixa}
            />
            <TextInput
                placeholder='password'
                onChangeText={setPassword}
                value={password}
                style={styles.caixa}
                secureTextEntry={true}
            />

            <Pressable
                style={styles.btnOk}
                onPress={fetchToken}
            >
                <Text style={{ fontSize: 25 }}>Sign In</Text>
            </Pressable>

            <Pressable
                style={styles.btnOk}
                onPress={() => navigation.navigate('cadastro')}
            >
                <Text style={{ fontSize: 25 }}>Sign Up</Text>
            </Pressable>

        </View>
    )
}