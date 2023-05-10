import { IUser } from "../../models/IUser";

const fs = require("fs");

export const getUsers = (): IUser[] => {
  try {
    const jsonData = fs.readFileSync("./db/collections/Users.json");
    const users = JSON.parse(jsonData);
    return users;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const findUserByEmail = (email: string) => {
  const users = getUsers();

  const userObject = users.find((user) => user.email === email);

  return userObject;
};

export const findUserById = (id: string) => {
  const users = getUsers();

  const userObject = users.find((user) => user.id === id);

  return userObject;
};

export const putNewUser = (user: IUser) => {
  const users = getUsers();

  users.push(user);
  const jsonString = JSON.stringify(users);
  fs.writeFileSync("./db/collections/Users.json", jsonString);
};

export const editUser = (user: IUser) => {
  const users = getUsers();
  let index = users.findIndex((u) => u.id === user.id);

  if (index !== -1) {
    users[index] = user;
    console.log("users: ", users);
    const jsonString = JSON.stringify(users);
    fs.writeFileSync("./db/collections/Users.json", jsonString);
  }
};
