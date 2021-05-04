import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './styles';
import Loading from '../components/Loading';

import { firebase } from '../firebase/config';

const usersRef = firebase.firestore().collection('users');

export default function EditProfileScreen( { navigation, route })
{
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = userState(true);

    const {userID } = route.params;

    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [bio, setBio] = useState('');

    const handleSubmit = () -> {
	const data = {
	    artistBio: bio,
	    email_d: email,
	    username_d: userName,
	    userType_d: userData.userType_d
	}

	const res = usersRef.doc(artistID).set(data);

	navigation.navigate("Settings");
    };

    useEffect(() => {
	return userRef.doc(artistID).onSnapshot(doc => {
	    if (!doc.exists) {
		console.log('Edit Profile: User not found');
	    } else {
		const userDoc = doc.data();
		setUserData(userDoc);
	    }
	    console.log(userData)
	    if (loading) {
		setLoading(false);
	    }
	});
    }, []);

    return (
        <View>
            <Text> Edit Profile Screen </Text>
        </View>
	<View style = {styles.container}>
	{loading ? <Loading/> : (
	    <>
		<form>
		    <TextInput
			placeholder = {userData.artistName}
			value = {userName}
			onChange = {(text) => setUserName(text)}
		    />
		    <TextInput
			placeholder = {userData.email_d}
			value = {email}
			onChange = {(text) => setEmail(text)}
		    />
		    <TextInput
			multiline
			numberOfLine = {4}
			placeholder = {userData.artistBio}
			value = {bio}
			onChangeText = {(text) => setBio(text)}
			fullwidth
		    />
		</form>
		<TouchableOpacity
		    style = {styles.button}
		    onPress= {handleSubmit}
		>
		    <Text style={styles.buttonTitle}>Save</Text>
		</TouchableOpacity>
	)}
	</View>
    )
}
