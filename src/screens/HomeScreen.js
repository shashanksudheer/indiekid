import React, { useState, useContext } from 'react';
import { Text, View, FlatList } from 'react-native';
import { firebase } from '../firebase/config';
import { AuthContext } from '../navigation/AuthProvider';
import styles from './styles';

export default function HomeScreen({ navigation })
{
	const { user } = useContext(AuthContext);
    return (
        <View style={styles.container}>
            <Text style={styles.text}> Welcome Home, {user.displayName} </Text>
            <Text style={styles.text}> (log out is in "Settings" bottom tab) </Text>
        </View>
    )
}
