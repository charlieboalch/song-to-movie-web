import {Button, FormControl, InputLabel, ListSubheader, MenuItem, Select, type SelectChangeEvent, styled, TextField, Typography} from "@mui/material"
import {type Track} from "@spotify/web-api-ts-sdk";
import {Suspense, useEffect, useMemo, useState} from "react";
import {createSuspender} from "../lib/suspense.ts";
import type {
    Movie, MovieAnalysis,
    MovieResultsProps,
    MoviesProps, TrackDetailProps,
    UserProfileProps
} from "./Movies.types.ts";
import {LuArrowDown, LuArrowDownRight, LuArrowRight, LuArrowUp, LuArrowUpRight} from "react-icons/lu";

const Content = styled('div')`
    display: flex;
    gap: 10px;
`

const SubSection = styled('div')`
    display: flex;
    flex-direction: column;
    width: 100%;
    flex: 1;
`

const MovieGrid = styled('div')`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
    padding: 20px;
`

const PosterLayout = styled('div')`
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
`

const TrackInfo = styled('div')`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const Movies = ({ client }: MoviesProps) => {
    const loadUserData = async () => {
        const shortTerm = await client.currentUser.topItems('tracks', 'short_term', 10);
        const mediumTerm = await client.currentUser.topItems('tracks', 'medium_term', 10);
        const longTerm = await client.currentUser.topItems('tracks', 'long_term', 10);

        const playlists = await client.currentUser.playlists.playlists()

        return {
            'top_tracks': [shortTerm.items, mediumTerm.items, longTerm.items],
            'playlists': playlists.items
        }
    }

    const fetchTracks = async () => {
        if (tracks.length != 0) {
            console.log('fetching')

            const mappedTracks = tracks.map(e => e.external_ids.isrc)
            const r = await fetch(" http://127.0.0.1:5000/rank_movies?songs=" + mappedTracks.join(","))
            return await r.json()
        }
    }

    const [tracks, setTracks] = useState<Track[]>([])
    const [analysis, setAnalysis] = useState<MovieAnalysis | null>(null)

    const movieData = useMemo(() => {
        return createSuspender(fetchTracks())
    }, [tracks]);

    const userData = useMemo(() => {
        return createSuspender(loadUserData())
    }, [])

    return <Content>
        <Suspense>
            <MovieResults data={movieData} dispatch={setAnalysis}/>
            <UserProfile client={client} promise={userData} dispatch={setTracks} trackData={analysis}/>
        </Suspense>
    </Content>
}

const MovieResults = ({data, dispatch}: MovieResultsProps) => {
    const analysis = data.read()

    useEffect(() => {
        dispatch(prev => {
            if (prev === analysis) return prev;
            return analysis;
        });
    }, [analysis]);

    if (analysis == undefined) {
        return <SubSection>
            <p>no results</p>
        </SubSection>
    }

    return <SubSection>
        <Typography variant={'h4'} align={'center'}>Top Movies</Typography>
        <MovieGrid>
            {analysis.movies.map(e =>
                <MovieDisplay movie={e.movie} score={e.score} url={e.url} />)}
        </MovieGrid>
    </SubSection>
}

const MovieDisplay = ({movie, score, url}: Movie) => {
    return <PosterLayout key={movie}>
        <img width={128} src={`https://image.tmdb.org/t/p/original${url}`}/>
        <Typography align={'center'} variant={'body2'}>{movie} - {score.toFixed(1)}</Typography>
    </PosterLayout>
}

const UserProfile = ({client, promise, dispatch, trackData}: UserProfileProps) => {
    const [playlist, updatePlaylist] = useState("")
    const [search, updateSearch] = useState("")
    const data = promise.read()

    const getSongData = async (event: SelectChangeEvent) => {
        const selected = event.target.value;
        updatePlaylist(selected);

        // search is -1
        if (selected == '-1') {
            return
        }

        let tracks = []
        // fetch playlist songs
        switch (selected) {
            case '0':
                tracks = data.top_tracks[0]
                break
            case '1':
                tracks = data.top_tracks[1]
                break
            case '2':
                tracks = data.top_tracks[2]
                break
            default:
                const playlistData = await client.playlists.getPlaylist(selected)
                tracks = playlistData.tracks.items.map(e => e.track)
        }

        dispatch(tracks)
    }

    const searchTrack = async (title: string) => {
        const searchResults = await client.search(title, ['track'])

        if (searchResults.tracks == null) {
            return null
        }

        return searchResults.tracks.items[0]
    }

    const dispatchSearch = async () => {
        const track = await searchTrack(search);
        if (track == null) {
            return
        }

        dispatch([track])
    }

    const playlistSelections = data.playlists
        .map(e => <MenuItem value={e.id}>{e.name}</MenuItem>)

    const searchMenu = <Content style={{display: (playlist == '-1') ? 'flex' : 'none', paddingTop: 10}}>
        <TextField
            variant={'outlined'}
            placeholder={'Search...'}
            style={{flex: 3}}
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
        />
        <Button style={{flex: 1}} onClick={dispatchSearch}>Go!</Button>
    </Content>

    return <SubSection>
        <FormControl fullWidth>
            <InputLabel id="music-source-label">Playlist</InputLabel>
            <Select
                labelId="music-source-label"
                id="music-source"
                value={playlist}
                label="Playlist"
                onChange={getSongData}
            >
                <MenuItem value={'-1'}>Search for song</MenuItem>
                <ListSubheader>Your Top Tracks</ListSubheader>
                <MenuItem value={'0'}>1 Month Top Tracks</MenuItem>
                <MenuItem value={'1'}>6 Month Top Tracks</MenuItem>
                <MenuItem value={'2'}>Year Top Tracks</MenuItem>
                <ListSubheader>Your Playlists</ListSubheader>
                {playlistSelections}
            </Select>
        </FormControl>
        {searchMenu}
        <TrackDetails analysis={trackData} />
    </SubSection>
}

const TrackDetails = ({analysis}: TrackDetailProps) => {
    const vectorToIcons = (vector: any) => {
        const result = []
        for (const i of vector) {
            if (i < -1) {
                result.push(<LuArrowDown color={'red'}/>)
            } else if (i < -0.25) {
                result.push(<LuArrowDownRight color={'lightcoral'}/>)
            } else if (i < 0.25) {
                result.push(<LuArrowRight color={'silver'}/>)
            } else if (i < 1) {
                result.push(<LuArrowUpRight color={'lightgreen'}/>)
            } else {
                result.push(<LuArrowUp color={'green'}/>)
            }
        }

        return result
    }

    if (analysis == null) {
        return <div></div>
    }

    const averageVector = [0, 0, 0, 0, 0, 0]
    for (const i of analysis.songs) {
        for (let j = 0; j < i.vector.length; j++) {
            averageVector[j] += (i.vector[j] / analysis.songs.length);
        }
    }

    return <SubSection style={{paddingTop: '5%', gap: 5}}>
        <TrackInfo>
            <Typography variant={'body2'}>Track Title</Typography>
            <div>
                <Typography variant={'body2'}>Mood, Energy, Grit, Tension, Warmth, Humor</Typography>
            </div>
        </TrackInfo>
        {analysis.songs.map(e => <TrackInfo key={e.track}>
            <Typography variant={'body1'}>{e.track}</Typography>
            <div>{vectorToIcons(e.vector)}</div>
        </TrackInfo>)}
        ----
        <TrackInfo>
            <Typography variant={'body1'}>Song Average</Typography>
            <div>{vectorToIcons(averageVector)}</div>
        </TrackInfo>
    </SubSection>
}