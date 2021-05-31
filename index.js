const express=require('express')
const app=express()
const bodyParser = require('body-parser')
const parser = bodyParser.urlencoded({extended:false})
const SqlString = require('sqlstring')
const port=8080

const file = './data.db';
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(file);

db.serialize(function() {
//如果表格data不存在，就新增data
db.run("CREATE TABLE IF NOT EXISTS data (key varchar(256),value varchar(256))");
})

app.get('/get/arielwu', (req,res) => {
        res.send('hi!')
})

app.get('/get/:key', (req,res)=>{

        if(req.params.key.length>256) {
                res.send('key not found!')
        }
        let sql = SqlString.format('SELECT rowid AS id, key, value FROM data WHERE key=?', [req.params.key])
				db.get(sql , function(err, row) {
					if(!row) {
						res.send('key not found!')
					} else {
						res.send(row.value)
					}
  			})
})

app.post('/set/:key', parser, (req,res)=>{
        if(req.params.key.length>256 || req.body.value.length>256) {
                console.log('key or value is too long!')
        } else {
	       	let sql = SqlString.format('SELECT rowid AS id, key, value FROM data WHERE key=?', [req.params.key])
					db.get(sql , function(err, row) {
						if(!row) {
                sql = SqlString.format('insert into data values ( ? , ? )', [req.params.key, req.body.value])
								db.run(sql);
								res.send('OK')
						} else {
								let sqlUpdate = SqlString.format('update data set value = ? where key = ?', [req.body.value, req.params.key])
								db.run(sqlUpdate)
               	res.send('OK')
						}
  				})

        }
})
app.listen(port, () => {
        console.log(`listening at http://localhost:${port}`)
})
