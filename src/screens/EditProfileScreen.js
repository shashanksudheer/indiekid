import React, { useState, useContext, useEffect } from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase/config';
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
	}
	else
	{
	    const data = {
		email_d: email,
		username_d: userName,
		userType_d: userData.userType_d
	    }
	}

	const res = usersRef.doc(user.uid).set(data);

	navigation.navigate("Settings");
    };

    useEffect(() => {
		return userRef.doc(user.uid).onSnapshot(doc => {
		    if (!doc.exists) {
				console.log('Edit Profile: User not found');
		    } else {
				const userDoc = doc.data();
				setUserData(userDoc);
		    }
		    console.log(userData)
		}).then(() => {
			if (userData.userType_d == "artist") {
			    setIsArtist(true);
			}
			if (loading) {
				setLoading(false);
		    }
		});
    }, []);

    return (
        <View style={styles.container}>
            <Text> Edit Profile Screen </Text>
				{loading ? <Loading/> : (
					<View style={styles.container}>
					    <TextInput
						placeholder={userData.artistName}
						value={userName}
						onChange={(text) => setUserName(text)}
					    />
					    <TextInput
						placeholder={userData.email_d}
						value={email}
						onChange={(text) => setEmail(text)}
					    />
					    {isArtist && <TextInput
						multiline
						numberOfLine= {4}
						placeholder={userData.artistBio}
						value={bio}
						onChangeText={(text) => setBio(text)}
						fullwidth
					    />}
						<TouchableOpacity
						    style={styles.button}
						    onPress={handleSubmit}>
						    <Text style={styles.buttonTitle}>Save</Text>
						</TouchableOpacity>
					</View>
				)}
		</View>
    )
}
