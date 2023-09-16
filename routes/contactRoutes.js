import express from "express";
import { createContact, deleteContact, getAllContacts, getSpecificContacts, updateContact } from "../controllers/contactController.js";

const router = express.Router();

router.route("/contacts").get(getAllContacts).post(createContact);
router.route("/contact").get(getSpecificContacts);
router.route("/contacts/:id").put(updateContact).delete(deleteContact);

export default router ;