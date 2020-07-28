const fs = require('fs')
const cp = require('child_process')

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

const readDir = (dirPath) => {
    const pathAux = dirPath
    fs.readdir(dirPath, 'utf-8', (error, files) => {
        if(error) console.log(error)
        else{
            console.log(files)
            for(let index in files){
                fs.stat(`${pathAux}/${files[index]}`, 'utf-8', (err, stats) => {
                    if(err) console.log(err)
                    else{
                        if(stats.isDirectory()) {
                            readDir(`${pathAux}/${files[index]}`)
                        }   
                    }
                })
            }
        }
    })
}

const main = () => {
    readDir('./test')
}

main()