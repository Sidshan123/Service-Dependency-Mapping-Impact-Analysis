// controllers/invite.controller.js

const inviteService =
require(
    "../services/invite.service"
);


exports.getLeadInviteCode =
async(req,res)=>{

    try{

        const result =
        await inviteService
        .getLeadInviteCode(
            req.params.id
        );

        return res
        .status(200)
        .json(result);

    }
    catch(error){

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

};


exports.getDeveloperInviteCode =
async(req,res)=>{

    try{

        const result =
        await inviteService
        .getDeveloperInviteCode(
            req.params.id
        );

        return res
        .status(200)
        .json(result);

    }
    catch(error){

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

};