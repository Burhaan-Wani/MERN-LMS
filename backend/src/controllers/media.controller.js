const {
    uploadToCloudinary,
    deleteFromCloudinary,
} = require("../lib/uploadToCloudinary");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const uploadSinglefile = catchAsync(async (req, res, next) => {
    const result = await uploadToCloudinary(req.file.path);
    res.status(200).json({
        status: "success",
        data: {
            result,
        },
    });
});

const deleteSingleFile = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new AppError("Asset ID is required", 400));
    }
    await deleteFromCloudinary(id);
    res.status(200).json({
        status: "success",
        message: "Asset deleted successfully",
    });
});

const bulkuploadFiles = catchAsync(async (req, res, next) => {
    const uploadPromises = req.files.map(file => uploadToCloudinary(file.path));

    const bulkuploads = await Promise.all(uploadPromises);

    res.status(200).json({
        status: "success",
        message: "bulk upload successful",
        data: {
            uploads: bulkuploads,
        },
    });
});

module.exports = {
    uploadSinglefile,
    deleteSingleFile,
    bulkuploadFiles,
};
