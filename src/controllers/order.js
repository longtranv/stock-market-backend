const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const orderService = require('../services/order');
const portfolioService = require('../services/portfolio');
const stockService = require('../services/stock');

const createOrder = catchAsync(async(req, res)=>{
   const order = req.body;
   if(order.orderType==='sell'){
      const userPortfolio = await portfolioService.getPortfolio(order.symbol, order.userId);
      if(!userPortfolio){throw new ApiError(httpStatus.NOT_FOUND, 'portfolio has not created')}
      if(userPortfolio.quantity<order.quantity){
         throw new ApiError(httpStatus.NOT_ACCEPTABLE, "the quantity of this stock in your asset is not enough to proceed");
      }
   }
   const onlyDate = new Date(order.created_at);
   onlyDate.setHours(0,0,0,0);
   const stock = await stockService.getStock(order.symbol, onlyDate.toISOString());
   if(order.price>stock.high || order.price<stock.low){
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, "the price of your order exceeds the ceiling price or below the floor price of market")
   }
   const matchOrderList = await orderService.matchLimitOrder(order);
   const userPortfolio = await portfolioService.getPortfolio(order.symbol, order.userId);
   if(!userPortfolio){
   }
   matchOrderList.map(async(item)=>{
      if(order.quantity>item.quantity){
         order.quantity -=item.quantity;
         item.quantity = 0;
         item.status = 'completed';
      } else if(order.quantity===item.quantity){
         order.quantity = 0;
         item.quantity = 0;
         order.status = 'completed';
         item.status = 'completed';
      }
      else{
         item.quantity -= order.quantity;
         order.quantity = 0;
         order.status = 'completed';
      }
      await orderService.updateOrderbyId(item.id, item);
   });

   const createdOrder = await orderService.createOrder(order);
   res.status(httpStatus.CREATED).send(createdOrder);
});

module.exports = createOrder;

