const express = require('express');
const { exportCSV, exportExcel } = require('../controllers/exportController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/csv/:type', adminAuth, exportCSV);
router.get('/excel/:type', adminAuth, exportExcel);

module.exports = router;
