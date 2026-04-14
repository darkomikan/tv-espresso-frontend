import { Pressable, StyleSheet, View } from "react-native";
import { useData } from "../hooks/useData";
import { useCallback, useRef, useState } from "react";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Video from "react-native-video";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Playback = () => {
    const { hostname, selectedFilm, selectedSeason, selectedEpisode, seekTimestamp } = useData();
    const sourcePri = {
        uri: `http://${hostname}:7080/${selectedFilm.Uri4k !== "" ? selectedFilm.Uri4k : (selectedFilm.Uri !== "" ? selectedFilm.Uri : (selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Uri4k !== "" ? selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Uri4k : selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Uri))}`,
        bufferConfig: {
            minBufferMs: 15000,
            maxBufferMs: 50000,
            bufferForPlaybackMs: 2500,
            bufferForPlaybackAfterRebufferMs: 5000,
        }
    };
    const sourceSec = {
        uri: `http://${hostname}:7080/${selectedFilm.Uri !== "" ? selectedFilm.Uri : selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Uri}`,
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
    const [showSkip, setShowSkip] = useState(-1);
    const [skipSegmentStart, ] = useState(selectedFilm.Uri !== "" ? (
        selectedFilm.SkipSegments !== null && selectedFilm.SkipSegments.length > 0 ? selectedFilm.SkipSegments.map((val) => val.substring(0, 1) * 3600 + val.substring(2, 4) * 60 + Number(val.substring(5, 7))) : []
    ) : (
        selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].SkipSegments !== null && selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].SkipSegments.length > 0 ? selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].SkipSegments.map((val) => val.substring(0, 1) * 3600 + val.substring(2, 4) * 60 + Number(val.substring(5, 7))) : []
    ));
    const [skipSegmentEnd, ] = useState(selectedFilm.Uri !== "" ? (
        selectedFilm.SkipSegments !== null && selectedFilm.SkipSegments.length > 0 ? selectedFilm.SkipSegments.map((val) => val.substring(8, 9) * 3600 + val.substring(10, 12) * 60 + Number(val.substring(13, 15))) : []
    ) : (
        selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].SkipSegments !== null && selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].SkipSegments.length > 0 ? selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].SkipSegments.map((val) => val.substring(8, 9) * 3600 + val.substring(10, 12) * 60 + Number(val.substring(13, 15))) : []
    ));

    const handleSkip = useCallback(() => {
        if (showSkip > -1 && showSkip < skipSegmentEnd.length)
            playerRef.current.seek(skipSegmentEnd[showSkip]);
    }, [showSkip, skipSegmentEnd]);

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
                        await AsyncStorage.setItem(selectedFilm.Uri !== "" ? selectedFilm.Id : selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Id, JSON.stringify(timestamp));
                    if (skipSegmentStart.length > 0 && timestamp % 2 === 0)
                    {
                        let skipIndex = skipSegmentStart.findLastIndex(s => timestamp >= s);
                        if (skipIndex > -1 && timestamp < skipSegmentEnd[skipIndex])
                            setShowSkip(skipIndex);
                        else
                            setShowSkip(-1);
                    }
                }}
                controls
                paused={false}
                repeat={false}
                playInBackground={false}
                playWhenInactive={false}
                ignoreSilentSwitch="ignore"
            />
            {showSkip > -1 && <Pressable style={[styles.btn, { width: "20%", position: "absolute", right: "10", bottom: "100" }]}
                onFocus={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "#0004ff" }})}
                onBlur={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "black" }})}
                onPress={() => { handleSkip(); }}>
                <FontAwesome name="forward" style={[styles.title, styles.textFocused]}> Do sledeće scene</FontAwesome>
            </Pressable>}
        </View>
    );
}

export default Playback;

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