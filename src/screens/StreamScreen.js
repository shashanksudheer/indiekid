import React from 'react';
import { Text, View } from 'react-native';
import { firebase } from '../firebase/config';
import styles from './styles';

// there needs to be a start streaming button (top right corner maybe?
// that is only available to artists.
export default function StreamScreen(props)
{
    return (
        <View style={styles.container}>
            <Text style={styles.text}> Stream Screen </Text>
        </View>
    )
}
