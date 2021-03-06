const express=require('express');
const routes=express.Router();
const { userCheckin, emit_testing, render_in, render_out, render_test, confirmCheckout, confirmCheckin } = require('../controller/controller.js');
routes.route('/checkin').post(userCheckin)
routes.route('/confirm/checkin').post(confirmCheckin);
routes.route('/confirm/checkout').post(confirmCheckout);
routes.route('/emit_testing').post(emit_testing);
routes.route('/in').get(render_in);
routes.route('/out').get(render_out);
routes.route('/test').get(render_test);

module.exports=routes;