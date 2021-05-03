import React, { useState, useContext, useEffect } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loading  from '../components/Loading';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import styles from './styles';
// displays a playlist. if owner of playlist accesses playlist page, then
// add songs button shows.
// MAJOR DATA FETCHING BUG HERE
function DisplayList({ data, navigation }) {
    console.log(data);
    if (data.length !== 0) {
        return (
            <FlatList
                data={data}
                keyExtractor={({ id }, index) => id}
                renderItem={({ item }) => (
                    <Text style={styles.text}>
                        {item.songTitle} by{' '}
                        <Text
                            style={styles.textButton}
                            onPress={() => {
                                navigation.navigate('ArtistPage', {
                                    artistID: item.artistID,
                                    artistName: item.artistName,
                                });
                        }}>
                        {item.artistName}
                        </Text>
                    </Text>
                )}
            />
        );
    } else {
        return (
            <Text style={styles.text}>This playlist doesn't have any songs...yet!</Text>
        );
    }
}

export default function PlaylistScreen({ navigation, route })
{
    const { user } = useContext(AuthContext);
    const { playlistID } = route.params;
    const [loading, setLoading] = useState(true);
    const [songIDs, setSongIDs] = useState([]);
    const [data, setData] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
// check ownership
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
    }, []);
// fetch songs from playlist
    useEffect(() => {
        const savedSongs = [];
        firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent')
        .doc(playlistID)
        .get().then((querySnapshot) => {
            console.log("From playlist:", querySnapshot.data().songs)
            setSongIDs(querySnapshot.data().songs);
            console.log("from songIDs:", songIDs);
        }).then(() => {
            // fetch songs for songs collection
            if (songIDs.length > 0) {
                console.log("There are songs:", songIDs);
                firebase.firestore().collection('songs')
                .where(firebase.firestore.FieldPath.documentId(), 'in', songIDs).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((song) => {
                        // song.data() is never undefined for query doc snapshots
                        let currentID = song.id;
                        console.log(currentID);
                        let appObj = { ...song.data(), ['id']: currentID };
                        savedSongs.push(appObj);
                    });
                    setData(savedSongs);
                })
                .catch((e) => console.log("Error getting documents: ", e))
            }
        })
        .catch((e) => console.log("Error getting documents: ", e))
        .finally(() => setLoading(false))
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
            ), ( <DisplayList data={data} navigation={navigation}/> )
            ]
        }
        </View>
    )
}
