interface JwtPayloadCreateExpenses {
  username: string;
  sub: string;
  iat: number;
  exp: number;
}

interface JwtPayloadGetAllExpenses {}

interface JwtPayloadGetOneExpenses {}

interface JwtPayloadUpdateExpenses {}

interface JwtPayloadDeleteExpenses {}

export interface JwtPayloadUserCreateExpenses {
  user: JwtPayloadCreateExpenses;
}
