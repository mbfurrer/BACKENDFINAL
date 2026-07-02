import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongodb.config.js";


console.log(ENVIRONMENT)

connectMongoDB()
