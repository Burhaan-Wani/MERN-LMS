import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUp from "@/components/auth/SignUp";
import LogIn from "@/components/auth/LogIn";

export default function Auth() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Tabs defaultValue={"Sign Up"}>
                    <TabsList className={"w-full"}>
                        <TabsTrigger value="Sign Up">Sign Up</TabsTrigger>
                        <TabsTrigger value="Log In">Login</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Sign Up">
                        <SignUp />
                    </TabsContent>
                    <TabsContent value="Log In">
                        <LogIn />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
