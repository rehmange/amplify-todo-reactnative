import { Pressable, Text, StyleSheet } from "react-native";
import {
  withAuthenticator,
  useAuthenticator,
} from "@aws-amplify/ui-react-native";

// retrieves only the current value of 'user' from 'useAuthenticator'
const userSelector = (context) => [context.user];

const SignOutButton = () => {
  const { user, signOut } = useAuthenticator(userSelector);
  return (
    <Pressable onPress={signOut} /* style={styles.buttonContainer} */>
      <Text /* style={styles.buttonText} */>
        Hello, {user.username}! Click here to sign out!
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { width: 400, flex: 1, padding: 20, alignSelf: "center" },
  todo: { marginBottom: 15 },
  input: {
    backgroundColor: "#ddd",
    marginBottom: 10,
    padding: 8,
    fontSize: 18,
  },
  todoName: { fontSize: 20, fontWeight: "bold" },
  buttonContainer: {
    alignSelf: "center",
    backgroundColor: "black",
    paddingHorizontal: 8,
  },
  buttonText: { color: "white", padding: 16, fontSize: 18 },
});
