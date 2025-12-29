import {Button, styled, Typography} from "@mui/material";
import {SpotifyApi} from "@spotify/web-api-ts-sdk";
import * as React from "react";

const Content = styled('div')`
    display: flex;
    flex-direction: column;
    width: 100%;
    text-align: center;
`

const AuthButtons = styled('div')`
    display: flex;
    gap: 10px;
    width: 100%;
    padding: 10px;
    margin-top: 5%;
`

const ServiceButton = styled(Button)`
    width: 100%;
`

interface AuthParams {
    setSpotifySdk: React.Dispatch<React.SetStateAction<SpotifyApi | null>>
}

export const Auth = ({ setSpotifySdk }: AuthParams) => {
    const spotifyAuth = async () => {
        const client = SpotifyApi.withUserAuthorization(
            "d7643f41b89b4f0f9b62ad17dd411317", "http://127.0.0.1:5173",
            ["playlist-read-private", "user-top-read"]);

        setSpotifySdk(client)
    }

    return <Content>
        <Typography variant={'h2'}>My Website</Typography>
        <Typography variant={'h4'}>Still Under Construction</Typography>
        <AuthButtons>
            <ServiceButton variant={'contained'} onClick={spotifyAuth}>Log in with Spotify</ServiceButton>
        </AuthButtons>
    </Content>
}