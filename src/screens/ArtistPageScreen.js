import React, { useContext, useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { firebase } from '../firebase/config';
import Loading  from '../components/Loading';
import styles from './styles';

// similar to spotify, display top five most popular songs, followed
// by artist media, then links to albums, EPs, singles, and artist curated playlists.
const usersRef = firebase.firestore().collection('users');
var userPage = null;

export default function ArtistPageScreen( {navigation, route} )
{
	const [loading, setLoading] = useState(true);
	const { artistID } = route.params;
    useEffect(() => {
		usersRef.doc(artistID).get()
		.then((doc) => { // YOU NEED TO WAIT FOR get() to return
		    if (!doc.exists) {
                console.log('User not found');
            } else {
                //console.log('User found');
                userPage = doc.data(); // there might be some kind of bug here
            }})
        .catch((e) => console.error(e))
		.finally(() => setLoading(false));
    }, []);

	if (loading) {
		return <Loading />
	} else {
		return (
            <View style={styles.container}>
                <Text style={styles.title}> {userPage.username_d} </Text>
            </View>
    )
	}
}
