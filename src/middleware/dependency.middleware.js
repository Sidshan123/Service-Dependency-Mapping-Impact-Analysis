const prisma =
require("../config/prisma");





async function canManageDependency(
    req,
    res,
    next
){

    try{

        const{

            source_service_id,
            target_service_id

        } = req.body;

        const userId =
        req.user.userId;

        //----------------------------------
        // GET SERVICES
        //----------------------------------

        const sourceService =
        await prisma.services.findUnique({

            where:{

                id:Number(
                    source_service_id
                )

            }

        });

        const targetService =
        await prisma.services.findUnique({

            where:{

                id:Number(
                    target_service_id
                )

            }

        });

        if(
            !sourceService ||
            !targetService
        ){

            return res
            .status(404)
            .json({

                message:
                "Service not found"

            });

        }

        //----------------------------------
        // GET DOMAINS
        //----------------------------------

        const sourceDomain =
        await prisma.domains.findUnique({

            where:{

                id:Number(
                    sourceService.domain_id
                )

            }

        });

        const targetDomain =
        await prisma.domains.findUnique({

            where:{

                id:Number(
                    targetService.domain_id
                )

            }

        });

        if(
            !sourceDomain ||
            !targetDomain
        ){

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

        const hasPermission =

            Number(
                sourceDomain.lead_user_id
            )===Number(userId)

            ||

            Number(
                targetDomain.lead_user_id
            )===Number(userId);

        if(!hasPermission){

            return res
            .status(403)
            .json({

                message:
                "Only source or target domain lead can create dependencies"

            });

        }

        next();

    }

    catch(error){

        return res
        .status(500)
        .json({

            message:error.message

        });

    }

}





async function canDeleteDependency(
    req,
    res,
    next
){

    try{

        const dependencyId =
        Number(
            req.params.id
        );

        const userId =
        req.user.userId;

        //----------------------------------
        // GET DEPENDENCY
        //----------------------------------

        const dependency =
        await prisma.dependencies.findUnique({

            where:{

                id:dependencyId

            }

        });

        if(!dependency){

            return res
            .status(404)
            .json({

                message:
                "Dependency not found"

            });

        }

        //----------------------------------
        // GET SERVICES
        //----------------------------------

        const sourceService =
        await prisma.services.findUnique({

            where:{

                id:Number(
                    dependency.source_service_id
                )

            }

        });

        const targetService =
        await prisma.services.findUnique({

            where:{

                id:Number(
                    dependency.target_service_id
                )

            }

        });

        if(
            !sourceService ||
            !targetService
        ){

            return res
            .status(404)
            .json({

                message:
                "Service not found"

            });

        }

        //----------------------------------
        // GET DOMAINS
        //----------------------------------

        const sourceDomain =
        await prisma.domains.findUnique({

            where:{

                id:Number(
                    sourceService.domain_id
                )

            }

        });

        const targetDomain =
        await prisma.domains.findUnique({

            where:{

                id:Number(
                    targetService.domain_id
                )

            }

        });

        if(
            !sourceDomain ||
            !targetDomain
        ){

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

        const hasPermission =

            Number(
                sourceDomain.lead_user_id
            )===Number(userId)

            ||

            Number(
                targetDomain.lead_user_id
            )===Number(userId);

        if(!hasPermission){

            return res
            .status(403)
            .json({

                message:
                "Only the respective domain leads can delete this dependency"

            });

        }

        next();

    }

    catch(error){

        return res
        .status(500)
        .json({

            message:error.message

        });

    }

}





module.exports={

    canManageDependency,
    canDeleteDependency

};