import { Link } from "react-router-dom";


export default function Home() {
    return (
        <div>
            <h1>home</h1>
            <Link to="/checkout">To checkout</Link>
        </div>
    )
}