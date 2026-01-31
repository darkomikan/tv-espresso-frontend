import { Stack } from "expo-router";
import { DataProvider } from "../contexts/DataContext";

const RootLayout = () => {
    return (
        <DataProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index"/>
                <Stack.Screen name="playback"/>
                <Stack.Screen name="preview"/>
            </Stack>
        </DataProvider>
    );
}

export default RootLayout;