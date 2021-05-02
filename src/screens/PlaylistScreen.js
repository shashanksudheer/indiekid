import React, { useState, useContext, useEffect } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loading  from '../components/Loading';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import styles from './styles';
// displays a playlist. if owner of playlist accesses playlist page, then
// add songs button shows.

export default function PlaylistScreen({ navigation, route })
{
    const { user } = useContext(AuthContext);
    const { playlistID } = route.params;
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);
    useEffect(() => {
        firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent')
        .doc(playlistID).collection('private')
        .doc('private').get()
        .then((result) => {
            if (result.data().owner === user.uid) {
                console.log("ownership matched")
                setIsOwner(true);
            }
        })
        .catch((e) => console.log(e))
        .finally(() => setLoading(false));
    }, []);
    return (
        <View style={styles.container}>
        {loading ? <Loading/> :
            [(isOwner ?
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => alert("bloop")}>
                    <Text style={styles.buttonTitle}>Add Songs</Text>
                </TouchableOpacity> :
                <Text>save</Text>
            ),
            ]
        }
        </View>
    )
}
