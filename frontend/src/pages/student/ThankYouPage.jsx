import React, { useEffect, useState } from "react";
import { useWindowSize } from "@react-hook/window-size";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
    const [showConfetti, setShowConfetti] = useState(false);
    const [width, height] = useWindowSize();
    const navigate = useNavigate();

    useEffect(() => {
        setShowConfetti(true);
        const redirect = setTimeout(() => {
            navigate("/my-courses");
        }, 6000);

        return () => {
            clearTimeout(redirect);
        };
    }, [navigate]);

    return (
        <>
            {showConfetti && <Confetti width={width} height={height} />}
            <div className="bg-gray-100 min-h-screen flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg text-center transition-all duration-700 ease-in-out">
                    <div className="text-green-500 mb-4">
                        <svg
                            className="mx-auto w-16 h-16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                            ></path>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Thank You!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Your course has been purchased successfully! You will be
                        redirected to your courses shortly.
                    </p>
                    <Button onClick={() => navigate("/my-courses")}>
                        Go to My Courses
                    </Button>
                </div>
            </div>
        </>
    );
}
