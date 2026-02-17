import { Image } from "expo-image";
import { FlatList, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import * as Constants from "expo-constants";
import uhdLogo from "../assets/4k.png";
import fhdLogo from "../assets/fhd.png";
import { router } from "expo-router";
import { useData } from "../hooks/useData";

const Home = () => {
    const { width } = useWindowDimensions();

    const { videos, search, getGenre, setSelectedFilm, setSelectedSeason } = useData();

    const [phrase, setPhrase] = useState("");
    const [focused, setFocused] = useState([false, false, false, false, false, false, false]);
    const [selected, setSelected] = useState([true, false, false, false, false, false, false]);
    const [focusedS, setFocusedS] = useState([false, false, false]);
    const [selectedS, setSelectedS] = useState([true, false, false]);

    const handlePreview = useCallback((film) => {
        setSelectedFilm(film);
        if (film.Series.length === 0)
            router.push("/preview/playButton");
        else if (film.Series.length === 1)
        {
            setSelectedSeason(1);
            router.push("/preview/episodes");
        }
        else if (film.Series.length > 1)
            router.push("/preview/seasons");
    }, []);

    const handleSearch = useCallback(async () => {
        await search(phrase, selectedS);
    }, [phrase, selectedS]);

    const handleGenre = useCallback(async () => {
        if (selected[1])
            await getGenre("akcija");
        else if (selected[2])
            await getGenre("komedija");
        else if (selected[3])
            await getGenre("sci-fi");
        else if (selected[4])
            await getGenre("triler");
        else if (selected[5])
            await getGenre("vestern");
        else if (selected[6])
            await getGenre("veselja");
    }, [selected]);

    useEffect(() => {
        if (!selected[0])
            handleGenre();
        else
            search("");
    }, [selected, handleGenre]);

    return (
        <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ width: "15%", backgroundColor: "black", justifyContent: "space-between", borderWidth: 3, borderColor: "#6600ff", borderRightWidth: 0 }}>
                <View>
                    <Pressable style={[styles.btn, focused[0] && styles.focused, selected[0] && styles.selected]}
                        onFocus={() => setFocused([true, false, false, false, false, false, false])}
                        onBlur={() => setFocused([false, false, false, false, false, false, false])}
                        onPress={() => setSelected([true, false, false, false, false, false, false])}>
                        <FontAwesome name="search" style={[styles.title, focused[0] && styles.textFocused]}></FontAwesome>
                    </Pressable>
                    <Pressable style={[styles.btn, focused[1] && styles.focused, selected[1] && styles.selected]}
                        onFocus={() => setFocused([false, true, false, false, false, false, false])}
                        onBlur={() => setFocused([false, false, false, false, false, false, false])}
                        onPress={() => setSelected([false, true, false, false, false, false, false])}>
                        <Text style={[styles.title, focused[1] && styles.textFocused]}>Akcija</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, focused[2] && styles.focused, selected[2] && styles.selected]}
                        onFocus={() => setFocused([false, false, true, false, false, false, false])}
                        onBlur={() => setFocused([false, false, false, false, false, false, false])}
                        onPress={() => setSelected([false, false, true, false, false, false, false])}>
                        <Text style={[styles.title, focused[2] && styles.textFocused]}>Komedija</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, focused[3] && styles.focused, selected[3] && styles.selected]}
                        onFocus={() => setFocused([false, false, false, true, false, false, false])}
                        onBlur={() => setFocused([false, false, false, false, false, false, false])}
                        onPress={() => setSelected([false, false, false, true, false, false, false])}>
                        <Text style={[styles.title, focused[3] && styles.textFocused]}>Sci-Fi</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, focused[4] && styles.focused, selected[4] && styles.selected]}
                        onFocus={() => setFocused([false, false, false, false, true, false, false])}
                        onBlur={() => setFocused([false, false, false, false, false, false, false])}
                        onPress={() => setSelected([false, false, false, false, true, false, false])}>
                        <Text style={[styles.title, focused[4] && styles.textFocused]}>Triler</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, focused[5] && styles.focused, selected[5] && styles.selected]}
                        onFocus={() => setFocused([false, false, false, false, false, true, false])}
                        onBlur={() => setFocused([false, false, false, false, false, false, false])}
                        onPress={() => setSelected([false, false, false, false, false, true, false])}>
                        <Text style={[styles.title, focused[5] && styles.textFocused]}>Vestern</Text>
                    </Pressable>
                    <Pressable style={[styles.btn, focused[6] && styles.focused, selected[6] && styles.selected]}
                        onFocus={() => setFocused([false, false, false, false, false, false, true])}
                        onBlur={() => setFocused([false, false, false, false, false, false, false])}
                        onPress={() => setSelected([false, false, false, false, false, false, true])}>
                        <Text style={[styles.title, focused[6] && styles.textFocused]}>Veselja</Text>
                    </Pressable>
                </View>
                <Text style={styles.title}>v{Constants.default.expoConfig.version}</Text>
            </View>
            <View style={{ width: "85%", backgroundColor: "black" }}>
                {selected[0] && <View style={{ height: "10%", borderWidth: 3, borderColor: "#6600ff", borderBottomWidth: 0, flexDirection: "row" }}>
                    <TextInput placeholder="Pretraga..." placeholderTextColor="#50ffd9" style={styles.input} value={phrase} onChangeText={setPhrase}
                        onSubmitEditing={handleSearch}/>
                    <Pressable style={[styles.btnh, focusedS[0] && styles.focused, selectedS[0] && styles.selected]}
                        onFocus={() => setFocusedS([true, false, false])}
                        onBlur={() => setFocusedS([false, false, false])}
                        onPress={() => setSelectedS([true, false, false])}>
                        <Text style={[styles.title, focusedS[0] && styles.textFocused]}>Po nazivu</Text>
                    </Pressable>
                    <Pressable style={[styles.btnh, focusedS[1] && styles.focused, selectedS[1] && styles.selected]}
                        onFocus={() => setFocusedS([false, true, false])}
                        onBlur={() => setFocusedS([false, false, false])}
                        onPress={() => setSelectedS([false, true, false])}>
                        <Text style={[styles.title, focusedS[1] && styles.textFocused]}>Po glumcu</Text>
                    </Pressable>
                    <Pressable style={[styles.btnh, focusedS[2] && styles.focused, selectedS[2] && styles.selected]}
                        onFocus={() => setFocusedS([false, false, true])}
                        onBlur={() => setFocusedS([false, false, false])}
                        onPress={() => setSelectedS([false, false, true])}>
                        <Text style={[styles.title, focusedS[2] && styles.textFocused]}>Po režiseru</Text>
                    </Pressable>
                </View>}
                <View style={{ height: selected[0] ? "90%" : "100%", borderWidth: 3, borderColor: "#6600ff", paddingBottom: 5, paddingRight: 5 }}>
                    <FlatList data={videos} numColumns={5} renderItem={({item}) => (
                        <Pressable style={{ width: (width * 0.85 - 11) * 0.2 - 5, alignItems: "center", borderWidth: 3, borderColor: "#6600ff", marginLeft: 5, marginTop: 5 }}
                            onFocus={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "#0004ff", borderColor: "#0004ff" }})}
                            onBlur={(e) => e.currentTarget.setNativeProps({style: { backgroundColor: "black", borderColor: "#6600ff" }})}
                            onPress={() => {handlePreview(item)}} >
                            <Image style={{ width: (width * 0.85 - 11) * 0.2 - 11, height: ((width * 0.85 - 11) * 0.2 - 11) * 1.5 }} contentFit="contain"
                                source={{ uri: `http://192.168.1.100:7080/${item.CoverUri}` }}/>
                            <View style={{ flexDirection: "row", position: "absolute", width: "100%" }}>
                                {item.Uri4k !== "" ? <Image source={uhdLogo} style={{ width: 40, height: 30 }} contentFit="fill" /> :
                                    (item.VideoFhd && <Image source={fhdLogo} style={{ width: 40, height: 30 }} contentFit="fill" />)}
                            </View>
                            <View style={{ padding: 5 }}>
                                <Text style={[styles.title]}>{item.Title} ({item.Year})</Text>
                                {item.TranslatedTitle !== "" && <Text style={[styles.title, { fontStyle: "italic", fontWeight: 300 }]}>{item.TranslatedTitle}</Text>}
                            </View>
                        </Pressable>
                    )} />
                </View>
            </View>
        </View>
    );
}

export default Home;

const styles = StyleSheet.create({
    title: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18,
        color: "#50ffd9"
    },
    input: {
        color: "#ffdd00",
        backgroundColor: "#090909",
        padding: 10,
        margin: 5,
        marginRight: 0,
        width: "50%",
        fontSize: 18
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