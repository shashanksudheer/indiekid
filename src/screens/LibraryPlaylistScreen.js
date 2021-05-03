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
                        style={styles.textButton}
                        key={item.id}
                        onPress={() => {
                            navigation.navigate('playlistScreen', {playlistID: item.id});
                    }}>
                    {item.contentName}
                    </Text>
                )}
            />
        );
    } else {
        return (
      	    <Text style={styles.text}>You don't have any playlists...yet!</Text>
      	);
    }
}

export default function LibraryScreen({ navigation })
{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { user } = useContext(AuthContext);
    const playlistsRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent')
        .where("contentType", "==", "playlist");

    useEffect(() => {
        return playlistsRef.onSnapshot(querySnapshot => {
            const playlists = [];
            querySnapshot.forEach(playlist => {
                const { contentName, songs, access, published } = playlist.data();
                playlists.push({
                    id: playlist.id,
                    contentName,
                    access,
                    published,
                    songs,
                });
            });
            setData(playlists);
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
