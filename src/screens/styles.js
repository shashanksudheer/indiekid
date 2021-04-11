import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    title: {

    },
    logo: {
        flex: 1,
        height: 120,
        width: 90,
        alignSelf: "center",
        margin: 30
    },
    input: {
        height: 48,
        color: 'grey',
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16
    },
    text: {
        color: 'grey',
        fontWeight: "bold",
        alignSelf: "flex-start",
        marginTop: 30,
        marginLeft: 30,
        marginRight: 30,
    },
    button: {
        backgroundColor: '#788eec',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 20,
        height: 48,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: 'center'
    },
    buttonTitle: {
        color: 'white',
        fontWeight: "bold",
        alignSelf: "center"
    },
    footerView: {
        flex: 1,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 20
    },
    footerText: {
        fontSize: 16,
        color: '#2e2e2d'
    },
    footerLink: {
        color: "#788eec",
        fontWeight: "bold",
        fontSize: 16
    },
    radioContainer: {
        flex: 1,
        height: 28,
        borderRadius: 5,
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 30,
        marginRight: 190
    },
    radioTitle: {
        color: 'grey',
        alignItems: "flex-start",
        paddingTop: 5,
        paddingLeft: 16
    },
    circle:{
        marginLeft: 120,
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 0.25,
        borderColor: 'grey',
        alignItems: 'center',
        paddingTop: 2.5
    },
    checkedCircle:{
        height: 14,
        width: 14,
        borderRadius: 7,
        backgroundColor: '#788eec',
        alignItems: 'center'
    },
});
