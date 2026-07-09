import {

    useEffect,
    useState

}
from "react";

import toast from "react-hot-toast";

import {

    X

}
from "lucide-react";

import {

    getDomains,
    createService

}
from "../services/workspaceService";


function CreateServiceModal({

    workspaceId,
    refreshWorkspace,
    onClose

}){

    const [

        domains,
        setDomains

    ] = useState([]);

    const [

        domainId,
        setDomainId

    ] = useState("");

    const [

        serviceName,
        setServiceName

    ] = useState("");

    const [

        creating,
        setCreating

    ] = useState(false);


    useEffect(()=>{

        loadDomains();

    },[]);


    async function loadDomains(){

        try{

            const response =
            await getDomains(
                workspaceId
            );

            setDomains(

                response.my_domains

            );

        }

        catch(error){



            toast.error(

                error.response?.data?.message ||

                "Failed to load domains."

            );

        }

    }


    async function handleCreateService(){

        if(

            !domainId ||

            !serviceName.trim()

        ){

            toast.success(

                "Please fill all fields"

            );

            return;

        }

        try{

            setCreating(true);

            const response =
            await createService({

                domain_id:
                Number(domainId),

                service_name:
                serviceName.trim()

            });

            toast.success(

                response.message ||

                "Service created successfully."

            );

            await refreshWorkspace();

            onClose();

        }

        catch(error){

            console.error(error);

            toast.error(

                error.response?.data?.message ||

                error.message ||

                "Failed to create service."

            );

        }

        finally{

            setCreating(false);

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

                    w-[520px]

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

                        Create Service

                    </h2>

                    <button

                        onClick={onClose}

                        className="

                            p-2

                            rounded-lg

                            hover:bg-zinc-800

                        "

                    >

                        <X size={20}/>

                    </button>

                </div>


                {/* FORM */}

                <div

                    className="

                        mt-8
                        space-y-6

                    "

                >

                    <div>

                        <label

                            className="text-sm"

                        >

                            Domain

                        </label>

                        <select

                            value={domainId}

                            onChange={event=>{

                                setDomainId(

                                    event.target.value

                                );

                            }}

                            className="

                                mt-2

                                w-full

                                px-4
                                py-3

                                rounded-xl

                                bg-[var(--bg-primary)]

                                border
                                border-[var(--border)]

                                outline-none

                            "

                        >

                            <option value="">

                                Select Domain

                            </option>

                            {

                                domains.map(

                                    domain=>(

                                        <option

                                            key={domain.id}

                                            value={domain.id}

                                        >

                                            {

                                                domain.domain_name

                                            }

                                        </option>

                                    )

                                )

                            }

                        </select>

                    </div>
                                        <div>

                        <label

                            className="text-sm"

                        >

                            Service Name

                        </label>

                        <input

                            value={serviceName}

                            onChange={event=>{

                                setServiceName(

                                    event.target.value

                                );

                            }}

                            placeholder="User Service"

                            className="

                                mt-2

                                w-full

                                px-4
                                py-3

                                rounded-xl

                                bg-[var(--bg-primary)]

                                border
                                border-[var(--border)]

                                outline-none

                            "

                        />

                    </div>

                </div>


                <button

                    onClick={

                        handleCreateService

                    }

                    disabled={creating}

                    className="

                        btn-primary

                        mt-8

                        w-full

                        py-3

                        rounded-xl

                        flex
                        items-center
                        justify-center
                        gap-2

                        disabled:opacity-60
                        disabled:cursor-not-allowed

                    "

                >

                    {

                        creating

                        ?

                        <>

                            <svg

                                className="

                                    h-5
                                    w-5

                                    animate-spin

                                "

                                xmlns="http://www.w3.org/2000/svg"

                                fill="none"

                                viewBox="0 0 24 24"

                            >

                                <circle

                                    className="opacity-25"

                                    cx="12"

                                    cy="12"

                                    r="10"

                                    stroke="currentColor"

                                    strokeWidth="4"

                                />

                                <path

                                    className="opacity-75"

                                    fill="currentColor"

                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"

                                />

                            </svg>

                            Creating...

                        </>

                        :

                        "Create Service"

                    }

                </button>

            </div>

        </div>

    );

}

export default CreateServiceModal;