import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

import { firebase } from '../firebase/config';
// similar to spotify, display top five most popular songs, followed
// by artist media, then links to albums, EPs, singles, and artist curated playlists.
const usersCollectionRef = firebase.firestore().collection('users');

export default function ArtistPageScreen( {navigation, route} )
{
	const { ID } = route.params;
	console.log(ID);
	try {
		const idDoc = usersCollectionRef.doc(ID).get();
		if (!idDoc.exists) {
            console.log('No such document!');
        } else {
            console.log('Document data:', idDoc.data());
        }
	} catch(e) {
		console.log(e);
	}
    return (
        <View style={styles.container}>
            <Text> Artist Page </Text>
            <Text>artistId: {JSON.stringify(ID)}</Text>
        </View>
    )
}
