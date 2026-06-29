const domainService =
require("../services/domain.service");

exports.createDomain =
async (req, res) => {

    try {

        const result =
        await domainService
        .createDomain(
            req.body,
            req.user.userId
        );

        return res
        .status(201)
        .json(result);

    }
    catch (error) {

        return res
        .status(400)
        .json({

            message:
            error.message

        });

    }

};




exports.updateDomainName =
async(req,res)=>{

    try{

        const result =
        await domainService
        .updateDomainName(
            req.params.id,
            req.body
        );

        res.status(200)
        .json(result);

    }
    catch(error){

        res.status(400)
        .json({

            message:
            error.message

        });

    }

};



exports.deleteDomain =
async(req,res)=>{

    try{

        const result =
        await domainService
        .deleteDomain(
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


exports.getDomains =
async(req,res)=>{

    try{

        const result =
        await domainService
        .getDomains(
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



