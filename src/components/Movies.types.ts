import {type SimplifiedPlaylist, SpotifyApi, type Track} from "@spotify/web-api-ts-sdk";
import type {ISuspender} from "../lib/suspense.ts";
import * as React from "react";

export interface MoviesProps {
    client: SpotifyApi
}

export interface UserData {
    top_tracks: Track[][],
    playlists: SimplifiedPlaylist[]
}

export interface UserProfileProps {
    client: SpotifyApi,
    promise: ISuspender<UserData>,
    dispatch: React.Dispatch<React.SetStateAction<Track[]>>,
    trackData: MovieAnalysis | null
}

export interface MovieResultsProps {
    data: ISuspender<MovieAnalysis>,
    dispatch: React.Dispatch<React.SetStateAction<MovieAnalysis | null>>
}

export interface TrackDetailProps {
    analysis: MovieAnalysis | null
}

export interface MovieAnalysis {
    movies: Movie[],
    songs: Song[]
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