import React, { useState, useContext } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { firebase } from '../firebase/config';
import RadioButton from '../components/RadioButton';
import styles from './styles';

// this page should be available to both artists and fans.
// new content that fans can create are playlists.
// artists can create songs, videos, as well as playlists. Everything 
// except the playlists should be hidden from fans. Artists should
// have an extra option to choose whether to make a playlist available
// on their artist page.
export default function NewContentScreen({ navigation })
{
    return (
        <View style={styles.container}>
            <Text> Content </Text>
        </View>
    )
}