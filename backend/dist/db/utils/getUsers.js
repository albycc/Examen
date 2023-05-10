"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUser = exports.putNewUser = exports.findUserByEmail = exports.getUsers = void 0;
const fs = require("fs");
const getUsers = () => {
    try {
        const jsonData = fs.readFileSync("./db/collections/Users.json");
        const users = JSON.parse(jsonData);
        return users;
    }
    catch (err) {
        console.log(err);
        return [];
    }
};
exports.getUsers = getUsers;
const findUserByEmail = (email) => {
    const users = (0, exports.getUsers)();
    const userObject = users.find((user) => user.email === email);
    return userObject;
};
exports.findUserByEmail = findUserByEmail;
const putNewUser = (user) => {
    const users = (0, exports.getUsers)();
    users.push(user);
    const jsonString = JSON.stringify(users);
    fs.writeFileSync("./db/collections/Users.json", jsonString);
};
exports.putNewUser = putNewUser;
const editUser = (user) => {
    const users = (0, exports.getUsers)();
    let userObject = users.find((u) => u.id === user.id);
    if (userObject) {
        userObject = user;
        const jsonString = JSON.stringify(users);
        fs.writeFileSync("./db/collections/Users.json", jsonString);
    }
};
exports.editUser = editUser;
