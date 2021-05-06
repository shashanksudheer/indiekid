import  React, { useState, useContext, useEffect } from 'react';
import {
    Text, View, TouchableOpacity, Image,
    TextInput, FlatList, ScrollView,
    Pressable, Modal, StyleSheet,
} from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SelectMultiple from 'react-native-select-multiple';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import Loading  from '../components/Loading';
import RadioButton from '../components/RadioButton';
import styles from './styles';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    width: 150,
    backgroundColor: '#788eec',
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    width: 250,
    height: 48,
    color: '#252525',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#EEEEEE',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    },
  longInput: {
    width: 250,
    height: 48,
    color: '#252525',
    borderRadius: 5,
    backgroundColor: '#EEEEEE',
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    },
});

const RadioOptions = [
    {
        key: 'special',
        text: 'subscriber only',
    },
    {
        key: 'public',
        text: 'free',
    },
];

const storage = firebase.storage();

export default function UploadSongsScreen({ navigation, route })
{
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);

    const [data, setData] = useState([]);

    const [artistSongs, setArtistSongs] = useState([]);
    const [artistSongsFormatted, setArtistSongsFormatted] = useState([]);
    const [selected, setSelected] = useState([]);

    const [access, setAccess] = useState('public');
    const [songTitle, setSongTitle] = useState('');
    const [duration, setDuration] = useState(0);
    const [genre, setGenre] = useState([]);
    const [songURL, setSongURL] = useState('');
    const [songIDs, setSongIDs] = useState([]);
    const [songImage, setSongImage] = useState(null);
    const [songFile, setSongFile] = useState(null);


    const { user } = useContext(AuthContext);
    const { contentID } = route.params;

    const songStorageRef = firebase.storage().ref('songs/');
    const contentRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent').doc(contentID);
    const songsRef = firebase.firestore().collection('songs');

    useEffect(() => {
	(async () => {
	    if (Platform.OS !== 'web') {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (status !== 'granted') {
		    alert('Need camera roll permissions');
		}
	    }
	})();
        return songsRef.where("artistID", "array-contains", user.uid)
        .onSnapshot(querySnapshot => {
            const songs = [];
            const format = [];
            querySnapshot.forEach(content => {
                const contentData = content.data();
                songs.push({
                    id: content.id,
                    contentData,
                });
                format.push({
                    label: content.data().songTitle,
                    value: content.id,
                });
            });
            // console.log(songs);
            setArtistSongs(songs);
            setArtistSongsFormatted(format);
            // console.log(artistSongs);
            if (loading) {
                setLoading(false);
            }
        });
    }, []);

    const removeFromData = (songToDelete) => {
        const newSongs = [];
        data.forEach(song => {
            if (song !== songToDelete) {
                newSongs.push(song);
            } else {
                console.log("Removing:", song);
            }
        });
        console.log("New array of songs", newSongs);
        setData(newSongs);
    };
    const onSelect = (item) => {
        setAccess(item.key);
    };
    const onSelectionsChange = (selected) => {
        //console.log(selected);
        setSelected(selected);
    }
    const addFiles = (whichModal) => {
        console.log(whichModal);
        if (!modalVisible && whichModal === "upload") {
            setModalVisible(true);
        } else if (!modalVisible2 && whichModal === "addExisting") {
            setModalVisible2(true);
        } else {
            console.log("Unknown error in modal addFiles")
        }
    };
    const cancel = () => {
        if (modalVisible) {
            setModalVisible(false);
        } else if (modalVisible2) {
            setModalVisible2(false);
        } else {
            console.log("Unknown error in modal cancel")
        }
        setSongTitle('');
        setSongURL('');
        setAccess('public');
        setGenre([]);
        setDuration('');
        setSelected([]);
    };
    const uploadFile = async () => {

	const storageRef = storage.ref("songs/" + user.displayName + "/" + songTitle + "/");
	const songFileRef = storageRef.child(songFile.name);
	const songImageFileRef = storageRef.child(songImage.name);

	await songImageFileRef.put(songImage);
	await songFileRef.put(songFile);

        setModalVisible(!modalVisible);

        const songObject = {
            access: access,
            songTitle: songTitle,
	    uploadDate: Date().toLocaleString(),
	    songFileName: songFile.name,
            songURL: await songFileRef.getDownloadURL(),
	    songFileSize: songFile.size,
	    songImgName: songImage.name,
	    songImgURL: await songImageFileRef.getDownloadURL(),
	    songImgSize: await songImage.size,
            artistID: [user.uid],
            artistName: [user.displayName],
            publicMeta: {
                duration: duration,
                genre: genre,
                numOfSaves: 0,
                onPlaylists: 0,
                plays: 0,
                published: firebase.firestore.Timestamp.now(),
            },
            new: true,
        }
        setSongTitle();
        setSongURL('');
        setAccess('public');
        setGenre([]);
        setDuration(0);

        console.log("in uploadFile:", songObject);
        setData(oldArray => [...oldArray, songObject]);
        console.log("set data:", data);
    };
    const addExistingSong = (selected, artistSongs) => {
        setModalVisible2(!modalVisible2);
        selected.forEach(songFormat => {
            console.log("songFormat =>", songFormat);
            artistSongs.forEach(song => {
                console.log(song);
                console.log("song.id =>", song.id);
                console.log("songFormat.value", songFormat.value);
                if (song.id === songFormat.value) {
                    setData(oldArray => [...oldArray, song.contentData]);
                    setSongIDs(oldArray => [...oldArray, song.id]);
                }
            });
        });
        setSelected([]);
    }
    const uploadSongs = async (data, songIDs) => {
        if (data.length > 0) {
        	data.forEach(song => {
                if (song.new) {
                    console.log("its a new one");
                    const songData = {
                        access: song.access,
                        songTitle: song.songTitle,
                        songURL: song.songURL,
                        artistID: [user.uid],
                        artistName: [user.displayName],
                        publicMeta: song.publicMeta,
                    };
                    try {
                        songsRef.add(songData).then(res => {
                            console.log("result:", res.data);
                            console.log("Successfully added song to firestore with ID:", res.id);
                            setSongIDs(oldArray => [...oldArray, res.id]);
                            contentRef.update({
                                songs: firebase.firestore.FieldValue.arrayUnion(res.id),
                            });
                            console.log("updated songs array:", songIDs);
                        })
                    } catch (e) {
                        console.log(e);
                    }
                }
        	});
        } else {
            alert("No songs were uploaded!");
        }
        if (songIDs.length > 0) {
            songIDs.forEach(ID => {
                try {
                    contentRef.update({
                        songs: firebase.firestore.FieldValue.arrayUnion(ID),
                    });
                } catch (e) {
                    console.log(e);
                }
            })
        }
        navigation.navigate('Library');
    };

    const onSongFileChange = async () => {
	let res = await DocumentPicker.getDocumentAsync("audio/*");

	if (res.type == "success")
	{
	    setSongFile(res);
	}
	else
	{
	    console.log("Upload of song file failed");
	}
	console.log(res);
    }

    const onLocalSongFileChange = async () => {
	let res = await ImagePicker.launchImageLibraryAsync({
	    mediaTypes: ImagePicker.MediaTypeOptions.All,
	    allowsEditing: true,
	    aspect: [4, 3],
	    quality: 1,
	});

	console.log(res);

	if (!res.cancelled)
	{
	    setSongFile(res);
	}
    }

    const onSongImageFileChange = async () => {
	let res = await DocumentPicker.getDocumentAsync("image/*");

	if (res.type == "success")
	{
	    setSongImage(res);
	}
	else
	{
	    console.log("Upload of song image file failed");
	}
	console.log(res);
    }

    const onLocalSongImageFileChange = async () => {
	let res = await ImagePicker.launchImageLibraryAsync({
	    mediaTypes: ImagePicker.MediaTypeOptions.Images,
	    allowsEditing: true,
	    aspect: [4, 3],
	    quality: 1,
	});

	console.log(res);

	if (!res.cancelled)
	{
	    setSongImage(res);
	}
    }

    return (
            <View style={styles.container}>
                {loading ? <Loading/> : (
                	<KeyboardAwareScrollView
                            key="scrollList"
                            style={{ width:"95%", padding: 2 }}
                            showsVerticalScrollIndicator={false}>
                        <Modal
                            key="newsong"
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={uploadFile}
                        >
                            <View style={modalStyles.centeredView}>
                                <View style={modalStyles.modalView}>
                                    <TextInput
                                        style={modalStyles.input}
                                        placeholder='Song Title'
                                        placeholderTextColor="#aaaaaa"
                                        onChangeText={(text) => setSongTitle(text)}
                                        value={songTitle}
                                        underlineColorAndroid="transparent"
                                    />
                                    <TextInput
                                        style={modalStyles.input}
                                        placeholder='Duration in seconds'
                                        placeholderTextColor="#aaaaaa"
                                        onChangeText={(text) => {
                                            if (text === '') {
                                                setDuration(0);
                                            } else {
                                                const dur = parseInt(text);
                                                setDuration(dur);
                                            }
                                        }}
                                        value={duration.toString()}
                                        underlineColorAndroid="transparent"
                                    />
                                    <TextInput
                                        style={modalStyles.longInput}
                                        placeholder='Comma Separated Genres'
                                        placeholderTextColor="#aaaaaa"
                                        onChangeText={(text) => {
                                            const genreArr = text.split(', ');
                                            setGenre(genreArr);
                                        }}
                                        value={genre.join(", ")}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="none"
                                    />
				    <TouchableOpacity
					style = {styles.button}
					onPress={onSongFileChange}>
					<Text style={styles.buttonTitle}>
					    [iCloud] Select Song File
					</Text>
				    </TouchableOpacity>
				    {songImage != null &&
					<>
					    <Image
						style = {styles.logo}
						source = {{
						    uri: songImage.uri,
						}}
					    />
					</>
				    }
				    <TouchableOpacity
                                        style = {styles.button}
                                        onPress = {onSongImageFileChange}>
                                        <Text style = {styles.buttonTitle}>
                                            [iCloud] Upload Song Image File
                                        </Text>
                                    </TouchableOpacity>
				    <TouchableOpacity
                                        style = {styles.button}
                                        onPress={onLocalSongFileChange}>
                                        <Text style={styles.buttonTitle}>
                                            [Local] Select Song File
                                        </Text>
                                    </TouchableOpacity>
                                    {songImage != null &&
                                        <>
                                            <Image
                                                style = {styles.logo}
                                                source = {{
                                                    uri: songImage.uri,
                                                }}
                                            />
                                        </>
                                    }
				    <TouchableOpacity
                                        style = {styles.button}
                                        onPress = {onLocalSongImageFileChange}>
                                        <Text style = {styles.buttonTitle}>
                                            [Local] Upload Song Image File
                                        </Text>
                                    </TouchableOpacity>
                                    <RadioButton
                                        selectedOption={access}
                                        onSelect={onSelect}
                                        options={RadioOptions}
                                    />
                                    <Pressable
                                        style={[modalStyles.button, modalStyles.buttonClose]}
                                        onPress={() => uploadFile()}
                                    >
                                        <Text style={modalStyles.textStyle}>Upload Song</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[modalStyles.button, modalStyles.buttonClose]}
                                        onPress={() => cancel()}
                                    >
                                        <Text style={modalStyles.textStyle}>Cancel</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>
                        <Modal
                            key="existingSongs"
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible2}
                            onRequestClose={addExistingSong}
                        >
                            <View style={modalStyles.centeredView}>
                                <View style={modalStyles.modalView}>
                                    <SelectMultiple
                                        items={artistSongsFormatted}
                                        selectedItems={selected}
                                        onSelectionsChange={onSelectionsChange}
                                    />
                                    <Pressable
                                        style={[modalStyles.button, modalStyles.buttonClose]}
                                        onPress={() => addExistingSong(selected, artistSongs)}
                                    >
                                        <Text style={modalStyles.textStyle}>Add Songs</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[modalStyles.button, modalStyles.buttonClose]}
                                        onPress={() => cancel()}
                                    >
                                        <Text style={modalStyles.textStyle}>Cancel</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>
                        <TouchableOpacity
                            style={styles.button}
                            key="uploadFiles"
                            onPress={() => addFiles("upload")}>
                            <Text style={styles.buttonTitle}>Upload a Song</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            key="addPreExistingSong"
                            onPress={() => addFiles("addExisting")}>
                            <Text style={styles.buttonTitle}>Add Existing Songs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            key="cancel"
                            onPress={() => navigation.navigate('Library')}>
                            <Text style={styles.buttonTitle}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Songs to be Added:</Text>
                		<KeyboardAwareScrollView 
                            key="scrollList" 
                            style={{ width:"95%", padding: 2 }}
                            showsVerticalScrollIndicator={false}>
                            {data.map(song => 
                                <Card key={song.id} style={{
                                    width: "90%",
                                    margin: 5,
                                }}>
                                    <Card.Content>
                                        <Title>{song.songTitle}</Title>
                                        <Paragraph>Artist: {song.artistName}</Paragraph>
                                        <Paragraph>Duration: {song.publicMeta.duration}</Paragraph>
                                        <Paragraph>Genre: {song.publicMeta.genre.join(', ')}</Paragraph>
                                    </Card.Content>
                                    <Card.Actions>
                                        <Button
                                        mode="default"
                                        onPress={() => removeFromData(song)}>Remove</Button>
                                    </Card.Actions>
                                </Card>
                            )}
                        </KeyboardAwareScrollView>
                        <TouchableOpacity
                            style={styles.button}
                            key="addSongsToPlaylist"
                            onPress={() => uploadSongs(data, songIDs)}>
                            <Text style={styles.buttonTitle}>Add Songs to Content</Text>
                        </TouchableOpacity>
	                </KeyboardAwareScrollView>
                )}
            </View>
    )
}
