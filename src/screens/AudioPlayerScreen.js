import React, { useState, useContext, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Button, IconButton, Card, Title, Paragraph } from 'react-native-paper';
import { Audio } from 'expo-av'
import Loading  from '../components/Loading';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import styles from './styles';

export default function AudioPlayerScreen({ navigation, route })
{
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playbackInstance, setPlaybackInstance] = useState(null);
    const [songURI, setSongURI] = useState('');
    const [artURI, setArtURI] = useState('');
    const [volume, setVolume] = useState(1.0);
    const [sound, setSound] = useState();

    async function loadSound() {
        console.log('Loading Sound');
        const { sound: playbackObject } = await Audio.Sound.createAsync(
            { uri: songURI },
            { shouldPlay: true }
        );
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                playsInSilentModeIOS: true,
                interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
                shouldDuckAndroid: true,
                staysActiveInBackground: true,
                playThroughEarpieceAndroid: true
            })
        } catch (e) {
            console.log(e);
        }
        setSound(sound);

        useEffect(() => {
            return sound
              ? () => {
                  console.log('Unloading Sound');
                  sound.unloadAsync(); }
              : undefined;
    }, [sound]);

    async function playSound() {
        console.log('Playing Sound');
        await sound.playAsync(); }
    }

    return (
        <View style={styles.container}>
        {loading ? <Loading/> : (
            <View style={styles.container}>
            <Image
                style={styles.albumCover}
                source={{ uri: artURI }}
            />
            <View style={styles.controls}>
                <TouchableOpacity style={styles.control} onPress={() => alert('')}>
                    <IconButton icon='rewind' color="#4F5FA0" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.control} onPress={() => alert('')}>
                    {this.state.isPlaying ? (
                        <IconButton name='pause-circle' color="#4F5FA0" />
                          ) : (
                        <IconButton name='play-circle' color="#4F5FA0" />
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.control} onPress={() => alert('')}>
                    <IconButton icon='fast-forward' color="#4F5FA0" />
                </TouchableOpacity>
            </View>
            </View>
        )}
        </View>
    )
}