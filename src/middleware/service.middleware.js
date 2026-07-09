const prisma =
require("../config/prisma");





async function canModifyService(
    req,
    res,
    next
){

    try{

        const serviceId =
        Number(req.params.id);

        const userId =
        req.user.userId;

        //----------------------------------
        // GET SERVICE
        //----------------------------------

        const service =
        await prisma.services.findUnique({

            where:{

                id:serviceId

            },

            select:{

                domain_id:true

            }

        });

        if(!service){

            return res
            .status(404)
            .json({

                message:
                "Service not found"

            });

        }

        //----------------------------------
        // GET DOMAIN
        //----------------------------------

        const domain =
        await prisma.domains.findUnique({

            where:{

                id:Number(
                    service.domain_id
                )

            }

        });

        if(!domain){

            return res
            .status(404)
            .json({

                message:
                "Domain not found"

            });

        }

        //----------------------------------
        // CHECK DOMAIN LEAD
        //----------------------------------

        if(

            Number(
                domain.lead_user_id
            )!==Number(userId)

        ){

            return res
            .status(403)
            .json({

                message:
                "Only the domain lead can modify this service."

            });

        }

        next();

    }

    catch(error){

        return res
        .status(500)
        .json({

            message:
            error.message

        });

    }

}





async function canCreateService(
    req,
    res,
    next
){

    try{

        const{

            domain_id

        } = req.body;

        //----------------------------------
        // GET DOMAIN
        //----------------------------------

        const domain =
        await prisma.domains.findUnique({

            where:{

                id:Number(
                    domain_id
                )

            }

        });

        if(!domain){

            return res
            .status(404)
            .json({

                message:
                "Domain not found"

            });

        }

        //----------------------------------
        // CHECK DOMAIN LEAD
        //----------------------------------

        if(

            Number(
                domain.lead_user_id
            )!==Number(
                req.user.userId
            )

        ){

            return res
            .status(403)
            .json({

                message:
                "Only the domain lead can create services."

            });

        }

        next();

    }

    catch(error){

        return res
        .status(500)
        .json({

            message:
            error.message

        });

    }

}





module.exports={

    canModifyService,
    canCreateService

};