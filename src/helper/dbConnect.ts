import mongoose from "mongoose";

type ConnectionObject = {
  isconnected?: number;
};

const connection: ConnectionObject = {};

export default async function dbConnect() {
  if (connection.isconnected) {
    console.log("Already Connected");
  } else {
    try {
      const db = await mongoose.connect(process.env.MONGO_URI!);
      connection.isconnected = db.connections[0].readyState;
      console.log("Database Connected");
    } catch (error) {
      console.log("Connection Failed");
      process.exit(1);
    }
  }
}
