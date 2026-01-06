import {Suspense, useMemo, useState} from "react";
import {createSuspender} from "../lib/suspense.ts";
import type {
    MovieAnalysis,
    MoviesProps
} from "./Movies.types.ts";
import {UserProfile} from "./movies/UserProfile.tsx";
import {MovieResults} from "./movies/MovieResults.tsx";
import {Section} from "../lib/Content.tsx";

export const Movies = ({ client }: MoviesProps) => {
    const loadUserData = async () => {
        if (typeof client == 'string') return null

        const shortTerm = await client.currentUser.topItems('tracks', 'short_term', 10);
        const mediumTerm = await client.currentUser.topItems('tracks', 'medium_term', 10);
        const longTerm = await client.currentUser.topItems('tracks', 'long_term', 10);

        const playlists = await client.currentUser.playlists.playlists()

        return {
            'top_tracks': [shortTerm.items, mediumTerm.items, longTerm.items],
            'playlists': playlists.items
        }
    }

    const [movies, setMovies] = useState<MovieAnalysis | null>(null)

    const userData = useMemo(() => {
        return createSuspender(loadUserData())
    }, [])

    return <Section>
        <Suspense>
            <MovieResults data={movies} />
            <UserProfile client={client} promise={userData} dispatch={setMovies}/>
        </Suspense>
    </Section>
}
