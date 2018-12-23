import { AsyncStorage } from "react-native"

const store = AsyncStorage;
const DREAMLISTKEY = "dreamList";
export default class DreamStore {

  static makeRecord(recordId, title) {
    var record = {
      id: recordId, 
      title: title
    }
    console.log("NEW RECORD: " + JSON.stringify(record));
    return record;
  }

  static initializeDreamList() {
    try {
      store.getAllKeys()
      .then((keys) => {
        if(keys.includes(DREAMLISTKEY)) {
          console.log("Successful AsyncStore initialization. List exists.");
        }
        else {
          var dl = [this.makeRecord(1, "BEST D EVER")]
          store.setItem(DREAMLISTKEY, JSON.stringify(dl)); 
        }
      });
    }
    catch {
      console.log("Error initializing a Dream list in the Async Storage.");
    }
  }

  static async getDreamList() {
    var listText = await store.getItem(DREAMLISTKEY);
    return JSON.parse(listText);
  }

}
