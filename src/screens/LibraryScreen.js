import  React, { useState, useContext, useEffect } from 'react';
import { Text, View, ScrollView, TextInput, FlatList } from 'react-native';
import { Button, Card, IconButton, Title, Paragraph } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import Loading  from '../components/Loading';
import styles from './styles';

export default function LibraryScreen({ navigation })
{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { user } = useContext(AuthContext);
    const savedSongsRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('savedSongs');
    const userRef = firebase.firestore().collection('users').doc(user.uid);

    useEffect(() => {
        return savedSongsRef.onSnapshot(querySnapshot => {
            const savedSongs = [];
            querySnapshot.forEach(song => {
                const { songTitle, artistID, artistName } = song.data();
                savedSongs.push({
                    id: song.id,
                    songTitle,
                    artistName,
                    artistID,
                });
            });
            setData(savedSongs);
            if(loading) {
                setLoading(false);
            }
        });
    }, []);

    const unSaveSong = async (songID, songTitle) => {
        try {
            userRef.collection('savedSongs').doc(songID).delete();
            alert("Song unsaved!");
        } catch (e) {
            console.log(e);
        }
    }
    const handlePlay = (songID) => {
        navigation.navigate('AudioPlayer', {
            songID: songID,
        });
    }
    return (
            <View style={styles.container}>
                {loading ? <Loading/> : (
                    <ScrollView 
                    style={styles.ScrollView}
                    showsVerticalScrollIndicator={false}>
                        {data.map(song => 
                            <Card key={song.id} style={{
                                width: "100%",
                                margin: 5,
                            }}>
                                <Card.Content>
                                    <Title>{song.songTitle}</Title>
                                    <Paragraph>{song.artistName}</Paragraph>
                                    <IconButton
                                        icon="play"
                                        color="#4F5FA0"
                                        onPress={() => handlePlay(song.id)}>
                                        </IconButton>
                                    <Button 
                                    mode="contained"
                                    style={{margin: 10}}
                                    onPress={() => unSaveSong(song.id, song.songTitle)}>Unsave</Button>
                                </Card.Content>
                                <Card.Actions>
                                    <Button 
                                    mode="default"
                                    onPress={() => {
                                            navigation.navigate('ArtistPage', {
                                                artistID: song.artistID,
                                                artistName: song.artistName,
                                            });
                                    }}>Go to Artist</Button>
                                </Card.Actions>
                            </Card>
                        )}
                    </ScrollView>
                )}
            </View>
    )
}
