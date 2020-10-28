
var { permissions, roles, brokers,propertys,comments,admins} = require('../config/migrations')


const logger = require('../config/logger');

const permissionModel = require('../models/permission-model')
const roleModel = require('../models/role-model')

const brokerModel = require('../models/broker-model')
const adminModel = require('../models/admin-model')
const propertyModel = require('../models/property-model')
const commentModel = require('../models/comment-model')

module.exports = {
    
    migratePermissions: async () => {
        logger.info(`Checking permissions migrations...`);
        // retrieve all permissions from db
        let permissionDocument =  await permissionModel.find({})
        
        if(permissions.length > permissionDocument.length) {
                logger.info(`Found new permissions...`);
                // some operation
                permissions = permissions.filter(per => {
                    return permissionDocument.findIndex(val => val.name === per) === -1
                })
                await permissionModel.insertMany([
                    ...permissions.map(val => ({name: val}))
                ])
                logger.info(`migrate permission completed ...`);
                return;
                
            }
            logger.info(`Noting to migrate fro permission ...`);
    },

    migrateRoles: async () => {
        logger.info(`Checking role migrations...`);

        await Object.keys(roles).forEach( async index => {
            // count if role exists
            let roleDocumentCount = await roleModel.countDocuments({ name: index})
            if(roleDocumentCount === 0) {
                logger.info(`Found new role...`);
                 let data =  await permissionModel.find({
                      name: {
                          $in: roles[index]
                      }
                  })
                  
                  await roleModel.create({
                        name: index,
                        permissions: data.map(val => val._id)
                    })
                    logger.info(`completed ${index} role migrated...`);
                   
            }
            })
            logger.info(`completed roles migrations...`);
        
    },

    migrateBrokers: async () => {
        logger.info(`Checking brokers migrations...`);

        await brokers.forEach(async broker => {
            let brokerDocumentCount = await brokerModel.countDocuments({
                username: broker.username
            })
            
                if(brokerDocumentCount === 0) {
                    let data = await roleModel.find({
                        name: {
                            $in: broker.roles // [1,2,3]
                        }
                    })
                        await brokerModel.create({
                            ...broker,
                            roles: data.map(val => val._id)
                        })
                        logger.info(`completed ${broker.username} user migrated...`);
                        
                }
        })
        logger.info(`completed users migrations...`);
    },
        migratePropertys: async () => {
        logger.info(`Checking propertys migrations...`);

        await propertys.forEach(async property => {
            let propertyDocumentCount = await propertyModel.countDocuments({
                prop_type: property.prop_type
            })
            
                if(propertyDocumentCount === 0) {
                    let data = await roleModel.find({
                        name: {
                            $in: property.roles // [1,2,3]
                        }
                    })
                        await propertyModel.create({
                            ...property,
                            roles: data.map(val => val._id)
                        })
                        logger.info(`completed ${property.prop_type} property migrated...`);
                        
                }
        })
        logger.info(`completed property migrations...`);
    },

migrateComments: async () => {
    logger.info(`Checking comments migrations...`);

    await comments.forEach(async comment => {
        let commentDocumentCount = await commentModel.countDocuments({
            commment: comment.comment
        })
        
            if(commentDocumentCount === 0) {
                let data = await brokerModel.find({
                    bname: {
                        $in: comment.broker // [1,2,3]
                    }
                })
                    await commentModel.create({
                        ...comment,
                        broker: data.map(val => val._id)
                    })
                    logger.info(`completed ${comment.comment} comment migrated...`);
                    
            }
    })
    logger.info(`completed comment migrations...`);
},

migrateAdmins: async () => {
    logger.info(`Checking admins migrations...`);

    await admins.forEach(async admin => {
        let adminDocumentCount = await adminModel.countDocuments({
            name: admin.name
        })
        
            if(adminDocumentCount === 0) {
                let data = await roleModel.find({
                    name: {
                        $in: admin.roles // [1,2,3]
                    }
                })
                    await adminModel.create({
                        ...admin,
                        roles: data.map(val => val._id)
                    })
                    logger.info(`completed ${admin.name} admin migrated...`);
                    
            }
    })
    logger.info(`completed admin migrations...`);
}
}