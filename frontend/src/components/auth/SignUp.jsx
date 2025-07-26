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
import axiosInstance from "@/lib/axios";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUp() {
    const [signUpData, setSignUpData] = useState({
        userName: "",
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = e => {
        setSignUpData(data => ({ ...data, [e.target.name]: e.target.value }));
    };
    const handleSubmit = async function (e) {
        e.preventDefault();
        try {
            setError("");
            setIsLoading(true);

            const res = await axiosInstance.post("/auth/register", signUpData, {
                withCredentials: true,
            });

            if (res.data?.status === "success") {
                toast(res.data?.message); //
                setSignUpData({
                    userName: "",
                    email: "",
                    password: "",
                });
            }
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Create a new account</CardTitle>
                    <CardDescription>
                        Enter your details to get started
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="userName">User name</Label>
                        <Input
                            value={signUpData.userName}
                            name="userName"
                            type={"text"}
                            id="userName"
                            placeholder="Enter your username"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            value={signUpData.email}
                            name="email"
                            type={"email"}
                            id="email"
                            placeholder="johndoe@gmail.com"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            value={signUpData.password}
                            name="password"
                            type={"password"}
                            id="password"
                            placeholder="********"
                            onChange={handleChange}
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button
                        disabled={isLoading}
                        type="submit"
                        className={"w-full"}
                    >
                        Sign Up
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
