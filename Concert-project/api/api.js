const User = require('../models/userdetialsModel');
const Concert= require('../models/concertdetialsModel');
const verifyToken= require('../middlewares/auth');
const express=require('express');
const bcrypt= require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Ticket = require('../models/ticketBookingModel');


//SIGNUP API 


router.post('/create_user_api', async (req,res)=>{
 try{  const{name, email, age, password, confirmPassword,Admin }= req.body;
    const saltRounds = 8
    const hashedPassword = await bcrypt.hash(password,saltRounds);

    const user = new User({
        name,
         email,
         age,
         password: hashedPassword,
         Admin
        });

    const validationError = user.validateSync();
    if (password !== confirmPassword){
        return res.status(400).json({message: ' Password dose not match'});
    }
    if(validationError) {
        const errors = {
            name: validationError.errors.name 
                ? validationError.errors.name.properties.message: undefined,

            email: validationError.errors.email 
                ? validationError.errors.email.properties.message: undefined,

            age: validationError.errors.age 
                ? validationError.errors.age.properties.message: undefined,

            password: validationError.errors.password 
                ? validationError.errors.password.properties.message: undefined
            
        };
        return res.status(400).json({errors});
    }
    await user.save();
    
            res.status(201).json({message : 'User sign up succesfull'});

    
} catch(error){
            console.error(error);
            if (error.code === 11000){
                return res.status(400).json({
                    messsage: "Email already taken"
                })
            }
            res.status(500).json({message:'Server Error'});
        };
    });




    //LOGIN API


    
 const JWT_SECRET= 'userSecretKey'
router.post('/login_user_api',async(req,res)=>{
    try{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(401).json({message: ' Invalid Email id'});
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    
    
    
    if(!isMatch){
        return res.status(401).json ({message: "Wrong password"})
    }
    const token = jwt.sign({userId:user._id,Admin:user.Admin},process.env.JWT_SECRET=JWT_SECRET ,{expiresIn:'1h'});
    res.status(200).json({message:'Login successful', token});
} catch(error){
    console.error(error);
    res.status(500).json({
        message:'Server error'
    })
}
});
 


// concert adding api


router.post('/concert_add_api',verifyToken ,async(req,res)=>{
    try{
        const {ConcertId,ConcertName,date,venue,price,TotalTickets}=req.body;
        const token=req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.userId;
        const Admin = decoded.Admin;
        if(!Admin){
           return res.status(400).json({message:"Only admins can add an event"})
        }
       
        const newConcert= new Concert({
            userId,
            ConcertId,
            ConcertName,
            date,
            venue,
            price,
            TotalTickets
        })
        const validationError= newConcert.validateSync();
        if (validationError){
            const errors={
            ConcertId: validationError.errors.ConcertId
                ? validationError.errors.ConcertId.properties.message: undefined,
            ConcertName:  validationError.errors.ConcertName
                ? validationError.errors.ConcertName.properties.message: undefined,
            date : validationError.errors.date 
                ? validationError.errors.date.properties.message: undefined,
            venue: validationError.errors.venue 
                ? validationError.errors.venue.properties.message: undefined,
            price : validationError.errors.price 
                ? validationError.errors.price.properties.message: undefined,
            TotalTickets : validationError.errors.TotalTickets 
                    ? validationError.errors.TotalTickets.properties.message: undefined,
            
        };
        return res.status(400).json({errors});

        
    }
     await newConcert.save();
    
            res.status(201).json({message : 'Concert added successfully'});

}catch(error){
     console.error(error);
     if (error.code===11000){
        return res.status(400).json({
            message: "This concert is already added once"
        });
     }
    res.status(500).json({
        message:'Server error'

}) }
});


// Viewing Concert API 

router.get('/veiw_concert_api',verifyToken,async(req,res)=>{
   try{
    
      const concerts = await Concert.find()
      const concertData=[];         
       for(const concert of concerts){
         
      
        const bookedtickt = await Ticket.aggregate([
            {$match:{ConcertId:concert.ConcertId}},
            {$group:{_id:null,bkttl_tickets:{$sum:"$nooftickets"}}}
        ]);
        const totalBooked= bookedtickt[0]?.bkttl_tickets||0;

        const remaining_tickets= concert.TotalTickets-totalBooked;
            
        concertData.push({
            ConcertId: concert.ConcertId,
            ConcertName : concert.ConcertName,
            date : concert.date,
            venue:concert.venue,
            price:concert.price,
            TotalTickets:concert.TotalTickets,
            RemainingTickets: remaining_tickets
        });
    }
        res.status(200).json({data:concertData});

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:'Server Error'})
    };
});



//EDIT CONCERT API

