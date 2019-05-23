const Sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

// create a sequelize instance with our local mysql database information.
const sequelize = new Sequelize("photo_album","root", "satyam", {
    host: "localhost",
    dialect: "mysql"
});

// setup User model and its fields.
var User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    firstname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }
});

User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password,this.password)  
}

var Album = sequelize.define("albums", {
    album_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    album_desc: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    user : {
        type: Sequelize.STRING,
        allowNull: false
    }
})

var Photo = sequelize.define("photos", {
    photo_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    photo_desc: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    album: {
        type: Sequelize.STRING,
        allowNull: false
    },
    file_name: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('Connected to database...'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = { sequelize, User, Album, Photo};