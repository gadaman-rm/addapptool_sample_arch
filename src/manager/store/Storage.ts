class Storage {
  appVersion = "0.0.1";
  apiAddress: string = "http://coolpanel.ir:7070";
  localServiceAddress: string = "http://localhost:7141";
  constructor() {}
}

const storage = new Storage();
export default storage;
