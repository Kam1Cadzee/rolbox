import auth from '@react-native-firebase/auth';

const getToken = async () => {
  try {
    const token = await auth().currentUser!.getIdToken(false);
    //console.log(token);

    return token;
  } catch (e) {
    return null;
  }
};

export default getToken;
