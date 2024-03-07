const mongoose = require('mongoose')

const connectDB = async (DATABASE_URL) => {
	try{
		const DB_OPTIONS = {
		    dbName: "db"
		}
		mongoose.set("strictQuery", false);
		await mongoose.connect(DATABASE_URL, DB_OPTIONS);
		console.log("Database Connected Successfully..");
	} catch (err) {
		console.log(err);
	}
}

module.exports = connectDB;
