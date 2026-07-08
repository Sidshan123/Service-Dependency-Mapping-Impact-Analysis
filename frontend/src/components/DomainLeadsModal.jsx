import {

    useEffect,
    useState

}
from "react";

import {

    X,
    Pencil

}
from "lucide-react";

import {

    getDomainLeads,
    getChangeLeadOptions,
    changeDomainLead

}
from "../services/workspaceService";

function DomainLeadsModal({

    workspaceId,
    onClose

}){

    //----------------------------------
    // DOMAIN LIST
    //----------------------------------

    const[

        domains,
        setDomains

    ] = useState([]);

    const[

        loading,
        setLoading

    ] = useState(true);

    //----------------------------------
    // CURRENTLY EXPANDED DOMAIN
    //----------------------------------

    const[

        expandedDomainId,
        setExpandedDomainId

    ] = useState(null);

    //----------------------------------
    // OPTIONS
    //----------------------------------

    const[

        leadOptions,
        setLeadOptions

    ] = useState({

        current_lead:{},

        developers:[],

        existing_leads:[]

    });

    //----------------------------------
    // SELECTED USER
    //----------------------------------

    const[

        selectedUser,
        setSelectedUser

    ] = useState(null);

    //----------------------------------
    // REMOVE OLD LEAD
    //----------------------------------

    const[

        removeOldLead,
        setRemoveOldLead

    ] = useState(false);

    //----------------------------------
    // LOADING
    //----------------------------------

    const[

        assigning,
        setAssigning

    ] = useState(false);

    useEffect(

        ()=>{

            fetchDomains();

        },

        []

    );

    //----------------------------------
    // FETCH DOMAINS
    //----------------------------------

    async function fetchDomains(){

        try{

            setLoading(true);

            const data =

            await getDomainLeads(

                workspaceId

            );

            setDomains(

                data

            );

        }
        catch(error){

            alert(

                error.response?.data?.message ||

                "Failed to fetch domain leads"

            );

            onClose();

        }
        finally{

            setLoading(false);

        }

    }

    //----------------------------------
    // MODIFY LEAD
    //----------------------------------

    async function handleModifyLead(
        domain
    ){

        try{

            //----------------------------------
            // COLLAPSE
            //----------------------------------

            if(

                expandedDomainId ===

                domain.domain_id

            ){

                setExpandedDomainId(

                    null

                );

                setLeadOptions({

                    current_lead:{},

                    developers:[],

                    existing_leads:[]

                });

                setSelectedUser(

                    null

                );

                setRemoveOldLead(

                    false

                );

                return;

            }

            //----------------------------------
            // FETCH OPTIONS
            //----------------------------------

            const response =

            await getChangeLeadOptions(

                domain.domain_id,

                domain.lead_id

            );

            //----------------------------------
            // IF CURRENT LEAD
            // HANDLES MULTIPLE
            // DOMAINS REMOVE
            // HIM AUTOMATICALLY
            //----------------------------------

            if(

                response.current_lead
                .is_multi_domain_lead

            ){

                setRemoveOldLead(

                    true

                );

            }
            else{

                setRemoveOldLead(

                    false

                );

            }

            //----------------------------------
            // RESET
            //----------------------------------

            setSelectedUser(

                null

            );

            setExpandedDomainId(

                domain.domain_id

            );

            setLeadOptions(

                response

            );

        }
        catch(error){

            alert(

                error.response?.data?.message ||

                "Failed to fetch lead options"

            );

        }

    }

    //----------------------------------
    // USERS
    //----------------------------------

    const users = [

        ...leadOptions.developers.map(

            developer=>({

                id:
                developer.id,

                name:
                developer.name,

                type:
                "DEVELOPER"

            })

        ),

        ...leadOptions.existing_leads.map(

            lead=>({

                id:
                lead.id,

                name:
                lead.name,

                domain_name:
                lead.domain_name,

                type:
                "LEAD"

            })

        )

    ];

    //----------------------------------
    // NO OPTIONS
    //----------------------------------

    const noOptionsAvailable =

        users.length===0;

    //----------------------------------
    // ASSIGN LEAD
    //----------------------------------
        async function handleAssignLead(
        domainId
    ){

        if(

            !selectedUser

        ){

            alert(

                "Please select a user."

            );

            return;

        }

        try{

            setAssigning(
                true
            );

            const response =

            await changeDomainLead(

                domainId,

                {

                    new_lead_user_id:
                    selectedUser.id,

                    user_type:
                    selectedUser.type,

                    remove_old_lead:
                    removeOldLead

                }

            );

            alert(
                response.message
            );

            //----------------------------------
            // RESET
            //----------------------------------

            setExpandedDomainId(
                null
            );

            setLeadOptions({

                current_lead:{},

                developers:[],

                existing_leads:[]

            });

            setSelectedUser(
                null
            );

            setRemoveOldLead(
                false
            );

            //----------------------------------
            // REFRESH
            //----------------------------------

            await fetchDomains();

        }
        catch(error){

            alert(

                error.response?.data?.message ||

                "Failed to assign lead"

            );

        }
        finally{

            setAssigning(
                false
            );

        }

    }

    return(

        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

            <div className="w-[760px] max-h-[85vh] overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--card-bg)] p-8">

                {/* HEADER */}

                <div className="flex items-center justify-between">

                    <h2 className="text-2xl font-bold">

                        Manage Domain Leads

                    </h2>

                    <button

                        onClick={
                            onClose
                        }

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

                            Loading domains...

                        </div>

                    )

                    :

                    domains.length===0

                    ?

                    (

                        <div className="py-20 text-center text-[var(--text-secondary)]">

                            No domains found.

                        </div>

                    )

                    :

                    (

                        <div className="mt-8 space-y-5">

                            {

                                domains.map(

                                    domain=>(

                                        <div

                                            key={

                                                domain.domain_id

                                            }

                                            className="rounded-2xl border border-[var(--border)] bg-[var(--bg-primary)] p-5"

                                        >

                                            <div className="flex items-center justify-between">

                                                <div>

                                                    <h3 className="text-lg font-semibold">

                                                        {

                                                            domain.domain_name

                                                        }

                                                    </h3>

                                                    <p className="text-sm text-[var(--text-secondary)]">

                                                        Lead

                                                        <span className="ml-2 font-medium">

                                                            {

                                                                domain.lead_name

                                                            }

                                                        </span>

                                                    </p>

                                                </div>

                                                <button

                                                    onClick={()=>{

                                                        handleModifyLead(

                                                            domain

                                                        );

                                                    }}

                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 transition"

                                                >

                                                    <Pencil

                                                        size={18}

                                                    />

                                                    {

                                                        expandedDomainId===

                                                        domain.domain_id

                                                        ?

                                                        "Hide Options"

                                                        :

                                                        "Modify Lead"

                                                    }

                                                </button>

                                            </div>

                                            {

                                                expandedDomainId===

                                                domain.domain_id

                                                &&

                                                (

                                                    <div className="mt-6 border-t border-[var(--border)] pt-6">

                                                        {

                                                            noOptionsAvailable

                                                            ?

                                                            (

                                                                <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300">

                                                                    No eligible developers or leads are available to become the new lead.

                                                                </div>

                                                            )

                                                            :

                                                            (

                                                                <>
                                                                                                                                    <h4 className="text-sm font-semibold text-[var(--text-secondary)]">

                                                                        Select New Lead

                                                                    </h4>

                                                                    <div className="mt-4 space-y-3">

                                                                        {

                                                                            users.map(

                                                                                user=>(

                                                                                    <label

                                                                                        key={`${user.type}-${user.id}`}

                                                                                        className={`flex items-center justify-between rounded-xl border px-4 py-4 cursor-pointer transition

                                                                                        ${

                                                                                            selectedUser?.id===user.id

                                                                                            &&

                                                                                            selectedUser?.type===user.type

                                                                                            ?

                                                                                            "border-cyan-500 bg-cyan-500/10"

                                                                                            :

                                                                                            "border-[var(--border)] bg-[var(--card-bg)] hover:border-cyan-500/40"

                                                                                        }`}

                                                                                    >

                                                                                        <div className="flex items-center gap-4">

                                                                                            <input

                                                                                                type="radio"

                                                                                                name={`lead-${domain.domain_id}`}

                                                                                                checked={

                                                                                                    selectedUser?.id===user.id

                                                                                                    &&

                                                                                                    selectedUser?.type===user.type

                                                                                                }

                                                                                                onChange={()=>{

                                                                                                    setSelectedUser({

                                                                                                        id:user.id,

                                                                                                        type:user.type

                                                                                                    });

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

                                                                                            <span className="rounded-lg bg-cyan-500/15 px-3 py-1 text-xs font-medium text-cyan-400">

                                                                                                Existing Lead

                                                                                            </span>

                                                                                        }

                                                                                    </label>

                                                                                )

                                                                            )

                                                                        }

                                                                    </div>

                                                                    {

                                                                        !leadOptions.current_lead

                                                                        .is_multi_domain_lead

                                                                        &&

                                                                        (

                                                                            <label className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--border)] p-4">

                                                                                <input

                                                                                    type="checkbox"

                                                                                    checked={

                                                                                        removeOldLead

                                                                                    }

                                                                                    onChange={

                                                                                        event=>{

                                                                                            setRemoveOldLead(

                                                                                                event.target.checked

                                                                                            );

                                                                                        }

                                                                                    }

                                                                                />

                                                                                <span className="text-sm">

                                                                                    Remove previous lead from this domain

                                                                                </span>

                                                                            </label>

                                                                        )

                                                                    }

                                                                    {

                                                                        leadOptions.current_lead

                                                                        .is_multi_domain_lead

                                                                        &&

                                                                        (

                                                                            <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-300">

                                                                                The current lead manages multiple domains.

                                                                                They will automatically be removed from this

                                                                                domain after assigning the new lead.

                                                                            </div>

                                                                        )

                                                                    }
                                                                                                                                        <button

                                                                        disabled={

                                                                            assigning ||

                                                                            !selectedUser

                                                                        }

                                                                        onClick={()=>{

                                                                            handleAssignLead(

                                                                                domain.domain_id

                                                                            );

                                                                        }}

                                                                        className="mt-6 w-full rounded-xl bg-cyan-500 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"

                                                                    >

                                                                        {

                                                                            assigning

                                                                            ?

                                                                            "Assigning..."

                                                                            :

                                                                            "Assign as Lead"

                                                                        }

                                                                    </button>

                                                                </>

                                                            )

                                                        }

                                                    </div>

                                                )

                                            }

                                        </div>

                                    )

                                )

                            }

                        </div>

                    )

                }

                <button

                    onClick={

                        onClose

                    }

                    className="mt-8 w-full rounded-xl border border-[var(--border)] py-3 hover:bg-zinc-800 transition"

                >

                    Close

                </button>

            </div>

        </div>

    );

}

export default DomainLeadsModal;