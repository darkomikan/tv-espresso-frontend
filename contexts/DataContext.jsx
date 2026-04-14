import { Image } from "expo-image";
import { createContext, useCallback, useEffect, useState } from "react";
import gif from "../assets/tv-espresso.gif";
import { View, TextInput } from "react-native";
import { useAudioPlayer } from "expo-audio";

const audio1 = require('../assets/six-blade-knife.mp3');
const audio2 = require('../assets/portobello-belle.mp3');
const audio3 = require('../assets/love-over-gold.mp3');
const audio4 = require('../assets/on-every-street.mp3');
const audio5 = require('../assets/how-long.mp3');
const audio6 = require('../assets/sabrina-espresso.mp3');
export const DataContext = createContext();

export function DataProvider({ children })
{
    const [waiting, setWaiting] = useState(true);
    const [online, setOnline] = useState(false);
    const [ip, setIp] = useState("109.165.");
    const [hostname, setHostname] = useState("192.168.1.100");

    const [videos, setVideos] = useState([]);
    const [selectedFilm, setSelectedFilm] = useState({});
    const [selectedSeason, setSelectedSeason] = useState(0);
    const [selectedEpisode, setSelectedEpisode] = useState(0);

    const [seekTimestamp, setSeekTimestamp] = useState(0);

    const audioPlayer = useAudioPlayer();

    async function search(phrase, by)
    {
        if (phrase === "")
        {
            await fetch(`http://${hostname}:7080/api/video/getall`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            }).then(async res => {
                if (res.ok)
                {
                    let result = await res.json();
                    setVideos(result);
                }
                else
                    console.log(res.status);
            }, () => {
                setOnline(false);
            });
        }
        else
        {
            if (by[0])
            {
                await fetch(`http://${hostname}:7080/api/video/getmatching?phrase=${encodeURIComponent(phrase)}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                }).then(async res => {
                    if (res.ok)
                    {
                        let result = await res.json();
                        setVideos(result);
                    }
                    else
                        console.log(res.status);
                }, () => {
                    setOnline(false);
                });
            }
            else if (by[1])
            {
                await fetch(`http://${hostname}:7080/api/video/getbyactor?actor=${encodeURIComponent(phrase)}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                }).then(async res => {
                    if (res.ok)
                    {
                        let result = await res.json();
                        setVideos(result);
                    }
                    else
                        console.log(res.status);
                }, () => {
                    setOnline(false);
                });
            }
            else if (by[2])
            {
                await fetch(`http://${hostname}:7080/api/video/getbydirector?director=${encodeURIComponent(phrase)}`, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    }
                }).then(async res => {
                    if (res.ok)
                    {
                        let result = await res.json();
                        setVideos(result);
                    }
                    else
                        console.log(res.status);
                }, () => {
                    setOnline(false);
                });
            }
        }
    }

    async function getGenre(genre)
    {
        await fetch(`http://${hostname}:7080/api/video/getbygenre?genre=${encodeURIComponent(genre)}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(async res => {
            if (res.ok)
            {
                let result = await res.json();
                setVideos(result);
            }
            else
                console.log(res.status);
        }, () => {
            setOnline(false);
        });
    }

    async function ensureEmbedded()
    {
        let res = await fetch(`http://${hostname}:7080/api/video/EnsureEmbeddedSubtitles`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(selectedFilm.Uri !== "" ? selectedFilm : selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1])
        });
        if (res.ok)
        {
            let data = await res.json();
            if (data !== false)
            {
                if (selectedFilm.Uri !== "")
                {
                    selectedFilm.Uri = data.Uri;
                    selectedFilm.Uri4k = data.Uri4k;
                }
                else if (selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Uri !== "")
                {
                    selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Uri = data.Uri;
                    selectedFilm.Series[selectedSeason - 1][selectedEpisode - 1].Uri4k = data.Uri4k;
                }
                await (search(""));
            }
        }
        else
            console.log("not ensured");
    }

    const checkStatus = useCallback(() => {
        const waitingTimeout = setTimeout(() => {
            setWaiting(true);
        }, 1000);

        fetch(`http://${hostname}:7080/api/video/status`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        }).then(res => {
            if (res.ok)
            {
                clearTimeout(waitingTimeout);
                setTimeout(() => {
                    setOnline(true);
                }, 5000);
            }
            else
                setOnline(false);
        }, () => {
            setOnline(false);
        }).finally(() => {
            setWaiting(false);
        });
    }, []);

    const rollAudio = useCallback(() => {
        let n = Math.random();
        if (n < 0.16)
            audioPlayer.replace(audio1);
        else if (n < 0.33)
            audioPlayer.replace(audio2);
        else if (n < 0.5)
            audioPlayer.replace(audio3);
        else if (n < 0.66)
            audioPlayer.replace(audio4);
        else if (n < 0.83)
            audioPlayer.replace(audio5);
        else
            audioPlayer.replace(audio6);
        audioPlayer.volume = 0.8;
        audioPlayer.play();
    }, [audioPlayer]);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    useEffect(() => {
        const autoCheck = setInterval(() => {
            if (!waiting)
                checkStatus();
        }, 5000);

        return () => { clearInterval(autoCheck); };
    }, [waiting, checkStatus]);

    useEffect(() => {
        const soundTimeout = setTimeout(() => {
            audioPlayer.removeAllListeners("playbackStatusUpdate");
            audioPlayer.addListener("playbackStatusUpdate", (status) => {
                if (status.didJustFinish && !online)
                    rollAudio();
            }); 
            rollAudio();
        }, 1000);

        if (online)
        {
            clearTimeout(soundTimeout);
            audioPlayer.removeAllListeners("playbackStatusUpdate");
            audioPlayer.pause();
        }

        return () => clearTimeout(soundTimeout);
    }, [online, audioPlayer, rollAudio])

    return (
        <DataContext.Provider value={{ hostname, videos, selectedFilm, selectedSeason, selectedEpisode, seekTimestamp,
            search, getGenre, setSelectedFilm, setSelectedSeason, setSelectedEpisode, ensureEmbedded, setSeekTimestamp }}>
            {online ? children : 
            <View style={{ flex: 1, backgroundColor: "black" }}>
                <View style={{ backgroundColor: "#b5b5b5", width: "50%", height: "50%", position: "absolute",
                    marginTop: "18%", marginLeft: "25%" }} />
                <Image source={gif} style={{ width: "100%", height: "100%" }} contentFit="contain" />
                <TextInput style={{
                    position: "absolute",
                    color: "#ffdd00",
                    backgroundColor: "#090909",
                    padding: 10,
                    margin: 5,
                    width: "50%",
                    fontSize: 18,
                    bottom: 20,
                    right: 20,
                }} value={ip} onChangeText={setIp} onSubmitEditing={() => { setHostname(ip); }}/>
            </View>}
        </DataContext.Provider>
    );
}