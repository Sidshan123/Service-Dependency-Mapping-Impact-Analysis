import {

    useEffect,
    useState

}
from "react";

import {

    X,
    Trash2

}
from "lucide-react";

import {

    getDomains

}
from "../services/workspaceService";


function DomainLeadsModal({

    workspaceId,
    onClose

}){

    const [

        domains,
        setDomains

    ] = useState([]);


    const [

        loading,
        setLoading

    ] = useState(true);


    useEffect(

        ()=>{

            fetchDomains();

        },

        []

    );


    async function fetchDomains(){

        console.log(
            "workspaceId received:",
            workspaceId
        );

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

            setLoading(false);

        }

    }


    function handleRemove(
        domainId
    ){

        alert(

            `Remove functionality for domain ${domainId} coming soon!`

        );

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

                    w-[750px]
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

                        Domain Leads

                    </h2>


                    <button

                        onClick={onClose}

                        className="

                            p-2

                            rounded-lg

                            hover:bg-zinc-800

                            transition

                        "

                    >

                        <X size={20}/>

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

                    domains.length === 0

                    ?

                    (

                        <div
                            className="

                                py-20

                                text-center

                                text-[var(--text-secondary)]

                            "
                        >

                            No domains found.

                        </div>

                    )

                    :

                    (

                        <div
                            className="

                                mt-8
                                space-y-4

                            "
                        >

                            {

                                domains.map(

                                    domain => (

                                        <div

                                            key={domain.id}

                                            className="

                                                max-w-[540px]

                                                mx-auto

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

                                            <div
                                                className="space-y-1"
                                            >

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

                                                    Lead:

                                                    {" "}

                                                    {

                                                        domain
                                                        .lead_name

                                                    }

                                                </p>

                                            </div>


                                            <button

                                                onClick={()=>

                                                    handleRemove(
                                                        domain.id
                                                    )

                                                }

                                                className="

                                                    flex
                                                    items-center
                                                    gap-2

                                                    px-4
                                                    py-2

                                                    rounded-xl

                                                    bg-red-500/15

                                                    text-red-400

                                                    hover:bg-red-500/25

                                                    transition

                                                    shrink-0

                                                "

                                            >

                                                <Trash2
                                                    size={18}
                                                />

                                                Remove

                                            </button>

                                        </div>

                                    )

                                )

                            }

                        </div>

                    )

                }


                <button

                    onClick={onClose}

                    className="

                        mt-8

                        w-full

                        py-2.5

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


export default DomainLeadsModal;