const Router = require('express')
const router = new Router()
const {isAuth} = require('../controller/auth.controller')

const {postCity, getCity, putCity, deleteCity} = require('../controller/city.controller')
const {postCityValidate, putCityValidate, deleteCityValidate} = require('../controller/city.validate')

const {postMaster, getMaster, getAvailableMastersForUpdate, putMaster, deleteMaster} = require('../controller/master.controller')
const {postMasterValidate, putMasterValidate, deleteMasterValidate} = require('../controller/master.validate')

const {getOrder, putOrder, deleteOrder} = require('../controller/order.controller')
const {putOrderValidate, deleteOrderValidate} = require('../controller/order.validate')

const {getUser, putUser, deleteUser} = require('../controller/user.controller')
const {putUserValidate, deleteUserValidate} = require('../controller/user.validate')

router.get('/city', [isAuth], getCity)
router.post('/city', [isAuth, postCityValidate], postCity)
router.put('/city', [isAuth, putCityValidate], putCity)
router.delete('/city', [isAuth, deleteCityValidate], deleteCity)

router.post('/master', [isAuth, postMasterValidate], postMaster)
router.get('/master', [isAuth], getMaster)
router.get('/availableMastersforUpdate', [isAuth], getAvailableMastersForUpdate) 
router.put('/master', [isAuth, putMasterValidate], putMaster) 
router.delete('/master', [isAuth, deleteMasterValidate], deleteMaster) 

router.get('/order', [isAuth], getOrder)
router.put('/order', [isAuth, putOrderValidate], putOrder)
router.delete('/order', [isAuth, deleteOrderValidate], deleteOrder)

router.get('/user', [isAuth], getUser)
router.put('/user', [isAuth, putUserValidate], putUser)
router.delete('/user', [isAuth, deleteUserValidate], deleteUser)


module.exports = router