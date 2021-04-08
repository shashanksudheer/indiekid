import React from 'react';
import { Text, View } from 'react-native';
import styles from './styles';

import { firebase } from '../../firebase/config';
// Accessible only to artist accounts. Allows users to post to
// any social media they have linked to their indiekid account
// and toggled in this page to be posted to.

export default function CampaignPostScreen(props)
{
    return (
        <View>
            <Text> Campaign Post Screen </Text>
        </View>
    )
}
