export default interface Users {
    [userSocketId: string]: {
        gid: string,
        gameId: string
    }
}