import React, {act, useReducer, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import {saveData, getUserData} from '../Api/FirebaseDb';
import {storage, auth} from '../../firebaseConfig';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import defaultImage from '../assets/post-logo-removebg-preview.png';

function newPostReducer(state, action) {
  switch (action.type) {
    case 'ADD_PHOTOS':
      return {...state, photos: [...state.photos, action.value]};
    case 'REMOVE_PHOTO':
      return {
        ...state,
        photos: state.photos.filter((photo, index) => index !== action.index),
      };
    case 'ADD_TITLE':
      return {...state, title: action.value};
    case 'ADD_PRICE':
      return {...state, price: action.value};
    case 'ADD_DESCRIPTION':
      return {...state, description: action.value};
    case 'ADD_CATEGORY':
      return {...state, category: action.value};
  }
}
const PostCreation = ({navigation}) => {
  const initalPostState = {
    photos: [],
    title: '',
    price: '',
    description: '',
    category: '',
  };

  const [newPostState, newPostDispatch] = useReducer(
    newPostReducer,
    initalPostState,
  );

  const handleAddPhoto = photoUrl => {
    newPostDispatch({type: 'ADD_PHOTO', value: photoUrl});
  };

  const handleRemovePhoto = index => {
    newPostDispatch({type: 'REMOVE_PHOTO', index});
  };

  const handleChooseImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      selectionLimit: 10, // Limit to 10 images if required
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const selectedPhotos = response.assets.map(asset => ({
          uri: asset.uri,
        }));
        // onChangeText={text => newPostDispatch({type: 'title', value: text})}
        // newPostState.photos = prevPhotos => [...prevPhotos, selectedPhotos];
        // console.log('photos log', newPostState);
        // setPhotos(prevPhotos => [...prevPhotos, ...selectedPhotos]);
        handleAddPhoto(...selectedPhotos);
      }
    });
  };

  const renderPhotos = () => {
    return newPostState.photos.map((photo, index) => (
      <Image key={index} source={{uri: photo.uri}} style={styles.photo} />
    ));
  };

  const submitPost = async () => {
    console.log('New post details:', newPost);
    let today = new Date();
    const uploadPromises = [];

    for (let i = 0; i < photos.length; i++) {
      const response = await fetch(photos[i].uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `postImages/IMG${today.getTime()}_${i}`);
      uploadPromises.push(uploadBytes(storageRef, blob));
    }

    try {
      const snapshots = await Promise.all(uploadPromises);
      const downloadURLs = await Promise.all(
        snapshots.map(snapshot => getDownloadURL(snapshot.ref)),
      );

      const userData = await getUserData(auth.currentUser.uid);
      const postData = {
        title: title,
        images: downloadURLs,
        description,
        price,
        category,
        created: new Date(),
        owner: auth.currentUser.uid,
        profileImg: userData?.profileImgURI || defaultImage,
      };

      await saveData('post', postData);
      navigation.navigate('Home');
    } catch (error) {
      console.log('Error uploading image: ', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.uploadPhotosSection}>
        <Text style={{fontSize: 18, marginBottom: 10}}>
          Upload Photos (Max 10)
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={handleChooseImage}>
            <Text style={styles.addPhotoButtonText}>Add Photo</Text>
          </TouchableOpacity>
          {/* {renderPhotos()} */}
        </ScrollView>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Title</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter title"
          value={newPostState.title}
          onChangeText={text =>
            newPostDispatch({type: 'ADD_TITLE', value: text})
          }
        />
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Price</Text>
        <TextInput
          style={styles.inputField}
          placeholder="Enter Price"
          value={newPostState.price}
          onChangeText={text =>
            newPostDispatch({type: 'ADD_PRICE', value: text})
          }
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Category</Text>
        <Picker
          style={styles.inputField}
          selectedValue={newPostState.category}
          onValueChange={itemValue => {
            newPostDispatch({type: 'ADD_CATEGORY', value: itemValue});
          }}>
          <Picker.Item label="Select a category" value="" />
          <Picker.Item label="Home Services" value="home_services" />
          <Picker.Item label="Transportation" value="transportation" />
          <Picker.Item label="Repairs" value="repairs" />
          <Picker.Item label="Delivery" value="delivery" />
          <Picker.Item label="Gardening" value="gardening" />
          <Picker.Item label="Moving Assistance" value="moving_assistance" />
          <Picker.Item label="Pet Care" value="pet_care" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={[styles.inputField, styles.descriptionField]}
          placeholder="Enter description"
          value={newPostState.description}
          onChangeText={text =>
            newPostDispatch({type: 'ADD_DESCRIPTION', value: text})
          }
          multiline
        />
      </View>

      <View style={styles.submitButtonSection}>
        <Button title="Submit" onPress={submitPost} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  uploadPhotosSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  photo: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
  addPhotoButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  addPhotoButtonText: {
    color: '#007AFF', // Blue color
  },
  inputSection: {
    marginBottom: 20,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  descriptionField: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButtonSection: {
    marginTop: 20,
  },
});

export default PostCreation;
