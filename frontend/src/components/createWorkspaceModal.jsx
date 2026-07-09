import { useState } from "react";

import {

    Plus,
    X

}
from "lucide-react";

import toast from "react-hot-toast";

function CreateWorkspaceModal({

    onClose,

    onCreate

}){

    const [workspaceName,setWorkspaceName] =
    useState("");

    const [loading,setLoading] =
    useState(false);

    async function handleSubmit(event){

        event.preventDefault();

        try{

            setLoading(true);

            await onCreate(
                workspaceName
            );

            onClose();

        }
        catch(error){

            toast.error(

                error.response?.data?.message ||

                "Failed to create workspace"

            );

        }
        finally{

            setLoading(false);

        }

    }

    return(

        <div
        className="
        fixed
        inset-0
        bg-black/70
        backdrop-blur-sm
        flex
        items-center
        justify-center
        z-50
        px-4
        "
        >

            <div
            className="
            w-full
            max-w-md
            p-7
            rounded-2xl
            bg-[var(--card-bg)]
            border
            border-[var(--border)]
            shadow-2xl
            shadow-black/50
            "
            >

                {/* HEADER */}

                <div
                className="
                flex
                items-center
                justify-between
                mb-8
                "
                >

                    <div>

                        <h2
                        className="
                        text-2xl
                        font-semibold
                        text-[var(--text-primary)]
                        "
                        >

                            Create Workspace

                        </h2>

                        <p
                        className="
                        mt-1
                        text-sm
                        text-[var(--text-secondary)]
                        "
                        >

                            Create a new team workspace

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="
                        p-2
                        rounded-lg
                        text-[var(--text-secondary)]
                        hover:bg-[var(--bg-primary)]
                        hover:text-[var(--text-primary)]
                        transition
                        cursor-pointer
                        "

                    >

                        <X size={18}/>

                    </button>

                </div>

                <form
                onSubmit={
                    handleSubmit
                }
                >

                    {/* INPUT */}

                    <div
                    className="
                    mb-8
                    "
                    >

                        <label
                        className="
                        block
                        mb-3
                        text-[11px]
                        uppercase
                        tracking-widest
                        font-medium
                        text-[var(--text-secondary)]
                        "
                        >

                            Workspace Name

                        </label>

                        <input

                            type="text"

                            required

                            value={
                                workspaceName
                            }

                            onChange={

                                event =>

                                setWorkspaceName(

                                    event.target
                                    .value

                                )

                            }

                            placeholder=
                            "Workspace Name"

                            className="
                            w-full
                            px-4
                            py-3
                            rounded-xl
                            bg-[var(--bg-primary)]
                            border
                            border-[var(--border)]
                            text-[var(--text-primary)]
                            placeholder:text-[var(--text-secondary)]
                            outline-none
                            transition
                            focus:border-[var(--accent-primary)]
                            focus:ring-2
                            focus:ring-cyan-500/20
                            "

                        />

                    </div>

                    {/* ACTIONS */}

                    <div
                    className="
                    flex
                    justify-end
                    gap-3
                    "
                    >

                        <button

                        type="button"

                        onClick={onClose}

                        className="
                        btn-secondary
                        px-5
                        py-3
                        rounded-xl
                        transition
                        cursor-pointer
                        "

                    >

                        Cancel

                    </button>

                    <button

                        type="submit"

                        disabled={loading}

                        className="
                        btn-primary
                        flex
                        items-center
                        gap-2
                        px-5
                        py-3
                        rounded-xl
                        font-semibold
                        transition-all
                        duration-200
                        cursor-pointer
                        shadow-lg
                        shadow-cyan-500/20
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                        "

                    >

                        <Plus size={16}/>

                        {

                            loading

                            ?

                            "Creating..."

                            :

                            "Create"

                        }

                    </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CreateWorkspaceModal;