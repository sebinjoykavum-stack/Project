const mongoose= require('mongoose');
const ticketSchema = new mongoose.Schema({
    userId:{type:String,
        require:true
    },
   
    ConcertId:String,
    nooftickets:{
        type:Number,
        required:true,
        min:[0, 'Atleast one ticket has to book'],
        max:[3, ' Max number of ticket with one id is 3']

    },
    TotalAmount:Number
   
});
const Ticket= mongoose.model('Ticket', ticketSchema);
module.exports=Ticket;