import Express, { Request, Response } from "express";
import stripe from "../stripe/stripeVars";
import {
  editUser,
  findUserByEmail,
  findUserById,
  getUsers,
  putNewUser,
} from "../db/utils/userUtils";
import { IUser } from "../models/IUser";
const fs = require("fs");

export const userRoute = Express.Router();

interface IRequestBodyRegister {
  email: string;
  type: "member" | "subscription";
}

interface IRequestBodyLogin {
  name: string;
  email: string;
  password: string;
}

userRoute.get("/api/getUserById/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = findUserById(id);
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

userRoute.get(
  "/api/getUserByEmail/:email",
  async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
      const user = findUserByEmail(email);
      res.send(user);
    } catch (err) {
      res.send(err);
    }
  }
);

userRoute.post("/api/login", async (req: Request, res: Response) => {
  let { email, password }: IRequestBodyLogin = req.body;
  const user = findUserByEmail(email);
  if (user) {
    if (user.password === password) {
      res.status(200).send(user);
    } else {
      res.send({ message: "incorrect-password", user: user });
    }
  } else {
    res.send({ message: "no-such-user" });
  }
});

userRoute.post("/api/register", async (req: Request, res: Response) => {
  let { name, email, password }: IRequestBodyLogin = req.body;

  const user = findUserByEmail(email);

  if (user) {
    res.send({ message: "user-already-exists" });
  } else {
    const user: IUser = {
      id: Math.random().toString().slice(2),
      name,
      email,
      password,
      type: "user",
      dateCreated: new Date(),
    };
    putNewUser(user);

    res.send({ user });
  }
});

userRoute.post("/registerMembership", async (req: Request, res: Response) => {
  console.log("/registerMembership");
  try {
    let { id, type } = req.body;

    const users = getUsers();
    const userObject = users.find((user) => user.id === id);

    if (userObject) {
      userObject.type = type;
      const memberExpirePaidDate = new Date();
      let year = memberExpirePaidDate.getFullYear();
      year++;
      memberExpirePaidDate.setFullYear(year);
      userObject.dateMemberPaidExpire = memberExpirePaidDate;
      editUser(userObject);
      res.send({ message: "success" });
    } else {
      res.send({ message: "failed" });
    }
  } catch (err) {
    res.send(err);
  }
});
