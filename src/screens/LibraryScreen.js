import React from 'react';
import { Text, View } from 'react-native';
import { firebase } from '../firebase/config';
import styles from './styles';

// shows a button at the top right to create new content, both 
// kinds of users can see this

export default function LibraryScreen(props)
{
    return (
        <View style={styles.container}>
            <Text style={styles.text}> Library Screen </Text>
        </View>
    )
}
