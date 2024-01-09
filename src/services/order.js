const Order = require('../models/order');
const stockService = require('./stock');
const httpStatus = require('http-status');
const apiError = require('../utils/apiError');

const matchLimitOrder = async(order)=>{
    let matchOrderList = [];
    if(order.orderType === 'sell'){
        matchOrderList = await Order.
        find({userId: {$ne: order.userId}, orderType: 'buy', symbol: order.symbol, status: 'pending'}).
        where('price').
        gte(order.price).
        sort({created_at: 'asc'}).
        exec()}
    else{
        matchOrderList = await Order.
        find({userId: {$ne: order.userId}, orderType: 'sell', symbol: order.symbol, status: 'pending'}).
        where('price').
        lte(order.price).
        sort({created_at: 'asc'}).
        exec();
    }
    return matchOrderList;
};

const createOrder = async(order)=>{
    const createdOrder = await Order.create(order);
    return createdOrder;
};

const findOrderbyId = async(id)=>{
    return Order.findById(id);
};

const getAllOrders = async(userid)=>{
    return Order.find({userId: userid});
}

const updateOrderbyId = async(id, updateBody)=>{
    const order = await findOrderbyId(id);
    if(!order){
        throw new apiError(httpStatus.NOT_FOUND, 'order not found');
    }
    Object.assign(order, updateBody);
    await order.save();
    return order;
}

const calculateVolume = async(symbol)=>{
    const sellOrders = await Order.find({symbol: symbol, orderType: 'sell', status: 'pending'});
    let newVolume = 0;
    sellOrders.map((order)=>{
        newVolume += order.quantity;
    });
    return newVolume;
};

module.exports = 
{
    matchLimitOrder,
    createOrder,
    findOrderbyId,
    updateOrderbyId,
    getAllOrders,
    calculateVolume
};