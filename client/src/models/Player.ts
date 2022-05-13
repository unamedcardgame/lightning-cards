export default interface Player {
    name: string;
    turn: boolean;
    gid: string;
    cards: number;
    reaction: {
        result: any;
        gesture: any;
    } // TODO(2): Figure out the types
}