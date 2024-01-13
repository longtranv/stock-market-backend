const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');
const Stock = require('../models/stock');
const Order = require('../models/order');
const Change = require('../models/change');
const orderSevice = require('./order');

const createStock = async (stock)=>{
    if(await Stock.isExisting(stock.name)){
        throw new ApiError(httpStatus.BAD_REQUEST, "this stock already exist in database");
    }
    return Stock.create(stock);
}

const insertNewDayStocks = async (todayStock) =>{
    todayStock.map(async(stock)=>{
        const changeStock = await Change.find({symbol: stock.name});
        if(changeStock.length===0){
            await Change.create({symbol: stock.name});
        }else{

        }
    });
    return Stock.insertMany(todayStock);
}

const queryStock = async (symbol)=>{
    const stockSeries = await Stock.find({name: symbol}).sort({timestamp: 'asc'});
    if(stockSeries.length===0){throw new ApiError(httpStatus.NOT_FOUND, 'stock not found')}
    const stockChange = await Change.findOne({symbol: symbol});
    const stockVolume = await orderSevice.calculateVolume(symbol);
    const theStock = {
        series: stockSeries,
        currentprice: stockChange.current,
        change: stockChange.change,
        volume: stockVolume
    }
    return theStock;
}

const getStock = async(symbol, date)=>{
    const stock = await Stock.findOne({name: symbol, $expr: {
        $eq: [
            {$dateToString: {format: '%Y-%m-%d', date: '$timestamp'}}, date
        ]
    }});
    if(!stock){
        throw new ApiError(httpStatus.NOT_FOUND, "stock not found");
    }
    return stock;
}

const getAllStocks = async ()=>{
    const date = new Date();
    const today = date.toISOString().split('T')[0];
    const stocks = await Stock.find({$expr: {
        $eq: [
            {$dateToString: {format: '%Y-%m-%d', date: '$timestamp'}}, today
        ]
    }});
    return stocks;
}

const updateCurrentPrice = async(symbol)=>{
    const completedOrders = await Order.find({symbol: symbol, status: 'completed'});
    let averagePrice = 0;
    completedOrders.map(order=>{
        averagePrice += order.price;
    });
    averagePrice /= completedOrders.length();
    const stockChange = await Change.findOne({symbol: symbol});
    let changePercent = 0;
    if(stockChange.previous !== averagePrice && stockChange.previous !== 0){
        stockChange.current = averagePrice;
        stockChange.change = ((averagePrice-stockChange.previous)/stockChange.previous)*100;
    }
    await stockChange.save();
    return stockChange;
}

const getChange = async()=>{
    const changes = await Change.find();
    return changes;
}

module.exports = {
    createStock,
    queryStock,
    getAllStocks,
    insertNewDayStocks,
    getStock,
    updateCurrentPrice,
    getChange
}