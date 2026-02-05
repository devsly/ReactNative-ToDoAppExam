import {  View,  Text,  TextInput,  Pressable,  KeyboardAvoidingView} from 'react-native';

export default function RegisterScreen({ navigation }) {
  return (
    <KeyboardAvoidingView   >
      <Text >Create Account</Text>
      <Text >Sign up to get started</Text>

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

      <View >
        <Text >Confirm Password</Text>
        <TextInput
          placeholder="Confirm your password"
        />
      </View>

      <Pressable >
        <Text >Register</Text>
      </Pressable>

      <Pressable
        
        onPress={() => navigation.goBack()}
      >
        <Text >
          Already have an account? Login
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

