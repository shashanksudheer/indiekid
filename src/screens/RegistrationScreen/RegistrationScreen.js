import React, { useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

import { firebase } from '../../firebase/config';

// needs to include question about whether users would like to associate
// their account with an artist account or fan account. Special questions
// need to be shown to those users who would like to sign up as artists.

const RadioButton = props => {
    return(
        <TouchableOpacity style={styles.circle} onPress={props.onPress}>
        {props.checked ? (<View style={checkedCircle}/>) : (<View/>)}
        </TouchableOpacity>
        )
};

export default function RegistrationScreen({navigation})
{
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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

    const onRegisterPress = () => {
	if (password != confirmPassword)
	{
	    alert("Passwords do not match");
	    return;
	}

	firebase
	    .auth()
	    .createUserWithEmailAndPassword(email, password)
	    .then((response) =>
	    {
		const uid = response.user.uid;
		const data =
		{
		    id: uid,
		    email,
		    fullName,
            userType
		};
		const usersRef = firebase.firestore().collection('users');

		usersRef
		    .doc(uid)
		    .set(data)
		    .then(() =>
		    {
			navigation.navigate('Home', {user: data});
		    })

		    .catch((error) =>
		    {
			alert(error);
		    });
	    });
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
                    placeholder='Full Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setFullName(text)}
                    value={fullName}
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
                <Text>I am</Text>
                <Text>an artist:</Text>
                <RadioButton checked={artist} onPress={artistHandler}/>
                <Text>a fan:</Text>
                <RadioButton checked={fan} onPress={fanHandler}/>
                </View>
                <
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onRegisterPress()}>
                    <Text style={styles.buttonTitle}>Create account</Text>
                </TouchableOpacity>
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Already got an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Log in</Text></Text>
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}
