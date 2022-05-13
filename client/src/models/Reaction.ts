export default interface Reaction {
    timeUp: string;
    name: string;
    gid: string;
    cards: number;
    reaction: any; // TODO(1): Make a reaction type ?
}