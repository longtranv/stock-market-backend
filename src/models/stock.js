const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema(
    {
        name: String,
        timestamp: Date,
        open: Number,
        close: Number,
        high: Number,
        low: Number,
        volume: Number,
        metadata:{
            ticker: String,
            company: String,
            logo: String,
            exchange: String
        }
    },
    {
        timeseries:{
            timeField: 'timestamp',
            metaField: 'metadata',
            granularity: 'hours'
        }
    }
);

StockSchema.statics.isExisting = async function (stockName, excludeId){
    const stock  = await this.findOne({name: stockName, _id: { $ne: excludeId }});
    return !!stock;
}
const Stock = mongoose.model('Stock', StockSchema);

module.exports = Stock;


