import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        width: '100%'
    },
    caixa: {
        width: '80%',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        fontSize: 25,
        marginTop: 10,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold'
    },
    caixas: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    btnOk: {
        marginTop: 30,
        borderRadius: 10,
        width: '50%',
        height: 50,
        backgroundColor: '#5a7bb0',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center', 
    },
});

export default styles;
