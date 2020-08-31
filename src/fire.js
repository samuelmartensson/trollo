import * as firebase from 'firebase/app';
import 'firebase/database';

var firebaseConfig = {
  apiKey: 'AIzaSyCR46N41OzlB7D4snrmmRRQyTMLEI1JC4s',
  authDomain: 'react-manager-42700.firebaseapp.com',
  databaseURL: 'https://react-manager-42700.firebaseio.com',
  projectId: 'react-manager-42700',
  storageBucket: 'react-manager-42700.appspot.com',
  messagingSenderId: '722626202307',
  appId: '1:722626202307:web:506ee67e714efe8431f076',
  measurementId: 'G-K1ZE3MLMF4'
};
// Initialize Firebase
var fire = firebase.initializeApp(firebaseConfig);

export default fire;
