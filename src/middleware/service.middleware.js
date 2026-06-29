const prisma =
require("../config/prisma");

async function canModifyService(
    req,
    res,
    next
){

    try{

        const {
            domain_id
        } = req.body;

        const userId =
        req.user.userId;

        const member =
        await prisma.workspace_members
        .findFirst({

            where:{

                domain_id:
                Number(domain_id),

                user_id:
                userId,

                role:
                "LEAD"

            }

        });

        if(!member){

            return res
            .status(403)
            .json({

                message:
                "Only domain lead can modify services"

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

module.exports = {
    canModifyService
};