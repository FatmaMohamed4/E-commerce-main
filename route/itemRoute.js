const express=require('express');
const router=express.Router();
const { addItem, getItems, getItemById, updateItem, deleteItem, deleteAllItems } = require('../controller/itemController.js');

const { protect, restrictTo } = require('../utilites/authentication.js');



router.post('/add',protect,restrictTo(),addItem)

router.get('/all',protect,getItems)
router.get('/:id',protect,getItemById)

router.patch('/:id',protect,restrictTo(),updateItem)

router.delete('/:id' ,protect,restrictTo(),deleteItem)
router.delete('/delete/all',protect,restrictTo(),deleteAllItems)
module.exports=router;
