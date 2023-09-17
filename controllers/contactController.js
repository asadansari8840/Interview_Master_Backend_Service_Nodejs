import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Contact from "../models/contactModel.js";
import XLSX from "xlsx";
import fs from "fs";

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


export const downloadExcelFile = catchAsyncErrors(async (req, res, next) => {
    const data = [];
    if (req.body.contacts && req.body.contacts.length > 0) {
        let filterObj = {};
        let filteredArr = [];
        //------------------------------Before looping filtering duplicate entries ------------------------------------------------------
        req.body.contacts.forEach((object) => {
            if (filterObj[object.key] == true) {
                filterObj[object.key] = true
            } else {
                filterObj[object.key] = true;
                filteredArr.push(object);
            }
            filterObj[object.key] = true;
        });
        req.body.contacts = filteredArr;
        //-------------------------------Contacts are now filtered--------------------------------------------------
        req.body.contacts.forEach((object, index) => {
            let tempObj = {};
            tempObj["ContactName"] = object.contact;
            tempObj["MobileNo"] = object.telephone;
            tempObj["SPOC"] = object.spoc;
            tempObj["Email"] = object.email;
            tempObj["CreatedOn"] = object.createdAt.slice(0, 10);
            data.push(tempObj);
        });
        const date = new Date().toISOString().slice(0, 10);
        const fileName = `Contact_Extended_Excel_Sheet_${date}.xlsx`;

        const workSheet = XLSX.utils.json_to_sheet(data);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "Contacts");
        XLSX.writeFile(workBook, fileName, { bookType: "xlsx", "type": "binary" });
        var fileReadStream = fs.createReadStream(fileName, { "encoding": "base64" });
        fileReadStream.pipe(res)
        fileReadStream.on("end", () => {
            fs.unlinkSync(fileName);
        })
    } else {
        return next(new ErrorHandler('Unable to create excel sheet , No contact data found : ( ', 404));
    }
});