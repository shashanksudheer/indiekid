import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 30
    },
    title: {
        color: 'black',
        alignSelf: "flex-start",
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 20,
        marginLeft: 35,
        marginRight: 35,
    },
    sectionContainer: {
        alignItems: "flex-start",
        marginTop: 5,
    },
    sectionTitle: {
        color: 'black',
        alignSelf: "flex-start",
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 10,
    },
    sectionItem: {
        color: 'black',
        alignSelf: "flex-start",
        marginTop: 5,
        marginLeft: 35,
        marginRight: 35,
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
        width: 90,
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
        color: 'black',
        alignSelf: "flex-start",
        marginTop: 30,
        marginLeft: 35,
        marginRight: 35,
    },
    textButton: {
        color: '#788eec',
        alignSelf: "flex-start",
        marginTop: 30,
        marginLeft: 35,
        marginRight: 35,
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
        marginLeft: 30,
        marginRight: 30,
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
    follow: {
        color: '#788eec',
        alignSelf: "flex-end",

        marginTop: 35,
        marginLeft: 35,
        marginRight: 35,
    },
});
