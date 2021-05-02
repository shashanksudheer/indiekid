import React, { useState, useContext } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthContext } from '../navigation/AuthProvider';
import RadioButton from '../components/RadioButton';
import { firebase } from '../firebase/config';
import styles from './styles';

const RadioOptions = [
    {
        key: 'private',
        text: 'private playlist',
    },
    {
        key: 'public',
        text: 'public playlist',
    },
];

export default function NewContentScreen({navigation})
{
    const [playlistName, setPlaylistName] = useState('');
    const [access, setAccess] = useState('private');

    const { user } = useContext(AuthContext);

    const onSelect = (item) => {
        setAccess(item.key);
    };

    const makePlaylist = async (playlistName, access) => {
        const data = {
            access: access,
            contentName: playlistName,
            contentType: 'playlist',
            published: firebase.firestore.Timestamp.now(),
            songs: {}
        };
        const privData = {
            owner: user.uid,
            editors: []
        };
        console.log(data);
        try {
            await firebase.firestore().collection('users')
            .doc(user.uid).collection('audioContent')
            .add(data)
            .then( async (result) => {
            // creates the playlist in the user's audioConetent collection in firestore
                console.log("Successfully added new playlist with ID:", result.id);
                try {
                    await firebase.firestore().collection('users').doc(user.uid)
                    .collection('audioContent').doc(result.id)
                    .collection('private').doc('private').set(privData);
                } catch (e) {
                    console.log(e);
                }
                navigation.navigate('playlistScreen', {playlistID: result.id});
            }).catch((e) => {
                alert(e);
                console.log(e);
            });
        } catch (e) {
          alert(e);
          console.log(e);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <TextInput
                    style={styles.input}
                    placeholder='New Playlist'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setPlaylistName(text)}
                    value={playlistName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Text style={styles.text}>This is a</Text>
                <RadioButton
                    selectedOption={access}
                    onSelect={onSelect}
                    options={RadioOptions}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => makePlaylist(playlistName, access)}>
                    <Text style={styles.buttonTitle}>Create Playlist</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}