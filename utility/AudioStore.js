import RNFetchBlob from 'react-native-fetch-blob';

const fs = RNFetchBlob.fs;
const OURDIR = fs.dirs.DocumentDir + "/DreamCord/";

export default class AudioStore {

  static testRecorder(path) {
    RNFetchBlob.fs.exists(path)
    .then((exist) => {
      console.log(`file ${exist ? '' : 'not'} exists`);
    })
    .catch((e) => {console.log("There was an error: \n" + e)})
  }

  static testSave(dir) {
    dir = dir || RNFetchBlob.fs.dirs.DocumentDir;
    fs.createFile(dir + "/testii.txt", "heyllo", 'utf8')
    .then(() => {
      console.log("File successfully created. ");
    })
    .catch((e) => {
      console.log("Error saving file: \n" + e);
    })
  }


  static initializeDir() {
    let logSuccess = () => {
      console.log("Our directory initialized succesfully.");
    };

    RNFetchBlob.fs.isDir(OURDIR)
    .then((exist) => {
      if(exist) {
        logSuccess();
        return;
      }
      else {
        fs.mkdir(OURDIR)
        .then(() => {
          logSuccess();
        });
      }
    })
    .catch((e) => {
      console.log("Issue initializing our directory: \n" + e);
    });
  }

  static countRecordings() {
    return new Promise((resolve, reject) => {
      RNFetchBlob.fs.lstat(OURDIR)
      .then((files) => {
        resolve(files.length);
      })
      .catch((e) => {
        console.log("Issue counting files in our directory: \n" + e);
        reject("Issue counting recordings in our directory: \n" + e);
      });
    });
  }

  static async saveRecording(path) {
    let handleError = (e) => {
      console.log("Error saving your recording: \n" + e);
    }
    try {
      let recordCount = await this.countRecordings()

      let newLoc = OURDIR + "dream" + (recordCount + 1) + ".aac";
      console.log("Moving " + path + "\nTo " + newLoc);
      
      let error = await RNFetchBlob.fs.mv(path, newLoc);
      if(error) {
        handleError(error);
        return -1;
      }
      else {
        console.log("Recording saved to " + newLoc);
        return recordCount + 1;
      }
    }
    catch (e) {
      handleError(e);
    }
  }

  static clearRecordings() {
    RNFetchBlob.fs.ls(OURDIR)
    .then((files) => {
      for(let i = 0; i < files.length; ++i) {
        let file = files[i];
        RNFetchBlob.fs.unlink(OURDIR + file);
      }
    })
    .catch((e) => {
      console.log("Error cleaning directory.");
    })
    console.log("Directory cleared of all recordings.");
  }
}
