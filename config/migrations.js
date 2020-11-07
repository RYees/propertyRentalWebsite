
//const brokerModel = require('../models/broker-model');
const permissions = [
    'create broker',
    'view any broker',
    'view broker',
    'update broker',
    'remove account',

    'create property',
    'update property',
    'remove property',
    'view any property',
    'hold property',

    'view property',
    'create comment',
    'view comment',
    'update comment',
    'remove comment',

    'view any comment',
    'view profile',
    'update profile',
    'grant access',
    'manage posts',
    'view notification'


]

const roles = {
    admin: [...permissions],
    broker: [],
    property: [],
    broAct: [
        'create broker',
        'view profile',
        'update profile',
        'remove account',

        'create property',
        'update property',
        'remove property',
        'view property',
        'hold property',

    ]
}



const admins = [
    {
        name: 'abebe',
        username: 'admin',
        email: 'abebe@admin.com',
        password: 'superuser',
        roles: ['admin']
    },
   
]
const brokers = []

const propertys = []
const comments = []



module.exports = { permissions, roles, brokers, propertys, comments, admins }
