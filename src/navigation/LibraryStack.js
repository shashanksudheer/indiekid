import React, { useContext, useState, useEffect } from 'react';
import { Button } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';

import { 
  LibraryScreen, ArtistPageScreen, DiscographyScreen, 
  CreatePlaylistScreen, CreateAlbumScreen, CreateSingleScreen,
  BlankScreen, PlaylistScreen, LibraryPlaylistScreen,
  AddSongsPlaylistScreen, UploadSongsScreen, LibraryMyContentScreen,
  AudioPlayerScreen,
} from '../screens';

const Stack = createStackNavigator();
const LibraryTab = createMaterialTopTabNavigator();
const ArtistNewContentTab = createMaterialTopTabNavigator();
const FanNewContentTab = createMaterialTopTabNavigator();

function MyLibraryTab() {
  return (
    <LibraryTab.Navigator>
      <LibraryTab.Screen name="Saved Songs" component={LibraryScreen} />
      <LibraryTab.Screen name="Artists" component={BlankScreen} />
      <LibraryTab.Screen name="Play Lists" component={LibraryPlaylistScreen} />
    </LibraryTab.Navigator>
  );
}

function ArtistLibraryTab() {
  return (
    <LibraryTab.Navigator>
      <LibraryTab.Screen name="My Content" component={LibraryMyContentScreen} />
      <LibraryTab.Screen name="Saved Songs" component={LibraryScreen} />
      <LibraryTab.Screen name="Artists" component={BlankScreen} />
      <LibraryTab.Screen name="Play Lists" component={LibraryPlaylistScreen} />
    </LibraryTab.Navigator>
  );
}

function ArtistContentTabs() {
  return (
    <ArtistNewContentTab.Navigator>
        <ArtistNewContentTab.Screen name="Ablum" component={CreateAlbumScreen} />
        <ArtistNewContentTab.Screen name="Single" component={CreateSingleScreen} />
        <ArtistNewContentTab.Screen name="Playlist" component={CreatePlaylistScreen} />
    </ArtistNewContentTab.Navigator>
  );
}

function FanContentTabs() {
  return (
    <FanNewContentTab.Navigator>
        <FanNewContentTab.Screen name="Playlist" component={CreatePlaylistScreen} />
    </FanNewContentTab.Navigator>
  );
}

export default function LibraryStack() {
  const { user, setUser } = useContext(AuthContext);
  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firebase.firestore().collection('users').doc(user.uid)
    .get()
    .then((doc) => {
      setUserType(doc.data().userType_d);
      // console.log(userType);
    })
    .catch((e) => console.log("Error getting user type: ", e))
    .finally(() => setLoading(false));
  }, []);

  return (
    <Stack.Navigator
      initialRouteName='Library'
      screenOptions={{
          headerStyle: {
            backgroundColor: '#788eec',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Library"
          component={ userType === "artist" ? ArtistLibraryTab : MyLibraryTab }
          options={({ navigation }) => ({
            title: "My Library",
            headerRight: () => (
              <Button
                onPress={() => navigation.navigate('NewContent')}
                title="[ + ]"
                color="white"
              />
              ),
          })}
        />
        <Stack.Screen
          name="ArtistPage"
          component={ArtistPageScreen}
          options={({ route }) => ({
            title: null,
            headerRight: () => (
              <Button
                onPress={() => alert('subscribe')}
                title="temptext"
                color="white"
              />
            ),
          })}
        />
        <Stack.Screen
          name="Discography"
          component={DiscographyScreen}
          options={({ route }) => ({
            title: route.params.contentName,
          })}
        />
        <Stack.Screen
          name="NewContent"
          component={ userType === "artist" ? ArtistContentTabs : FanContentTabs }
          options={() => ({
            title: "Create Content",
          })}
        />
        <Stack.Screen
          name="playlistScreen"
          component={PlaylistScreen}
          options={({ navigation, route }) => ({
            title: route.params.contentName,
            headerLeft: () => (
              <Button
                onPress={() => navigation.navigate("Library")}
                title="< Back"
                color="white"
              />
            ),
          })}
        />
        <Stack.Screen
          name="AddSongsToPlaylist"
          component={AddSongsPlaylistScreen}
          options={({ navigation, route }) => ({
            title: route.params.contentName,
            headerLeft: () => (
              <Button
                onPress={() => navigation.navigate("playlistScreen")}
                title="< Back"
                color="white"
              />
            ),
          })}
        />
        <Stack.Screen
          name="UploadSongs"
          component={UploadSongsScreen}
          options={({ navigation, route }) => ({
            title: route.params.contentName,
            headerLeft: null,
          })}
        />
        <Stack.Screen
            name="AudioPlayer"
            component={AudioPlayerScreen}
            options={() => ({
              title: null,
            })}
        />
    </Stack.Navigator>
  );
}