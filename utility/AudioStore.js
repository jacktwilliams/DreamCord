import RNFetchBlob from 'react-native-fetch-blob';

const fs = RNFetchBlob.fs;
const OURDIR = fs.dirs.DocumentDir + "/DreamCord/";

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

    RNFetchBlob.fs.isDir(OURDIR)
    .then((exist) => {
      if(exist) {
        logSuccess();
        return;
      }
      else {
        fs.mkdir(OURDIR)
        .then(() => {
          //also put a file in directory
          this.testSave(OURDIR);
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
      RNFetchBlob.fs.lstat(OURDIR)
      .then((files) => {
        resolve(files.length);
      })
      .catch(() => {
        console.log("Issue counting files in our directory.");
        reject("Issue counting recordings in our directory.");
      });
    });
  }

  static async saveRecording(path) {
    var handleError = () => {
      console.log("Error saving your recording.");
    }
    try {
      var recordCount = await this.countRecordings()

      var newLoc = OURDIR + "dream" + (recordCount + 1) + ".aac";
      console.log("Moving " + path + "\nTo " + newLoc);
      
      var error = await RNFetchBlob.fs.mv(path, newLoc);
      if(error) {
        handleError();
        return -1;
      }
      else {
        console.log("Recording saved to " + newLoc);
        return recordCount + 1;
      }
    }
    catch {
      handleError();
    }
  }

  static clearRecordings() {
    RNFetchBlob.fs.ls(OURDIR)
    .then((files) => {
      for(var i = 0; i < files.length; ++i) {
        var file = files[i];
        console.log(file);
        RNFetchBlob.fs.unlink(OURDIR + file);
      }
    })
  }
}
