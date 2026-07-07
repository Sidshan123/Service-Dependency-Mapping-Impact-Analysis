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

    getMyDevelopers,
    removeDeveloper

}
from "../services/workspaceService";


function ManageDevelopersModal({

    workspaceId,
    onClose

}){
    console.log("ManageDevelopersModal props:", {
    workspaceId
});

    const [

        developers,
        setDevelopers

    ] = useState([]);

    const [

        loading,
        setLoading

    ] = useState(true);


    useEffect(()=>{

        loadDevelopers();

    },[]);


    async function loadDevelopers(){
         console.log("workspaceId =", workspaceId);

        try{

            const response = await getMyDevelopers(
                workspaceId
            );

            setDevelopers(response);

        }

        catch(error){

            console.error(error);

            alert(
                "Failed to load developers."
            );

        }

        finally{

            setLoading(false);

        }

    }


    async function handleRemove(
    developerId
    ){

        try{

            const response =
            await removeDeveloper(

                workspaceId,

                developerId

            );

            alert(

                response.message ||

                "Developer removed successfully."

            );

            await loadDevelopers();

        }

        catch(error){

            alert(

                error.response?.data?.message ||

                "Failed to remove developer."

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

                        Manage Developers

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

                        developers.length===0 ?

                        (

                            <p>

                                No developers found.

                            </p>

                        )

                        :

                        developers.map(

                            developer=>(

                                <div

                                    key={developer.id}

                                    className="

                                        max-w-[550px]
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

                                    <div>

                                        <h3

                                            className="

                                                text-lg
                                                font-semibold

                                            "

                                        >

                                            {developer.name}

                                        </h3>

                                        <p

                                            className="

                                                text-sm

                                                text-[var(--text-secondary)]

                                            "

                                        >

                                            Domain: {developer.domain}

                                        </p>

                                    </div>


                                    <button

                                        onClick={()=>

                                            handleRemove(

                                                developer.id

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

                                        "

                                    >

                                        <Trash2 size={18}/>

                                        Remove

                                    </button>

                                </div>

                            )

                        )

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

                    "

                >

                    Close

                </button>

            </div>

        </div>

    );

}

export default ManageDevelopersModal;