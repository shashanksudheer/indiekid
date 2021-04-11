import React, { useState, useContext } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../navigation/AuthProvider';
import styles from './styles';


import { firebase } from '../../firebase/config';
// whatever seems important here??? not sure

export default function SettingsScreen(props)
{
	const { user, logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <Text> Settings </Text>
            <TouchableOpacity style={styles.button} onPress={() => logout()}>
             <Text style={styles.buttonTitle}>Log Out</Text>
            </TouchableOpacity>
        </View>
    )
}
