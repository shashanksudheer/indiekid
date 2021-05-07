import React, { useContext, useState, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal, } from 'react-native';
import { Button, IconButton, Card, Title, Paragraph, List, Divider, TextInput } from 'react-native-paper';
import { firebase } from '../firebase/config';
import { AuthContext } from '../navigation/AuthProvider';
import Loading  from '../components/Loading';
import styles from './styles';

export default function ArtistPageScreen({ navigation, route })
{
	const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [loading3, setLoading3] = useState(true);
    const [loading4, setLoading4] = useState(true);
	const [artistData, setArtistData] = useState(null);
    const [mostPopular, setMostPopular] = useState([]);
    const [releases, setReleases] = useState([]);
    const [artistPlaylists, setArtistPlaylists] = useState([]);
    const [openPaymentPortal, setOpenPaymentPortal ] = useState(false);

	const { artistID, artistName } = route.params;
    const { user } = useContext(AuthContext);

    const userRef = firebase.firestore().collection('users');
    const songsRef = firebase.firestore().collection('songs')
        .where('artistID', 'array-contains', artistID);

    useEffect(() => {
        return userRef.doc(artistID).onSnapshot(doc => {
            if (!doc.exists) {
                console.log('Artist Page: User not found');
            } else {
                const userDoc = doc.data();
                setArtistData(userDoc);
            }
            // console.log(artistData);
            if(loading1) {
                setLoading1(false);
            }
        });
    }, []);
    useEffect(() => {
        const songs = [];
        return songsRef.onSnapshot(querySnapshot => {
                querySnapshot.forEach(song => {
                    const { artistID, artistName, 
                        songTitle, publicMeta } = song.data();
                    songs.push({
                        id: song.id,
                        publicMeta,
                        artistID, artistName, 
                        songTitle,
                    });
                });
                console.log(songs);
                songs.sort((a, b) => b.publicMeta.plays - a.publicMeta.plays);
                setMostPopular(songs.splice(0, 5));
                if(loading2) {
                    setLoading2(false);
                }
            });
    }, []);
    useEffect(() => {
        const contents = [];
        return userRef.doc(artistID).collection('audioContent').where('contentType', '!=', 'playlist').onSnapshot(querySnapshot => {
                querySnapshot.forEach(content => {
                    const { access, contentName, 
                        contentType, published } = content.data();
                    if (access === 'public') {
                        contents.push({
                            id: content.id,
                            access,
                            contentName,
                            contentType,
                            published,
                        });
                    }
                });
                console.log(contents);
                setReleases(contents.splice(0, 5));
                if(loading3) {
                    setLoading3(false);
                }
            });
    }, []);
    useEffect(() => {
        const playlists = [];
        return userRef.doc(artistID).collection('audioContent').where('contentType', '==', 'playlist').onSnapshot(querySnapshot => {
                querySnapshot.forEach(content => {
                    const { access, contentName, 
                        published } = content.data();
                    if (access === 'public') {
                        playlists.push({
                            id: content.id,
                            access,
                            contentName,
                            published,
                        });
                    }
                });
                console.log(playlists);
                setArtistPlaylists(playlists.splice(0, 5));
                if(loading4) {
                    setLoading4(false);
                }
            });
    }, []);

    const saveSong = async (songID, artistID, songTitle, artistName) => {
        const data = {
            artistID: artistID,
            artistName: artistName,
            songTitle: songTitle,
        }
        try {
            userRef.doc(user.uid).collection('savedSongs').doc(songID).set(data);
            console.log("saved");
        } catch (e) {
            console.log(e);
        }
    }
    const handlePlay = (songID) => {
        alert("play");
    }
    const goToDisco = (contentID, contentName) => {
        alert("to album page");
    }
    const goToPlaylist = (contentID, contentName) => {
        navigation.navigate('playlistScreen', {
            playlistID: contentID,
            contentName: contentName
        });
    }

	return (
            <View style={{ flex: 0, padding: 35, paddingBottom: 200 }}>
            {loading1 || loading2 || loading3 || loading4 ? <Loading/> : (
                <View>

                    <Modal visible={openPaymentPortal} animationType='slide'>
                        <Card style={{display: "flex", flex: 0, paddingTop: 100, }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={20}>
                            <Text style={{ fontSize: 20, marginLeft: 40, marginRight: 40, marginBottom: 40}}>Enter Payment Information</Text>
                            <TextInput
                                style={{height: 40, marginLeft: 40, marginRight: 40 }}
                                placeholder="Name on Card"
                            />
                            <TextInput
                                style={{height: 40, marginLeft: 40, marginRight: 40 }}
                                placeholder="Card Number"
                            />
                            <TextInput
                                style={{height: 40, marginLeft: 40, marginRight: 40 }}
                                placeholder="Expiry Date"
                            />
                            <TextInput
                                style={{height: 40, marginLeft: 40, marginRight: 40, marginBottom: 10 }}
                                placeholder="CVC"
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setOpenPaymentPortal(false)}>
                                <Text style={styles.buttonTitle}>Submit Payment</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setOpenPaymentPortal(false)}>
                                <Text style={styles.buttonTitle}>Cancel</Text>
                            </TouchableOpacity>
                        </Card>
                    </Modal>

                    <Text style={styles.title}>{artistName}</Text>
                    <ScrollView
                    style={styles.ScrollView}
                    showsVerticalScrollIndicator={false}>
                        <List.Section>
                            <List.Subheader style={styles.sectionTitle}>Popular</List.Subheader>
                            <Divider />
                            {mostPopular.map(song =>
                                <List.Item 
                                    key={song.id} 
                                    style={{
                                        width: "100%",
                                        margin: 5,
                                    }}
                                    title={song.songTitle}
                                    description={song.publicMeta.plays.toString()}
                                    left={props => 
                                    <IconButton
                                        icon="play"
                                        color="#4F5FA0"
                                        onPress={() => handlePlay(song.id)}>
                                        </IconButton>}
                                    right={props => 
                                        <IconButton
                                        icon="heart"
                                        color="#F89090"
                                        onPress={() => saveSong(song.id, artistID, song.songTitle, artistName)}>
                                        </IconButton>}
                                    onPress={() => alert("To Discography")}
                                />
                            )}
                        </List.Section>
                        <List.Section>
                            <List.Subheader style={styles.sectionTitle}>Releases</List.Subheader>
                            <Divider />
                            {releases.map(content =>
                                <List.Item 
                                    key={content.id} 
                                    style={{
                                        width: "100%",
                                        margin: 5,
                                    }}
                                    title={content.contentName}
                                    description={content.contentType.toUpperCase()}
                                    left={props => <List.Icon {...props} icon="music" />}
                                    right={props => 
                                        <Button
                                        style={{height: 35.5}}
                                        mode="outlined"
                                        onPress={() => goToDisco(content.id, content.contentName)}>See Songs
                                        </Button>}
                                />
                            )}
                        </List.Section>
                        <List.Section>
                            <List.Subheader style={styles.sectionTitle}>Artist Playlists</List.Subheader>
                            <Divider />
                            {artistPlaylists.map(playlist =>
                                <List.Item 
                                    key={playlist.id} 
                                    style={{
                                        width: "100%",
                                        margin: 5,
                                    }}
                                    title={playlist.contentName}
                                    description={playlist.published.toDate().getFullYear().toString()}
                                    left={props => <List.Icon {...props} icon="disc" />}
                                    right={props => 
                                        <Button
                                        style={{height: 35.5}}
                                        mode="outlined"
                                        onPress={() => goToPlaylist(playlist.id, playlist.contentName)}>See Playlist
                                        </Button>}
                                />
                            )}
                        </List.Section>
                        <List.Section>
                            <List.Subheader style={styles.sectionTitle}>About</List.Subheader>
                            <Divider />
                            <List.Item 
                                    key={"artistBio"} 
                                    style={{
                                        width: "100%",
                                        margin: 1,
                                    }}
                                    title={artistData.artistBio}
                                />
                        </List.Section>
                        <List.Section>
                        <TouchableOpacity
                                style={styles.button}
                                onPress={() => setOpenPaymentPortal(true)}>
                            <Text style={styles.buttonTitle}>Subscribe to Artist</Text>
                        </TouchableOpacity>
                        </List.Section>
                    </ScrollView>
                </View>
            )}
            </View>
    )
}
