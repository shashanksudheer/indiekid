import React, { useState, useContext, useEffect } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image, Slider } from 'react-native';
import { Button, IconButton, Card, Title, Paragraph } from 'react-native-paper';
import { Audio } from 'expo-av'
import Loading  from '../components/Loading';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import styles from './styles';

export default function AudioPlayerScreen({ navigation, route })
{
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playbackInstance, setPlaybackInstance] = useState(null);
    const [songTitle, setSongTitle] = useState('');
    const [artist, setArtist] = useState([]);
    const [songURI, setSongURI] = useState('');
    const [volume, setVolume] = useState(1.0);

    const { songID } = route.params;

    const songsRef = firebase.firestore().collection('songs').doc(songID);

    useEffect(() => {
        async function fetchSong() {
            console.log('Setting Audio Mode');
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
            try {
                console.log("getting uri");
                await songsRef.onSnapshot(querySnapshot => {
                    console.log(querySnapshot.data().songURL);
                    const uri = querySnapshot.data().songURL;
                    const name = querySnapshot.data().songTitle;
                    const artistName = querySnapshot.data().artistName;
                    setSongURI(uri);
                    setArtist(artistName);
                    setSongTitle(name);
                });
            } catch (e) {
                console.log(e);
            }
            try {
                console.log('Loading Sound');
                const { sound } = await Audio.Sound.createAsync(
                    //require('../../assets/test-sound.m4a'),
                    { uri: songURI },
                    { shouldPlay: isPlaying }
                );
                console.log('Setting playbackInstance');
                setPlaybackInstance(sound);
            } catch (e) {
                console.log(e);
            }
            if (loading) {
                setLoading(false);
            }
        }
        fetchSong();
    }, []);
    useEffect(() => {
        return playbackInstance ? () => {
            console.log('Unloading Sound');
            playbackInstance.unloadAsync(); 
        } : undefined;
    }, [playbackInstance]);

    const playSound = async () => {
        try {
            console.log('Playing Sound');
            setIsPlaying(true);
            await playbackInstance.playAsync();
        } catch (e) {
            console.log(e);
        } 
    }
    const pauseSound = async () => {
        try {
            console.log('Paused Sound');
            setIsPlaying(false);
            await playbackInstance.pauseAsync();
        } catch (e) {
            console.log(e);
        } 
    }

    return (
        <View style={styles.container}>
        {loading ? <Loading/> : (
            <View style={styles.container}>
            <Card key={"player"} style={{
                width: "100%",
                margin: 5,
                alignItems: "center"
            }}>
            <Card.Content>
                <Title>{songTitle}</Title>
                <Paragraph>{artist}</Paragraph>
            </Card.Content>
            <Card.Actions>
                <IconButton icon='rewind' color="#4F5FA0" onPress={() => alert("previous")} />
                {isPlaying ? (
                    <IconButton icon='pause-circle' color="#4F5FA0" onPress={() => pauseSound()} />
                      ) : (
                    <IconButton icon='play-circle' color="#4F5FA0" onPress={() => playSound()} />
                )}
                <IconButton icon='fast-forward' color="#4F5FA0" onPress={() => alert("next")} />
            </Card.Actions>
            </Card>
            </View>
        )}
        </View>
    )
}