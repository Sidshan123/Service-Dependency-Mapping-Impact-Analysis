import {

    X

}
from "lucide-react";

import {

    useEffect,
    useState

}
from "react";

function InputModal({

    isOpen,
    title,
    label,
    placeholder,
    defaultValue = "",
    confirmText = "Save",
    loading = false,
    onConfirm,
    onCancel

}){

    const [

        value,
        setValue

    ] = useState("");

    useEffect(()=>{

        if(isOpen){

            setValue(

                defaultValue

            );

        }

    },[

        defaultValue,
        isOpen

    ]);

    if(!isOpen){

        return null;

    }

    function handleSave(){

        const trimmed =

        value.trim();

        if(

            trimmed===""

        ){

            return;

        }

        onConfirm(

            trimmed

        );

    }

    return(

        <div

            className="

                fixed
                inset-0
                z-50

                flex
                items-center
                justify-center

                bg-black/60
                backdrop-blur-sm

            "

        >

            <div

                className="

                    w-full
                    max-w-lg

                    rounded-3xl

                    border
                    border-[var(--border)]

                    bg-[var(--card-bg)]

                    p-8

                    shadow-2xl

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

                        {title}

                    </h2>

                    <button

                        onClick={onCancel}

                        className="

                            rounded-lg

                            p-2

                            transition

                            hover:bg-zinc-800

                        "

                    >

                        <X size={18}/>

                    </button>

                </div>

                <div

                    className="

                        mt-6

                    "

                >

                    <label

                        className="

                            mb-2

                            block

                            text-sm

                            font-medium

                            text-[var(--text-secondary)]

                        "

                    >

                        {label}

                    </label>

                    <input

                        value={value}

                        onChange={(event)=>{

                            setValue(

                                event.target.value

                            );

                        }}

                        placeholder={placeholder}

                        onKeyDown={(event)=>{

                            if(

                                event.key==="Enter"

                            ){

                                handleSave();

                            }

                        }}

                        className="

                            w-full

                            rounded-xl

                            border
                            border-[var(--border)]

                            bg-[var(--bg-primary)]

                            px-4
                            py-3

                            outline-none

                            transition

                            focus:border-cyan-500

                        "

                    />

                </div>

                <div

                    className="

                        mt-8

                        flex
                        justify-end
                        gap-3

                    "

                >

                    <button

                        onClick={onCancel}

                        disabled={loading}

                        className="

                            rounded-xl

                            border
                            border-[var(--border)]

                            px-5
                            py-2.5

                            transition

                            hover:bg-zinc-800

                        "

                    >

                        Cancel

                    </button>

                    <button

                        onClick={handleSave}

                        disabled={loading}

                        className="

                            rounded-xl

                            bg-cyan-600

                            px-5
                            py-2.5

                            font-medium

                            text-white

                            transition

                            hover:bg-cyan-700

                        "

                    >

                        {

                            loading

                            ?

                            "Saving..."

                            :

                            confirmText

                        }

                    </button>

                </div>

            </div>

        </div>

    );

}

export default InputModal;