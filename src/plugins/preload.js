import { ipcRenderer } from "electron";

export const quit = () => {
    ipcRenderer.send("quit");
}


export const maximize = () => {
    ipcRenderer.send("maximize");
}


export const minimize = () => {
    ipcRenderer.send("minimize");
}