import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useData } from "../../hooks/useData";
import { router } from "expo-router";
import { Image } from "expo-image";

const Episodes = () => {
    const { width } = useWindowDimensions();
    const { selectedFilm, selectedSeason, setSelectedEpisode } = useData();

    const handleEpisode = (episode) => {
        setSelectedEpisode(episode);
        router.push("/preview/playButton");
    };

    return (
        <View style={{ backgroundColor: "black", height: "100%", paddingBottom: 5, paddingRight: 5 }}>
            <FlatList data={selectedFilm.Series[selectedSeason - 1]} numColumns={5} renderItem={({item}) => (
                <Pressable style={{ width: (width * 0.8 - 11) * 0.2 - 5, alignItems: "center", borderWidth: 3, borderColor: "#6600ff", marginLeft: 5, marginTop: 5 }}
                    onFocus={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "#0004ff", borderColor: "#0004ff" }})}
                    onBlur={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "black", borderColor: "#6600ff" }})}
                    onPress={() => {handleEpisode(item.Episode)}} >
                    <Image style={{ width: (width * 0.8 - 11) * 0.2 - 11, height: ((width * 0.8 - 11) * 0.2 - 11) * 1.5 }} contentFit="contain"
                        source={{ uri: `http://192.168.1.28:7080/${item.CoverUri}` }}/>
                    <View style={{ padding: 5 }}>
                        <Text style={[styles.title]}>{item.Episode}. Epizoda</Text>
                        {item.EpisodeTitle !== "" && item.EpisodeTitle !== undefined &&
                            <Text style={[styles.title]}>{item.EpisodeTitle}</Text>}
                        {item.TranslatedEpisodeTitle !== "" && item.TranslatedEpisodeTitle !== undefined &&
                            <Text style={[styles.title, { fontStyle: "italic", fontWeight: 300 }]}>{item.TranslatedEpisodeTitle}</Text>}
                    </View>
                </Pressable>
            )} />
        </View>
    );
}

export default Episodes;

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