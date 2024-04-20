const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/', adminController.createAdmin);

router.get('/', adminController.getAdmin);

router.post('/login-admin', adminController.loginAdmin);

router.delete('/volunteers/delete', adminController.deleteVolunteer);

router.get('/volunteers/infos', adminController.getVolunteer);

router.get('/volunteers', adminController.getAllVolunteers);

router.get('/volunteers/latest-volunteers', adminController.getLatestVolunteers);

router.get('/beneficiaires', adminController.getAllBeneficiaires);

router.post('/beneficiaires/update-status', adminController.updateBeneficiaryStatus);

router.delete('/beneficiaires/delete', adminController.deleteBeneficiary);

router.get('/admins',adminController.getAllAdmins);

router.delete('/delete', adminController.deleteAdmin);

router.post('/addAdmin', adminController.addVolunteerToAdmins);

router.post('/volunteers/update-status', adminController.updateVolunteerStatus);

router.get('/activities/latest', adminController.getLatestActivities);

router.get('/activites', adminController.getActivities);

router.get('/services', adminController.getAllServices);

router.get('/all', adminController.getAllVolunteersAndBeneficiaries);

router.get('/all/latest', adminController.getAllLatestVolunteersAndBeneficiaries);

router.post('/addActivityPrive', adminController.createActivityPrive);

router.get('/volunteers/:id', adminController.getVolunteerById);

router.get('/beneficiaires/:id', adminController.getBeneficiaryById);

router.post('/addActivity', adminController.createActivity);

router.get('/activites/:ID_Activite', adminController.showEvent);
    
router.put('/activites/update/:ID_Activite', adminController.updateActivity);

router.post('/blogs/create', adminController.createBlog);

router.get('/blogs', adminController.getAllBlogs);

router.post('/addFormation', adminController.createFormation);

router.post('/addPartenaire', adminController.addPartenaire);

router.delete('/Partenaires/delete', adminController.deletePartenaire);

router.get('/Partenaires', adminController.getAllPartenaires);

router.get('/activites/registrations/:ID_event', adminController.getRegistrations);
router.post('/activites/registrations', adminController.addRegistration);
router.delete('/activites/registrations/:ID_event/volunteers/:ID_Benevole', adminController.removeVolunteerFromEvent);


router.post('/notifications', adminController.sendNotification);

module.exports = router;
