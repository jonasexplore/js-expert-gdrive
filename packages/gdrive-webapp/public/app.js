import AppController from "./src/appController.js";
import ConnectionManager from "./src/connectionManager.js";
import DragAndDropManager from "./src/dragAndDropManager.js";
import ViewManager from "./src/viewManager.js";

const API_URL = "http://localhost:3000";

const appController = new AppController({
  viewManager: new ViewManager(),
  dragAndDropManager: new DragAndDropManager(),
  connectionManager: new ConnectionManager({
    apiUrl: API_URL,
  }),
});

try {
  await appController.initialize();
} catch (error) {
  console.log("Error on initialize: ", error);
}
