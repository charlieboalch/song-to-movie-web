import {type SimplifiedPlaylist, SpotifyApi, type Track} from "@spotify/web-api-ts-sdk";
import type {ISuspender} from "../lib/suspense.ts";
import * as React from "react";
import type {ReactNode} from "react";

export interface MoviesProps {
    client: string | SpotifyApi
}

export interface UserData {
    top_tracks: Track[][],
    playlists: SimplifiedPlaylist[]
}

export interface UserProfileProps {
    client: string | SpotifyApi,
    promise: ISuspender<UserData | null>,
    dispatch: React.Dispatch<React.SetStateAction<MovieAnalysis | null>>,
}

export interface ZeroAuthProfile {
    searchMenu: ReactNode,
    trackVectors: Song[],
    tracks: string
}

export interface MovieResultsProps {
    data: MovieAnalysis | null
}

export interface TrackDetailProps {
    analysis: Song[] | null,
    expected: number
}

export interface MovieAnalysis {
    movies: Movie[],
}

export interface Movie {
    movie: string,
    score: number,
    url: string
}

interface Song {
    track: string,
    vector: number[]
}