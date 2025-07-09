import { Label } from "@radix-ui/react-label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useAuthContext } from "@/context/context";
import { useNavigate } from "react-router-dom";

export default function LogIn() {
    const navigate = useNavigate();
    const { authUser } = useAuthContext();
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = e => {
        setData(curr => ({ ...curr, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            setError("");
            setIsLoading(true);
            const res = await axiosInstance.post("/auth/login", data, {
                withCredentials: true,
            });

            if (res.data.status === "success") {
                toast(res.data.message);
                await authUser();
                navigate("/home");
            }
        } catch (error) {
            console.log(error);
            setError(error.response.data.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Log in to your account</CardTitle>
                    <CardDescription>
                        Enter your email and password to access you account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            name="email"
                            value={data.email}
                            id="email"
                            type="email"
                            placeholder={"johndoe@gmail.com"}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            name="password"
                            value={data.password}
                            id="password"
                            type="password"
                            placeholder="********"
                            onChange={handleChange}
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className={"w-full"}
                    >
                        Log In
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
