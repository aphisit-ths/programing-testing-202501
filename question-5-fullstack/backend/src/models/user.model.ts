export class User {
    name:string;
    age:number;
    email:string
    avatarUrl:string
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
