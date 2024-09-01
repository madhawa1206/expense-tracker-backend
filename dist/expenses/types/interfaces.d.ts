interface JwtPayloadCreateExpenses {
    username: string;
    sub: string;
    iat: number;
    exp: number;
}
export interface JwtPayloadUserCreateExpenses {
    user: JwtPayloadCreateExpenses;
}
export {};
