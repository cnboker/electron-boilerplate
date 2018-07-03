//update column
db.getCollection('keywords').update({'status':{$exists:false}},{$set:{'status':1}},{multi:true})