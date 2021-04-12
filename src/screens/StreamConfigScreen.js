import React from 'react';
import { Text, View } from 'react-native';
import { firebase } from '../firebase/config';
import styles from './styles';

// this page is only available to artists.
export default function StreamConfigScreen(props)
{
    return (
        <View>
            <Text> Stream Configuration Screen </Text>
            <Text> like the one from twitch studio </Text>
        </View>
    )
}
