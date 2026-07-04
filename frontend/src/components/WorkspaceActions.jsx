import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {

    UserPlus,
    FolderKanban,
    Plus,
    Copy,
    Trash2

}
from "lucide-react";

import {

    cloneWorkspace,
    deleteWorkspace

}
from "../services/workspaceService";

import InviteLeadModal
from "./InviteLeadModal";

import DomainLeadsModal
from "./DomainLeadsModal";

import CreateDomainModal
from "./CreateDomainModal";

import DeleteWorkspaceModal
from "./DeleteWorkspaceModal";


function WorkspaceActions({

    workspace,
    roles

}){

    const navigate =
    useNavigate();


    const [

        showInviteModal,
        setShowInviteModal

    ] = useState(false);


    const [

        showDomainModal,
        setShowDomainModal

    ] = useState(false);


    const [

        showCreateDomainModal,
        setShowCreateDomainModal

    ] = useState(false);


    const [

        showDeleteModal,
        setShowDeleteModal

    ] = useState(false);


    //--------------------------------------------------
    // CLONE WORKSPACE
    //--------------------------------------------------

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

                    `/workspace/${

                        response
                        .workspace_id

                    }`

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


    //--------------------------------------------------
    // DELETE WORKSPACE
    //--------------------------------------------------

    async function handleDeleteWorkspace(){

        try{

            const response =

            await deleteWorkspace(
                workspace.id
            );


            if(

                response.message ===
                "Workspace deleted successfully"

                ||

                response.message ===
                "Personal workspace deleted successfully"

            ){

                navigate(
                    "/dashboard"
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

                "Failed to delete workspace"

            );

        }

    }


    //--------------------------------------------------
    // OWNER CHECK
    //--------------------------------------------------

    const isOwner =

        roles.includes(
            "OWNER"
        );


    if(!isOwner){

        return null;

    }


    return(

        <>

            <div

                className="

                    mt-6

                    flex
                    items-center
                    gap-4

                    flex-wrap

                "

            >

                <button

                    onClick={()=>{

                        setShowInviteModal(
                            true
                        );

                    }}

                    className="

                        btn-primary

                        h-14
                        px-6

                        rounded-2xl

                        flex
                        items-center
                        gap-3

                    "

                >

                    <UserPlus
                        size={18}
                    />

                    Invite Lead

                </button>


                <button

                    onClick={()=>{

                        setShowDomainModal(
                            true
                        );

                    }}

                    className="

                        btn-secondary

                        h-14
                        px-6

                        rounded-2xl

                        flex
                        items-center
                        gap-3

                    "

                >

                    <FolderKanban
                        size={18}
                    />

                    Manage Domains

                </button>


                <button

                    onClick={()=>{

                        setShowCreateDomainModal(
                            true
                        );

                    }}

                    className="

                        btn-secondary

                        h-14
                        px-6

                        rounded-2xl

                        flex
                        items-center
                        gap-3

                    "

                >

                    <Plus
                        size={18}
                    />

                    New Domain

                </button>


                <button

                    onClick={
                        handleCloneWorkspace
                    }

                    className="

                        btn-secondary

                        h-14
                        px-6

                        rounded-2xl

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

                    onClick={()=>{

                        setShowDeleteModal(
                            true
                        );

                    }}

                    className="

                        h-14
                        px-6

                        rounded-2xl

                        flex
                        items-center
                        gap-3

                        bg-red-500/15
                        text-red-400

                        hover:bg-red-500/25

                        transition

                    "

                >

                    <Trash2
                        size={18}
                    />

                    Delete Workspace

                </button>

            </div>


            {

                showInviteModal && (

                    <InviteLeadModal

                        workspaceId={
                            workspace.id
                        }

                        onClose={()=>{

                            setShowInviteModal(
                                false
                            );

                        }}

                    />

                )

            }


            {

                showDomainModal && (

                    <DomainLeadsModal

                        workspaceId={
                            workspace.id
                        }

                        onClose={()=>{

                            setShowDomainModal(
                                false
                            );

                        }}

                    />

                )

            }


            {

                showCreateDomainModal && (

                    <CreateDomainModal

                        workspaceId={
                            workspace.id
                        }

                        onClose={()=>{

                            setShowCreateDomainModal(
                                false
                            );

                        }}

                    />

                )

            }


            {

                showDeleteModal && (

                    <DeleteWorkspaceModal

                        workspace={
                            workspace
                        }

                        onClose={()=>{

                            setShowDeleteModal(
                                false
                            );

                        }}

                        onDelete={
                            handleDeleteWorkspace
                        }

                    />

                )

            }

        </>

    );

}


export default WorkspaceActions;