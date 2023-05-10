export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  type: "user" | "member" | "subscription";
  dateCreated: Date;
  dateMemberPaidExpire?: Date;
}
