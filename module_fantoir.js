const path = require('path')
const fs = require('fs')
const readline = require('readline')
const fantoir = require('./fantoir')

module.exports = (sourceFile, targetPath) => {
    const fichier = path.resolve(sourceFile)

    const read = fs.createReadStream(fichier)
    const write = fs.createWriteStream('./parse.json', {flags: 'a'})
    read.readable = true
    write.writable = true

    const rl = readline.createInterface(read, write)

    const ft = new fantoir.FANTOIR(targetPath)

    rl.on('line', line => rl.emit('pause', line))

    rl.on('pause', line => {
        try {
            ft.addLine(line, true)
        } catch (error) {
            console.error(error)
        }
        rl.emit('resume')
    })

    rl.on('close', () => console.log("Fin"))
}
