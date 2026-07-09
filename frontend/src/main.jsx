import React from "react";
import ReactDOM from "react-dom/client";

import { Toaster } from "react-hot-toast";

import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(
    document.getElementById("root")
).render(

    <React.StrictMode>

        <App />

        <Toaster

            position="top-right"

            reverseOrder={false}

            toastOptions={{

                duration: 3000,

                style: {

                    background: "#18181b",

                    color: "#ffffff",

                    border: "1px solid #3f3f46",

                    borderRadius: "12px",

                    fontSize: "14px"

                },

                success: {

                    iconTheme: {

                        primary: "#22c55e",

                        secondary: "#ffffff"

                    }

                },

                error: {

                    iconTheme: {

                        primary: "#ef4444",

                        secondary: "#ffffff"

                    }

                }

            }}

        />

    </React.StrictMode>

);