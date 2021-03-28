import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB6HMhTHfdQ5gKyIXdJweXRKiTZLbFN4rc',
  authDomain: 'indiekid-firebase.firebaseapp.com',
  databaseURL: 'https:indiekid-firebase.us-east4.firebaseio.app',
  projectId: 'indiekid-firebase',
  storageBucket: 'indiekid-firebase.appspot.com',
  messagingSenderId: '483029604744',
  appId: '1:483029604744:ios:b99380dbf2431e61bc023d',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
