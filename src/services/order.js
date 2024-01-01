const Order = require('../models/order');
const httpStatus = require('http-status');
const apiError = require('../utils/apiError');

const matchLimitOrder = async(order)=>{
    let matchOrderList = [];
    if(order.orderType === 'sell'){
        matchOrderList = await Order.
        find({userId: {$ne: order.userId}, orderType: 'buy', symbol: order.symbol}).
        where('price').
        gte(order.price).
        sort({created_at: 'asc'}).
        exec()}
    else{
        matchOrderList = await Order.
        find({userId: {$ne: order.userId}, orderType: 'sell', symbol: order.symbol}).
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

const updateOrderbyId = async(id, updateBody)=>{
    const order = await findOrderbyId(id);
    if(!order){
        throw new apiError(httpStatus.NOT_FOUND, 'order not found');
    }
    Object.assign(order, updateBody);
    await order.save();
    return order;
}

module.exports = 
{
    matchLimitOrder,
    createOrder,
    findOrderbyId,
    updateOrderbyId
};