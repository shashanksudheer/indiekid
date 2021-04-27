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
    const [songs, setSongs] = useState([]);
    const [access, setAccess] = useState('private');

    const { register } = useContext(AuthContext);

    const onSelect = (item) => {
        setAccess(item.key);
    };

    const makePlaylist = (playlistName, access, songs) => {
        alert("making playlist");
        console.log(playlistName);
        console.log(access);
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                <TextInput
                    style={styles.input}
                    placeholder='Playlist Name'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setPlaylistName(text)}
                    value={playlistName}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <Text style={styles.text}>adding songs here</Text>
                <Text style={styles.text}>This is a</Text>
                <RadioButton
                    selectedOption={access}
                    onSelect={onSelect}
                    options={RadioOptions}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => makePlaylist(playlistName, access, songs)}>
                    <Text style={styles.buttonTitle}>Create Playlist</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}