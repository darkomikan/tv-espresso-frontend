import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useData } from "../../hooks/useData";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PlayButton = () => {
    const { selectedFilm, selectedSeason, selectedEpisode, ensureEmbedded, setSeekTimestamp } = useData();
    const [loading, setLoading] = useState(false);
    const [timestamp, setTimestamp] = useState(1);

    const handlePlay = async (seek) => {
        if (seek)
            setSeekTimestamp(timestamp);
        else
            setSeekTimestamp(0);
        setLoading(true);
        await ensureEmbedded();
        setLoading(false);
        router.push("/playback");
    };

    useEffect(() => {
        const checkExistingTimestamp = async () => {
            let res = await AsyncStorage.getItem(selectedFilm.Uri !== "" ? selectedFilm.Id : selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Id);
            if (res !== null)
                setTimestamp(Number(res));
            else
                setTimestamp(0);
        }
        checkExistingTimestamp();
    }, [selectedFilm, selectedSeason, selectedEpisode]);

    return (
        <View style={{ backgroundColor: "black", height: "100%", justifyContent: "center", alignItems: "center" }}>
            {timestamp > 0 && <Pressable style={[styles.btn, { width: "30%" }, loading && { opacity: 0.4 }]}
                onFocus={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "#0004ff" }})}
                onBlur={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "black" }})}
                onPress={() => handlePlay(true)}
                disabled={loading}>
                <FontAwesome name="play" style={[styles.title, styles.textFocused]}>  Nastavi od {Math.floor(timestamp / 3600)}:{((timestamp % 3600) / 60).toString().padStart(2, "0")}:{(timestamp % 60).toString().padStart(2, "0")}</FontAwesome>
            </Pressable>}
            <Pressable style={[styles.btn, { width: "30%" }, loading && { opacity: 0.4 }]}
                onFocus={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "#0004ff" }})}
                onBlur={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "black" }})}
                onPress={() => handlePlay(false)}
                disabled={loading}>
                <FontAwesome name="play" style={[styles.title, styles.textFocused]}>{timestamp > 0 ? "  Od početka" : ""}</FontAwesome>
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