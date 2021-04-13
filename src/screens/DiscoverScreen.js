import  React, { useState, useContext } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import 'react-native-gesture-handler';
import { AuthContext } from '../navigation/AuthProvider';
import styles from './styles';

import { firebase } from '../firebase/config';
// search bar is implemented here, discover lists underneath the search bar.

export default function DiscoverScreen( {navigation} )
{
	const { user } = useContext(AuthContext);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Discover</Text>
	        <Button
	            title="Go to Artist Page"
	            onPress={() => {
	                navigation.navigate('ArtistPage', {
	                    artistId: 86,
	                });
	            }}
	        />
	    </View>
    )
}
