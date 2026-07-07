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
            req.params.id,
        );

        return res
        .status(200)
        .json(result);

    }
    catch(error){

    console.error(error);

    return res.status(500).json({

        message:error.stack

    });

}

};




exports.getDeveloperInviteCodes =
async(req,res)=>{

    try{

        const result =
        await inviteService.getDeveloperInviteCodes(

            req.params.workspaceId,
            req.user.userId

        );

        return res
        .status(200)
        .json(result);

    }
    catch(error){

        return res
        .status(400)
        .json({

            message:error.message

        });

    }

};