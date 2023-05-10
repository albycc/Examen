export interface IUser {
  id: string;
  name: string;
  email: string;
  type: "user" | "member" | "subscription";
  dateCreated: Date;
  dateMemberPaidExpire?: Date;
}

export interface IUserRegister {
  name: string;
  email: string;
  password: string;
}
