import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useData } from "../../hooks/useData";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PlayButton = () => {
    const { videos, selectedFilm, selectedSeason, selectedEpisode, search, setSelectedFilm, setSelectedSeason, ensureEmbedded, setSeekTimestamp } = useData();
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

    const [nextTitle, setNextTitle] = useState(null);

    const handleNext = useCallback((film) => {
        setSelectedFilm(film);
        if (film.Series.length === 0)
            router.replace("/preview/playButton");
        else if (film.Series.length === 1)
        {
            setSelectedSeason(1);
            router.replace("/preview/episodes");
        }
        else if (film.Series.length > 1)
            router.replace("/preview/seasons");
    }, []);

    useEffect(() => {
        const checkExistingTimestamp = async () => {
            let res = await AsyncStorage.getItem(selectedFilm.Uri !== "" ? selectedFilm.Id : selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Id);
            if (res !== null)
                setTimestamp(Number(res));
            else
                setTimestamp(0);
        };
        checkExistingTimestamp();
        const autoCheckExistingTimestamp = setInterval(checkExistingTimestamp, 2000);

        const checkNextTitle = async () => {
            if (selectedFilm.Uri !== "" || (selectedFilm.Series.length > 0 && selectedFilm.Series.length === selectedSeason && selectedFilm.Series[selectedSeason - 1].length === selectedEpisode))
            {
                let next = videos.find(v => v.PreviousTitle === selectedFilm.Title);
                if (next !== undefined)
                    setNextTitle(next);
                else
                {
                    await search("");
                    setTimeout(() => {
                        let next = videos.find(v => v.PreviousTitle === selectedFilm.Title);
                        if (next !== undefined)
                            setNextTitle(next);
                    }, 1000);
                }
            }
        }
        checkNextTitle();

        return () => { clearInterval(autoCheckExistingTimestamp); };
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
            {nextTitle !== null && <Pressable style={[styles.btn, { width: "30%", position: "absolute", right: "10" }, loading && { opacity: 0.4 }]}
                onFocus={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "#0004ff" }})}
                onBlur={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "black" }})}
                onPress={() => { handleNext(nextTitle); }}
                disabled={loading}>
                <FontAwesome name="arrow-right" style={[styles.title]}> Preporučen nastavak:</FontAwesome>
                <Text style={[styles.title, styles.textFocused]}> {nextTitle.Title} ({nextTitle.Year})</Text>
            </Pressable>}
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