import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Contact from "../models/contactModel.js";

export const getAllOrSpecificContacts = catchAsyncErrors(async (req, res, next) => {
    let contacts;
    if (req.query.contactName && req.query.contactName !== undefined && req.query.contactName !== '') {
        contacts = await Contact.find({
            contactName: {
                $regex: req.query.contactName,
                $options: "i"
            }
        });
    } else {
        contacts = await Contact.find();
    }
    const totalContacts = await Contact.countDocuments();
    return res.status(200).json({
        success: true,
        contacts,
        totalContacts,
    })
});


export const createContact = catchAsyncErrors(async (req, res, next) => {
    const { contactName, mobileNo, spoc, email } = req.body;
    const contact = await Contact.create({
        contactName,
        mobileNo,
        spoc,
        email,
    });

    return res.status(200).json({
        success: true,
        message: 'Contact created successfully',
        contact,
    });
});


export const updateContact = catchAsyncErrors(async (req, res, next) => {
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
        return next(new ErrorHandler('Contact not found with this id', 404));
    };

    contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: 'Contact updated successfully',
        contact,
    });
});


export const deleteContact = catchAsyncErrors(async (req, res, next) => {
    const response = await Contact.deleteMany({
        "_id": {
            $in: req.body.deleteIds
        }
    });

    let message;
    if (response.deletedCount == 0) {
        message = 'No contact found !';
    } else if (response.deletedCount == 1) {
        message = 'Contact deleted successfully';
    } else {
        message = 'Contacts deleted successfully'
    }

    return res.status(200).json({
        success: true,
        message,
    });
});