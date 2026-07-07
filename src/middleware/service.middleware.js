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

        const member =
        await prisma.workspace_members
        .findFirst({

            where:{

                domain_id:
                Number(service.domain_id),

                user_id:
                Number(userId),

                role:
                "LEAD"

            }

        });

        if(!member){

            return res
            .status(403)
            .json({

                message:
                "Only the domain lead can modify this service."

            });

        }

        return next();

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

        const {

            domain_id

        } = req.body;

        const member =
        await prisma.workspace_members.findFirst({

            where:{

                domain_id:Number(domain_id),

                user_id:Number(req.user.userId),

                role:"LEAD"

            }

        });

        if(!member){

            return res.status(403).json({

                message:
                "Only the domain lead can create services."

            });

        }

        next();

    }

    catch(error){

        return res.status(500).json({

            message:error.message

        });

    }

}

module.exports = {

    canModifyService,
    canCreateService

};