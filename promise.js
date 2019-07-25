const MongoClient = require("mongodb").MongoClient;


class Xiaoye_db {
	constructor(dbUrl, dbName) {
		this.dbUrl = dbUrl;
		this.databaseName = dbName;
	}

	_connect(callback) {
		MongoClient.connect(this.dbUrl, {
			useNewUrlParser: true
		}, (err, db) => {
			callback && callback(err, db);
			db.close()
		})
	}


	insert(collectionName, json) {
		return new Promise((resolve, reject) => {
			this._connect((err, db) => {
				if (err) return console.log("数据库连接失败")
				let dbase = db.db(this.databaseName);
				console.log(!Array.isArray(json))
				if (!Array.isArray(json)) { // 添加一条数据
					dbase.collection(collectionName).insertOne(json, (err, result) => {
						if (err) return reject(err)
						return resolve(result)
					})
				} else {
					// 添加多条数据
					dbase.collection(collectionName).insertMany(json, (err, result) => {
						if (err) return reject(err)
						return resolve(result)
					})
				}

			})
		})
	}



	find(collectionName, json, args) {
		return new Promise((resolve, reject) => {

			this._connect((err, db) => {
				if (err) return console.log("数据库连接失败")
				if (arguments.length == 2) {
					var skipAmount = 0;
					var limitNumber = 0;
					var sortObj = {};
				} else {
					var skipAmount = args.pageSize * args.page || 0;
					var limitNumber = args.pageSize || 0;
					var sortObj = args.sort || {};
				}
				let dbase = db.db(this.databaseName)
				dbase.collection(collectionName).find(json).limit(limitNumber).skip(skipAmount).sort(sortObj).toArray((err,
					result) => {
					if (err) return reject(err);
					resolve(result)
				})
			})
		})
	}


	update(collectionName, json1, json2) { // 更新函数
		return new Promise((resolve, reject) => {
			this._connect((err, db) => {
				if (err) return console.log("数据库连接失败")
				let dbase = db.db(this.databaseName)
				dbase.collection(collectionName).updateMany(json1, {
					$set: json2
				}, (err, result) => {
					// callback && callback(err, result)
					if (err) return reject(err)
					return resolve(result)
				})
			})
		})
	}


	removeData(collectionName, json) { // 删除函数
		return new Promise((resolve,reject)=>{
			this._connect((err, db) => {
				if (err) return console.log("数据库连接失败")
				let dbase = db.db(this.databaseName)
				dbase.collection(collectionName).deleteMany(json, (err, result) => {
					if (err) return reject(err)
					return resolve(result)
				})
			})
		})
	}

	getAllCount(collectionName) { // 获取所有个数
		return new Promise((resolve, reject) => {
			this._connect((err, db) => {
				if (err) return console.log("数据库连接失败")
				let dbase = db.db(this.databaseName)
				// dbase.collection(collectionName).countDocuments().then((count) => {
				// 	return resolve(result)
				// });

				dbase.collection(collectionName).find({}).count(function(err, result) {
					// 对返回值result做你想做的操作
					if (err) return reject(err)
					return resolve(result)
				});
			})
		})
	}


}

let xiaoye = new Xiaoye_db("mongodb://localhost:27017", "chat")

// 测试
// xiaoye.find("userInfo",{}).then(result=>{
// 	console.log(result)
// })

// xiaoye.insert("userInfo",{"name":"红红","age":"12"}).then(count => {
// 	console.log(count)
// })
// xiaoye.insert("userInfo",[{"name":"红红1","age":"122"},{"name":"红红2","age":"124"}]).then(result => {
// 	console.log(result)
// })

// xiaoye.update("userInfo",{"name":"红红1","age":"122"},{"name":"红红1111111","age":"124"}).then(result => {
// 	console.log(result)
// })
// 
// xiaoye.removeData("userInfo",{"name":"红红1111111"}).then(result => {
// 	console.log(result)
// })

module.exports = Xiaoye_db
