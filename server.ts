// import the express configuratino
import {configure, run} from "./config/express";

// load and configure express
let app = configure();

// start listening
run(app);
