function DeleteWorkspaceModal({

    workspace,

    onClose,

    onDelete

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
            w-[450px]
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
                mb-4
                "
                >

                    Delete Workspace

                </h2>

                <p
                className="
                text-slate-400
                mb-8
                "
                >

                    Delete

                    {" "}

                    <b>

                        {

                            workspace
                            .workspace_name

                        }

                    </b>

                    ?

                </p>

                <div
                className="
                flex
                justify-end
                gap-4
                "
                >

                    <button

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

                        onClick={()=>

                            onDelete(
                                workspace
                            )

                        }

                        className="
                        px-6
                        py-3
                        rounded-2xl
                        bg-red-500
                        cursor-pointer
                        "
                    >

                        Delete

                    </button>

                </div>

            </div>

        </div>

    );

}

export default DeleteWorkspaceModal;