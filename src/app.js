const express =
require("express");

const app =
express();

app.use(
    express.json()
);


const authRoutes =
require("./routes/auth.routes");

const workspaceRoutes =
require("./routes/workspace.routes");

const workspaceLeaveRoutes =
require(
    "./routes/workspace-leave.routes"
);

const domainRoutes =
require("./routes/domain.routes");

const serviceRoutes =
require("./routes/service.routes");

const dependencyRoutes =
require(
    "./routes/dependency.routes"
);


const workspaceMemberRoutes =
require(
    "./routes/workspace-member.routes"
);


const inviteRoutes =
require(
    "./routes/invite.routes"
);


//----------------------------------
// AUTH ROUTES
//----------------------------------

app.use(
    "/api/auth",
    authRoutes
);


//----------------------------------
// WORKSPACE ROUTES
//----------------------------------

app.use(
    "/api/workspaces",
    workspaceRoutes
);

app.use(
    "/api/workspace-leave",
    workspaceLeaveRoutes
);


//----------------------------------
// DOMAIN ROUTES
//----------------------------------

app.use(
    "/api/domains",
    domainRoutes
);


//----------------------------------
// SERVICE ROUTES
//----------------------------------

app.use(
    "/api/services",
    serviceRoutes
);


//----------------------------------
// DEPENDENCY ROUTES
//----------------------------------

app.use(
    "/api/dependencies",
    dependencyRoutes
);


//----------------------------------
// WORKSPACE MEMBER ROUTES
//----------------------------------


app.use(
    "/api/workspace-members",
    workspaceMemberRoutes
);


//----------------------------------        
//routes to display the code
//----------------------------------

app.use(
    "/api/invites",
    inviteRoutes
);


const PORT =
process.env.PORT || 5000;

app.listen(PORT, ()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});


module.exports =
app;