import React, { useContext, useState, useEffect } from 'react';
import { Text, View, SectionList } from 'react-native';
import { firebase } from '../firebase/config';
import Loading  from '../components/Loading';
import styles from './styles';

// similar to spotify

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
    })
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
        mostPopular.push([song.songTitle, song.plays]);
    })
    const mostRecentReleases = [];
    mostRecentReleasesData.forEach((album) => {
        mostRecentReleases.push([album.contentName, album.published]);
    })
    const playlists = [];
    playlistsData.forEach((playlist) => {
        playlists.push([playlist.contentName, playlist.published]);
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
                console.log('User not found');
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
                    <Text style={styles.title}> {userData[0].username_d} </Text>
                    <DisplayList artistID={artistID} artistBio={userData[0].artistBio} navigation={navigation}/>
                </>
            )}
            </View>
    )
}
