import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {

    Copy,
    LogOut

}
from "lucide-react";

import toast from "react-hot-toast";

import {

    cloneWorkspace

}
from "../services/workspaceService";

import ExitWorkspaceModal
from "./ExitWorkspaceModal";

function DeveloperActions({

    workspace

}){

    const navigate =
    useNavigate();

    //----------------------------------
    // EXIT
    //----------------------------------

    const [

        showExitModal,
        setShowExitModal

    ] = useState(false);

    const [

        exitType,
        setExitType

    ] = useState("");

    //----------------------------------
    // CLONE
    //----------------------------------

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

            toast.success(

                response.message

            );

        }
        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to clone workspace"

            );

        }

    }

    //----------------------------------
    // EXIT
    //----------------------------------

    function handleExitWorkspace(){

        setExitType(

            "DEVELOPER"

        );

        setShowExitModal(

            true

        );

    }

    return(

        <>

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

                        <Copy size={18}/>

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

                        <LogOut size={18}/>

                        Exit Workspace

                    </button>

                </div>

            </div>

            {showExitModal && (

                <ExitWorkspaceModal

                    workspaceId={workspace.id}

                    exitType={exitType}

                    onClose={() => {

                        setShowExitModal(false);

                    }}

                />

            )}

        </>

    );

}

export default DeveloperActions;