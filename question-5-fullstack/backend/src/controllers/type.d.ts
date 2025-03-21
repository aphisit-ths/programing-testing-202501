export interface IQueryParams{
    query?:string
    start?:number
    limit?:number
}


export class CreteUserDto {
    name: string;
    age: number;
    email: string;
    avatarUrl: string;
}
export class UpdateUserDto {
    email: string;
    name: string;
    age: number;
    avatarUrl: string;
}
