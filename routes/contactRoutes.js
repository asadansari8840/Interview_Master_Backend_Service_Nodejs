import express from "express";
import { createContact, deleteContact, downloadExcelFile, getAllOrSpecificContacts, updateContact } from "../controllers/contactController.js";

const router = express.Router();

router.route("/contacts").get(getAllOrSpecificContacts).post(createContact).delete(deleteContact)
router.route("/contacts/:id").put(updateContact);
router.route("/dowloadexcelfile").post(downloadExcelFile);
export default router;