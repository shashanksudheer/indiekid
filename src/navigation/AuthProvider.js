import React, { createContext, useState } from 'react';
import { firebase } from '../firebase/config';

/**
 * This provider is created
 * to access user in whole app
 */

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await firebase.auth().signInWithEmailAndPassword(email, password);
          } catch (e) {
            alert(e);
            console.log(e);
          }
        },
        register: async (email, password, confirmPassword, username, userType) => {
          if (password == confirmPassword) {
            try {
              await firebase.auth().createUserWithEmailAndPassword(email, password)
              .then(function(result) {
                // creates the user in the user collection in firestore
                // to store any other information about the user.
                const data = {
                  email_d: email,
                  username_d: username,
                  userType_d: userType
                };
                try {
                  const res = firebase.firestore().collection('users').doc(result.user.uid).set(data);
                  console.log("Successfully added new user to 'users' collection")
                } catch (e) {
                  console.log(e);
                }
                // adds the username to the profile
                return result.user.updateProfile({
                  displayName: username
                })
              }).catch(function(error) {
                alert(error);
                console.log(error);
              });
            } catch (e) {
              alert(e);
              console.log(e);
            }
          } else {
            alert("Passwords do not match");
          }
        },
        logout: async () => {
          try {
            await firebase.auth().signOut();
          } catch (e) {
            console.error(e);
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};