const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');
const catchAsync = require('../utils/catchAsync');
const orderService = require('../services/order');
const portfolioService = require('../services/portfolio');
const stockService = require('../services/stock');
const walletService = require('../services/wallet');
const userService = require('../services/user');
const mailService = require('../services/email')

const createOrder = catchAsync(async(req, res)=>{
   const order = {...req.body};
   //check sell order valid
   if(order.orderType==='sell'){
      const userPortfolio = await portfolioService.getPortfolio(order.symbol, order.userId);
      if(!userPortfolio){throw new ApiError(httpStatus.NOT_FOUND, 'portfolio has not created')}
      if(userPortfolio.quantity<order.quantity){
         throw new ApiError(httpStatus.NOT_ACCEPTABLE, "the quantity of this stock in your asset is not enough to proceed");
      }
   }
   //check buy order valid
   if(order.orderType==='buy'){
      const userWallet = await walletService.getWallet(order.userId);
      if(userWallet.balance < order.price*order.quantity){
         throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'your balance is not enough to make this order ')
      }
   }
   //check price constraint
   const onlyDate = new Date(order.created_at);
   const inputDate = onlyDate.toISOString().split('T')[0];
   const stock = await stockService.getStock(order.symbol, inputDate);
   if(order.price>(stock.open+7/100*stock.open) || order.price<(stock.open-7/100*stock.open)){
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, "the price of your order exceeds the ceiling price or below the floor price of market")
   }
   //perform order matching
   const matchOrderList = await orderService.matchLimitOrder(order);
   const userPortfolio = await portfolioService.getPortfolio(order.symbol, order.userId);
   if(!userPortfolio){
      await portfolioService.createPortfolio(order.userId, order.symbol);
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
      
      const userPortfolio = await portfolioService.getPortfolio(order.symbol, order.userId);
      const itemPortfolio = await portfolioService.getPortfolio(item.symbol, item.userId);
      const userWallet = await walletService.getWallet(order.userId);
      const itemWallet = await walletService.getWallet(item.userId);
      //const user = await userService.getUserById(item.userId);
      if(order.orderType==='sell'){
         userPortfolio.quantity -= req.body.quantity - order.quantity;
         itemPortfolio.quantity += req.body.quantity - order.quantity;
         userWallet.balance += order.price*(req.body.quantity - order.quantity);
         if(itemWallet.balance < order.price*(req.body.quantity - order.quantity)){
            item.status = 'cancelled';
            // await mailService.sendEmail(user.email, "Order cancelled", `your order ${item.id} has been cancelled because your balance is insufficient`);
         }else{
         itemWallet.balance -= order.price*(req.body.quantity - order.quantity);}
         
      }else if(order.orderType === 'buy'){
         userPortfolio.quantity += req.body.quantity - order.quantity;
         if(itemPortfolio.quantity < req.body.quantity - order.quantity){
            item.status = 'cancelled';
            //await mailService.sendEmail(user.email, 'Order cancelled', `your order ${item.id} has been cancelled because your quantity of stock is insufficient`)
         }else{
         itemPortfolio.quantity -= req.body.quantity - order.quantity;}
         userWallet.balance -= order.price*(req.body.quantity - order.quantity);
         itemWallet.balance += order.price*(req.body.quantity - order.quantity);
      }
      await portfolioService.updatePortfolio(order.userId, order.symbol, userPortfolio);
      await portfolioService.updatePortfolio(item.userId, item.symbol, itemPortfolio);
      await walletService.updateWallet(order.userId, userWallet);
      await walletService.updateWallet(item.userId, itemWallet);
      await orderService.updateOrderbyId(item.id, item);
   });
   const createdOrder = await orderService.createOrder(order);
   await stockService.updateCurrentPrice(order.symbol);
   res.status(httpStatus.CREATED).send(createdOrder);
});

const getOrders = catchAsync(async(req, res)=>{
   const orders = await orderService.getAllOrders(req.body);
   res.send(orders);
});

const cancelOrder = catchAsync(async(req, res)=>{
   const updateBody = {
      status: 'cancelled'
   }
   const cancelledOrder = await orderService.updateOrderbyId(req.body, updateBody);
   res.status(httpStatus.OK).send(cancelledOrder);
});

module.exports = {
   createOrder,
   getOrders,
   cancelOrder
}

