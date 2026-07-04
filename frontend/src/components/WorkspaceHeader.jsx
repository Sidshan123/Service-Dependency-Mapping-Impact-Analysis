import {

    Pencil,
    Check,
    X

}
from "lucide-react";

import {

    useState

}
from "react";

import {

    renameWorkspace

}
from "../services/workspaceService";


function WorkspaceHeader({

    roles,
    workspace,
    setWorkspace

}){

    const [

        isEditing,
        setIsEditing

    ] = useState(false);


    const [

        newWorkspaceName,
        setNewWorkspaceName

    ] = useState(

        workspace?.workspace_name || ""

    );


    const role =

        roles.includes("OWNER")

        ? "OWNER"

        : roles.includes("LEAD")

        ? "LEAD"

        : "DEVELOPER";


    async function handleRename(){

        try{

            if(

                !newWorkspaceName.trim()

            ){

                return;

            }

            await renameWorkspace(

                workspace.id,

                newWorkspaceName

            );


            setWorkspace({

                ...workspace,

                workspace_name:
                newWorkspaceName

            });


            setIsEditing(
                false
            );

        }
        catch(error){

            alert(

                error.response
                ?.data
                ?.message

                ||

                "Failed to rename workspace"

            );

        }

    }


    function handleKeyDown(
        event
    ){

        if(

            event.key ===
            "Enter"

        ){

            handleRename();

        }

        if(

            event.key ===
            "Escape"

        ){

            setNewWorkspaceName(

                workspace
                .workspace_name

            );

            setIsEditing(
                false
            );

        }

    }


    return(

        <header

            className="

                h-24
                px-10

                flex
                items-center
                justify-between

                border-b
                border-[var(--border)]

                bg-[var(--bg-primary)]

            "

        >

            {/* LEFT */}

            <div
                className="flex items-center gap-8"
            >

                <img

                    src="/logo.jpeg"

                    alt="Blast Radius"

                    className="w-12 h-12"

                />


                <div
                    className="flex items-center gap-6"
                >

                    <h1
                        className="text-3xl font-bold"
                    >

                        Blast Radius

                    </h1>


                    <div
                        className="h-8 w-px bg-[var(--border)]"
                    />


                    {

                        isEditing

                        ?

                        (

                            <div
                                className="flex items-center gap-3"
                            >

                                <input

                                    value={
                                        newWorkspaceName
                                    }

                                    onChange={

                                        event =>

                                        setNewWorkspaceName(

                                            event
                                            .target
                                            .value

                                        )

                                    }

                                    onKeyDown={
                                        handleKeyDown
                                    }

                                    autoFocus

                                    className="

                                        bg-transparent

                                        border-b
                                        border-cyan-400

                                        outline-none

                                        text-xl
                                        font-medium

                                        w-[240px]

                                    "

                                />


                                <button

                                    onClick={
                                        handleRename
                                    }

                                    className="

                                        text-green-400

                                        hover:text-green-300

                                    "

                                >

                                    <Check
                                        size={18}
                                    />

                                </button>


                                <button

                                    onClick={()=>{

                                        setNewWorkspaceName(

                                            workspace
                                            .workspace_name

                                        );

                                        setIsEditing(
                                            false
                                        );

                                    }}

                                    className="

                                        text-red-400

                                        hover:text-red-300

                                    "

                                >

                                    <X
                                        size={18}
                                    />

                                </button>

                            </div>

                        )

                        :

                        (

                            <div
                                className="flex items-center gap-3"
                            >

                                <span

                                    className="

                                        text-xl
                                        font-medium

                                        text-[var(--text-secondary)]

                                    "

                                >

                                    {

                                        workspace
                                        ?.workspace_name

                                    }

                                </span>


                                <button

                                    onClick={()=>{

                                        setIsEditing(
                                            true
                                        );

                                    }}

                                    className="

                                        text-[var(--text-secondary)]

                                        hover:text-cyan-400

                                        transition

                                    "

                                >

                                    <Pencil
                                        size={16}
                                    />

                                </button>

                            </div>

                        )

                    }

                </div>

            </div>


            {/* RIGHT */}

            <div
                className="flex items-center gap-6"
            >

                <div

                    className="

                        px-5
                        py-2

                        rounded-xl

                        bg-purple-900/50
                        text-purple-300

                        text-sm
                        font-semibold

                    "

                >

                    {role}

                </div>


                <div

                    className="

                        w-14
                        h-14

                        rounded-full

                        border
                        border-[var(--border)]

                        flex
                        items-center
                        justify-center

                        bg-[var(--card-bg)]

                        text-xl
                        font-semibold

                    "

                >

                    {

                        JSON.parse(

                            localStorage.getItem(
                                "user"
                            )

                        )?.name

                        ?.charAt(0)

                        ?.toUpperCase()

                        ||

                        "U"

                    }

                </div>

            </div>

        </header>

    );

}

export default WorkspaceHeader;