router.put('/edit_concert_api/:id',verifyToken,async(req,res)=>{
try{
    const ConcertId = req.params.id;
    const {ConcertName,date,venue,price,TotalTickets}=req.body;
     const token=req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.userId;
        const Admin = decoded.Admin;
        if(!Admin){
           return res.status(400).json({message:"Only admins can Edit an event"})
        }
    const conc = await Concert.findOne({ConcertId:ConcertId});
    if (!conc){
        return res.status(400).json({message: "No concert found"})
    }
    if(userId!== conc.userId.toString()){
        return res.status(400).json({message:"User doesn't match"});
    }
    const newConcert= new Concert({
        userId,
        ConcertId,
        ConcertName,
        date,
        venue,
        TotalTickets,
        price
    });
    const validationError=newConcert.validateSync();

    if (validationError){
        const errors={
             ConcertName:  validationError.errors.ConcertName
                ? validationError.errors.ConcertName.properties.message: undefined,
            date : validationError.errors.date 
                ? validationError.errors.date.properties.message: undefined,
            venue: validationError.errors.venue 
                ? validationError.errors.venue.properties.message: undefined,
            price : validationError.errors.price 
                ? validationError.errors.price.properties.message: undefined,
            TotalTickets : validationError.errors.TotalTickets 
                    ? validationError.errors.TotalTickets.properties.message: undefined,

        };
        
        return res.status(400).json({errors});
    }

            Concert.findOneAndUpdate({ConcertId,ConcertId},
        {ConcertName,date,venue,price,TotalTickets},
        {new:true}
    )
    .then((updatedConcert)=>{
        if(!updatedConcert){
            return res.status(404).json({message: "Concert Not found"});
        }
        res.status(200).json({message:"Concert Successfully editted",Concert:updatedConcert})
    })
    }
    catch(error){
        
        res.status(500).json({message:"server Error"});
    };

});



//Delete Concert API


router.delete('/delete_concert_api/:id',verifyToken,async(req,res)=>{
   try{const ConcertId= req.params.id;
     const token=req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        const userId = decoded.userId;
        const Admin = decoded.Admin;
        if(!Admin){
           return res.status(400).json({message:"Only admins can Delet an event"})
        }
         const conc =  await Concert.findOne({ConcertId:ConcertId});
    if (!conc){
        return res.status(400).json({message: "No concert found"})
    }
    if(userId!== conc.userId.toString()){
        return res.status(400).json({message:"User doesn't match"});
    }
    await Concert.findOneAndDelete({ConcertId:ConcertId})
    
        res.status(200).json({message:" Concert deleted successfully "})
} 
    catch(error){
                
           return res.status(500).json({message:'Server Error'})
        }
    
   
});


// Ticket Booking API


router.post('/Ticket_booking_api',verifyToken,async(req,res)=>{
 try{

    const {ConcertId,nooftickets}=req.body;
    
    
    const bkingConcert= await Concert.findOne({ConcertId:ConcertId});
      if(!bkingConcert){
        return res.status(404).json({message: "Concert not found"})
    }
    const ticketPrice = bkingConcert.price;
    const TotalAmount = ticketPrice * nooftickets;
    
    const token=req.headers.authorization.split(' ')[1];
    const decoded = jwt.decode(token);
    const userId = decoded.userId;
    
    const Admin = decoded.Admin;
    if(Admin){
         return res.status(400).json({message:"Only users can book a ticket"})
     }
    
    const TotalTickets = bkingConcert.TotalTickets;
    const bookdetickt = await Ticket.aggregate([
        {$match:{ConcertId:ConcertId}},
        {$group:{_id:null,bkttl_tickets:{$sum:"$nooftickets"}}}
    ]);
    const bkttl_tickets= bookdetickt[0]?.bkttl_tickets||0;

    const remaining_tickets= TotalTickets-bkttl_tickets;

    const concert_result = await Ticket.aggregate([
        {$match:{userId:userId, ConcertId:ConcertId}},
    {$group:{_id:null, totalTicketbukd:{$sum:"$nooftickets"}}}
    ]);
    const totalTicketbukd= concert_result[0]?.totalTicketbukd||0;
    


  
     if(nooftickets>3||nooftickets<=0){
       return res.status(400).json({message:'Minimum 1 and maximum 3 tickets allowed'});
    } 
     if (remaining_tickets<= 0){
        return res.status(400).json({message:'Tickets sold out'});
    } 
    if ((totalTicketbukd+nooftickets)>3) {
        return res.status(400).json({message:'One user cannot able to book more than 3 Tickets'});
    } 
    if (remaining_tickets<nooftickets){
        return res.status(400).json({message:'Not that much tickets left'})
    }
     const ticket= new Ticket({
            userId,
            ConcertId,
            nooftickets,
            TotalAmount

        });
     const validationError= ticket.validateSync();
     if(validationError){ 
        const errors={
            userId: validationError.errors.userId
                ? validationError.errors.userId.properties.message: undefined,
            ConcertId: validationError.errors.ConcertId
                ? validationError.errors.ConcertId.properties.message: undefined,
            nooftickets: validationError.errors.nooftickets
                ? validationError.errors.nooftickets.properties.message: undefined,
            TotalAmount: validationError.errors.TotalAmount
                ? validationError.errors.TotalAmount.properties.message: undefined

     };
     return res.status(400).json({errors});
     }
    await ticket.save();
     
    res.status(201).json({message:'Ticket booking confirmed'});
    
   
 
}catch(error){
    res.status(500).json({message:'Server error'});
}});
module.exports = router;