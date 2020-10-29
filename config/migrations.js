
//const brokerModel = require('../models/broker-model');
const permissions = [
    'create broker',
    'view any broker',
    'view broker',
    'update broker',
    'remove broker',

    'create property',
    'update property',
    'remove property',
    'view property',
    'hold property',


    'create comment',
    'view comment',
    'update comment',
    'remove comment',
   

    'view profile',
    'view posts',
    'grant access',
    'manage posts',

   
    ]

const roles = {
    admin: [...permissions],
    broker:[],
    property:[],
    broAct: [
    'create broker',
    'view broker',
    'update broker',
    'remove broker',

    'create property',
    'update property',
    'remove property',
    'view property',
    'hold property',
   
    ]
}



const admins = [
    {   
        name:'abebe',
        username: 'admin',
        email: 'abebe@admin.com',
        password: 'superuser',
        roles: ['admin'] 
    }
]
const brokers = [
    {   
        bname:'abebe',
        username: 'abebe1',
        email: 'abebe@admin.com',
        password: 'superuser',
        address:'jemo',
        roles: ['broAct'] 
    }
   
]

const propertys = [
    {
        bname:[
            {
                firstName: 'abebe',
                lastName: 'beso'
            }
        ],
        prop_type:'house',
        price:'5900',
       // brokerId:'5f9584ffd004ba6dbc7bcdce'
        
    }
]
const comments = []



module.exports = { permissions, roles, brokers,propertys,comments,admins}
