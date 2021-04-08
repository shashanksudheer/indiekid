import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

import { firebase } from '../../firebase/config';
// this page should be available to both artists and fans.
// new content that fans can create are playlists.
// artists can create songs, videos, as well as playlists. Everything 
// except the playlists should be hidden from fans. Artists should
// have an extra option to choose whether to make a playlist available
// on their artist page.

export default function NewContentScreen(props)
{
    return (
        <View>
            <Text> Create New Content Screen </Text>
        </View>
    )
}
