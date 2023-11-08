const express = require("express");
const router = express.Router();
const {fetchAll, Create, Delete} = require('../controllers/developer-controller')

// Route to delete a developer by ID
router.delete("/delete-developer-by-id/:id", Delete);

/* fetch all developers */
router.get("/", fetchAll);

// create a developer
router.post("/create", Create)


module.exports = router;
