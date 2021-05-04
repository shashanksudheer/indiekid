import  React, { useState, useContext, useEffect } from 'react';
import { Text, View, ScrollView, TextInput, FlatList } from 'react-native';
import { Button, Card, Title, Paragraph, Switch } from 'react-native-paper';
import { AuthContext } from '../navigation/AuthProvider';
import { firebase } from '../firebase/config';
import Loading  from '../components/Loading';
import styles from './styles';

export default function LibraryScreen({ navigation })
{
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const { user } = useContext(AuthContext);
    const userRef = firebase.firestore().collection('users').doc(user.uid);
    const audioContentRef = firebase.firestore().collection('users')
        .doc(user.uid).collection('audioContent')
        .where("contentType", "!=", "playlist");

    useEffect(() => {
        return audioContentRef.onSnapshot(querySnapshot => {
            const audioContent = [];
            querySnapshot.forEach(content => {
                const { contentName, songs, access, published, contentType, credits } = content.data();
                var accessFalse = access;
                if (accessFalse === "private") {
                    accessFalse = "public";
                } else if (accessFalse === "public") {
                    accessFalse = "private";
                }
                audioContent.push({
                    id: content.id,
                    credits,
                    contentName,
                    contentType,
                    access,
                    published,
                    songs,
                    accessFalse: accessFalse,
                });
            });
            setData(audioContent);
            if (loading) {
                setLoading(false);
            }
        });
    }, []);

    const deleteContent = async (contentID, contentName) => {
        try {
            userRef.collection('audioContent').doc(contentID).delete();
            alert(contentName + " was deleted");
        } catch (e) {
            console.log(e);
        }
    }

    const setAccess = async (contentID, contentName, access) => {
        if (access === "private" ) {
            try {
                userRef.collection('audioContent').doc(contentID).update({access: "public"});
                alert(contentName + " was made public");
            } catch (e) {
                console.log(e);
            }
        } else if (access === "public") {
            try {
                userRef.collection('audioContent').doc(contentID).update({access: "private"});
                alert(contentName + " was made private");
            } catch (e) {
                console.log(e);
            }
        } else {
            console.log("Unexpect access value");
        }
    }

    return (
            <View style={styles.container}>
                {loading ? <Loading/> : (
                    <ScrollView style={{ width:"95%", padding: 2 }}>
                        {data.map(content => 
                            <Card key={content.id} style={{
                                width: "100%",
                                margin: 5,
                            }}>
                                <Card.Content>
                                    <Title>{content.contentName}</Title>
                                    <Paragraph>{content.contentType.toUpperCase()}</Paragraph>
                                    <Paragraph>{content.credits}</Paragraph>
                                </Card.Content>
                                <Card.Actions>
                                    <Button 
                                    mode="default"
                                    onPress={() => {
                                            navigation.navigate('Discography', {
                                                contentID: content.id,
                                                contentName: content.contentName
                                            });
                                    }}>Go to content</Button>
                                    <Button
                                    mode="default"
                                    onPress={() => deleteContent(content.id, content.contentName)}>Delete</Button>
                                    <Button
                                    mode="default"
                                    onPress={() => setAccess(content.id, content.contentName, content.access)}>Make {content.accessFalse}</Button>
                                </Card.Actions>
                            </Card>
                        )}
                    </ScrollView>
                )}
            </View>
    )
}
