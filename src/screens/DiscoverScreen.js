import  React, { useState, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import { AuthContext } from '../navigation/AuthProvider';
import styles from './styles';

import { Searchbar, Button, Card, Title, Paragraph } from 'react-native-paper';

import { firebase } from '../firebase/config';


export default function DiscoverScreen( {navigation} )
{
	const { user } = useContext(AuthContext);
    const [discoverArtists, setDiscoverArtists] = useState([]);
	const [searchQuery, setSearchQuery] = React.useState('');

	// Set up query to return all artists in users
    const discoverArtistsRef = firebase.firestore().collection('users/')
							   .where("userType_d", "==", "artist");

	//function that sets search query into state variable
	const onChangeSearch = (query) => setSearchQuery(query);

	// function that handles executing db query and stores returned artists
	// in state variable
	const onSearchPress = () => {

		discoverArtistsRef.get()
			.then((querySnapshot) => {
				returnedArtists = [];

				querySnapshot.forEach((doc) => {
					let currentID = doc.id;
	                let appObj = { ...doc.data(), ['id']: currentID };
	                returnedArtists.push(appObj);

					// DEBUG CODE
					// console.log(doc.id, "=>", doc.data());
				});
				setDiscoverArtists(returnedArtists);
			})
			.catch((error) => {
				console.log("Error getting documents: ", error);
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
				placeholder="search for artists"
				onChangeText = {onChangeSearch}
				value={searchQuery}
				style={{ margin: 15 }}
			/>
			<Button 
				mode="contained"
				onPress={onSearchPress}
				style={{ margin: 5 }}>
			SEARCH
			</Button>

			<ScrollView style={{ width:"100%", padding: 2 }}>
			{discoverArtists.map(artist => 
				<Card key={artist.username_d} style={{
					width: "100%",
					margin: 5,
				}}>
					<Card.Content>
						<Title>{artist.username_d}</Title>
						<Paragraph>{artist.artistBio}</Paragraph>
					</Card.Content>
					<Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
					<Card.Actions>
						<Button 
						mode="default"
						onPress={() => {
								// console.log(artist.id);
                                navigation.navigate('ArtistPage', {
                                	artistID: artist.id,
                                    artistName: artist.username_d,
                                });
                        }}>Check Page</Button>
					</Card.Actions>
				</Card>
			)}
			</ScrollView>
	    </View>
    )
}
