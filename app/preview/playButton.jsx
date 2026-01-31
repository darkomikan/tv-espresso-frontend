import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useData } from "../../hooks/useData";
import { useState } from "react";

const PlayButton = () => {
    const { ensureEmbedded } = useData();
    const [loading, setLoading] = useState(false);

    const handlePlay = async () => {
        setLoading(true);
        await ensureEmbedded();
        setLoading(false);
        router.push("/playback");
    };

    return (
        <View style={{ backgroundColor: "black", height: "100%", justifyContent: "center", alignItems: "center" }}>
            <Pressable style={[styles.btn, { width: "30%" }, loading && { opacity: 0.4 }]}
                onFocus={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "#0004ff" }})}
                onBlur={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "black" }})}
                onPress={handlePlay}
                disabled={loading}>
                <FontAwesome name="play" style={[styles.title, styles.textFocused]}></FontAwesome>
            </Pressable>
            {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" color="white" />}
        </View>
    );
}

export default PlayButton;

const styles = StyleSheet.create({
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
        color: "#50ffd9"
    },
    btn: {
        backgroundColor: "#000000",
        padding: 10,
        margin: 5,
        marginBottom: 0,
        borderWidth: 3,
        borderColor: "#6600ff"
    },
    btnh: {
        backgroundColor: "#000000",
        padding: 5,
        margin: 5,
        marginRight: 0,
        borderWidth: 3,
        borderColor: "#6600ff"
    },
    textFocused: {
        color: "#ffdd00"
    },
    focused: {
        backgroundColor: "#0004ff"
    },
    selected: {
        backgroundColor: "#6600ff"
    }
});