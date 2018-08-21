/*
    groups初始出入值{}, 
    const events = [
    { time: '12:00', location: 'mall' },
    { time: '9:00', location: 'store' },
    { time: '9:00', location: 'mall' },
    { time: '12:00', location: 'store' },
    { time: '12:00', location: 'market' },
    ]
    const groupedByTime = events.groupBy('time')
    output
    groupedByTime = {
    '9:00': [
      { time: '9:00', location: 'store' },
      { time: '9:00', location: 'mall' },
    ],
    '12:00': [
      { time: '12:00', location: 'mall' },
      { time: '12:00', location: 'store' },
      { time: '12:00', location: 'market' },
    ],
  }
*/
Array.prototype.groupBy = function(prop) {
    return this.reduce(function(groups, item) {
      const val = item[prop]
      groups[val] = groups[val] || []
      groups[val].push(item)
      return groups
    }, {})
  }