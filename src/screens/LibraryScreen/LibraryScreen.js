import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

import { firebase } from '../../firebase/config';
// shows a button at the top right to create new content, both 
// kinds of users can see this

export default function LibraryScreen(props)
{
    return (
        <View>
            <Text> Library Screen </Text>
        </View>
    )
}
