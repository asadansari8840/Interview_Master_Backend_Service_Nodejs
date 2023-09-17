import express from "express";
import { createContact, deleteContact, getAllOrSpecificContacts, updateContact } from "../controllers/contactController.js";

const router = express.Router();

router.route("/contacts").get(getAllOrSpecificContacts).post(createContact).delete(deleteContact)
router.route("/contacts/:id").put(updateContact);

export default router;