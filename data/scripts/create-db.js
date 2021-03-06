//cmd: mongo create-db.js
var db = connect('localhost:27017/kwPolish');
//drop database
db.dropDatabase();

db.users.insert({
  userName: 'admin',
  password: '1',
  email: '1123@qq.com',
  locked: false,
  createDate: new Date(),
  actived: true,
  todayPoint: 0,
  totalPoint: 0,
  lostPoint: 0
});

db.users.insert({
  userName: 'scott',
  password: '1',
  email: '1@qq.com',
  locked: false,
  createDate: new Date(),
  actived: true,
  todayPoint: 0,
  totalPoint: 0,
  lostPoint: 0,
  keeper:true
});


db.users.insert({
  userName: 'hwx',
  password: '1',
  email: '1@qq.com',
  locked: false,
  createDate: new Date(),
  actived: true,
  todayPoint: 0,
  totalPoint: 0,
  lostPoint: 0,
  keeper:true
});


db.users.insert({
  userName: 'songsj',
  password: '1',
  email: '1@qq.com',
  locked: false,
  createDate: new Date(),
  actived: true,
  todayPoint: 0,
  totalPoint: 0,
  lostPoint: 0,
  keeper:true
});

db.users.insert({
  userName: 'song',
  password: '1',
  email: '2@qq.com',
  locked: false,
  createDate: new Date(),
  actived: true,
  todayPoint: 0,
  totalPoint: 0,
  lostPoint: 0
});
db.users.insert({
  userName: '9580089',
  password: '1',
  email: '3@qq.com',
  locked: false,
  createDate: new Date(),
  actived: true,
  todayPoint: 0,
  totalPoint: 0,
  lostPoint: 0
});
db.users.insert({
  userName: 'vipUser',
  password: '1',
  email: '4@qq.com',
  locked: false,
  createDate: new Date(),
  actived: true,
  todayPoint: 0,
  totalPoint: 0,
  lostPoint: 0,
  grade: 2,
  upgradeGradeDate: new Date(),
  vipExpiredDate: new Date()
});

db.keywords.insert({
  keyword: '软件定制服务',
  engine: 'baidu',
  link: 'ioliz.com',
  user: 'scott',

  originRank: 0,
  dynamicRank: 0,
  todayPolished: false,
  isValid: false,
  createDate: new Date(),
  polishedCount: 0
});

db.keywords.insert({
  keyword: '软件定制 广告机',
  engine: 'baidu',
  link: 'ioliz.com',
  user: 'scott',

  originRank: 0,
  dynamicRank: 0,
  todayPolished: false,
  isValid: false,
  createDate: new Date(),
  polishedCount: 0
});

db.keywords.insert({
  keyword: '软件定制',
  engine: 'baidu',
  link: 'ioliz.com',
  user: 'scott',

  originRank: 0,
  dynamicRank: 0,
  todayPolished: false,
  isValid: false,
  createDate: new Date(),
  polishedCount: 0
});

db.keywords.insert({
  keyword: '软件外包',
  engine: 'baidu',
  link: 'ioliz.com',
  user: 'scott',

  originRank: 0,
  dynamicRank: 0,
  todayPolished: false,
  isValid: false,
  createDate: new Date(),
  polishedCount: 0
});

db.keywords.insert({
  keyword: '数字标牌内容发布系统',
  engine: 'baidu',
  link: 'ioliz.com',
  user: 'scott',

  originRank: 0,
  dynamicRank: 0,
  todayPolished: false,
  isValid: false,
  createDate: new Date(),
  polishedCount: 0
});

db.keywords.insert({
  keyword: '充电桩监控系统',
  engine: 'baidu',
  link: 'ioliz.com',
  user: 'scott',

  originRank: 0,
  dynamicRank: 0,
  todayPolished: false,
  isValid: false,
  createDate: new Date(),
  polishedCount: 0
});


db.keywords.insert({
  keyword: '保健品',
  engine: 'baidu',
  link: 'ebotop.com',
  user: 'scott',

  originRank: 0,
  dynamicRank: 0,
  todayPolished: false,
  isValid: true,
  createDate: new Date(),
  polishedCount: 0,
  status: 1
});

db.rewardcodes.insert({
  code:'401c',
  isUsed:false
})

db.rewardcodes.insert({
  code:'401b',
  isUsed:false
})

db.qrpays.insert({
  payNo:'12345678',
  payUser:'hwx',
  payDate: new Date(),
  keeper:'scott',
  payCode:'abc',
  createDate: new Date(),
  status:0 //pending
})

