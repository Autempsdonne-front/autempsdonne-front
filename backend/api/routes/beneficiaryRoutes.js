const express = require('express');
const router = express.Router();
const upload = require('../multerConfig');

const { registerBeneficiary } = require('../controllers/beneficiaryController');
const {getBeneficiaireInfo} = require('../controllers/beneficiaryController');

router.post('/registerBeneficiary', upload, registerBeneficiary);
router.get('/info/:email', getBeneficiaireInfo);

module.exports = router;