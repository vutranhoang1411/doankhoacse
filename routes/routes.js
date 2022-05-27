const express=require('express');
const routes=express.Router();
const { userCheckin, emit_testing, render_in, render_out, render_test } = require('../controller/controller.js');
routes.route('/checkin').post(userCheckin)
routes.route('/emit_testing').post(emit_testing);
routes.route('/in').get(render_in);
routes.route('/out').get(render_out);
routes.route('/test').get(render_test);

module.exports=routes;