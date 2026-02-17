import { Image } from "expo-image";
import { FlatList, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useData } from "../../hooks/useData";
import { router } from "expo-router";

const Seasons = () => {
    const { width } = useWindowDimensions();
    const { selectedFilm, setSelectedSeason } = useData();

    const handleSeason = (season) => {
        setSelectedSeason(season);
        router.push("/preview/episodes");
    };

    return (
        <View style={{ backgroundColor: "black", height: "100%", paddingBottom: 5, paddingRight: 5 }}>
            <FlatList data={selectedFilm.Series} numColumns={5} renderItem={({item}) => (
                <Pressable style={{ width: (width * 0.8 - 11) * 0.2 - 5, alignItems: "center", borderWidth: 3, borderColor: "#6600ff", marginLeft: 5, marginTop: 5 }}
                    onFocus={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "#0004ff", borderColor: "#0004ff" }})}
                    onBlur={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "black", borderColor: "#6600ff" }})}
                    onPress={() => {handleSeason(item[0].Season)}} >
                    <Image style={{ width: (width * 0.8 - 11) * 0.2 - 11, height: ((width * 0.8 - 11) * 0.2 - 11) * 1.5 }} contentFit="contain"
                        source={{ uri: `http://192.168.1.100:7080/${item[0].CoverUri}` }}/>
                    <Text style={[styles.title, { paddingVertical: 5 }]}>Sezona {item[0].Season} ({item[0].Year})</Text>
                </Pressable>
            )} />
        </View>
    );
}

export default Seasons;

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