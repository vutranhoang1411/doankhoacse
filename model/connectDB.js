const knex = require('knex')({
    client:process.env.DB,
    connection:{
        host:process.env.DBhost,
        port:process.env.DBport,
        user:process.env.DBuser,
        password:process.env.DBpassword,
        database:process.env.DBtable,
        timezone: 'UTC',
        dateStrings: true
    }
})
module.exports=knex;