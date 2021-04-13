import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function RadioButtons({ options, selectedOption, onSelect }) {
  return (
    <View>
      {options.map((item) => {
        return (
          <View key={item.key} style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.circle}
              onPress={() => {
                onSelect(item);
              }}>
              {selectedOption === item.key && (
                <View style={styles.checkedCircle} />
              )}
            </TouchableOpacity>
            <Text style={styles.buttonText}>{item.text}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 35,
  },

  circle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ACACAC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkedCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#788eec',
  },
  buttonText: {
    paddingLeft: 5
  },
});