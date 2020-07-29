const fs = require('fs')
const cp = require('child_process')
const process = require('process')

let bkpPath
let contentPath
let contentPrePath
let bkpTablePath
let contentTablePath

const copyFile = (filePath, destPath) => {
    let pathArray = filePath.split('/')
    const fileName = pathArray.pop()
    const path = pathArray.join('/')
    cp.exec(`robocopy "${path}" "${destPath}" "${fileName}" `, (error, stdout) => {
        if(error){
            console.log(error)
        }
        if(stdout) console.log(stdout)
    })
} 

const getTablePath = (type) => {
    return JSON.parse(fs.readFileSync(`./TablePath/${type}.json`))
}

const getPrePath = (path) => {
    const arrayPath = path.split('/')
    arrayPath.pop()
    return arrayPath.join('/')
}

const verifyPathAndTime = (path, mtime) => {
    let arrayPath = path.split('/')
    let pointer = bkpTablePath
    for(let index in arrayPath){
        if(typeof pointer[arrayPath[index]] !== 'undefined'){
            pointer = pointer[arrayPath[index]]
        }else {
            return false
        }
    }
    if(pointer.__INFO.mtime != mtime) {
        // console.log(pointer.__INFO.mtime)
        // console.log(mtime)
        // console.log('---------------')
        return false
    }
    return true
}

const bkp = (pointer, path) => {
    for(let index in pointer){
        if(index !== '__INFO'){
            if(pointer[index].__INFO.isDirectory){
                bkp(pointer[index], path == '' ? index : `${path}/${index}`)
            }else{
                if(!verifyPathAndTime(path == '' ? `ue/${index}` : `${path}/${index}`, pointer[index].__INFO.mtime)){
                    // console.log(`${contentPrePath}/${path}/${index}`)
                    copyFile(path == '' ? `${contentPrePath}/${index}` : `${contentPrePath}/${path}/${index}`, path == '' ? bkpPath : `${bkpPath}/${path}`)
                }
            }
        }
    }
}

const main = () => {
    bkpPath = 'C:/users/ro7rinke/Desktop/bkp'
    contentPath = 'C:/users/ro7rinke/Desktop/New Folder'
    contentPrePath = getPrePath(contentPath)

    cp.execSync(`start start.bat`)

    bkpTablePath = getTablePath('bkpTablePath').bkp
    contentTablePath = getTablePath('contentTablePath')

    bkp(contentTablePath, '')
}

main()