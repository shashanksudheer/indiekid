import React, { useState, useContext, useEffect } from 'react';
import { Text, View, Input, Image, TextInput, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase/config';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as DocumentPicker from 'expo-document-picker';
import { AuthContext } from '../navigation/AuthProvider';
import Loading from '../components/Loading';
import styles from './styles';

const userRef = firebase.firestore().collection('users');
const storage = firebase.storage();

export default function EditProfileScreen( { navigation, route })
{
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [bio, setBio] = useState('');
    const [banner, setBanner] = useState(null);

    const [isArtist, setIsArtist] = useState(false);

    const handleSubmit = async () => {
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

	if (banner != null)
	{
	    const storageRef = storage.ref("banners/" + userName + "-" + user.uid + "/"); // Create folder to upload file
	    const fileRef = storageRef.child(banner.name);

	    await fileRef.put(banner);

	    userRef.doc(user.uid).update({
		banner: firebase.firestore.FieldValue.arrayUnion({
		    name: banner.name,
		    uploadDate: Date().toLocaleString(),
		    size: banner.size,
		    url: await fileRef.getDownloadURL()
		})
	    })
	}

	navigation.navigate("Settings");

	return user.updateProfile({
	    displayName: userName
	});
    }

    const onFileChange = async () => {
	let res = await DocumentPicker.getDocumentAsync("image/*");

	if (res.type == "success")
	{
	    setBanner(res);
	}
	else
	{
	    console.log("Cancelled");
	}
	console.log(res);
    }

    useEffect(() => {
		return userRef.doc(user.uid).onSnapshot(doc => {
		    if (!doc.exists) {
			console.log('Edit Profile: User not found');
		    } else {
			const userDoc = doc.data();
			setUserData(userDoc);
			setBanner(doc.data().banner);
		    }
		    console.log(userData) // Use doc.data() to check since userData takes a while to set

		    if (doc.data() != null) {
		        if (doc.data().userType_d == "artist")
			{
			    setIsArtist(true);

			    setBio(doc.data().artistBio);
			}

			setUserName(doc.data().username_d);
			setEmail(doc.data().email_d);

			if (loading)
			{
			    setLoading(false);
			}
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
		{isArtist &&
		    <>
			<Text> Bio </Text>
			<TextInput
			    style = {styles.input}
			    numberOfLine= {4}
			    multiline
			    value={bio}
			    onChangeText = {(text) => setBio(text)}
			    underlineColorAndroid = 'transparent'
			    autoCapitalize = 'none'
			/>
			{banner != null &&
			    <>
				<Image
				    style = {styles.logo}
				    source = {{
					uri: banner.uri,
				    }}
				/>
			    </>
			}
			<TouchableOpacity
			    style={styles.button}
			    onPress={onFileChange}>
			    <Text style={styles.buttonTitle}>
				Upload an image
			    </Text>
			</TouchableOpacity>
		    </>
		}
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
