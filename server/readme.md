//update column
db.getCollection('keywords').update({'status':{$exists:false}},{$set:{'status':1}},{multi:true})

//run
forever start ./server.js
forever stopall

//git
git reset --hard
git pull