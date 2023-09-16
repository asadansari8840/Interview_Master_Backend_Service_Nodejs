import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Contact from "../models/contactModel.js";

export const getAllContacts = catchAsyncErrors(async (req, res, next) => {

    const totalContacts = await Contact.countDocuments();
    const contacts = await Contact.find();

    return res.status(200).json({
        success: true,
        contacts,
        totalContacts,
    })
});



export const getSpecificContacts = catchAsyncErrors(async (req, res, next) => {
    const contacts = await Contact.find({
        contactName: {
            $regex: req.query.contactName,
            $options: "i"
        }
    });

    return res.status(200).json({
        success: true,
        contacts,
    });
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
    const contact = await Contact.findById(req.params.id);

    if (!contact) { return next(new ErrorHandler('Contact not found !', 404)) };

    await contact.deleteOne();

    return res.status(200).json({
        success: true,
        message: 'Contact deleted successfully',
    });
});