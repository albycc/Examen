"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const userUtils_1 = require("../db/utils/userUtils");
exports.userRoute = express_1.default.Router();
exports.userRoute.get("/api/getUserById/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = (0, userUtils_1.findUserById)(id);
        res.send(user);
    }
    catch (err) {
        res.send(err);
    }
}));
exports.userRoute.get("/api/getUserByEmail/:email", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    try {
        const user = (0, userUtils_1.findUserByEmail)(email);
        res.send(user);
    }
    catch (err) {
        res.send(err);
    }
}));
exports.userRoute.post("/api/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    const user = (0, userUtils_1.findUserByEmail)(email);
    if (user) {
        if (user.password === password) {
            res.status(200).send(user);
        }
        else {
            res.send({ message: "incorrect-password", user: user });
        }
    }
    else {
        res.send({ message: "no-such-user" });
    }
}));
exports.userRoute.post("/api/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, email, password } = req.body;
    const user = (0, userUtils_1.findUserByEmail)(email);
    if (user) {
        res.send({ message: "user-already-exists" });
    }
    else {
        const user = {
            id: Math.random().toString().slice(2),
            name,
            email,
            password,
            type: "user",
            dateCreated: new Date(),
        };
        console.log("user: ", user);
        (0, userUtils_1.putNewUser)(user);
        res.send(user);
    }
}));
exports.userRoute.post("/registerMembership", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("/registerMembership");
    try {
        let { id, type } = req.body;
        const users = (0, userUtils_1.getUsers)();
        const userObject = users.find((user) => user.id === id);
        if (userObject) {
            userObject.type = type;
            const memberExpirePaidDate = new Date();
            let year = memberExpirePaidDate.getFullYear();
            year++;
            memberExpirePaidDate.setFullYear(year);
            userObject.dateMemberPaidExpire = memberExpirePaidDate;
            (0, userUtils_1.editUser)(userObject);
            res.send({ message: "success" });
        }
        else {
            res.send({ message: "failed" });
        }
    }
    catch (err) {
        res.send(err);
    }
}));
