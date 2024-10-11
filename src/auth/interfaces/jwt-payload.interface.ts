export interface JwtPayload {
	id: string // User id
	iat: number
	exp: number
}
