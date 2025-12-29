import {useState} from "react";
import {SpotifyApi} from "@spotify/web-api-ts-sdk";
import {Auth} from "./components/Auth.tsx";
import {Movies} from "./components/Movies.tsx";

export const Home = () => {
    const [client, setSpotifySdk] = useState<SpotifyApi | null>(null);

    return (client == null) ? <Auth setSpotifySdk={setSpotifySdk}/>
        : <Movies client={client}/>
}