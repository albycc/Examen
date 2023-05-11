import axios from "axios";
import config from "../config.json";
import { IUserRegister } from "../models/IUser";

/*
service file for calling different routes for the sites users from server

getUserByEmail - retrive a BH user from server by email
getUserById - retrive a BH user from server by id
login - loggs in the user. It returns the user object if it finds an existing user. Returns messages if user doesn't exists or password is incorrect
registerUser - creates user for site. Returns the user object. Returns message if user with email already exists.
registerMember - registers a user after he/she pays for membership. The users type will be either member or subscription. Returns user object
*/
export const userService = {
  getUserByEmail: async (email: string) => {
    const res = await axios.get(
      config.SERVER_URL_API + `getUserByEmail/${email}`
    );
    return res.data;
  },
  getUserById: async (id: string) => {
    const res = await axios.get(config.SERVER_URL_API + `getUserById/${id}`);
    return res.data;
  },
  login: async (email: string, password: string) => {
    const res = await axios.post(config.SERVER_URL_API + "login", {
      email,
      password,
    });

    return res.data;
  },
  registerUser: async (user: IUserRegister) => {
    let res = await axios.post(config.SERVER_URL_API + `register`, user);
    return res.data;
  },
  registerMember: async (id: string, type: string) => {
    let res = await axios.post(config.SERVER_URL + `registerMembership`, {
      id,
      type,
    });
    return res.data;
  },
};
