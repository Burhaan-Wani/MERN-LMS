import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";

function InstructorDashboard({ listOfCourses }) {
    function calculateTotalStudentsAndProfit() {
        const { totalStudents, totalProfit } = listOfCourses.reduce(
            (acc, course) => {
                const studentCount = course.students.length;
                acc.totalStudents += studentCount;
                acc.totalProfit += course.pricing * studentCount;

                return acc;
            },
            {
                totalStudents: 0,
                totalProfit: 0,
            }
        );

        return {
            totalProfit,
            totalStudents,
        };
    }

    const config = [
        {
            icon: Users,
            label: "Total Students",
            value: calculateTotalStudentsAndProfit().totalStudents,
        },
        {
            icon: DollarSign,
            label: "Total Revenue",
            value: calculateTotalStudentsAndProfit().totalProfit,
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {config.map((item, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {item.label}
                            </CardTitle>
                            <item.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {item.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default InstructorDashboard;
