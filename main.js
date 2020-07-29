const fs = require('fs')
const cp = require('child_process')

let dirNumbers = 0
let fileNumbers = 0

let bkpTablePath = {}

const copyFile = async (filePath, destPath) => {
    const pathArray = filePath.split('/')
    const fileName = pathArray.pop()
    const path = pathArray.join('/')
    cp.exec(`robocopy "${path}" "${destPath}" "${fileName}" /mt /zb`, (error, stdout) => {
        if(error){
            console.log(error)
        }
        if(stdout) console.log(stdout)
    })
} 

const readDir = (dirPath, pointer) => {
    const lastPath = dirPath.split('/').pop()

    if(typeof pointer[lastPath] === 'undefined'){
        pointer[lastPath] = {
            __INFO: {isDirectory: true}
        }
        console.log(JSON.stringify(bkpTablePath))
        console.log('-----')
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
                            readDir(`${dirPath}/${files[index]}`, pointer)
                            
                            dirNumbers++
                        }else{
                            pointer[files[index]] = {
                                __INFO: {isDirectory: false, mtime: stats.mtime}
                            }
                            console.log(JSON.stringify(bkpTablePath))
                            console.log('-----')
                            fileNumbers++
                        }
                    }
                })
            }
        }
    })
}

const main = () => {
    readDir('C:/users/ro7rinke/desktop/New Folder', bkpTablePath)
}

main()