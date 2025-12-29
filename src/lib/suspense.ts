export interface ISuspender<T> {
    read(): T;
}

export const createSuspender = <T,>(promise: Promise<T>): ISuspender<T> => {
    let status: string = 'pending';
    let response: T;

    const suspender: Promise<void> = promise.then(
        (result) => {
            status = "susccess";
            response = result;
        },
        (error) => {
            status = "error";
            response = error;
        }
    );
    const read = (): T => {
        switch (status) {
            case 'pending':
                throw suspender;
            case 'error':
                throw response;
            default:
                return response;
        }
    }
    return { read }
}