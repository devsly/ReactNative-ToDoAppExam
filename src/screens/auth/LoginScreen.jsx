import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import {
  colors,
  spacing,
  fontSizes,
  borderRadius,
  button,
} from '../../theme/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function handleLogin(data) {
    try {
      await login(data.email, data.password);
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      {/* Email*/}
      <View style={styles.field}>
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Invalid email format',
            },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.error}>{errors.email.message}</Text>
        )}
      </View>

      {/* Password */}
      <View style={styles.field}>
        <Text style={styles.label}>Password</Text>
        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
            validate: value =>
              /[0-9]/.test(value) ||
              'Password must contain at least one number',
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Enter your password"
              secureTextEntry
              style={styles.input}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.error}>{errors.password.message}</Text>
        )}
      </View>

      {/* Login button */}
      <Pressable
        style={styles.loginBtn}
        onPress={handleSubmit(handleLogin)}
      >
        <Text style={styles.loginText}>Login</Text>
      </Pressable>

      {/* Register link */}
      <Pressable
        style={styles.linkContainer}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.linkText}>
          Don’t have an account? Register
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: spacing.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    fontSize: fontSizes.sm,
    backgroundColor: colors.inputBackground,
  },
  error: {
    color: colors.error,
    marginTop: spacing.xs,
    fontSize: fontSizes.xs,
  },
  loginBtn: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: button.primary.backgroundColor,
    alignItems: 'center',
  },
  loginText: {
    color: button.primary.color,
    fontWeight: '700',
    fontSize: fontSizes.md,
  },
  linkContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  linkText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: '600',
  },
};
