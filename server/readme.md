//update column
db.getCollection('keywords').update({'status':{$exists:false}},{$set:{'status':1}},{multi:true})

//run
forever start ./server.js
forever stopall

//git
git reset --hard
git pull

//mongodb backup and restore
For lazy people like me, i use mongodump it's faster:

mongodump -d <database_name> -o <directory_backup>
And to "restore/import" that, i used (from directory_backup/dump/):

mongorestore -d <database_name> <directory_backup>