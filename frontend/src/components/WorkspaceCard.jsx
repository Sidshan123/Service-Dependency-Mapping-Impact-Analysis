import { useState } from "react";

import { useNavigate }
from "react-router-dom";

import {

    MoreVertical,
    AlertTriangle,
    Users,
    User,
    Edit,
    Trash2

}
from "lucide-react";


function WorkspaceCard({

    workspace,

    onRename,

    onDelete

}) {

    const navigate =
    useNavigate();


    const [

        showMenu,
        setShowMenu

    ] = useState(false);


    const hasAlert =
    workspace.has_alert || false;


    //--------------------------------------------------
    // ROLES
    //--------------------------------------------------

    const roles =
    workspace.roles || [];


    const displayRole =

        roles.includes("OWNER")

        &&

        roles.includes("LEAD")

        ?

        "OWNER + LEAD"

        :

        roles.includes("OWNER")

        ?

        "OWNER"

        :

        roles.includes("LEAD")

        ?

        "LEAD"

        :

        workspace.role

        ||

        "DEVELOPER";


    const isOwner =

        displayRole === "OWNER"

        ||

        displayRole === "OWNER + LEAD";


    //--------------------------------------------------
    // STYLES
    //--------------------------------------------------

    const roleStyles = {

        OWNER:
        "bg-amber-500/10 border-amber-500/20 text-amber-300",

        LEAD:
        "bg-violet-500/10 border-violet-500/20 text-violet-300",

        DEVELOPER:
        "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",

        "OWNER + LEAD":
        "bg-purple-500/10 border-purple-500/20 text-purple-300"

    };


    const workspaceStyles = {

        TEAM:
        "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",

        PERSONAL:
        "bg-slate-500/10 border-slate-500/20 text-slate-300"

    };


    const statusClass =

        hasAlert

            ?

            "border-l-4 border-l-amber-500"

            :

            "";


    return (

        <div

            onClick={() =>

                navigate(

                    `/workspace/${workspace.id}`

                )

            }

            className={`

                group
                relative

                h-[190px]
                p-5

                rounded-xl

                bg-[var(--card-bg)]

                border
                border-[var(--border)]

                ${statusClass}

                transition-all
                duration-300

                cursor-pointer

                hover:border-[#3d4a5d]
                hover:-translate-y-1
                hover:shadow-lg
                hover:shadow-black/50

            `}

        >

            {/* HEADER */}

            <div

                className="

                    flex
                    justify-between
                    items-start
                    gap-4

                "

            >

                <div

                    className="

                        flex
                        gap-4

                        flex-1
                        min-w-0

                    "

                >

                    {/* ICON */}

                    <div

                        className="

                            w-10
                            h-10

                            rounded-lg

                            bg-[var(--bg-primary)]

                            flex
                            items-center
                            justify-center

                            shrink-0

                            transition-transform
                            duration-300

                            group-hover:scale-105

                        "

                    >

                        {

                            workspace.workspace_type
                            === "TEAM"

                                ?

                                <Users size={18} />

                                :

                                <User size={18} />

                        }

                    </div>


                    {/* TITLE */}

                    <div

                        className="

                            flex-1
                            min-w-0

                        "

                    >

                        <h2

                            className="

                                text-lg
                                font-semibold

                                tracking-tight
                                leading-snug

                                line-clamp-2

                                text-[var(--text-primary)]

                            "

                        >

                            {

                                workspace
                                .workspace_name

                            }

                        </h2>

                    </div>

                </div>


                {/* ACTIONS */}

                <div

                    className="

                        relative

                        flex
                        items-center
                        gap-2

                    "

                >

                    {

                        hasAlert && (

                            <AlertTriangle

                                size={15}

                                className="
                                    text-amber-400
                                "

                            />

                        )

                    }


                    {

                        isOwner && (

                            <>

                                <button

                                    onClick={(event) => {

                                        event.stopPropagation();

                                        setShowMenu(

                                            !showMenu

                                        );

                                    }}

                                    className="

                                        opacity-0

                                        group-hover:opacity-100

                                        transition-opacity
                                        duration-200

                                        text-[var(--text-secondary)]

                                        hover:text-[var(--text-primary)]

                                        cursor-pointer

                                    "

                                >

                                    <MoreVertical
                                        size={18}
                                    />

                                </button>


                                {

                                    showMenu && (

                                        <div

                                            className="

                                                absolute

                                                top-8
                                                right-0

                                                w-40

                                                rounded-xl

                                                overflow-hidden

                                                bg-[var(--bg-secondary)]

                                                border
                                                border-[var(--border)]

                                                shadow-2xl

                                                z-50

                                            "

                                        >

                                            <button

                                                onClick={(event) => {

                                                    event.stopPropagation();

                                                    setShowMenu(
                                                        false
                                                    );

                                                    onRename(
                                                        workspace
                                                    );

                                                }}

                                                className="

                                                    w-full

                                                    px-4
                                                    py-3

                                                    flex
                                                    items-center
                                                    gap-3

                                                    text-sm
                                                    font-medium

                                                    hover:bg-[var(--card-bg)]

                                                    transition

                                                    cursor-pointer

                                                "

                                            >

                                                <Edit
                                                    size={15}
                                                />

                                                Rename

                                            </button>


                                            <button

                                                onClick={(event) => {

                                                    event.stopPropagation();

                                                    setShowMenu(
                                                        false
                                                    );

                                                    onDelete(
                                                        workspace
                                                    );

                                                }}

                                                className="

                                                    w-full

                                                    px-4
                                                    py-3

                                                    flex
                                                    items-center
                                                    gap-3

                                                    text-sm
                                                    font-medium

                                                    text-red-400

                                                    hover:bg-[var(--card-bg)]

                                                    transition

                                                    cursor-pointer

                                                "

                                            >

                                                <Trash2
                                                    size={15}
                                                />

                                                Delete

                                            </button>

                                        </div>

                                    )

                                }

                            </>

                        )

                    }

                </div>

            </div>


            {/* TAGS */}

            <div

                className="

                    flex
                    flex-wrap
                    gap-2

                    mt-5

                "

            >

                <span

                    className={`

                        px-3
                        py-1

                        rounded-full

                        text-[10px]
                        font-medium

                        uppercase

                        tracking-[0.18em]

                        border

                        ${

                            workspaceStyles[
                                workspace.workspace_type
                            ]

                        }

                    `}

                >

                    {

                        workspace
                        .workspace_type

                    }

                </span>


                <span

                    className={`

                        px-3
                        py-1

                        rounded-full

                        text-[10px]
                        font-medium

                        uppercase

                        tracking-[0.18em]

                        border

                        ${

                            roleStyles[
                                displayRole
                            ]

                        }

                    `}

                >

                    {

                        displayRole

                    }

                </span>

            </div>


            {/* FOOTER */}

            <div

                className="

                    absolute

                    bottom-5
                    left-5
                    right-5

                    flex
                    items-center

                "

            >

                <p

                className="

                    font-mono

                    text-[10px]

                    uppercase

                    tracking-[0.22em]

                    text-[var(--text-secondary)]

                    flex
                    items-center

                "

            >

                Created:

                {" "}

                {

                    new Date(

                        workspace.created_at

                    ).toLocaleDateString()

                }

                <span

                    className="

                        mx-4

                        text-[var(--text-secondary)]

                    "

                >

                    •

                </span>

            <span

                className="

                    text-sky-300/80

                "

            >

                <span

                    className="

                        font-medium

                    "

                >

                    {workspace.service_count ?? 0}

                </span>

                {" SERVICES"}

            </span>

            </p>

            </div>

        </div>

    );

}


export default WorkspaceCard;