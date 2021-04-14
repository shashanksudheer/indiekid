import  React, { useState, useContext } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import 'react-native-gesture-handler';
import { AuthContext } from '../navigation/AuthProvider';
import styles from './styles';

import { firebase } from '../firebase/config';

// shows a button at the top right to create new content, both 
// kinds of users can see this

export default function LibraryScreen( { navigation } )
{
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>My Library</Text>
	        <Button
	            title="Go to Artist Page"
	            onPress={() => {
	                navigation.navigate('ArtistPage', {
	                    ID: 'shashank',
	                });
	            }}
	        />
        </View>
    )
}
