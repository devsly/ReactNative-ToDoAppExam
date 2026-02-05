import { View, Text, Image, Pressable } from 'react-native';

export default function ProfileScreen() {
  // временно – по-късно от Firebase Auth
  const user = {
    email: 'user@mail.com',
    displayName: 'Slav Slavov',
    photoURL: ''
  };

  return (
    <View >
      <View >
        <Image source={{ uri: user.photoURL }}  />

        <Text >{user.displayName}</Text>
        <Text >{user.email}</Text>
      </View>

      <View >
        <Pressable >
          <Text >Change Profile Photo</Text>
        </Pressable>

        <Pressable >
          <Text >Edit Profile</Text>
        </Pressable>

        <Pressable >
          <Text >Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

