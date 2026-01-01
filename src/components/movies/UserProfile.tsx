import styled from "@emotion/styled"
import type {TrackDetailProps, UserProfileProps } from "../Movies.types"
import {type ReactNode, useEffect, useState} from "react"
import {AppBar, Button, Dialog, Fab, FormControl, IconButton, InputLabel,
    LinearProgress, ListSubheader, MenuItem, Select, TextField, Toolbar, Typography, type SelectChangeEvent } from "@mui/material"
import { getApi } from "../../lib/environment"
import {LuArrowDown, LuArrowDownRight, LuArrowRight, LuArrowUp, LuArrowUpRight, LuListMusic} from "react-icons/lu";
import {getWindowSize} from "../../lib/hooks.tsx";
import {Section, SubSection} from "../../lib/Content.tsx";
import {IoMdClose} from "react-icons/io";

const TrackInfo = styled('div')`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const DynamicPadding = styled(SubSection)`
    @media screen and (max-width: 768px) {
        padding-top: 15%;
        width: 90%;
        padding-left: 5%;
    }
`

interface UserDialogProps {
    children: ReactNode
}

const UserDialog = ({ children }: UserDialogProps) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        console.log('hello')
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return <>
        <Fab color={'primary'} style={{position: 'fixed', bottom: 40, right: 40}} onClick={handleClickOpen}>
            <LuListMusic />
        </Fab>
        <Dialog fullScreen open={open} onClose={handleClose}>
            <AppBar>
                <Toolbar>
                    <IconButton onClick={handleClose}>
                        <IoMdClose color={'white'} />
                    </IconButton>
                </Toolbar>
            </AppBar>
            {children}
        </Dialog>
    </>
}

export const UserProfile = ({client, promise, dispatch}: UserProfileProps) => {
    const [playlist, updatePlaylist] = useState("")
    const [search, updateSearch] = useState("")
    const [tracks, updateTracks] = useState<string>('')
    const [trackVectors, addTrackVector] = useState([])
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

        updateTracks(tracks.map(e => e.external_ids.isrc).join(','))
    }

    const searchTrack = async (title: string) => {
        const searchResults = await client.search(title, ['track'])

        if (searchResults.tracks == null) {
            return null
        }

        return searchResults.tracks.items[0]
    }

    const dispatchSearch = async () => {
        const foundTrack = await searchTrack(search);
        if (foundTrack == null) {
            return
        }

        updateTracks(foundTrack.external_ids.isrc)
    }

    useEffect(() => {
        console.log('opening connection')

        if (tracks == '') {
            return
        }

        addTrackVector([])
        dispatch(null)

        const url = getApi() + tracks

        const eventSource = new EventSource(url);

        eventSource.onmessage = (e) => {
            try {
                let data = e.data
                if (typeof data == 'string') {
                    data = JSON.parse(data)
                }

                if ('track' in data) {
                    addTrackVector(prevState => prevState.concat(data))
                } else {
                    dispatch(data)
                }
            } catch (e) {
                console.log(e)
            }
        }

        eventSource.onerror = (_) => { eventSource.close(); };

        return () => {
            eventSource.close();
        };
    }, [tracks]);

    const playlistSelections = data.playlists
        .map(e => <MenuItem value={e.id}>{e.name}</MenuItem>)

    const searchMenu = <Section style={{display: (playlist == '-1') ? 'flex' : 'none', paddingTop: 10}}>
        <TextField
            variant={'outlined'}
            placeholder={'Search...'}
            style={{flex: 3}}
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
        />
        <Button style={{flex: 1}} onClick={dispatchSearch}>Go!</Button>
    </Section>

    const mainBody = <DynamicPadding>
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
        <TrackDetails analysis={trackVectors} expected={(tracks == '') ? 0 : tracks.split(',').length} />
    </DynamicPadding>

    const windowSize = getWindowSize()
    console.log(windowSize)

    if (windowSize[0] <= 768) {
        return <UserDialog>
            {mainBody}
        </UserDialog>
    } else {
        return mainBody
    }
}

const TrackDetails = ({analysis, expected}: TrackDetailProps) => {
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

    if (analysis == null || analysis.length == 0) {
        if (expected == 0) {
            return <div></div>
        }

        return <SubSection style={{paddingTop: '5%', gap: 5}}>
            <LinearProgress variant={'indeterminate'} />
        </SubSection>
    }

    const averageVector = [0, 0, 0, 0, 0, 0]
    for (const i of analysis) {
        for (let j = 0; j < i.vector.length; j++) {
            averageVector[j] += (i.vector[j] / analysis.length);
        }
    }

    const progress = (analysis.length == 0) ? <LinearProgress variant={'indeterminate'} />
        : <LinearProgress variant={'determinate'} value={(analysis.length / expected) * 100} />

    return <SubSection style={{paddingTop: '5%', gap: 5}}>
        <TrackInfo>
            <Typography variant={'body2'}>Track Title</Typography>
            <div>
                <Typography variant={'body2'}>Mood, Energy, Grit, Tension, Warmth, Humor</Typography>
            </div>
        </TrackInfo>
        {analysis.map(e => <TrackInfo key={e.track}>
            <Typography variant={'body1'}>{e.track}</Typography>
            <div>{vectorToIcons(e.vector)}</div>
        </TrackInfo>)}
        ----
        <TrackInfo>
            <Typography variant={'body1'}>Song Average</Typography>
            <div>{vectorToIcons(averageVector)}</div>
        </TrackInfo>
        {progress}
    </SubSection>
}