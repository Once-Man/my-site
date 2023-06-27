const User = require('../models/User');
const fs = require('fs');

getAllUsers = async(req, res) => {
    const users = await User.find({});
    res.render('index', {
        title: 'home',
        users: users
        });
}

addUser = async(req, res) => {
    res.render('add-user', {title: 'add-user'});
}

addUserandStore = async(req, res) => {
    try{
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename,
        });
       await user.save();
        req.session.message = {
            type: 'success',
            message: 'User added successfully!'
        }
        res.redirect('/');
    }catch(error){
        console.log(error.message);
    }
}

editUser = async(req, res) => {
    const id = req.params.id;
    const user = await User.findById({_id: id});
    res.render('edit-user', {
        title: 'edit-user',
        user: user 
    });
}

updateUser = async(req, res) => {
    const id = req.params.id;
    var new_image = '';
    try{
        if(req.file){
            new_image = req.file.filename;
            fs.unlinkSync('public/uploads/' + req.body.old_image);
        }else{
            new_image = req.body.old_image;
        }

        await User.findByIdAndUpdate(id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: new_image 
        }, {new: true});
        req.session.message = {
            type: 'success',
            message: 'User updated successfully!'
        };
        res.redirect('/');
    }catch(error){
        console.log(error.message);
    }
}

deleteUser = async(req, res) => {
    const id = req.params.id;
    const user = await User.findByIdAndRemove({_id: id});
    fs.unlinkSync('public/uploads/' + user.image);
    req.session.message = {
        type: 'success',
        message: 'User deleted successfully!'
    };
    res.redirect('/');
}

module.exports = {
    getAllUsers,
    addUser,
    addUserandStore,
    editUser,
    updateUser,
    deleteUser
}