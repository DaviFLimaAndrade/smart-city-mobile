import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from "../pages/home/home";
import Login from "../pages/login/login";
import Cadastro from "../pages/cadastro/cadastro";

const Pilha = createStackNavigator()
const Tab = createBottomTabNavigator();

function MyTabs(){
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: 'black',
                    paddingBottom: 1,
                    paddingTop: 1,
                    borderTopColor: 'transparent'
                },
                tabBarActiveTintColor: '#f0f',
                tabBarInactiveTintColor: '#555'
            }}

        >
            <Tab.Screen
                name = 'home'
                component = {Home}
                options={
                    {
                    headerShown: false,
                    tabBarStyle: { display: 'none' },
                    tabBarIcon: ({ size, color }) => (
                        <Feather name="user" size={size} color={color} />
                    )
                }
            }
            />

            <Tab.Screen
                name = 'login'
                component = {Login}
                options={
                    {
                    headerShown: false,
                    tabBarStyle: { display: 'none' },
                    tabBarIcon: ({ size, color }) => (
                        <Feather name="user" size={size} color={color} />
                    )
                }
            }
            />

            <Tab.Screen
                name = 'cadastro'
                component = {Cadastro}
                options={
                    {
                    headerShown: false,
                    tabBarStyle: { display: 'none' },
                    tabBarIcon: ({ size, color }) => (
                        <Feather name="user" size={size} color={color} />
                    )
                }
            }
            />

        </Tab.Navigator>
    );
}

export default function Routers(){
    return(
        <NavigationContainer>
            <Pilha.Navigator>

                <Pilha.Screen
                    name="login"
                    component={Login}
                    options={{ headerShown: false }}
                />

                <Pilha.Screen
                    name="home"
                    component={Home}
                    options={{ headerShown: false }}
                />
            </Pilha.Navigator>
        </NavigationContainer>
    )
}