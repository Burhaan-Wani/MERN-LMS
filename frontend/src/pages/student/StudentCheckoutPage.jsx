import { useAuthContext } from "@/context/auth/context";
import { useStudentContext } from "@/context/student-context/context";
import axiosInstance from "@/lib/axios";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CheckoutPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { courseDetails, fetchCourseDetails } = useStudentContext();
    const { user } = useAuthContext();

    const createOrder = async () => {
        const body = {
            coursePricing: courseDetails.pricing,
            courseTitle: courseDetails.title,
        };
        const res = await axiosInstance.post("/orders/create", body, {
            withCredentials: true,
        });
        return res.data.orderId;
    };

    const onApprove = async data => {
        const { orderID, payerID, paymentID } = data;
        const body = {
            payerId: payerID,
            paymentId: paymentID,
            orderId: orderID,
            orderData: {
                userId: user.user._id,
                paymentMethod: "paypal",
                orderDate: new Date(),
                instructorId: courseDetails.instructorId,
                courseId: courseDetails._id,
                coursePricing: courseDetails.pricing,
            },
        };
        try {
            const res = await axiosInstance.post("/orders/capture", body, {
                withCredentials: true,
            });

            if (res.data.status === "success") {
                navigate("/thank-you");
            }
        } catch (error) {
            //TODO: Implement functionality to redirect the user to failed payment page if payment fails.
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCourseDetails(id);
    }, [id]);

    if (!courseDetails) {
        return (
            <div className="h-[100vh] flex items-center justify-center">
                <Loader className="animate-spin" />
            </div>
        );
    }
    return (
        <div className="p-8 max-w-2xl mx-auto grid md:grid-cols-2 gap-8">
            <div>
                <h1 className="text-2xl font-bold">Checkout</h1>
                <div className="mt-4 p-4 border rounded-lg bg-slate-50">
                    <h2 className="text-lg font-semibold">
                        {courseDetails.title}
                    </h2>
                    <p className="text-2xl font-bold mt-2">
                        ${courseDetails.pricing}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                        You are about to purchase this course. Complete your
                        payment to get instant access.
                    </p>
                </div>
            </div>

            {/* Payment Column */}
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Select Payment Method
                </h2>
                <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={createOrder}
                    onApprove={onApprove}
                />
            </div>
        </div>
    );
};

export default CheckoutPage;
