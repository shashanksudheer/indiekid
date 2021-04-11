import React, { useState, useContext } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthContext } from '../../navigation/AuthProvider';
import styles from './styles';

import { firebase } from '../../firebase/config';

// needs to include question about whether users would like to associate
// their account with an artist account or fan account. Special questions
// need to be shown to those users who would like to sign up as artists.

const RadioButton = props => {
    return(
        <TouchableOpacity style={styles.circle} onPress={props.onPress}>
        {props.checked ? (<View style={styles.checkedCircle}/>) : (<View/>)}
        </TouchableOpacity>
        )
};

export default function RegistrationScreen({navigation})
{
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useContext(AuthContext);
    const [userType, setUserType] = useState('fan');

    const [fan, setFan] = useState(true);
    const [artist, setArtist] = useState(false);

// radio buttons
    const artistHandler = () => {
        if (fan) {
            setFan(false);
            setUserType('artist');
            setArtist(true);
        } else {
            setArtist(true);
            setUserType('artist');
        }
    }

    const fanHandler = () => {
        if (artist) {
            setArtist(false);
            setUserType('fan');
            setFan(true);
        } else {
            setArtist(true);
            setUserType('fan');
        }
    }

    const onFooterLinkPress = () => {
        navigation.navigate('Login');
    }

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />
                <TextInput
                    style={styles.input}
                    placeholder='User Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setUserName(text)}
                    value={userName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Confirm Password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    value={confirmPassword}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Text style={styles.text}>I am:</Text>
                <View style={styles.radioContainer}>
                    <Text style={styles.radioTitle}>an artist </Text>
                    <RadioButton checked={artist} onPress={artistHandler}/>
                </View>
                <View style={styles.radioContainer}>
                    <Text style={styles.radioTitle}> a fan </Text>
                    <RadioButton checked={fan} onPress={fanHandler}/>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => register(email, password, userName)}>
                    <Text style={styles.buttonTitle}>Sign Up</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}
