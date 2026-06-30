// controllers/workspace-member.controller.js

const workspaceMemberService =
require(
    "../services/workspace-member.service"
);


exports.joinAsDeveloper =
async(req,res)=>{

    try{

        const result =
        await workspaceMemberService
        .joinAsDeveloper(

            req.body,
            req.user.userId

        );

        return res
        .status(201)
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