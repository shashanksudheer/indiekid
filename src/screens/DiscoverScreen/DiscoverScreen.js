import * as React from 'react';
import { Text, View, TextInput } from 'react-native';
import styles from './styles';

import { firebase } from '../../firebase/config';
// search bar is implemented here, discover lists underneath the search bar.

export default function DiscoverScreen(props)
{
    return (
        <View>
          <Text> Discover </Text>
          <View>
            <TextInput style={styles.input}/>
          </View>
        </View>
    )
}
