import  React, { useState, useContext, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput, Button, FlatList } from 'react-native';
import SelectMultiple from 'react-native-select-multiple'
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import Loading  from '../components/Loading';
import styles from './styles';

export default function AddSongsPlaylistScreen({ navigation, route })
{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState([]);

    const { user } = useContext(AuthContext);
    const { playlistID } = route.params;

    const savedSongsRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('savedSongs');
    const playlistRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent').doc(playlistID);

    const onSelectionsChange = (selected) => {
    	setSelected(selected);
    }

    useEffect(() => {
        return savedSongsRef.onSnapshot(querySnapshot => {
            const savedSongs = [];
            querySnapshot.forEach(song => {
				if(song.id) {
					const { songTitle, artistName } = song.data();
	                const songLabel = songTitle + ' ' + 'by' + ' ' + artistName;
	                savedSongs.push({
	                	label: songLabel,
	                    value: song.id,
                        extraData: songTitle,
	                });
		        }
            });
            setData(savedSongs);
            if(loading) {
                setLoading(false);
            }
        });
    }, []);

    const addSongs = async (selected, navigation) => {
        if (selected.length > 0) {
        	selected.forEach(select => {
    	    	try {
    	    		playlistRef.update({
    	  				songs: firebase.firestore.FieldValue.arrayUnion(select.value)
    				});
    	    	} catch (e) {
    	    		console.log(e);
    	    	}
        	});
            navigation.navigate('playlistScreen');
        } else {
            alert("No songs selected. If none are available, go save some songs!");
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