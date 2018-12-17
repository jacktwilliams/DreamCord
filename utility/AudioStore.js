var RNFS = require('react-native-fs');

export default class AudioStore {
    static testSave() {
        var path = RNFS.DocumentDirectoryPath + '/test.txt';
        console.log("PATH: " + path);
     
        // write the file
        RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
        .then((success) => {
            console.log('FILE WRITTEN!');
        })
        .catch((err) => {
            console.log(err.message);
        });
    }
}
