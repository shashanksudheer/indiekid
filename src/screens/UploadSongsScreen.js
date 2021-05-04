import  React, { useState, useContext, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import Loading  from '../components/Loading';
import styles from './styles';

export default function UploadSongsScreen({ navigation, route })
{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const { user } = useContext(AuthContext);
    const { contentID } = route.params;

    const songStorageRef = firebase.storage().ref().child('songs/');
    const contentRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent').doc(contentID);
    const songsRef = firebase.firestore().collection('songs');

    useEffect(() => {
        return;
    }, []);

    const addSongs = async (data, navigation) => {
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
                    console.log("Successfully added song with ID:", newSong.id);
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
                		<SelectMultiple
                			items={data}
                			selectedItems={selected}
                			onSelectionsChange={onSelectionsChange}
                		/>
	                    <TouchableOpacity
		                    style={styles.button}
		                    key="addSongsToPlaylist"
		                    onPress={() => addSongs(selected, navigation)}>
		                    <Text style={styles.buttonTitle}>Add Songs to Playlist</Text>
		                </TouchableOpacity>
	                </View>
                )}
            </View>
    )
}