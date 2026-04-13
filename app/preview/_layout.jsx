import { Image } from "expo-image";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useData } from "../../hooks/useData";
import { useEffect, useState } from "react";
import uhdLogo from "../../assets/4k.png";
import fhdLogo from "../../assets/fhd.png";
import { Stack, usePathname } from "expo-router";
import { useAudioPlayer } from "expo-audio";

const PreviewLayout = () => {
    const pathname = usePathname();
    const { width } = useWindowDimensions();
    const { selectedFilm, selectedSeason, selectedEpisode } = useData();
    const audioPlayer = useAudioPlayer(`http://109.165.195.83:7080/${selectedFilm.ThemeUri}`);

    const [duration, setDuration] = useState("");

    useEffect(() => {
        if (pathname === "/preview/playButton")
        {
            fetch(`http://109.165.195.83:7080/api/video/getduration?uri=${encodeURIComponent(selectedFilm.Uri !== "" ? selectedFilm.Uri : selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Uri)}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(async res => {
                if (res.ok)
                    setDuration(await res.json());
            });
        }
        else
            setDuration("");
        if (selectedFilm.ThemeUri !== "")
        {
            audioPlayer.volume = 0.8;
            audioPlayer.loop = true;
            audioPlayer.play();
            if (pathname === "/playback")
                audioPlayer.pause();
        }
    }, [selectedFilm, pathname]);

    return (
        <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ width: "20%", backgroundColor: "black", borderWidth: 3, borderColor: "#6600ff", borderRightWidth: 0 }}>
                <Image style={{ width: width * 0.2 - 3, height: (width * 0.2 - 3) * 1.5 }} contentFit="contain" transition={500}
                    source={{ uri: `http://109.165.195.83:7080/${pathname !== "/preview/seasons" && selectedFilm.Uri === "" ? selectedFilm.Series[selectedSeason - 1][0].CoverUri : selectedFilm.CoverUri}` }}/>
                <View style={{ flexDirection: "row", position: "absolute", width: "100%" }}>
                    {selectedFilm.Uri4k !== "" ? <Image source={uhdLogo} style={{ width: 48, height: 36 }} contentFit="fill" /> :
                        (selectedFilm.VideoFhd && <Image source={fhdLogo} style={{ width: 48, height: 36 }} contentFit="fill" />)}
                </View>
                <View style={{ padding: 5 }}>
                    <Text style={styles.title}>{selectedFilm.Title}</Text>
                    {selectedFilm.TranslatedTitle !== "" && <Text style={[styles.title, { fontStyle: "italic", fontWeight: 300 }]}>{selectedFilm.TranslatedTitle}</Text>}
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={styles.title}>Godina:</Text>
                        <Text style={styles.title}>{pathname !== "/preview/seasons" && selectedFilm.Uri === "" ? selectedFilm.Series[selectedSeason - 1][0].Year : selectedFilm.Year}</Text>
                    </View>
                    {pathname !== "/preview/seasons" && selectedFilm.Uri === "" && <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={styles.title}>Sezona {selectedSeason}</Text>
                        {pathname === "/preview/playButton" && <Text style={styles.title}>Epizoda {selectedEpisode}</Text>}
                    </View>}
                    {pathname === "/preview/playButton" && selectedFilm.Uri === "" && <View>
                        {selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].EpisodeTitle !== "" &&
                        selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].EpisodeTitle !== undefined &&
                        <Text style={styles.title}>{selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].EpisodeTitle}</Text>}
                        {selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].TranslatedEpisodeTitle !== "" &&
                        selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].TranslatedEpisodeTitle !== undefined &&
                        <Text style={[styles.title, { fontStyle: "italic", fontWeight: 300 }]}>{selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].TranslatedEpisodeTitle}</Text>}
                    </View>}
                    {duration !== "" && <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={styles.title}>Trajanje:</Text>
                        <Text style={styles.title}>{duration}</Text>
                    </View>}
                </View>
            </View>
            <View style={{ width: "80%", backgroundColor: "black", borderWidth: 3, borderColor: "#6600ff" }}>
                <View style={{ height: "20%", borderColor: "#6600ff", borderBottomWidth: 3, justifyContent: "center" }}>
                    <View style={{ flexDirection: "row", justifyContent: "center", width: "100%" }}>
                        <Text style={[styles.title, { marginRight: 10 }]}>Žanr:</Text>
                        <Text style={styles.title}>{selectedFilm.Genres.join("  |  ")}</Text>
                    </View>
                    {selectedFilm.Director !== "" && <View style={{ flexDirection: "row", justifyContent: "center", width: "100%" }}>
                        <Text style={[styles.title, { marginRight: 10 }]}>Režiser:</Text>
                        <Text style={styles.title}>{selectedFilm.Director}</Text>
                    </View>}
                    {selectedFilm.Actors.length > 0 && <View style={{ flexDirection: "row", justifyContent: "center", width: "100%" }}>
                        <Text style={[styles.title, { marginRight: 10 }]}>Uloge:</Text>
                        <Text style={styles.title}>{selectedFilm.Actors.slice(0, 4).join("  |  ")}</Text>
                    </View>}
                    {selectedFilm.Actors.length > 4 && <Text style={styles.title}>{selectedFilm.Actors.slice(4).join("  |  ")}</Text>}
                </View>
                <View style={{ height: "80%" }}>
                    <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="playButton"/>
                        <Stack.Screen name="seasons"/>
                        <Stack.Screen name="episodes"/>
                    </Stack>
                </View>
            </View>
        </View>
    );
}

export default PreviewLayout;

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