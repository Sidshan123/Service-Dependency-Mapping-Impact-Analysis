function DeleteWorkspaceModal({

    workspace,

    onClose,

    onDelete,

    loading = false

}){

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
                    w-[500px]
                    p-8
                    rounded-3xl
                    bg-[var(--card-bg)]
                    border
                    border-red-500
                "
            >

                <h2
                    className="
                        text-3xl
                        font-bold
                        text-red-400
                        mb-4
                    "
                >

                    Delete Workspace

                </h2>


                <p
                    className="
                        text-[var(--text-secondary)]
                        mb-2
                    "
                >

                    Are you sure you want to delete

                    {" "}

                    <span
                        className="font-semibold text-white"
                    >

                        {

                            workspace
                            ?.workspace_name

                        }

                    </span>

                    ?

                </p>


                <p
                    className="
                        text-sm
                        text-red-300
                        mb-8
                    "
                >

                    This action cannot be undone.

                </p>


                <div
                    className="
                        flex
                        justify-end
                        gap-4
                    "
                >

                    <button

                        onClick={onClose}

                        disabled={loading}

                        className="
                            px-6
                            py-3
                            rounded-2xl
                            bg-slate-700
                            hover:bg-slate-600
                            transition
                            cursor-pointer
                            disabled:opacity-50
                        "

                    >

                        Cancel

                    </button>


                    <button

                        onClick={()=>{

                            onDelete(
                                workspace
                            );

                        }}

                        disabled={loading}

                        className="
                            px-6
                            py-3
                            rounded-2xl
                            bg-red-600
                            hover:bg-red-500
                            transition
                            cursor-pointer
                            disabled:opacity-50
                        "

                    >

                        {

                            loading

                            ?

                            "Deleting..."

                            :

                            "Delete"

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteWorkspaceModal;