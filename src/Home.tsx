import {useEffect, useState} from "react";
import {SpotifyApi} from "@spotify/web-api-ts-sdk";
import {Auth} from "./components/Auth.tsx";
import {Movies} from "./components/Movies.tsx";
import {useSearchParams} from "react-router";
import {getRedirect} from "./lib/environment.ts";

export const Home = () => {
    const [client, setSpotifySdk] = useState<SpotifyApi | null>(null);
    const [authenticated, setAuthenticated] = useState(false)

    const [params] = useSearchParams()

    const preAuthenticate = async () => {
        const spotify = SpotifyApi.withUserAuthorization(
            "d7643f41b89b4f0f9b62ad17dd411317", getRedirect(),
            ["playlist-read-private", "user-top-read"]);

        if (authenticated) return

        if (params.has('code') || await spotify.getAccessToken()) {
            setAuthenticated(true)
            setSpotifySdk(spotify)
        }
    }

    useEffect(() => {
        preAuthenticate()
    }, []);

    return (client == null) ? <Auth setSpotifySdk={setSpotifySdk}/>
        : <Movies client={client}/>
}