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
      	    <Text style={styles.text}>You don't have any saved songs...yet!</Text>
      	);
    }
}

export default function LibraryScreen({ navigation })
{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { user } = useContext(AuthContext);
    const savedSongsRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('savedSongs');

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

    return (
            <View style={styles.container}>
                {loading ? <Loading/> : (
                    <DisplayList data={data} navigation={navigation}/>
                )}
            </View>
    )
}
