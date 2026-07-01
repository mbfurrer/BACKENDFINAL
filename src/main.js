import { connect } from "mongoose";
import ENVIRONMENT from "./config/environment.config.js";
import connectMongoDB from "./config/mongodb.config.js";
import Contact from "./models/contact.model.js";

console.log(ENVIRONMENT)

connectMongoDB()

 