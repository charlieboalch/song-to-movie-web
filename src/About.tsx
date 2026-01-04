import {styled, Typography} from "@mui/material"
import {SubSection} from "./lib/Content.tsx";

const InfoSection = styled(SubSection)`
    gap: 5px;
    margin-bottom: 20px;
`

export const About = () => {
    return <>
        <InfoSection>
            <Typography variant={'h4'}>How does it work?</Typography>
            <Typography variant={'body1'}>The easiest way to think about it is to ask what movies are "pointing" in the same direction as a song. Songs and movies are encoded in six different dimensions- valence (or mood), energy, darkness, tension, warmth, and humor. If a user inputs a playlist, we take the average of all the songs in that playlist. The song vector is then projected into movie space, and the ranking algorithm uses both cosine similarity and the vector's Euclidean norm to find the movies with the most similar dimensions.</Typography>
            <img src={'/flowchart.png'}/>
        </InfoSection>
        <InfoSection>
            <Typography variant={'h4'}>What movies can I get?</Typography>
            <Typography variant={'body1'}>Nearly 1,000 movies are included in the dataset. They are the most popular movies on https://tmdb.com by number of votes. More movies may be added in the future based on performance.</Typography>
        </InfoSection>
        <InfoSection>
            <Typography variant={'h4'}>Why do songs take forever to load?</Typography>
            <Typography variant={'body1'}>The main bottleneck in the song scoring pipeline is how lyrics are fetched. Unfortunately, there is no (free) unified source of song lyrics that can be gotten programmatically. Instead, data is scraped from https://genius.com, but it takes several seconds per song and sometimes they don't even have lyrics there. After a song is loaded for the first time, it is cached for future use, but it's impossible to preemptively load every song before they're requested. I've tried to offset this by streaming songs as they come in and using a visual progress indicator.</Typography>
        </InfoSection>
        <InfoSection>
            <Typography variant={'h4'}>These movies aren't even close to this song!</Typography>
            <Typography variant={'body1'}>Yeah, sorry. Algorithms aren't perfect and sometimes have weird results. If you wanted specific movies to go with a playlist, you're welcome to make your own list.</Typography>
        </InfoSection>
    </>
}