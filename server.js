const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db/database.js');
const cors = require('cors')
const {v4 : uuidv4} = require("uuid")
const app = express();
app.use(bodyParser.json());
app.use(express.json())
app.use(cors())

const port = 3000;

app.post('/user', async(req, res) => {
const { fname,lname, uname,pass,phoneNum,date} = req.body;
let uuid = uuidv4()

const query = `INSERT INTO users (usersCode,first_name, last_name,username,password,birth_date) VALUES (?,?,?,?,?,?); INSERT into phones (user_id,phone_number) VALUES (?,?);`

  
 const [result] = await db.query(query, [uuid,fname,lname,uname,pass,date,uuid,Number(phoneNum)])
 res.send(result)

});

app.get('/user',async (req, res) => {
 const {first_name="", last_name="" , username="" , password="" , birth_date=""}=req.query
 const params = [`%${first_name}%`,`%${last_name}%`,`%${username}%`,`%${password}%`,`%${birth_date}%`]
 
 const query = `SELECT * , group_concat(phone_number separator ',')as phones_number ,floor(datediff(curdate(),birth_date)/365)as age from users inner join phones on phones.user_id=users.usersCode WHERE first_name like ? and last_name like ? and username like ? and password like ? and birth_date like ? group by usersCode;`
 
const result =await db.query(query,params)

    res.send(result[0]);
    
  
});

app.put('/user/:id', (req, res) => {
  const { fname,lname,uname,pass,phoneNum,date } = req.body;
  const query = `UPDATE users SET first_name=?, last_name=? , username=? , password=? , birth_date=? WHERE usersCode=?; UPDATE phones SET phone_number =? where user_id=?;`
  
  db.query(query, [fname,lname,uname,pass,date, req.params.id,phoneNum,req.params.id], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'کاربر با موفقیت به‌روزرسانی شد!' });
  });
});

app.delete('/user/:id', async(req, res) => {
  const query = 'DELETE FROM users WHERE usersCode = ?;DELETE FROM phones WHERE user_id=?;';
const result = await db.query(query, [req.params.id,req.params.id])
res.send(result)
});



app.get(`/user/:id`,async(req,res)=>{
  const query = `SELECT * FROM users inner join phones on users.usersCode = phones.user_id WHERE users.usersCode=?;`
  try{
 const [result] =await db.query(query,[req.params.id])
 res.send(result)
  }
  catch(err){
    console.log(err)
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});