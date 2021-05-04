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
        text: 'private single',
    },
    {
        key: 'public',
        text: 'public single',
    },
];

export default function NewContentScreen({navigation})
{
    const [singleName, setSingleName] = useState('');
    const [credits, setCredits] = useState('');
    const [access, setAccess] = useState('private');

    const { user } = useContext(AuthContext);

    const onSelect = (item) => {
        setAccess(item.key);
    };

    const makeSingle = async (singleName, credits, access) => {
        const data = {
            access: access,
            contentName: singleName,
            contentType: 'single',
            credits: credits,
            duration: 0,
            published: firebase.firestore.Timestamp.now(),
            songs: []
        };
        console.log(data);
        try {
            await firebase.firestore().collection('users')
            .doc(user.uid).collection('audioContent')
            .add(data)
            .then((result) => {
            // creates the playlist in the user's audioConetent collection in firestore
                console.log("Successfully added new single with ID:", result.id);
                alert("Single called \""+singleName+"\" was created.")
                navigation.navigate('UploadSongs', { contentID: result.id,
                     contentName: result.contentName });
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
                    placeholder='New Single'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setSingleName(text)}
                    value={singleName}
                    underlineColorAndroid="transparent"
                />
                <TextInput
                    style={styles.longInput}
                    multiline={true}
                    placeholder='Credits'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setCredits(text)}
                    value={credits}
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
                    onPress={() => {
                        if (singleName === '') {
                            alert("Single must have a name");
                        } else {
                            makeSingle(singleName, credits, access);
                        }
                    }
                }>
                    <Text style={styles.buttonTitle}>Upload Songs</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
        </View>
    )
}