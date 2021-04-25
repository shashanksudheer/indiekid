import React, { useContext, useState, useEffect } from 'react';
import { Text, View, SectionList } from 'react-native';
import { firebase } from '../firebase/config';
import cloneDeep from 'lodash/cloneDeep';
import Loading  from '../components/Loading';
import styles from './styles';

// similar to spotify. there is currently a bug on this
// page because of an unmounted component (mack may have fixed this
// memory leak bug on april 16,2021.

const usersRef = firebase.firestore().collection('users');
const songsRef = firebase.firestore().collection('songs');

function getPopular(data) {
    // console.log('artistID:\t', data)
    const [mostPopular, setMostPopular] = useState([]);
    useEffect(() => {
        const allSongs = [];
        songsRef.where('artistID', 'array-contains', data)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((song) => {
                // song.data() is never undefined for query doc snapshots
                let currentID = song.id;
                let appObj = { ...song.data(), ['id']: currentID };
                allSongs.push(appObj);
            });
        })
        .then(() => {
            allSongs.sort((a, b) => b.plays - a.plays);
        })
        .catch((e) => console.log("Error getting documents: ", e))
        .finally(() => {
            setMostPopular(allSongs.splice(0, 5))
        });
    }, [data]);

    return mostPopular;
}
function getReleases(data) {
    const mostRecentReleases = [];

    return mostRecentReleases;
}
function getPlaylists(data) {
    const playlists = [];
    
    return playlists;
}

function DisplayList({ artistID, artistBio, navigation }) {
	const [loading, setLoading] = useState(true);
	const [audioData, setAudioData] = useState([]);

	useEffect(() => {
		const artistAudioContent = [];
		usersRef.doc(artistID).collection('audioContent')
		.get()
		.then((querySnapshot) => {
            querySnapshot.forEach((audioContent) => {
                // song.data() is never undefined for query doc snapshots
                let currentID = audioContent.id;
                let appObj = { ...audioContent.data(), ['id']: currentID };
                artistAudioContent.push(appObj);
            });
            setAudioData(artistAudioContent);
        })
        .catch((e) => console.log("Error getting documents: ", e))
        .finally(() => setLoading(false));
    }, []);

    const mostPopularData = getPopular(artistID);
    const mostRecentReleasesData = getReleases(audioData);
    const playlistsData = getPlaylists(audioData);

    const mostPopular = [];
    mostPopularData.forEach((song) => {
        mostPopular.push(song.songTitle);
    })
    const mostRecentReleases = [];
    audioData.forEach((album) => {
        if (album.contentType !== 'playlist') {
            mostRecentReleases.push(album.contentName);
        }
    })
    const playlists = [];
    audioData.forEach((playlist) => {
        if (playlist.contentType === 'playlist' && playlist.access === 'public') {
            playlists.push(playlist.contentName);
        }
    })

	return ( 
		<View style={styles.sectionContainer}>
		    <SectionList
                sections={[
                    {title: 'Popular', data: mostPopular },
                    {title: 'Releases', data: mostRecentReleases },
                    {title: 'Artist Playlists', data: playlists },
                    {title: 'About', data: [artistBio]},
                ]}
                renderItem={({item}) =>
                    <Text style={styles.sectionItem}>{item}</Text>}
                renderSectionHeader={({section}) =>
                    <Text style={styles.sectionTitle}>{section.title}</Text>}
                keyExtractor={(item, index) => index}
                />
        </View>
    );
}

export default function ArtistPageScreen({ navigation, route })
{
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState([]);

	const { artistID } = route.params;
    useEffect(() => {
        const userDoc = [];
		usersRef.doc(artistID)
		.get()
        .then((doc) => {
		    if (!doc.exists) {
                console.log('Artist Page: User not found');
                // console.log(artistID);
            } else {
                userDoc.push(doc.data());
            }
        })
        .then(() => {
            setUserData(userDoc);
        })
        .catch((e) => console.error(e))
		.finally(() => setLoading(false));
    }, []);

	return (
            <View style={styles.container}>
            {loading ? <Loading/> : (
            	<>
                    <Text style={styles.title}> {route.params.artistName} </Text>
                    <DisplayList artistID={artistID} artistBio={userData[0].artistBio} navigation={navigation}/>
                </>
            )}
            </View>
    )
}
