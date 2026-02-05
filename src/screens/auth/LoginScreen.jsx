import { View,  Text,  TextInput,  Pressable,  KeyboardAvoidingView} from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <KeyboardAvoidingView >

      <Text >Welcome Back</Text>
      <Text >Login to your account</Text>

      <View >
        <Text >Email</Text>
        <TextInput
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>

      <View >
        <Text >Password</Text>
        <TextInput
          placeholder="Enter your password"
        />
      </View>

      <Pressable >
        <Text >Login</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text >
          Don’t have an account? Register
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}