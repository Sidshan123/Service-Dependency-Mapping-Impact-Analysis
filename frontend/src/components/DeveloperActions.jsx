import { useNavigate } from "react-router-dom";

import {

    Copy,
    LogOut

}
from "lucide-react";

import {

    cloneWorkspace

}
from "../services/workspaceService";


function DeveloperActions({

    workspace

}){

    const navigate =
    useNavigate();


    async function handleCloneWorkspace(){

        try{

            const response =

            await cloneWorkspace(
                workspace.id
            );


            if(

                response.message ===
                "Workspace cloned successfully"

            ){

                navigate(

                    `/workspace/${response.workspace_id}`

                );

                return;

            }


            alert(
                response.message
            );

        }
        catch(error){

            alert(

                error.response
                ?.data
                ?.message

                ||

                "Failed to clone workspace"

            );

        }

    }


    function handleExitWorkspace(){

        alert(
            "Exit Workspace functionality coming soon!"
        );

    }


    return(

            <div
                className="
                    flex
                    items-center
                    justify-end
                "
            >

                <div

                    className="

                        flex
                        items-center
                        gap-4
                        whitespace-nowrap

                    "

                >

                    <button

                        onClick={
                            handleCloneWorkspace
                        }

                        className="

                            btn-secondary

                            h-12
                            px-5

                            rounded-xl

                            flex
                            items-center
                            gap-3

                        "

                    >

                        <Copy
                            size={18}
                        />

                        Clone Workspace

                    </button>


                    <button

                        onClick={
                            handleExitWorkspace
                        }

                        className="

                            btn-secondary

                            h-12
                            px-5

                            rounded-xl

                            flex
                            items-center
                            gap-3

                        "

                    >

                        <LogOut
                            size={18}
                        />

                        Exit Workspace

                    </button>

                </div>

            </div>

        );

}


export default DeveloperActions;