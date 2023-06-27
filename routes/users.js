const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const { Store } = require('express-session');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + '_' + file.originalname);
    },
});

const upload = multer({storage: storage}).single('image');

router.get('/', userController.getAllUsers);
router.get('/add-user', userController.addUser);
router.post('/add-user', upload, userController.addUserandStore);
router.get('/edit/:id', userController.editUser);
router.put('/update/:id', upload, userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);

module.exports = router;