const express = require('express');
const AdminRouter = express.Router();
const {adminLogin} = require('../controller/Admincontroller');
const {getEducationUsers} = require('../controller/Admincontroller');
const { getHealthcareUsers} = require('../controller/Admincontroller');
const { blockEducationUser} = require('../controller/Admincontroller');
const { blockHealthcareUser} = require('../controller/Admincontroller');

const { unblockEducationUser} = require('../controller/Admincontroller');
const { unblockHealthcareUser} = require('../controller/Admincontroller');
const { addCategory} = require('../controller/Admincontroller');
const { createNews} = require('../controller/Admincontroller');
const { getAllNews } = require('../controller/Admincontroller');
const {getContacts } = require('../controller/Admincontroller');
const {sendPasswordLink } = require('../controller/Admincontroller');
const {adminforgotpassword} = require('../controller/Admincontroller');
const {resetPassword} = require('../controller/Admincontroller');
AdminRouter.post('/adminlogin',adminLogin);

AdminRouter.get('/getHealthcareUsers', getHealthcareUsers);
AdminRouter.get('/getEducationUsers', getEducationUsers);

AdminRouter.post('/blockEducationUser', blockEducationUser);
AdminRouter.post('/blockHealthcareUser', blockHealthcareUser);

AdminRouter.post('/unblockEducationUser', unblockEducationUser);
AdminRouter.post('/unblockHealthcareUser', unblockHealthcareUser);

AdminRouter.post('/addNews', createNews);

AdminRouter.post('/addCategory',addCategory );

AdminRouter.get('/getallNews',getAllNews );
AdminRouter.get('/getContacts',getContacts)



AdminRouter.post('/admin-resetpassword',sendPasswordLink)
AdminRouter.get('/admin-forgotpassword/:id/:token',adminforgotpassword)
AdminRouter.post('/admin-updatepassword/:id/:token',resetPassword)

module.exports = AdminRouter;