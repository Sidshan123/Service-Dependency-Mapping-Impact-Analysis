const authService =
require("../services/auth.service");

exports.register = async (req, res) => {

    try {

        await authService.register(
            req.body
        );

        res.status(201).json({
            message:
            "User registered successfully"
        });

    }
    catch (error) {

        res.status(400).json({
            message:
            error.message
        });

    }

};

exports.login = async (req, res) => {

    try {

        const result =
        await authService.login(
            req.body
        );

        res.status(200).json(result);

    }
    catch (error) {

        res.status(401).json({
            message:
            error.message
        });

    }

};



exports.deleteAccount =
async (req, res) => {

    try{

        const result =
        await authService.deleteAccount(

            req.user.userId

        );

        res.status(200).json(result);

    }
    catch(error){

        res.status(400).json({

            message:error.message

        });

    }

};

