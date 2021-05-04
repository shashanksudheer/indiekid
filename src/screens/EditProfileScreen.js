import React, { useState, useContext, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase/config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthContext } from '../navigation/AuthProvider';
import Loading from '../components/Loading';
import styles from './styles';

const userRef = firebase.firestore().collection('users');

export default function EditProfileScreen( { navigation, route })
{
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [bio, setBio] = useState('');

    const [isArtist, setIsArtist] = useState(false);

    const handleSubmit = () => {
	if (isArtist)
	{
	    const data = {
		artistBio: bio,
		email_d: email,
		username_d: userName,
		userType_d: userData.userType_d
	    }

	    const res = userRef.doc(user.uid).set(data);
	}
	else
	{
	    const data = {
		email_d: email,
		username_d: userName,
		userType_d: userData.userType_d
	    }

	    const res = userRef.doc(user.uid).set(data);
	}

	navigation.navigate("Settings");
    }

    // Was trying to force loop to occur until data is inputted
    const handleNullData = () => {
	console.log(userData);
	if (userData != null)
	{
	    setUserName(userData.username_d);
	    setEmail(userData.email_d);

	    if (userData.userType_d == "artist")
	    {
		setIsArtist(true);
		setBio(userData.artistBio);
	    }
	}
	else
	{
	    handleNullData();
	}
    }

    useEffect(() => {
		return userRef.doc(user.uid).onSnapshot(doc => {
		    if (!doc.exists) {
			console.log('Edit Profile: User not found');
		    } else {
			const userDoc = doc.data();
			setUserData(userDoc);
		    }
		    console.log(userData)

		    if (userData != null) {
		        if (userData.userType_d == "artist")
			{
			    setIsArtist(true);

			    setBio(userData.artistBio);
			}

			setUserName(userData.username_d);
			setEmail(userData.email_d);
		    }
		    else
		    {
//			handleNullData();
		    }

		    if (loading) {
		        setLoading(false);
		    }
		});
    }, []);

    return (
	<View style = {styles.container}>
	{loading ? <Loading/> : (
	    <KeyboardAwareScrollView
		style = {{flex: 1, width: '100%' }}
		keyboardShouldPersistTaps = "always">
		<Text> Edit Profile Screen </Text>
		<Text> Username </Text>
		<TextInput
		    style = {styles.input}
		    numberOfLine = {1}
		    value={userName}
		    onChangeText = {(text) => setUserName(text)}
		    underlineColorAndroid='transparent'
		    autoCapitalize='none'
		/>
		<Text> Email </Text>
		<TextInput
		    style = {styles.input}
		    numberOfLine = {1}
		    value={email}
		    onChangeText = {(text) => setEmail(text)}
		    underlineColorAndroid = 'transparent'
		    autoCapitalize = 'none'
		/>
		{isArtist && <><Text> Bio </Text>
		<TextInput
		    style = {styles.input}
		    numberOfLine= {4}
		    multiline
		    value={bio}
		    onChangeText = {(text) => setBio(text)}
		    underlineColorAndroid = 'transparent'
		    autoCapitalize = 'none'
		/></>}
		<TouchableOpacity
		    style={styles.button}
		    onPress={handleSubmit}>
		    <Text style={styles.buttonTitle}>Save</Text>
		</TouchableOpacity>
	    </KeyboardAwareScrollView>
	)}
	</View>
    )
}
