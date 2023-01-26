import axios from 'axios';
import * as fs from 'fs'

export const writeToDb = (fileName: string, map: Map<any, any>) => fs.writeFile(fileName, JSON.stringify(Array.from(map.values())), (e: any) => console.log(e))

export const savePic = (ctx: any, fileId: string) => ctx.telegram.getFileLink(fileId).then((url: string) => {    
    axios({url, responseType: 'stream'}).then(response => {
        return new Promise((resolve, reject) => {
            response.data.pipe(fs.createWriteStream(`photos/${fileId}.jpg`))
                        .on('finish', () => console.log('succes'))
                        .on('error', (e: any) => console.log('Error: ', e))
                });
            })
})