const fs = require("fs");
const AppError = require("../utils/AppError");
const cloudinary = require("../config/cloudinary");

const uploadToCloudinary = async filePath => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });

        fs.unlinkSync(filePath); // delete local file after upload

        return {
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
        };
    } catch (error) {
        console.error("❌ Cloudinary upload failed:", error);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (fsErr) {
            console.warn("⚠️ Failed to delete local file:", fsErr.message);
        }

        // Use AppError instead of generic Error
        throw new AppError("Failed to upload file to Cloudinary", 500);
    }
};

const deleteFromCloudinary = async function (public_id) {
    try {
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.log(error);
        throw new AppError("Failed to delete file to Cloudinary", 500);
    }
};
module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
};
