import  React, { useState, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { Searchbar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import 'react-native-gesture-handler';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import Loading  from '../components/Loading';
import styles from './styles';

export default function DiscoverScreen( {navigation} )
{
	const { user } = useContext(AuthContext);

	const [artistLoading, setArtistLoading] = useState(true);
	const [songLoading, setSongLoading] = useState(true);

    const [allArtists, setAllArtists] = useState([]);
    const [discoverArtists, setDiscoverArtists] = useState([]);
    const [discoverSongs, setDiscoverSongs] = useState([]);
    const [discoverGenre, setDiscoverGenre] = useState([]);

	const [searchQuery, setSearchQuery] = useState('');
	const [searchTimer, setSearchTimer] = useState(null);

	const userRef = firebase.firestore().collection('users').doc(user.uid);
    const artistRef = firebase.firestore().collection('users')
		.where("userType_d", "==", "artist");
	const songRef = firebase.firestore().collection('songs');

	// function that handles executing db query and stores returned artists
	// in state variable
	const fetchArtistSearch = (input) => {
		console.log(input);
		if (input !== '') {
			return artistRef.onSnapshot(querySnapshot => {
	            const artists = [];
	            querySnapshot.forEach(artist => {
	                const { username_d, artistBio } = artist.data();
	                if(username_d.includes(input)) {
		                artists.push({
		                    id: artist.id,
		                    username_d,
							artistBio,
		                });
	                }
	            });
	            setDiscoverArtists(artists);
	            if(artistLoading) {
	                setArtistLoading(false);
	            }
	        });
		} else {
			return setDiscoverArtists([]);
		}
	}
	const fetchSongSearch = (input) => {
		console.log(input);
		if (input !== '') {
			return songRef.onSnapshot(querySnapshot => {
	            const songs = [];
	            querySnapshot.forEach(song => {
	                const { access, songTitle, artistID, artistName } = song.data();
	                if(access === 'public') {
	                	if(songTitle.includes(input)) {
			                songs.push({
			                    id: song.id,
			                    songTitle,
								artistID,
								artistName,
			                });
	                	}
	                }
	            });
	            setDiscoverSongs(songs);
	            if(songLoading) {
	                setSongLoading(false);
	            }
	        });
		} else {
			return setDiscoverSongs([]);
		}
	}
    const fetchAllArtists = (input) => {
        console.log(input);
        if (input === 'all artists') {
            return artistRef.onSnapshot(querySnapshot => {
                const artists = [];
                querySnapshot.forEach(artist => {
                    const { username_d, artistBio } = artist.data();
                    artists.push({
                        id: artist.id,
                        username_d,
                        artistBio,
                    });
                });
                setAllArtists(artists);
                if(artistLoading) {
                    setArtistLoading(false);
                }
            });
        } else {
            return setAllArtists([]);
        }
    }
    const fetchSongGenreSearch = (input) => {
        console.log(input);
        if (input !== '') {
            return songRef.where("publicMeta.genre", "array-contains", input)
              .onSnapshot(querySnapshot => {
                const songs = [];
                querySnapshot.forEach(song => {
                    console.log('genre: ', input)
                    const { access, songTitle, artistID, artistName } = song.data();
                    if(access === 'public') {
                        songs.push({
                            id: song.id,
                            songTitle,
                            artistID,
                            artistName,
                        });
                    }
                });
                setDiscoverGenre(songs);
                if(songLoading) {
                    setSongLoading(false);
                }
            });
        } else {
            return setDiscoverGenre([]);
        }
    }
    const saveSong = async (songID, artistID, songTitle, artistName) => {
    	const data = {
    		artistID: artistID[0],
    		artistName: artistName[0],
    		songTitle: songTitle,
    	}
    	try {
    		userRef.collection('savedSongs').doc(songID).set(data);
            alert("Song saved!");
    	} catch (e) {
    		console.log(e);
    	}
    }
    const handlePlay = (songID) => {
        navigation.navigate('AudioPlayer', {
            songID: songID,
        });
    }

	// function that returns JSX creating a list of artist info returned from search
	const ArtistTiles = () => {
		return (
			<View>

			</View>
		)
	}


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Searchbar
				placeholder="Search"
				onChangeText = {(text) => {
					if (searchTimer) {
						clearTimeout(searchTimer);
					}
					setSearchQuery(text);
					setSearchTimer(setTimeout(() => {
						fetchArtistSearch(text);
						fetchSongSearch(text);
                        fetchSongGenreSearch(text);
                        fetchAllArtists(text);
					}, 500),
					);
				}}
				value={searchQuery}
				style={{ margin: 15 }}
			/>
			<KeyboardAwareScrollView
            style={{ width:"95%", padding: 2 }}
            showsVerticalScrollIndicator={false}>
			{discoverSongs.map(song => 
				<Card key={song.id} style={{
					width: "100%",
					margin: 5,
				}}>
					<Card.Content>
						<Title>{song.songTitle}</Title>
						<Paragraph>by {song.artistName}</Paragraph>
					</Card.Content>
					<Card.Actions>
						<Button 
						mode="default"
						onPress={() => handlePlay(song.id)
                        }>Go to Song</Button>
                        <Button 
						mode="default"
						onPress={() => saveSong(song.id, song.artistID, song.songTitle, song.artistName)}>Save</Button>
					</Card.Actions>
				</Card>
			)}
			{discoverArtists.map(artist => 
				<Card key={artist.id} style={{
					width: "100%",
					margin: 5,
				}}>
					<Card.Content>
						<Title>{artist.username_d}</Title>
						<Paragraph>{artist.artistBio}</Paragraph>
					</Card.Content>
					<Card.Actions>
						<Button 
						mode="default"
						onPress={() => {
								// console.log(artist.id);
                                navigation.navigate('ArtistPage', {
                                	artistID: artist.id,
                                    artistName: artist.username_d,
                                });
                        }}>Go to Artist</Button>
					</Card.Actions>
				</Card>
			)}
            {allArtists.map(artist => 
                <Card key={artist.id} style={{
                    width: "100%",
                    margin: 5,
                }}>
                    <Card.Content>
                        <Title>{artist.username_d}</Title>
                        <Paragraph>{artist.artistBio}</Paragraph>
                    </Card.Content>
                    <Card.Actions>
                        <Button 
                        mode="default"
                        onPress={() => {
                                // console.log(artist.id);
                                navigation.navigate('ArtistPage', {
                                    artistID: artist.id,
                                    artistName: artist.username_d,
                                });
                        }}>Go to Artist</Button>
                    </Card.Actions>
                </Card>
            )}
            {discoverGenre.map(song => 
                <Card key={song.id} style={{
                    width: "100%",
                    margin: 5,
                }}>
                    <Card.Content>
                        <Title>{song.songTitle}</Title>
                        <Paragraph>by {song.artistName}</Paragraph>
                    </Card.Content>
                    <Card.Actions>
                        <Button 
                        mode="default"
                        onPress={() => handlePlay(song.id)
                        }>Go to Song</Button>
                        <Button 
                        mode="default"
                        onPress={() => saveSong(song.id, song.artistID, song.songTitle, song.artistName)}>Save</Button>
                    </Card.Actions>
                </Card>
            )}
			</KeyboardAwareScrollView>
	    </View>
    )
}
