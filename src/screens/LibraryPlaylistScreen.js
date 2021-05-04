import  React, { useState, useContext, useEffect } from 'react';
import { Text, View, ScrollView, TextInput, FlatList } from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import Loading  from '../components/Loading';
import styles from './styles';

export default function LibraryScreen({ navigation })
{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { user } = useContext(AuthContext);
    const userRef = firebase.firestore().collection('users').doc(user.uid);
    const playlistsRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent')
        .where("contentType", "==", "playlist");

    useEffect(() => {
        return playlistsRef.onSnapshot(querySnapshot => {
            const playlists = [];
            querySnapshot.forEach(playlist => {
                const { contentName, songs, access, published, ownerID, ownerName } = playlist.data();
                playlists.push({
                    id: playlist.id,
                    contentName,
                    access,
                    published,
                    songs,
                    ownerID,
                    ownerName,
                });
            });
            setData(playlists);
            if(loading) {
                setLoading(false);
            }
        });
    }, []);

    const deletePlaylist = async (playlistID, contentName) => {
        try {
            userRef.collection('audioContent').doc(playlistID).delete();
            alert(contentName + " was deleted");
        } catch (e) {
            console.log(e);
        }
    }

    return (
            <View style={styles.container}>
                {loading ? <Loading/> : (
                    <ScrollView style={{ width:"95%", padding: 2 }}>
                        {data.map(playlist => 
                            <Card key={playlist.id} style={{
                                width: "100%",
                                margin: 5,
                            }}>
                                <Card.Content>
                                    <Title>{playlist.contentName}</Title>
                                    <Paragraph>{playlist.ownerName}</Paragraph>
                                </Card.Content>
                                <Card.Actions>
                                    <Button 
                                    mode="default"
                                    onPress={() => {
                                            navigation.navigate('playlistScreen', {
                                                playlistID: playlist.id,
                                                contentName: playlist.contentName
                                            });
                                    }}>Go to Playlist</Button>
                                    <Button
                                    disabled={playlist.ownerID !== user.uid}
                                    mode="default"
                                    onPress={() => deletePlaylist(playlist.id, playlist.contentName)}>Delete</Button>
                                </Card.Actions>
                            </Card>
                        )}
                    </ScrollView>
                )}
            </View>
    )
}
