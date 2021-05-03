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

    useEffect(() => {
    	const playlists = [];
        firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent')
        .where("contentType", "==", "playlist")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((playlist) => {
                // playlist.data() is never undefined for query doc snapshots
                let currentID = playlist.id;
                let appObj = { ...playlist.data(), ['id']: currentID };
                playlists.push(appObj);
            });
            setData(playlists);
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
