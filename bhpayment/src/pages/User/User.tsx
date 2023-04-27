import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom"

export default function User() {


    return (
        <div>
            <h1>user</h1>
            <Link to="/checkout">Medlem</Link>
            <Link to="/checkout">Prenumerera</Link>

        </div>
    )
}