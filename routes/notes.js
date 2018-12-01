var express = require('express');
var router = express.Router();
var { check, body,  validationResult } = require('express-validator/check');
var config = require('../config/options');
var models = require('../models');
var Sequelize = require('sequelize');
var Op = Sequelize.Op;
const PER_PAGE = 5;
var multer  = require('multer');
var thumbnailUpload = multer({ dest: 'public/uploads/notes' });
var upload =  thumbnailUpload.single('attachment');

/* GET home page. */
router.get('/', async function(req, res, next) {
 
  var totalExpense = await models.Transaction.sum('amount', {where:{type:1}}) || 0;
  var totalIncome  = await models.Transaction.sum('amount', {where:{type:2}}) || 0;
  var totalReceivable  = await models.Transaction.sum('amount', {where:{type:3}}) || 0;

  var type = req.query.type ? req.query.type : 0;
  var q    = req.query.q ? req.query.q : null;
  var from_date = req.query.from_date ? req.query.from_date : null;
  var to_date   = req.query.to_date ? req.query.to_date : null;
  var condition = {where:{}};
      if(type>0){
      condition.where.type = type;
      }
      if(q){
      condition.where.title = { [Op.like]: '%'+q+'%' };
      }

      if(from_date && to_date){
         condition.where.date = {[Op.between]: [from_date, to_date]};
      }else{

      if(from_date || to_date){
          let datecon = {};
           if(from_date){
              datecon = Object.assign({[Op.gte]: from_date}, datecon);
           }
           if(to_date){
             datecon = Object.assign({[Op.lte]: to_date}, datecon);
           }
           condition.where.date = datecon;
      }

      }

    let types = config.TRANSACTION_TYPES;
    let currencies = config.CURRENCIES;
    let currentPage = req.query.page ? parseInt(req.query.page) : 1;
      //pagination query 
         condition.limit = PER_PAGE;
         condition.offset = (currentPage - 1) * PER_PAGE ; 
    let result = await models.Transaction.findAndCountAll(condition); //find records and total records in db
    let pagination = {
        totalRecords : result.count,
        currentPage  : currentPage
    };

      pagination.totalPages = Math.ceil(pagination.totalRecords/PER_PAGE);
      pagination.hasNextPage = (pagination.totalPages > 1 && pagination.currentPage < pagination.totalPages) ? (pagination.currentPage + 1) : false;
      pagination.hasPrevPage = (pagination.totalPages > 1 && pagination.currentPage > 1) ? (pagination.currentPage - 1) : false;
      console.log(pagination);

    res.render('notes/index', 
      { title: 'moneyNotes', 
        transactions: result.rows,
        pagination : pagination,
        type: type,
        q: q, 
        from_date: from_date,
        to_date: to_date,
        types:types, 
        currencies: currencies,
        totalExpense: totalExpense,
        totalIncome: totalIncome,
        totalReceivable: totalReceivable,
        currentBalance: (totalIncome-totalExpense),
        expectedBalance: (totalIncome+totalReceivable) - totalExpense
      });

  // models.Transaction.findAll(condition).then((result)=>{
  //                                     res.render('index', 
  //                                             { title: 'moneyNotes', 
  //                                               transactions: result,
  //                                               type: type,
  //                                               q: q, 
  //                                               types:types, 
  //                                               currencies: currencies,
  //                                               totalExpense: totalExpense,
  //                                               totalIncome: totalIncome,
  //                                               totalReceivable: totalReceivable,
  //                                               currentBalance: (totalIncome-totalExpense),
  //                                               expectedBalance: (totalIncome+totalReceivable) - totalExpense
  //                                             });

  //                                 })
  //                                 .catch((err)=>{
  //                                   console.log("Error...");
  //                                 });

  //res.render('index', { title: 'moneyNotes', transactions: transactions, });

});


/* GET create page. */
router.get('/create', function(req, res, next) {
  let types = config.TRANSACTION_TYPES;
  res.render('notes/create', { title: 'moneyNotes' , types: types});
});

var keys = [];
for(var i = 1; i < config.TRANSACTION_TYPES.length; i++){
  keys.push(i);
}

/* POST store a note. */
router.post('/store', upload, [
  check('title').isLength({ min: 3 }).withMessage('title must be at least 3 chars long'),
  check('amount').isNumeric().withMessage('amount must be a valid number'),
  check('type').isIn(keys).withMessage("type must be a valid number"),
], function(req, res, next) {
  let formData = req.body;
    console.log(formData);


    //save uploaded file info
    let photo = req.file;
    if(photo){
      formData.attachment = photo.filename;
    }

  let errors = validationResult(req);

  if (!errors.isEmpty()) {
   // return res.status(422).json({ errors: errors.array() });
      req.flash("infos",errors.array());
      return res.redirect('/notes/create');
  }

    models.Transaction.create(formData).then((err,result)=>{
   //   console.log(err);
  //    console.log(result);
      req.flash("success","Successfully created!");
      return res.redirect("/notes");

    });
    
   
});

/* GET delete a transaction. */
router.get('/transaction/:id/remove', function(req, res, next) {
    let id = req.params.id;
       models.Transaction.destroy({where:{id:id}}).then((result)=>{
        return res.redirect("/notes");
       });

});

/* GET mark as income a transaction. */
router.get('/transaction/:id/income', function(req, res, next) {
  let id = req.params.id;
     models.Transaction.update({type:2},{where:{id:id}}).then((result)=>{
      return res.redirect("/notes");
     });

});


module.exports = router;
