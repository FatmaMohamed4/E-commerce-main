const Item = require("../model/itemModel.js")
const { AppError } = require("../utilites/appError.js")
const catchError = require("../utilites/catchError.js")

exports.addItem =catchError(async (req,res)=>{
        const item = await Item.create(req.body)
            res.status(201).json({
                status:true,
                message:"new item is added",
                item :item
            })
    }
   )
exports.getItems =catchError(async (req,res,next) =>{
    
      const items = await Item.find()
      res.status(201).json({
        status:true,
        message:"Items",
        items:items ,
      
        
    })
    next(new AppError("Items not found" , 404))
})

exports.getItemById =catchError(async (req,res,next)=>{
    
    const id = req.params.id
    const item = await Item.findById({_id:id}) 

    if (item){
       res.status(201).json({
           status:true,
           item :item
       })}

       next(new AppError('Item not found' , 404))
   })
    

exports.updateItem = catchError(async (req,res, next) =>{
   
        const id = req.params.id
     const item = await Item.findByIdAndUpdate({_id:id},{$set:req.body},{new:true}) 


     if (item){
        res.status(201).json({
            status:true,
            message :"Item is updated " ,
            updatedItem :item
        })
    }else {
        return next(new AppError('Item not found' , 404))
    }
 })
////
 
exports.deleteItem = catchError(async (req,res) =>{
    
        const id = req.params.id
        const item = await Item.findByIdAndDelete({_id:id},{new:true}) 
   
        if (item){
           res.status(201).json({
               status:true,
               message :"Item is deleted " ,
            //    item :item
           })
       }else {
        return next(new AppError('Item not found' , 404))
       }
   })

exports.deleteAllItems = catchError(async (req,res)=>{

        const items = await Item.find().deleteMany()
        if(!items){
           return next(new AppError('Items are not found' , 404))
        }
        res.status(201).json({
          status:true,
          message:"Items deleted",
      })
})

