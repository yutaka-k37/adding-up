'use strict';
// コメント追加
// node.js で用意されている module を使用して実装する
// fs: FileSystem の略で、ファイルを扱うことが可能
const fs = require('fs')
// readline: ファイルを、1行ずつ読み込むことが可能
const readline = require('readline')
// popu-pref.csv ファイルから、ファイルを読み込みを行う Stream（ストリーム）を生成
const rs = fs.createReadStream('./popu-pref.csv')
// readline オブジェクトの input として設定し、 rl オブジェクトを作成しています。
const rl = readline.createInterface({ 'input': rs, 'output': {}})
const prefectureDataMap = new Map()
rl.on('line', (lineString) => {
  const columns = lineString.split(',')
  const year = parseInt(columns[0])
  const prefecture = columns[1]
  const popu = parseInt(columns[3])
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture) // 都道府県を取得
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      }
    }
    if (year === 2010) value.popu10 = popu
    if (year === 2015) value.popu15 = popu
    prefectureDataMap.set(prefecture, value)
  }
})
rl.on('close', () => {
  for (let [key, value] of prefectureDataMap) {
    value.change = value.popu15 / value.popu10
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair1[1].change - pair2[1].change
  })
  const rankingStrings = rankingArray.map(([key, value], index) => {
    return index+1  + '位 ' + key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change
  })
  console.log(rankingStrings)
})
