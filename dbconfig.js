const {connect} = require('mongoose');

const conn = connect(process.env.MONGO_URI)
             .then(db=>db)
             .catch(err=>err.message)

module.exports = {conn}
