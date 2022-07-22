const routes = require('express').Router();
const controllerAutenticacao = require('../controllers/controllerAutenticacao');
const controllerHook = require('../controllers/controllerHook');

routes.post('/autenticacao', controllerAutenticacao.autenticacao, controllerAutenticacao.createBilling, controllerAutenticacao.getQrCode);
routes.post('/webhook(/pix)?', controllerHook.notificacao)

module.exports = routes;