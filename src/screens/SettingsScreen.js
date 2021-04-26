import React, { useState, useContext } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { firebase } from '../firebase/config';
import { AuthContext } from '../navigation/AuthProvider';
import styles from './styles';

// whatever seems important here??? not sure
export default function SettingsScreen(props)
{
	const { user, logout } = useContext(AuthContext);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={() => logout()}>
             <Text style={styles.buttonTitle}>Log Out</Text>
            </TouchableOpacity>
        </View>
    )
}
