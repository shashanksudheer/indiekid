import  React, { useState, useContext, useEffect } from 'react';
import { Text, View, TextInput, Button, FlatList } from 'react-native';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import Loading  from '../components/Loading';
import styles from './styles';

function DisplayList({ data, navigation }) {
	//console.log(data);
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
      	    <Text style={styles.text}>You don't have any saved songs...yet!</Text>
      	);
    }
}

export default function LibraryScreen({ navigation })
{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {
    	const savedSongs = [];
        firebase.firestore().collection('users')
        .doc(user.uid).collection('savedSongs')
        .get().then((querySnapshot) => {
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
                {loading ? <Loading/> : (
                    <DisplayList data={data} navigation={navigation}/>
                )}
            </View>
    )
}
