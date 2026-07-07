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

    getWorkspaceDependencies

}
from "../services/workspaceService";


function ManageDependenciesModal({

    workspaceId,
    onClose

}){

    const [

        myDependencies,
        setMyDependencies

    ] = useState([]);

    const [

        otherDependencies,
        setOtherDependencies

    ] = useState([]);

    const [

        loading,
        setLoading

    ] = useState(true);


    useEffect(()=>{

        loadDependencies();

    },[]);


    async function loadDependencies(){

        try{

            const response =
            await getWorkspaceDependencies(
                workspaceId
            );

            setMyDependencies(

                response.my_dependencies

            );

            setOtherDependencies(

                response.other_dependencies

            );

        }

        catch(error){

            console.error(error);

            alert(

                "Failed to load dependencies."

            );

        }

        finally{

            setLoading(false);

        }

    }


    function handleDelete(
        id
    ){

        alert(
            `Delete ${id} coming soon!`
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

                    w-[760px]
                    max-h-[80vh]

                    overflow-y-auto

                    rounded-3xl

                    border
                    border-[var(--border)]

                    bg-[var(--card-bg)]

                    p-8

                "

            >

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

                        Manage Dependencies

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


                <div

                    className="

                        mt-8
                        space-y-4

                    "

                >

                    {

                        loading ?

                        (

                            <p>

                                Loading...

                            </p>

                        )

                        :

                        myDependencies.length===0 &&

                        otherDependencies.length===0 ?

                        (

                            <p>

                                No dependencies found.

                            </p>

                        )

                        :

                        <>
                                                    {/* MY DEPENDENCIES */}

                            {

                                myDependencies.length > 0 && (

                                    <>

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

                                            My Dependencies

                                        </h3>

                                        {

                                            myDependencies.map(

                                                dependency=>(

                                                    <div

                                                        key={dependency.id}

                                                        className="

                                                            max-w-[600px]
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

                                                        <h3

                                                            className="

                                                                text-lg
                                                                font-semibold

                                                            "

                                                        >

                                                            {

                                                                dependency
                                                                .source_service_name

                                                            }

                                                            {" → "}

                                                            {

                                                                dependency
                                                                .target_service_name

                                                            }

                                                        </h3>

                                                        <button

                                                            onClick={()=>{

                                                                handleDelete(

                                                                    dependency.id

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

                                                )

                                            )

                                        }

                                    </>

                                )

                            }


                            {/* OTHER DEPENDENCIES */}

                            {

                                otherDependencies.length > 0 && (

                                    <>

                                        <h3

                                            className="

                                                max-w-[550px]
                                                mx-auto

                                                mt-6
                                                mb-3

                                                text-sm
                                                font-semibold

                                                uppercase

                                                tracking-wider

                                                text-[var(--text-secondary)]

                                            "

                                        >

                                            Other Dependencies

                                        </h3>

                                        {

                                            otherDependencies.map(

                                                dependency=>(

                                                    <div

                                                        key={dependency.id}

                                                        className="

                                                            max-w-[600px]
                                                            mx-auto

                                                            mb-4

                                                            rounded-2xl

                                                            border
                                                            border-[var(--border)]

                                                            bg-[var(--bg-primary)]

                                                            px-6
                                                            py-5

                                                        "

                                                    >

                                                        <h3

                                                            className="

                                                                text-lg
                                                                font-semibold

                                                            "

                                                        >

                                                            {

                                                                dependency
                                                                .source_service_name

                                                            }

                                                            {" → "}

                                                            {

                                                                dependency
                                                                .target_service_name

                                                            }

                                                        </h3>

                                                    </div>

                                                )

                                            )

                                        }

                                    </>

                                )

                            }

                        </>

                    }

                </div>


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

export default ManageDependenciesModal;