import Player from './Player'
import Reaction from "./Reaction";

export default interface Game {
    id: string;
    players: { [gid: string]: Player };
    host: boolean;
    reactionReady: boolean;
    roundLoser: {
        name: string;
        reaction: Reaction;
    };
    winner: { name: string, gid: string };
    rules: any; // TODO(3): Configurable rules;
    reacted: boolean;
}