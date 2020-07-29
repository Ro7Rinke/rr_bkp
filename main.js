const fs = require('fs')
const cp = require('child_process')
const process = require('process')

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