import { StyleSheet, View } from "react-native";
import { useData } from "../hooks/useData";
import { useRef, useState } from "react";
import { router } from "expo-router";
import Video from "react-native-video";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Playback = () => {
    const { selectedFilm, selectedSeason, selectedEpisode, seekTimestamp } = useData();
    const sourcePri = {
        uri: `http://192.168.1.100:7080/${selectedFilm.Uri4k !== "" ? selectedFilm.Uri4k : (selectedFilm.Uri !== "" ? selectedFilm.Uri : (selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Uri4k !== "" ? selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Uri4k : selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Uri))}`,
        bufferConfig: {
            minBufferMs: 15000,
            maxBufferMs: 50000,
            bufferForPlaybackMs: 2500,
            bufferForPlaybackAfterRebufferMs: 5000,
        }
    };
    const sourceSec = {
        uri: `http://192.168.1.100:7080/${selectedFilm.Uri !== "" ? selectedFilm.Uri : selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Uri}`,
        bufferConfig: {
            minBufferMs: 15000,
            maxBufferMs: 50000,
            bufferForPlaybackMs: 2500,
            bufferForPlaybackAfterRebufferMs: 5000,
        }
    };
    const playerRef = useRef(null);

    const [currentSource, setCurrentSource] = useState(sourcePri);
    const [videoKey, setVideoKey] = useState(0);

    return (
        <View style={{ flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "center" }}>
            <Video
                ref={playerRef}
                key={videoKey}
                style={{ width: "100%", height: "100%" }}
                resizeMode="contain"
                source={currentSource}
                selectedTextTrack={{
                    type: 'language',
                    value: "hbs-srp" 
                }}
                onError={(e) => {
                    console.log("Video error");
                    if (videoKey < 1)
                    {
                        setCurrentSource(sourceSec);
                        setVideoKey(prev => prev + 1);
                    }
                }}
                onLoad={() => {
                    if (seekTimestamp > 0)
                        playerRef.current.seek(seekTimestamp);
                }}
                onEnd={async () => {
                    await AsyncStorage.removeItem(selectedFilm.Uri !== "" ? selectedFilm.Id : selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Id);
                    router.back();
                }}
                onProgress={async e => {
                    let timestamp = Math.round(e.currentTime);
                    if (timestamp % 300 === 0 && timestamp > 0)
                        await AsyncStorage.setItem(selectedFilm.Uri !== "" ? selectedFilm.Id : selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Id, JSON.stringify(timestamp), () => console.log((selectedFilm.Uri !== "" ? selectedFilm.Id : selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Id) + "  " + timestamp));
                }}
                controls
                paused={false}
                repeat={false}
                playInBackground={false}
                playWhenInactive={false}
                ignoreSilentSwitch="ignore"
            />
        </View>
    );
}

export default Playback;

const styles = StyleSheet.create({
    title: {
        fontWeight: "bold",
        fontSize: 22,
        marginBottom: 10
    },
    btn: {
        backgroundColor: "#0022ffff",
        padding: 15,
        borderRadius: 6,
        marginVertical: 10,
        boxShadow: "0px 4px rgba(0,0,0,0.2)"
    },
    pressed: {
        opacity: 0.6
    },
    cover: {
        width: "50%",
        height: "100%"
    }
});