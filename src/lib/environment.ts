export const isDev = () => !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

export const getApi = () => {
    if (!isDev()) {
        return "https://song.phqsh.me/api/rank_movies?songs="
    } else {
        return "http://127.0.0.1:8000/rank_movies?songs="
    }
}

export const getRedirect = () => {
    if (!isDev()) {
        return "https://song.phqsh.me/"
    } else {
        return "http://127.0.0.1:5173"
    }
}