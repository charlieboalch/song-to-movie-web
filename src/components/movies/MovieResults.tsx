import type {Movie, MovieResultsProps} from "../Movies.types.ts";
import {styled, Typography} from "@mui/material";
import {SubSection} from "../../lib/Content.tsx";

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

export const MovieResults = ({data}: MovieResultsProps) => {
    if (data == null) {
        return <SubSection>
            <Typography variant={'body2'}>Loading results...</Typography>
        </SubSection>
    }

    return <SubSection>
        <Typography variant={'h4'} align={'center'}>Most Similar Movies</Typography>
        <MovieGrid>
            {data.movies.map(e =>
                <MovieDisplay movie={e.movie} score={e.score} url={e.url} key={e.movie} />)}
        </MovieGrid>
    </SubSection>
}

const MovieDisplay = ({movie, score, url}: Movie) => {
    return <PosterLayout>
        <img width={128} src={`https://image.tmdb.org/t/p/original${url}`}/>
        <Typography align={'center'} variant={'body2'}>{movie} - {score.toFixed(1)}</Typography>
    </PosterLayout>
}