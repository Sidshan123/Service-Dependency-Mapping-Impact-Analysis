import {

    useEffect,
    useState

}
from "react";

import {

    useNavigate

}
from "react-router-dom";

import {

    X

}
from "lucide-react";

import {

    getExitOptions,
    exitWorkspace

}
from "../services/workspaceService";

import toast from "react-hot-toast";

function ExitWorkspaceModal({

    workspaceId,
    exitType,
    onClose

}){

    const navigate =
    useNavigate();

    //----------------------------------
    // OPTIONS
    //----------------------------------

    const [

        options,
        setOptions

    ] = useState(null);

    //----------------------------------
    // LOADING
    //----------------------------------

    const [

        loading,
        setLoading

    ] = useState(true);

    //----------------------------------
    // EXITING
    //----------------------------------

    const [

        exiting,
        setExiting

    ] = useState(false);

    //----------------------------------
    // OWNER
    //----------------------------------

    const [

        selectedOwner,
        setSelectedOwner

    ] = useState(null);

    //----------------------------------
    // DOMAIN LEADS
    //----------------------------------

    const [

        selectedDomainLeads,
        setSelectedDomainLeads

    ] = useState({});

    //----------------------------------
    // FETCH OPTIONS
    //----------------------------------

    useEffect(

        ()=>{
            console.log("fetch exit options")

            fetchExitOptions();

        },

        [

            workspaceId,
            exitType

        ]

    );

    //----------------------------------
    // FETCH
    //----------------------------------

    async function fetchExitOptions(){

        try{

            setLoading(

                true

            );

            const response =

            await getExitOptions(

                workspaceId,

                exitType

            );

            setOptions(

                response

            );

        }
        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to fetch exit options"

            );

            onClose();

        }
        finally{

            setLoading(

                false

            );

        }

    }

    //----------------------------------
    // OWNER
    //----------------------------------

    function handleOwnerSelect(

        owner

    ){

        setSelectedOwner(

            owner

        );

    }

    //----------------------------------
    // DOMAIN
    //----------------------------------

    function handleLeadSelection(

        domainId,
        user

    ){

        setSelectedDomainLeads(

            previous=>({

                ...previous,

                [domainId]:

                user

            })

        );

    }

    //----------------------------------
    // EXIT
    //----------------------------------

    async function handleExit(){

        try{

            setExiting(

                true

            );

            const payload = {

                exit_type:

                exitType

            };

            //----------------------------------
            // OWNER
            //----------------------------------

            if(

                exitType ===
                "OWNER"

            ){

                if(

                    !selectedOwner

                ){

                    toast.error(

                        "Please select a new workspace owner."

                    );

                    return;

                }

                payload.new_owner_user_id =

                selectedOwner.id;

            }

            //----------------------------------
            // LEAD
            //----------------------------------

            if(

                exitType ===
                "LEAD"

            ){

                if(

                    Object.keys(

                        selectedDomainLeads

                    ).length

                    !==

                    (options.domain_transfers || []).length

                ){

                    toast.error(

                        "Please select a replacement lead for every domain."

                    );

                    return;

                }

                payload.domain_transfers =

                (options.domain_transfers || []).map(

                    domain => ({

                        domain_id:

                        domain.domain_id,

                        new_lead_user_id:

                        selectedDomainLeads[

                            domain.domain_id

                        ].id,

                        user_type:

                        selectedDomainLeads[

                            domain.domain_id

                        ].type

                    })

                );

            }

            //----------------------------------
            // OWNER + LEAD
            //----------------------------------

            if(

                exitType ===
                "OWNER_AND_LEAD"

            ){

                if(

                    !selectedOwner

                ){

                    toast.error(

                        "Please select a new workspace owner."

                    );

                    return;

                }

                if(

                    Object.keys(

                        selectedDomainLeads

                    ).length

                    !==

                    (options.domain_transfers || []).length

                ){

                    toast.error(

                        "Please select a replacement lead for every domain."

                    );

                    return;

                }

                payload.new_owner_user_id =

                selectedOwner.id;

                payload.domain_transfers =

                (options.domain_transfers || []).map(

                    domain => ({

                        domain_id:

                        domain.domain_id,

                        new_lead_user_id:

                        selectedDomainLeads[

                            domain.domain_id

                        ].id,

                        user_type:

                        selectedDomainLeads[

                            domain.domain_id

                        ].type

                    })

                );

            }

            //----------------------------------
            // EXIT
            //----------------------------------

            const response =

            await exitWorkspace(

                workspaceId,

                payload

            );

            toast.success(

                response.message

            );

            navigate(

                "/dashboard"

            );

        }
        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to exit workspace"

            );

        }
        finally{

            setExiting(

                false

            );

        }

    }

    return(

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="w-[760px] max-h-[85vh] overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-8">
                                {/*----------------------------------
                    HEADER
                -----------------------------------*/}

                <div className="flex items-center justify-between">

                    <h2 className="text-2xl font-bold">

                        Exit Workspace

                    </h2>

                    <button

                        onClick={onClose}

                        className="p-2 rounded-lg hover:bg-zinc-800 transition"

                    >

                        <X size={20}/>

                    </button>

                </div>

                {

                    loading

                    ?

                    (

                        <div className="py-20 text-center text-[var(--text-secondary)]">

                            Loading exit options...

                        </div>

                    )

                    :

                    (

                        <div className="mt-8">

                            {/*----------------------------------
                                DEVELOPER
                            -----------------------------------*/}

                            {

                                exitType === "DEVELOPER"

                                &&

                                (

                                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5">

                                        <h3 className="text-lg font-semibold text-red-400">

                                            Exit Workspace

                                        </h3>

                                        <p className="mt-3 text-sm text-[var(--text-secondary)]">

                                            {

                                                options?.message

                                            }

                                        </p>

                                    </div>

                                )

                            }

                            {/*----------------------------------
                                OWNER
                            -----------------------------------*/}

                            {

                                (

                                    exitType === "OWNER"

                                    ||

                                    exitType === "OWNER_AND_LEAD"

                                )

                                &&

                                (

                                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-5">

                                        <h3 className="text-lg font-semibold">

                                            Select New Workspace Owner

                                        </h3>

                                        <p className="mt-1 text-sm text-[var(--text-secondary)]">

                                            Ownership must be transferred before exiting.

                                        </p>

                                        <div className="mt-5 space-y-3">

                                            {

                                                (options?.owner_candidates || []).map(

                                                    owner => (

                                                        <label

                                                            key={owner.id}

                                                            className={`flex items-center justify-between rounded-xl border px-4 py-4 cursor-pointer transition

                                                            ${

                                                                selectedOwner?.id === owner.id

                                                                ?

                                                                "border-cyan-500 bg-cyan-500/10"

                                                                :

                                                                "border-[var(--border)] bg-[var(--card-bg)] hover:border-cyan-500/40"

                                                            }`}

                                                        >

                                                            <div className="flex items-center gap-4">

                                                                <input

                                                                    type="radio"

                                                                    name="workspace-owner"

                                                                    checked={

                                                                        selectedOwner?.id === owner.id

                                                                    }

                                                                    onChange={()=>

                                                                        handleOwnerSelect(

                                                                            owner

                                                                        )

                                                                    }

                                                                    className="h-4 w-4"

                                                                />

                                                                <div>

                                                                    <div className="font-medium">

                                                                        {

                                                                            owner.name

                                                                        }

                                                                    </div>

                                                                    <div className="mt-1 text-xs text-[var(--text-secondary)]">

                                                                        Existing Lead

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </label>

                                                    )

                                                )

                                            }

                                        </div>

                                    </div>

                                )

                            }
                                                        {/*----------------------------------
                                LEAD
                            -----------------------------------*/}

                            {

                                (

                                    exitType === "LEAD"

                                    ||

                                    exitType === "OWNER_AND_LEAD"

                                )

                                &&

                                (

                                    <div className="mt-6 space-y-5">

                                        {

                                            (options?.domain_transfers || []).map(

                                                domain=>{

                                                    const users = [

                                                        ...domain.developer_candidates.map(

                                                            developer=>({

                                                                id:developer.id,

                                                                name:developer.name,

                                                                type:"DEVELOPER"

                                                            })

                                                        ),

                                                        ...domain.existing_lead_candidates.map(

                                                            lead=>({

                                                                id:lead.id,

                                                                name:lead.name,

                                                                domain_name:lead.domain_name,

                                                                type:"LEAD"

                                                            })

                                                        )

                                                    ];

                                                    return(

                                                        <div

                                                            key={

                                                                domain.domain_id

                                                            }

                                                            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-5"

                                                        >

                                                            <h3 className="text-lg font-semibold">

                                                                {

                                                                    domain.domain_name

                                                                }

                                                            </h3>

                                                            <p className="mt-1 text-sm text-[var(--text-secondary)]">

                                                                Select a replacement lead.

                                                            </p>

                                                            <div className="mt-5 space-y-3">

                                                                {

                                                                    users.map(

                                                                        user=>(

                                                                            <label

                                                                                key={`${domain.domain_id}-${user.type}-${user.id}`}

                                                                                className={`flex items-center justify-between rounded-xl border px-4 py-4 cursor-pointer transition

                                                                                ${

                                                                                    selectedDomainLeads[domain.domain_id]?.id===user.id

                                                                                    &&

                                                                                    selectedDomainLeads[domain.domain_id]?.type===user.type

                                                                                    ?

                                                                                    "border-cyan-500 bg-cyan-500/10"

                                                                                    :

                                                                                    "border-[var(--border)] bg-[var(--card-bg)] hover:border-cyan-500/40"

                                                                                }`}

                                                                            >

                                                                                <div className="flex items-center gap-4">

                                                                                    <input

                                                                                        type="radio"

                                                                                        name={`domain-${domain.domain_id}`}

                                                                                        checked={

                                                                                            selectedDomainLeads[domain.domain_id]?.id===user.id

                                                                                            &&

                                                                                            selectedDomainLeads[domain.domain_id]?.type===user.type

                                                                                        }

                                                                                        onChange={()=>{

                                                                                            handleLeadSelection(

                                                                                                domain.domain_id,

                                                                                                {

                                                                                                    id:user.id,

                                                                                                    type:user.type

                                                                                                }

                                                                                            );

                                                                                        }}

                                                                                        className="h-4 w-4"

                                                                                    />

                                                                                    <div>

                                                                                        <div className="font-medium">

                                                                                            {

                                                                                                user.name

                                                                                            }

                                                                                        </div>

                                                                                        <div className="mt-1 text-xs text-[var(--text-secondary)]">

                                                                                            {

                                                                                                user.type==="DEVELOPER"

                                                                                                ?

                                                                                                "Developer"

                                                                                                :

                                                                                                `Lead • ${user.domain_name}`

                                                                                            }

                                                                                        </div>

                                                                                    </div>

                                                                                </div>

                                                                                {

                                                                                    user.type==="LEAD"

                                                                                    &&

                                                                                    (

                                                                                        <span className="rounded-lg bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-400">

                                                                                            Existing Lead

                                                                                        </span>

                                                                                    )

                                                                                }

                                                                            </label>

                                                                        )

                                                                    )

                                                                }

                                                            </div>

                                                        </div>

                                                    );

                                                }

                                            )

                                        }

                                    </div>

                                )

                            }
                                                        <button

                                disabled={

                                    exiting ||

                                    (

                                        exitType === "OWNER"

                                        &&

                                        !selectedOwner

                                    ) ||

                                    (

                                        exitType === "LEAD"

                                        &&

                                        Object.keys(

                                            selectedDomainLeads

                                        ).length

                                        !==

                                        (options?.domain_transfers || []).length

                                    ) ||

                                    (

                                        exitType === "OWNER_AND_LEAD"

                                        &&

                                        (

                                            !selectedOwner ||

                                            Object.keys(

                                                selectedDomainLeads

                                            ).length

                                            !==

                                            (options?.domain_transfers || []).length

                                        )

                                    )

                                }

                                onClick={

                                    handleExit

                                }

                                className="mt-8 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"

                            >

                                {

                                    exiting

                                    ?

                                    "Processing..."

                                    :

                                    exitType === "DEVELOPER"

                                    ?

                                    "Exit Workspace"

                                    :

                                    exitType === "OWNER"

                                    ?

                                    "Transfer Ownership & Exit"

                                    :

                                    exitType === "LEAD"

                                    ?

                                    "Assign New Leads & Exit"

                                    :

                                    "Transfer Ownership, Assign Leads & Exit"

                                }

                            </button>

                        </div>

                    )

                }

                <button

                    onClick={

                        onClose

                    }

                    className="mt-5 w-full rounded-xl border border-[var(--border)] py-3 hover:bg-zinc-800 transition"

                >

                    Cancel

                </button>

            </div>

        </div>

    );

}

export default ExitWorkspaceModal;