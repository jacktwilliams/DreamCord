import RNFetchBlob from 'react-native-fetch-blob';

const fs = RNFetchBlob.fs;
const ourDir = fs.dirs.DocumentDir + "/DreamCord/";

export default class AudioStore {

    static testRecorder(path) {
        RNFetchBlob.fs.exists(path)
        .then((exist) => {
            console.log(`file ${exist ? '' : 'not'} exists`);
        })
        .catch(() => {console.log("There was an error.")})
    }

    static testSave(dir) {
        dir = dir || RNFetchBlob.fs.dirs.DocumentDir;
        fs.createFile(dir + "/testii.txt", "heyllo", 'utf8')
        .then(() => {
            console.log("File successfully created. ");
        })
        .catch(() => {
            console.log("Error saving file. ");
        })
    }

    static initializeDir() {
        console.log("INITIALIZE!");
        var logSuccess = () => {
            console.log("Our directory initialized succesfully.");
        };

        RNFetchBlob.fs.isDir(ourDir)
        .then((exist) => {
            if(exist) {
                logSuccess();
                return;
            }
            else {
                fs.mkdir(ourDir)
                .then(() => {
                    //also put a file in directory
                    this.testSave(ourDir);
                    logSuccess();
                })
            }
        })
        .catch(() => {
            console.log("Issue initializing our directory.");
        });
    }

    static countRecordings() {
        return new Promise((resolve, reject) => {
            RNFetchBlob.fs.lstat(ourDir)
            .then((files) => {
                console.log("lstat returned promise.");
                resolve(files.length);
            })
            .catch(() => {
                console.log("Issue counting files in our directory.");
                reject("Issue counting recordings in our directory.");
            });
        });
    }

}
