import * as React from 'react';
import { Text, View, TextInput } from 'react-native';
import styles from './styles';

import { firebase } from '../firebase/config';
// search bar is implemented here, discover lists underneath the search bar.

export default function DiscoverScreen(props)
{
    return (
        <View style={styles.container}>
            <Text style={styles.text}> Discover </Text>
            <TextInput style={styles.input}/>
        </View>
    )
}
