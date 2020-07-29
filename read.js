const fs = require('fs')
const cp = require('child_process')
const process = require('process')

let bkpTablePath = {}
let contentTablePath = {}
let bkpTableInfo = {
    dirNumbers: 0,
    fileNumbers: 0
}
let contentTableInfo = {
    dirNumbers: 0,
    fileNumbers: 0
}

const readDir = (dirPath, tablePath, tableInfo, pointer) => {
    const lastPath = dirPath.split('/').pop()

    if(typeof pointer[lastPath] === 'undefined'){
        pointer[lastPath] = {
            __INFO: {isDirectory: true}
        }
        // console.log(JSON.stringify(bkpTablePath))
        // console.log('-----')
    }
    pointer = pointer[lastPath]        

    fs.readdir(dirPath, 'utf-8', (error, files) => {
        if(error) console.log(error)
        else{
            for(let index in files){
                fs.stat(`${dirPath}/${files[index]}`, 'utf-8', (err, stats) => {
                    if(err) console.log(err)
                    else{
                        if(stats.isDirectory()) {
                            readDir(`${dirPath}/${files[index]}`, tablePath, tableInfo, pointer)
                            tableInfo.dirNumbers++
                        }else{
                            pointer[files[index]] = {
                                __INFO: {isDirectory: false, mtime: stats.mtime, size: stats.size}
                            }
                            // console.log(JSON.stringify(bkpTablePath))
                            // console.log('-----')
                            tableInfo.fileNumbers++
                        }
                    }
                })
            }
        }
    })
}

const main = () => {
    const bkpPath = "C:/users/ro7rinke/desktop/bkp"
    const contentPath = "C:/users/ro7rinke/desktop/New Folder"

    readDir(bkpPath, bkpTablePath, bkpTableInfo, bkpTablePath)
    readDir(contentPath, contentTablePath, contentTableInfo, contentTablePath)
}

process.on('beforeExit', () => {
    // console.log(JSON.stringify(bkpTablePath))
    // console.log('---------------------------')
    // console.log(JSON.stringify(contentTablePath))
    fs.writeFileSync('./TablePath/bkpTablePath.json', JSON.stringify(bkpTablePath))
    fs.writeFileSync('./TablePath/contentTablePath.json', JSON.stringify(contentTablePath))
})
main()