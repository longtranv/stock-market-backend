const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');
const Stock = require('../models/stock');

const createStock = async (stock)=>{
    if(await Stock.isExisting(stock.name)){
        throw new ApiError(httpStatus.BAD_REQUEST, "this stock already exist in database");
    }
    return Stock.create(stock);
}

const insertNewDayStocks = async (todayStock) =>{
    return Stock.insertMany(todayStock);
}

const queryStock = async (queryBuilder)=>{
    return Stock.find(queryBuilder)
}

const getStock = async(symbol, date)=>{
    const stock = await Stock.findOne({name: symbol, timestamp: date})
    if(!stock){
        throw new ApiError(httpStatus.NOT_FOUND, "stock not found");
    }
    return stock;
}

const getAllStocks = async ()=>{
    const stocks = await Stock.find();
    return stocks;
}

module.exports = {
    createStock,
    queryStock,
    getAllStocks,
    insertNewDayStocks,
    getStock
}