const serviceService =
require("../services/service.service");

exports.createService =
async(req,res)=>{

    try{

        const result =
        await serviceService
        .createService(
            req.body
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


exports.updateServiceName =
async(req,res)=>{

    try{

        const result =
        await serviceService
        .updateServiceName(
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


exports.deleteService =
async(req,res)=>{

    try{

        const result =
        await serviceService
        .deleteService(
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


exports.getWorkspaceServices =
async(req,res)=>{

    try{

        const result =
        await serviceService
        .getWorkspaceServices(
            req.params.workspaceId
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