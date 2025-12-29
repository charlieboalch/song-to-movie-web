import {styled} from "@mui/material"
import {useState} from "react";
import {SpotifyApi} from "@spotify/web-api-ts-sdk";
import {Auth} from "./components/Auth.tsx";
import {Movies} from "./components/Movies.tsx";

const Content = styled('div')`
    display: flex;
    margin-left: 15%;
    margin-right: 15%;
    flex-direction: column;
`

export const Home = () => {
    const [client, setSpotifySdk] = useState<SpotifyApi | null>(null);

    const body = (client == null) ? <Auth setSpotifySdk={setSpotifySdk} />
        : <Movies client={client} />

    return <Content>
        {body}
    </Content>
}