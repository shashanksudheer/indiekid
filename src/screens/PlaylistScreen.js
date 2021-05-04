import React, { useState, useContext, useEffect } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Loading  from '../components/Loading';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import styles from './styles';
// displays a playlist. if owner of playlist accesses playlist page, then
// add songs button shows.
function DisplayList({ data, navigation }) {
    if (data.length !== 0) {
        return (
            <FlatList
                data={data}
                keyExtractor={({ id }, index) => id}
                renderItem={({ item }) => (
                    <Text 
                        style={styles.text}
                        key={item.id}>
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

    const [loadingSongIDs, setLoadingSongIDs] = useState(true);
    const [loading, setLoading] = useState(true);
    const [songIDs, setSongIDs] = useState([]);
    const [data, setData] = useState([]);
    const [isOwner, setIsOwner] = useState(false);

    const ownershipRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent')
        .doc(playlistID).collection('private').doc('private');
    const playlistRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent').doc(playlistID);
    const songsQueryRef = firebase.firestore().collection('songs');

// clear states on load
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            console.log("in listener")
            setIsOwner(false);
            setSongIDs([]);
            setData([]);
            setLoadingSongIDs(true);
            setLoading(true);
        });
        return unsubscribe;
    }, [navigation]);
// check ownership
    useEffect(() => {
        return ownershipRef.onSnapshot(result => {
            if (result.data().owner === user.uid) {
                console.log("ownership matched")
                setIsOwner(true);
            }
        });
    }, []);
// fetch songs from playlist
    useEffect(() => {
        return playlistRef.onSnapshot(querySnapshot => {
            const songIDArray = querySnapshot.data().songs;
            console.log(songIDArray);
            setSongIDs(songIDArray);
            if(loadingSongIDs) {
                console.log("loaded song array of size:", songIDs.length);
                setLoadingSongIDs(false);
            }
        });
    }, []);
    useEffect(() => {
        if (songIDs.length > 0) {
            return songsQueryRef
            .where(firebase.firestore.FieldPath.documentId(), 'in', songIDs)
            .onSnapshot(querySnapshot => {
                const songs = [];          
                querySnapshot.forEach(song => {
                    const { access, artistID, artistName, 
                        publicMeta, songTitle, songURL } = song.data();
                    songs.push({
                        id: song.id,
                        access, artistID, artistName, 
                        publicMeta, songTitle, songURL,
                    });
                });
                setData(songs);
                console.log("set data");
                if (loading) {
                    console.log("finished loading data");
                    setLoading(false);
                }
            });
        } else {
            return (() => { 
                if(loading) {
                    console.log("no data to load");
                    setLoading(false);
                }
            });
        }
    }, [!loadingSongIDs]);

    return (
        <View style={styles.container}>
        {loading ? <Loading/> :
            [(isOwner ?
                <TouchableOpacity
                    key="addSongs"
                    style={styles.button}
                    onPress={() => navigation.navigate("AddSongsToPlaylist", { playlistID })}>
                    <Text style={styles.buttonTitle}>Add Songs</Text>
                </TouchableOpacity> :
                <TouchableOpacity
                    style={styles.button}
                    key="save"
                    onPress={() => alert("Save")}>
                    <Text style={styles.buttonTitle}>Save</Text>
                </TouchableOpacity>
            ), ( <DisplayList key="DisplayListPlaylist" data={data} navigation={navigation}/> )
            ]
        }
        </View>
    )
}
