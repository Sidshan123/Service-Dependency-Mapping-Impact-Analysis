import {

    useEffect,
    useState

}
from "react";

import {

    X,
    Pencil,
    Trash2,
    Check,
    Ban

}
from "lucide-react";

import {

    getDomains,
    updateDomainName,
    deleteDomain

}
from "../services/workspaceService";


function ManageDomainsModal({

    workspaceId,
    refreshWorkspace,
    roles,
    onClose

}){

    const [

        domains,
        setDomains

    ] = useState({

        my_domains:[],

        other_domains:[]

    });


    const [

        loading,
        setLoading

    ] = useState(true);


    const [

        editingDomainId,
        setEditingDomainId

    ] = useState(null);


    const [

        newDomainName,
        setNewDomainName

    ] = useState("");


    //--------------------------------------------------
    // FETCH DOMAINS
    //--------------------------------------------------

    useEffect(

        ()=>{

            fetchDomains();

        },

        []

    );


    async function fetchDomains(){

        try{

            const data =
            await getDomains(
                workspaceId
            );

            setDomains(
                data
            );

        }
        catch(error){

            alert(

                error.response
                ?.data
                ?.message

                ||

                "Failed to fetch domains"

            );

            onClose();

        }
        finally{

            setLoading(
                false
            );

        }

    }


    //--------------------------------------------------
    // EDIT DOMAIN
    //--------------------------------------------------

     async function handleEdit(
            domain
        ){

            const newName =
            prompt(
                "Enter new domain name:",
                domain.domain_name
            );

            if(

                !newName ||

                newName.trim() === "" ||

                newName === domain.domain_name

            ){

                return;

            }

            try{

                const response =
                await updateDomainName(

                    domain.id,

                    newName.trim()

                );

                alert(

                    response.message ||

                    "Domain updated successfully."

                );

            }

            catch(error){

                console.error(
                    "Update failed:",
                    error
                );

                alert(

                    error.response?.data?.message ||

                    "Failed to update domain."

                );

                return;

            }

            try{

                await fetchDomains();

                if(refreshWorkspace){

                    await refreshWorkspace();

                }

            }

            catch(error){

                console.error(
                    "Refresh failed:",
                    error
                );

            }

        }


    function handleSave(){

        alert(
            "Rename Domain API coming soon!"
        );



        setDomains(previousDomains => ({

            ...previousDomains,

            my_domains:

                previousDomains.my_domains.filter(

                    domain =>

                        domain.id !== id

                )

        }));


        setEditingDomainId(
            null
        );

    }


    function handleCancel(){

        setEditingDomainId(
            null
        );

    }


    //--------------------------------------------------
    // DELETE
    //--------------------------------------------------

        async function handleDelete(
            id
        ){

            const confirmed = window.confirm(

                "Are you sure you want to delete this domain?"

            );

            if(!confirmed){

                return;

            }

            try{

                const response =
                    await deleteDomain(id);

                alert(
                    response.message
                );

                await refreshWorkspace?.();

                setDomains(

                previousDomains => ({

                    ...previousDomains,

                    my_domains:

                        previousDomains.my_domains.filter(

                            domain =>

                                domain.id !== id

                        )

                })

            );

            }
            catch(error){

                console.error(error);

                alert(

                    error.response?.data?.message ||

                    error.message ||

                    "Failed to delete domain."

                );

            }

        }


    return(

        <div

            className="

                fixed
                inset-0

                bg-black/60

                flex
                items-center
                justify-center

                z-50

            "

        >

            <div

                className="

                    w-[700px]
                    max-h-[80vh]

                    overflow-y-auto

                    rounded-3xl

                    border
                    border-[var(--border)]

                    bg-[var(--card-bg)]

                    p-8

                "

            >

                {/* HEADER */}

                <div

                    className="

                        flex
                        items-center
                        justify-between

                    "

                >

                    <h2

                        className="

                            text-2xl
                            font-bold

                        "

                    >

                        Manage Domains

                    </h2>

                    <button

                        onClick={onClose}

                        className="

                            p-2

                            rounded-lg

                            hover:bg-zinc-800

                        "

                    >

                        <X
                            size={20}
                        />

                    </button>

                </div>

                {/* CONTENT */}

                {

                    loading

                    ?

                    (

                        <div

                            className="

                                py-20

                                text-center

                                text-[var(--text-secondary)]

                            "

                        >

                            Loading domains...

                        </div>

                    )

                    :

                    (

                        <div

                            className="

                                mt-8

                                space-y-8

                            "

                        >

                            {/* MY DOMAINS */}

                            <div>

                                <h3

                                    className="

                                        max-w-[550px]
                                        mx-auto

                                        mb-3

                                        text-sm
                                        font-semibold

                                        uppercase

                                        tracking-wider

                                        text-[var(--text-secondary)]

                                    "

                                >

                                    My Domains

                                </h3>

                        {

                                    domains.my_domains.map(

                                        domain=>(

                                            <div

                                                key={domain.id}

                                                className="

                                                    max-w-[550px]
                                                    mx-auto
                                                    mb-4

                                                    rounded-2xl

                                                    border
                                                    border-[var(--border)]

                                                    bg-[var(--bg-primary)]

                                                    px-6
                                                    py-5

                                                    flex
                                                    items-center
                                                    justify-between

                                                "

                                            >

                                                {

                                                    editingDomainId ===
                                                    domain.id

                                                    ?

                                                    (

                                                        <div

                                                            className="

                                                                flex
                                                                items-center
                                                                gap-3

                                                                w-full

                                                            "

                                                        >

                                                            <input

                                                                value={
                                                                    newDomainName
                                                                }

                                                                onChange={

                                                                    event=>{

                                                                        setNewDomainName(

                                                                            event
                                                                            .target
                                                                            .value

                                                                        );

                                                                    }

                                                                }

                                                                className="

                                                                    flex-1

                                                                    px-4
                                                                    py-2

                                                                    rounded-xl

                                                                    bg-zinc-900

                                                                    border
                                                                    border-cyan-500

                                                                    outline-none

                                                                "

                                                            />

                                                            <button

                                                                onClick={
                                                                    handleSave
                                                                }

                                                                className="

                                                                    p-2

                                                                    rounded-lg

                                                                    text-green-400

                                                                    hover:bg-green-500/15

                                                                    transition

                                                                "

                                                            >

                                                                <Check
                                                                    size={20}
                                                                />

                                                            </button>

                                                            <button

                                                                onClick={
                                                                    handleCancel
                                                                }

                                                                className="

                                                                    p-2

                                                                    rounded-lg

                                                                    text-red-400

                                                                    hover:bg-red-500/15

                                                                    transition

                                                                "

                                                            >

                                                                <Ban
                                                                    size={20}
                                                                />

                                                            </button>

                                                        </div>

                                                    )

                                                    :

                                                    (

                                                        <>

                                                            <div>

                                                                <h3

                                                                    className="

                                                                        text-lg
                                                                        font-semibold

                                                                    "

                                                                >

                                                                    {

                                                                        domain
                                                                        .domain_name

                                                                    }

                                                                </h3>

                                                                <p

                                                                    className="

                                                                        text-sm

                                                                        text-[var(--text-secondary)]

                                                                    "

                                                                >

                                                                    Lead:{" "}

                                                                    {

                                                                        domain
                                                                        .lead_name

                                                                    }

                                                                </p>

                                                            </div>

                                                            <div

                                                                className="

                                                                    flex
                                                                    items-center
                                                                    gap-3

                                                                "

                                                            >

                                                                <button

                                                                    onClick={()=>{

                                                                        handleEdit(
                                                                            domain
                                                                        );

                                                                    }}

                                                                    className="

                                                                        p-3

                                                                        rounded-xl

                                                                        bg-cyan-500/15

                                                                        text-cyan-400

                                                                        hover:bg-cyan-500/25

                                                                        transition

                                                                    "

                                                                >

                                                                    <Pencil
                                                                        size={18}
                                                                    />

                                                                </button>

                                                                <button

                                                                    onClick={()=>{

                                                                        handleDelete(
                                                                            domain.id
                                                                        );

                                                                    }}

                                                                    className="

                                                                        p-3

                                                                        rounded-xl

                                                                        bg-red-500/15

                                                                        text-red-400

                                                                        hover:bg-red-500/25

                                                                        transition

                                                                    "

                                                                >

                                                                    <Trash2
                                                                        size={18}
                                                                    />

                                                                </button>

                                                            </div>

                                                        </>

                                                    )

                                                }

                                            </div>

                                        )

                                    )

                                }

                            </div>


                            {/* OTHER DOMAINS */}

                            <div>

                                <h3

                                    className="

                                        max-w-[550px]
                                        mx-auto

                                        mb-3

                                        text-sm
                                        font-semibold

                                        uppercase

                                        tracking-wider

                                        text-[var(--text-secondary)]

                                    "

                                >

                                    Other Domains

                                </h3>

                                {

                                    domains.other_domains.map(

                                        domain=>(

                                            <div

                                                key={domain.id}

                                                className="

                                                    max-w-[550px]
                                                    mx-auto
                                                    mb-4

                                                    rounded-2xl

                                                    border
                                                    border-[var(--border)]

                                                    bg-[var(--bg-primary)]

                                                    px-6
                                                    py-5

                                                    flex
                                                    items-center
                                                    justify-between

                                                "

                                            >

                                                <div>

                                                    <h3

                                                        className="

                                                            text-lg
                                                            font-semibold

                                                        "

                                                    >

                                                        {

                                                            domain
                                                            .domain_name

                                                        }

                                                    </h3>

                                                    <p

                                                        className="

                                                            text-sm

                                                            text-[var(--text-secondary)]

                                                        "

                                                    >

                                                        Lead:{" "}

                                                        {

                                                            domain
                                                            .lead_name

                                                        }

                                                    </p>

                                                </div>

                                            </div>

                                        )

                                    )

                                }

                            </div>

                        </div>

                    )

                }

                <button

                    onClick={onClose}

                    className="

                        mt-8

                        w-full

                        py-3

                        rounded-xl

                        border
                        border-[var(--border)]

                        hover:bg-zinc-800

                        transition

                    "

                >

                    Close

                </button>

            </div>

        </div>

    );

}

export default ManageDomainsModal;