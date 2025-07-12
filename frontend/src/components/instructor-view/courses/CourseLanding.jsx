import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    courseCategories,
    courseLevelOptions,
    languageOptions,
} from "@/config";
import { useInstructorContext } from "@/context/instructor/context";
import React from "react";

/**
 * title: "",
        category: "",
        level: "",
        primaryLanguage: "",
        subtitle: "",
        description: "",
        pricing: "",
        objectives: "",
        welcomeMessage: "",
        image: "",
 */
export default function CourseLanding() {
    const { landingPageFormData, setLandingPageFormData } =
        useInstructorContext();

    const handleChange = (eOrKey, value) => {
        if (typeof eOrKey === "string" && value !== undefined) {
            // Direct key-value usage
            setLandingPageFormData(curr => ({
                ...curr,
                [eOrKey]: value,
            }));
        } else {
            // Normal event-based usage
            const e = eOrKey;
            setLandingPageFormData(curr => ({
                ...curr,
                [e.target.name]: e.target.value,
            }));
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Course Landing Page</CardTitle>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="mt-2">
                            <Label>Title</Label>
                            <Input
                                name={"title"}
                                value={landingPageFormData.title}
                                className={"mt-3"}
                                type={"input"}
                                placeholder={"Enter course title"}
                                onChange={handleChange}
                            />
                        </div>
                        <div
                            className="mt-3
                        "
                        >
                            <Label>Category</Label>
                            <Select
                                value={landingPageFormData.category}
                                onValueChange={value =>
                                    handleChange("category", value)
                                }
                            >
                                <SelectTrigger className="w-full mt-3">
                                    <SelectValue placeholder="Web Development" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseCategories.map(category => (
                                        <SelectItem
                                            value={category.id}
                                            key={category.id}
                                        >
                                            {category.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div
                            className="mt-3
                        "
                        >
                            <Label>Level</Label>
                            <Select
                                value={landingPageFormData.level}
                                onValueChange={value =>
                                    handleChange("level", value)
                                }
                            >
                                <SelectTrigger className="w-full mt-3">
                                    <SelectValue placeholder="Beginner" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseLevelOptions.map(option => (
                                        <SelectItem
                                            value={option.id}
                                            key={option.id}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div
                            className="mt-3
                        "
                        >
                            <Label>Primary Language</Label>
                            <Select
                                value={landingPageFormData.primaryLanguage}
                                onValueChange={value =>
                                    handleChange("primaryLanguage", value)
                                }
                            >
                                <SelectTrigger className="w-full mt-3">
                                    <SelectValue placeholder="English" />
                                </SelectTrigger>
                                <SelectContent>
                                    {languageOptions.map(language => (
                                        <SelectItem
                                            value={language.id}
                                            key={language.id}
                                        >
                                            {language.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mt-3">
                            <Label>Subtitle</Label>
                            <Input
                                value={landingPageFormData.subtitle}
                                name={"subtitle"}
                                className={"mt-3"}
                                type={"input"}
                                placeholder={"Enter course subtitle"}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-3">
                            <Label>Description</Label>
                            <Textarea
                                value={landingPageFormData.description}
                                name={"description"}
                                className={"mt-3"}
                                type={"textarea"}
                                placeholder={"Enter course description"}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-3">
                            <Label>Pricing</Label>
                            <Input
                                value={landingPageFormData.pricing}
                                name={"pricing"}
                                className={"mt-3"}
                                type={"input"}
                                placeholder={"Enter course price"}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-3">
                            <Label>Objectives</Label>
                            <Textarea
                                value={landingPageFormData.objectives}
                                name={"objectives"}
                                className={"mt-3"}
                                type={"textarea"}
                                placeholder={"Enter course objectives"}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-3">
                            <Label>Welcome Message</Label>
                            <Textarea
                                name={"welcomeMessage"}
                                value={landingPageFormData.welcomeMessage}
                                className={"mt-3"}
                                type={"textarea"}
                                placeholder={
                                    "Write welcome message for students"
                                }
                                onChange={handleChange}
                            />
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
