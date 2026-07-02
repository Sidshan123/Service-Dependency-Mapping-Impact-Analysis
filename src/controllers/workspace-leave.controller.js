// controllers/workspace-leave.controller.js

const workspaceLeaveService =
require(
    "../services/workspace-leave.service"
);





exports.getExitOptions =
async (req, res) => {

    try {

        const result =
        await workspaceLeaveService
        .getExitOptions(

            req.params.workspaceId,

            req.user.userId

        );

        res.status(200)
        .json(result);

    }
    catch (error) {

        res.status(400)
        .json({
            message: error.message
        });

    }

};


exports.exitWorkspace =
async (req, res) => {

    try {

        const result =
        await workspaceLeaveService
        .exitWorkspace(

            req.params.workspaceId,

            req.user.userId,

            req.body

        );

        res.status(200)
        .json(result);

    }
    catch (error) {

        res.status(400)
        .json({
            message: error.message
        });

    }

};







exports.getChangeLeadOptions =
async(req,res)=>{

    try{

        const result =
        await workspaceLeaveService
        .getChangeLeadOptions(
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



exports.changeDomainLead =
async(req,res)=>{

    try{

        const result =
        await workspaceLeaveService
        .changeDomainLead(

            req.params.id,
            req.body

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








exports.getDomainLeads =
async(req,res)=>{

    try{

        const result =
        await workspaceLeaveService
        .getDomainLeads(
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





exports.getMyDevelopers =
async (req, res) => {

    try {

        const result =
        await workspaceLeaveService
        .getMyDevelopers(

            req.query.workspaceId,

            req.user.userId

        );

        res.status(200)
        .json(result);

    }
    catch (error) {

        res.status(400)
        .json({

            message:
            error.message

        });

    }

};





exports.removeDeveloper =
async(req,res)=>{

    try{

        const result =
        await workspaceLeaveService
        .removeDeveloper(

            req.params.id,
            req.params.developerId

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