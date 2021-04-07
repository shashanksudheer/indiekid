import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

import { firebase } from '../../firebase/config';
// this page should be available to both artists and fans.
// new content that fans can create are playlists.
// artists can create songs, videos, and playlists. These 
// functions should be hidden from fans.

export default function NewContentScreen(props)
{
    return (
        <View>
            <Text> Create New Content Screen </Text>
        </View>
    )
}
