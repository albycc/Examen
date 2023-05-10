import React, { createContext, useEffect, useState } from "react";
import { IUser } from "../models/IUser";

interface IUserContext {
    user: IUser | null;
    setUserState: (user: IUser | null) => void
}

export const UserContext = createContext<IUserContext>({
    user: null,
    setUserState: (user: IUser | null) => { }
})

interface Iprops {
    children: React.ReactNode;
}

const UserContextProvider = ({ children }: Iprops) => {
    const [user, setUser] = useState<IUser | null>(null)

    useEffect(() => {
        const user = sessionStorage.getItem('user')

        if (user) {
            const parsedUser = JSON.parse(user)
            setUser(parsedUser)
        }

    }, [])

    const setUserState = (user: IUser | null) => {
        if (user) {
            setUser(user)
            sessionStorage.setItem('user', JSON.stringify(user))
        } else if (user === null) {
            setUser(null)
            sessionStorage.removeItem('user')

        }
    }

    return (
        <UserContext.Provider value={{ user, setUserState }}>{children}</UserContext.Provider>
    )
}

export default UserContextProvider