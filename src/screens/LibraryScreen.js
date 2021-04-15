import  React, { useState, useContext, useEffect } from 'react';
import { Text, View, TextInput, Button, FlatList } from 'react-native';
import 'react-native-gesture-handler';
import Loading  from '../components/Loading';
import { AuthContext } from '../navigation/AuthProvider';
import styles from './styles';

import { firebase } from '../firebase/config';

// shows a button at the top right to create new content, both 
// kinds of users can see this

export default function LibraryScreen( { navigation } )
{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {
    	const savedSongs = [];
        firebase.firestore().collection('users').doc(user.uid).collection('savedSongs')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((song) => {
                // song.data() is never undefined for query doc snapshots
                let currentID = song.id;
                let appObj = { ...song.data(), ['id']: currentID };
                savedSongs.push(appObj);
            });
            setData(savedSongs);
        })
        .catch((e) => console.log("Error getting documents: ", e))
        .finally(() => setLoading(false));
    }, []);

    return (
            <View style={styles.container}>
                <Text style={styles.text}>My Library</Text>
                {loading ? <Loading/> : (
                    <FlatList
                        data={data}
                        keyExtractor={({ id }, index) => id}
                        renderItem={({ item }) => (
                            <Text style={styles.text}>
                                {item.songTitle} by
                                <Button
                                    style={styles.text}
                                    title={item.artistName}
                                    onPress={() => {
                                	    navigation.navigate('ArtistPage', {
                                		    artistID: item.artistID,
                                	    });
                                    }}
                            />
                            </Text>
                        )}
                    />
                )}
            </View>
    )
}
