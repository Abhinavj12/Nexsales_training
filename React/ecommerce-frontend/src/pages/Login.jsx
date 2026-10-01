import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

export const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await loginUser({
                email,
                password
            })
            console.log("Login Response:", response);
            const accessToken = response.data.accessToken;
            const user = response.data.user;

            //Now storing JWT
            localStorage.setItem(
                "token",
                accessToken
            );

            //Now storing User infromaton
            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );
            // Now storing User role
            localStorage.setItem(
                "role",
                user.role
            );
            console.log("Token stored");
            console.log("Role:", user.role);

            if (user.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/user/dashboard");
            }
        } catch (error) {
            console.log("Login Error", error);
        }

        // console.log("Email:",email);
        // console.log("Password:",password);
    }
    return (
        <div>
            <h1> Ecommerce Login</h1>

            <form onSubmit={handleLogin}>
                <div>
                    <label>Email </label>
                    <input
                        type="Email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <label> Password </label>

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit">
                    Login
                </button>
            </form>

        </div>
    )
}