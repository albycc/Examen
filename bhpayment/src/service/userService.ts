import axios from "axios";
import config from "../config.json";
import { IUserRegister } from "../models/IUser";

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
