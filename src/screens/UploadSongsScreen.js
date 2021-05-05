import  React, { useState, useContext, useEffect } from 'react';
import { 
    Text, View, TouchableOpacity, 
    TextInput, Button, FlatList, ScrollView,
    Pressable, Modal,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import Loading  from '../components/Loading';
import styles from './styles';

export default function UploadSongsScreen({ navigation, route })
{
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [data, setData] = useState([]);
    const [files, setFiles] = useState([]);

    const { user } = useContext(AuthContext);
    const { contentID } = route.params;

    const songStorageRef = firebase.storage().ref('songs/');
    const contentRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent').doc(contentID);
    const songsRef = firebase.firestore().collection('songs');

    const addFiles = async () => {
        setModalVisible(true);
        // adds song data objects to data
        // lets user select files to upload
    }

    const uploadSongs = async (data, navigation) => {
        if (data.length > 0) {
        	data.forEach(song => {
                const songData = {
                    access: song.access,
                    songTitle: song.songTitle,
                    songURL: song.songURL,
                    artistID: [user.uid],
                    artistName: [user.displayName],
                    publicMeta: {
                        duration: song.duration,
                        genre: song.genres,
                        numOfSaves: 0,
                        onPlaylists: 0,
                        plays: 0,
                        published: firebase.firestore.Timestamp.now(),
                    }
                };
    	    	try {
                    const newSong = songsRef.add(songData);
                    console.log("Successfully added song to firestore with ID:", newSong.id);
    	    		contentRef.update({
    	  				songs: {
                            [newSong.id]: firebase.firestore.FieldValue.arrayUnion(newSong.data().songTitle),
                        }
    				});
    	    	} catch (e) {
    	    		console.log(e);
    	    	}
        	});
            navigation.navigate('Library');
        } else {
            alert("No songs were uploaded!");
        }
    }

    return (
            <View style={styles.container}>
                {loading ? <Loading/> : (
                	<View style={styles.container}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>Hello World!</Text>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={() => setModalVisible(!modalVisible)}
                                    >
                                        <Text style={styles.textStyleModal}>Hide Modal</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>
                        <TouchableOpacity
                            style={styles.button}
                            key="uploadFiles"
                            onPress={() => addFiles()}>
                            <Text style={styles.buttonTitle}>Select File</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            key="cancel"
                            onPress={() => navigation.navigate('Library')}>
                            <Text style={styles.buttonTitle}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Songs to be Uploaded:</Text>
                		<KeyboardAwareScrollView key="scrollList" style={{ width:"95%", padding: 2 }}>
                            {data.map(song => 
                                <Card key={song.id} style={{
                                    width: "100%",
                                    margin: 5,
                                }}>
                                    <Card.Content>
                                        <Title>{song.songTitle}</Title>
                                        <Paragraph>Artist: {song.artistName}</Paragraph>
                                        <Paragraph>Access: {song.access}</Paragraph>
                                        <Paragraph>Duration: {song.publicMeta.duration}</Paragraph>
                                        <Paragraph>Genre: {song.publicMeta.genre}</Paragraph>
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
    	                    <TouchableOpacity
    		                    style={styles.button}
    		                    key="addSongsToPlaylist"
    		                    onPress={() => uploadSongs(data, navigation)}>
    		                    <Text style={styles.buttonTitle}>Add Songs to Playlist</Text>
    		                </TouchableOpacity>
                        </KeyboardAwareScrollView>
	                </View>
                )}
            </View>
    )
}