import React, { useState, useContext, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import Loading  from '../components/Loading';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import styles from './styles';
// displays a playlist. if owner of playlist accesses playlist page, then
// add songs button shows.

export default function PlaylistScreen({ navigation, route })
{
    const { user } = useContext(AuthContext);
    const { playlistID, contentName } = route.params;

    const [loadingSongIDs, setLoadingSongIDs] = useState(true);
    const [loading, setLoading] = useState(true);
    const [songIDs, setSongIDs] = useState([]);
    const [data, setData] = useState([]);
    const [isOwner, setIsOwner] = useState(false);

    const userRef = firebase.firestore().collection('users');
    const playlistRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent').doc(playlistID);
    const audioContentRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent');
    const songsQueryRef = firebase.firestore().collection('songs');

// clear states on load
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', () => {
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
        return playlistRef.onSnapshot(result => {
            if (result.data().ownerID === user.uid) {
                console.log("ownership matched");
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

    const removeFromPlaylist = async (songID, songTitle) => {
        try {
            playlistRef.update({
                songs: firebase.firestore.FieldValue.arrayRemove(songID),
            });
            alert(songTitle + " was removed from the playlist");
        } catch (e) {
            console.log(e);
        }
    }
    const savePlaylist = async (playlistID) => {
        try {
            playlistRef.update({
                songs: firebase.firestore.FieldValue.arrayRemove(songID),
            });
            alert(songTitle + " was removed from the playlist");
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <View style={styles.container}>
        {loading ? <Loading/> :
            [(isOwner ?
                <TouchableOpacity
                    key="addSongs"
                    style={styles.button}
                    onPress={() => navigation.navigate("AddSongsToPlaylist", { playlistID, contentName })}>
                    <Text style={styles.buttonTitle}>Add Songs</Text>
                </TouchableOpacity> :
                <TouchableOpacity
                    style={styles.button}
                    key="save"
                    onPress={() => alert("Save")}>
                    <Text style={styles.buttonTitle}>Save</Text>
                </TouchableOpacity>
            ), ( <ScrollView key="scrollList" style={{ width:"95%", padding: 2 }}>
                        {data.map(song => 
                            <Card key={song.id} style={{
                                width: "100%",
                                margin: 5,
                            }}>
                                <Card.Content>
                                    <Title>{song.songTitle}</Title>
                                    <Paragraph>{song.artistName}</Paragraph>
                                </Card.Content>
                                <Card.Actions>
                                    <Button 
                                    mode="default"
                                    onPress={() => {
                                            navigation.navigate('Discography', {
                                                contentID: song.id,
                                                contentName: song.songTitle,
                                            });
                                    }}>Go to Song</Button>
                                    <Button
                                    disabled={!isOwner}
                                    mode="default"
                                    onPress={() => removeFromPlaylist(song.id, song.songTitle)}>Remove</Button>
                                </Card.Actions>
                            </Card>
                        )}
                    </ScrollView> )
            ]
        }
        </View>
    )
}
