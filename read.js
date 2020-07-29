const fs = require('fs')
const cp = require('child_process')
const process = require('process')

let bkpTablePath = {
    dirNumbers: 0,
    fileNumbers: 0
}
let contentTablePath = {
    dirNumbers: 0,
    fileNumbers: 0
}

const readDir = (dirPath, tablePath, pointer) => {
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
                            readDir(`${dirPath}/${files[index]}`, tablePath, pointer)
                            tablePath.dirNumbers++
                        }else{
                            pointer[files[index]] = {
                                __INFO: {isDirectory: false, mtime: stats.mtime}
                            }
                            // console.log(JSON.stringify(bkpTablePath))
                            // console.log('-----')
                            tablePath.fileNumbers++
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
    readDir(bkpPath, bkpTablePath, bkpTablePath)
    readDir(contentPath, contentTablePath, contentTablePath)
}

process.on('beforeExit', () => {
    // console.log(JSON.stringify(bkpTablePath))
    // console.log('---------------------------')
    // console.log(JSON.stringify(contentTablePath))
    fs.writeFileSync('./TablePath/bkpTablePath.json', JSON.stringify(bkpTablePath))
    fs.writeFileSync('./TablePath/contentTablePath.json', JSON.stringify(contentTablePath))
})
main()