const mongoose = require('mongoose');

module.exports = (value, respond, modelName) => {
    return modelName
        .countDocuments({ _id: value })
        .exec()
        .then(function(count) {
            console.log(count);
            return count > 0;
        })
        .catch(function(err) {
            throw err;
        });
}; 
