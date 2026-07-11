import { useState } from "react";

function RenameWorkspaceModal({

    workspace,

    onClose,

    onSave

}){

    const [name,setName] =
    useState(

        workspace.workspace_name

    );

    const [loading,setLoading] =
    useState(false);

    async function handleSubmit(
        event
    ){

        event.preventDefault();

        try{

            setLoading(true);

            await onSave({

                ...workspace,

                workspace_name:
                name

            });

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
        flex
        items-center
        justify-center
        z-50
        "
        >

            <div
            className="
            w-[450px]
            p-8
            rounded-3xl
            bg-[var(--card-bg)]
            border
            border-[var(--border)]
            "
            >

                <h2
                className="
                text-3xl
                font-bold
                mb-8
                "
                >

                    Rename Workspace

                </h2>

                <form
                onSubmit={
                    handleSubmit
                }
                >

                    <input

                        value={
                            name
                        }

                        onChange={

                            event =>

                            setName(

                                event.target
                                .value

                            )

                        }

                        className="
                        w-full
                        p-4
                        rounded-2xl
                        bg-[var(--bg-secondary)]
                        border
                        border-[var(--border)]
                        outline-none
                        mb-8
                        "

                    />

                    <div
                    className="
                    flex
                    justify-end
                    gap-4
                    "
                    >

                        <button

                            type="button"

                            onClick={
                                onClose
                            }

                            className="
                            px-6
                            py-3
                            rounded-2xl
                            bg-slate-700
                            cursor-pointer
                            "
                        >

                            Cancel

                        </button>

                        <button

                            disabled={
                                loading
                            }

                            className="
                            px-6
                            py-3
                            rounded-2xl
                            bg-cyan-600
                            text-white
                            font-semibold
                            hover:bg-cyan-500
                            transition
                            cursor-pointer
                            disabled:opacity-50
                            "
                        >

                            {

                                loading

                                ?

                                "Saving..."

                                :

                                "Save"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default RenameWorkspaceModal;