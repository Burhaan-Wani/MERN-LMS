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

export default function LogIn() {
    return (
        <form>
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
                            id="email"
                            type="email"
                            placeholder={"johndoe@gmail.com"}
                        />
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="********"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className={"w-full"}>Log In</Button>
                </CardFooter>
            </Card>
        </form>
    );
}
