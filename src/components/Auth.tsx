import {Button, styled} from "@mui/material";
import {SpotifyApi} from "@spotify/web-api-ts-sdk";
import * as React from "react";

const AuthButtons = styled('div')`
    display: flex;
    gap: 10px;
    width: 100%;
`

const ServiceButton = styled(Button)`
    width: 100%;
`

interface AuthParams {
    setSpotifySdk: React.Dispatch<React.SetStateAction<SpotifyApi | null>>
}

export const Auth = ({ setSpotifySdk }: AuthParams) => {
    const spotifyAuth = async () => {
        console.log('hello')

        const client = SpotifyApi.withUserAuthorization(
            "d7643f41b89b4f0f9b62ad17dd411317", "http://127.0.0.1:5173",
            ["playlist-read-private", "user-top-read"]);

        setSpotifySdk(client)
    }

    return <AuthButtons>
        <ServiceButton variant={'contained'} onClick={spotifyAuth}>Spotify</ServiceButton>
    </AuthButtons>
}