const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
    ConcertId:{
        type:String,
        unique:true
    },
    ConcertName: {
        type: String,
        required: [true,'Name is required'],

    },
    date:{
        type:Date,
        required: [true, 'Date and time required'],
        validate:{
            validator: (value)=>{
                return value > new Date();
            },
            message: ' Date must be a future date'
        }
    },
    venue:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    TotalTickets:{
        type:Number,
        required:true
    },
    userId:{

        required:true,
        type : String

    }

});
const Concert= mongoose.model ('concert',concertSchema);
module.exports= Concert;