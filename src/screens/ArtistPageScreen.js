import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

import { firebase } from '../firebase/config';
// similar to spotify, display top five most popular songs, followed
// by artist media, then links to albums, EPs, singles, and artist curated playlists.

export default function ArtistPageScreen({navigation, route})
{
	const { artistId } = route.params;
    return (
        <View style={styles.container}>
            <Text> Artist Page </Text>
            <Text>artistId: {JSON.stringify(artistId)}</Text>
        </View>
    )
}
