export default interface User {
    isAuthenticated: boolean;
    user?: {
        email?: string,
        id: string,
        name: string
    };
    token: any; // TODO(4): Figure out type ?
}