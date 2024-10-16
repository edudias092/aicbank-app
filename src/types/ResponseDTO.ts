export type ResponseDTO<T> = {
    action: string,
    success: boolean,
    data: T,
    errors: string[]
}