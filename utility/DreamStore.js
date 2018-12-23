import { AsyncStorage } from "react-native"

const store = AsyncStorage;
const DreamListKey = "dreamList";
export default class DreamStore {

  static makeRecord(recordId, title) {
    var record = {
      id:recordId, 
      title:title
    }
    console.log("NEW RECORD: " + JSON.stringify(record));
    return record;
  }

  static initializeDreamList() {
    try {
      store.getAllKeys()
      .then((keys) => {
        if(keys.includes(DreamListKey)) {
          console.log("Successful AsyncStore initialization. List exists.");
        }
        else {
          var dl = [this.makeRecord(1, "BEST D EVER")]
          store.setItem(DreamListKey, JSON.stringify(dl)); 
        }
      });
    }
    catch {
      console.log("Error initializing a Dream list in the Async Storage.");
    }
  }

}
