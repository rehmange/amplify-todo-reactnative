// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
// import { useEffect } from "react";
// import "react-native-reanimated";

// import { useColorScheme } from "@/hooks/useColorScheme";

// import { Amplify } from 'aws-amplify';
// import amplifyconfig from '../src/amplifyconfiguration.json';
// Amplify.configure(amplifyconfig);

// // Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const [loaded] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView,
} from "react-native";
import { generateClient } from "aws-amplify/api";
import { createTodo } from "../src/graphql/mutations";
import { listTodos } from "../src/graphql/queries";

import {
  withAuthenticator,
  useAuthenticator,
} from "@aws-amplify/ui-react-native";

import { Amplify } from "aws-amplify";
import amplifyconfig from "../src/amplifyconfiguration.json";
Amplify.configure(amplifyconfig);

const initialState = { name: "", description: "" };
const client = generateClient();

const App = () => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value });
  }

  async function fetchTodos() {
    try {
      const todoData = await client.graphql({
        query: listTodos,
      });
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      console.log("error fetching todos");
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      await client.graphql({
        query: createTodo,
        variables: {
          input: todo,
        },
      });
    } catch (err) {
      console.log("error creating todo:", err);
    }
  }

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <SignOutButton />

        <TextInput
          onChangeText={(value) => setInput("name", value)}
          style={styles.input}
          value={formState.name}
          placeholder="Name"
        />
        <TextInput
          onChangeText={(value) => setInput("description", value)}
          style={styles.input}
          value={formState.description}
          placeholder="Description"
        />
        <Pressable onPress={addTodo} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Create todo</Text>
        </Pressable>
        {todos.map((todo, index) => (
          <View key={todo.id ? todo.id : index} style={styles.todo}>
            <Text style={styles.todoName}>{todo.name}</Text>
            <Text style={styles.todoDescription}>{todo.description}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default withAuthenticator(App);

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
