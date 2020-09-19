## Electron React Js Template
Electronjs cross-platform desktop application template using Reactjs as base.<br/>
I built this template so that I won't get trouble setting this up every time I needed it.<br/>
Since it's the React thing, this template can be deployed as a web app too. Good for me &#128522;<br/>
**BUILD READY. Just chill and npm run electron-pack**
### Usage
```bash
# Clone this repository
git clone https://github.com/HarukaH001/electron-react-template.git
# Go into the repository
cd electron-react-template
# Install dependencies
npm install
# Run the desktop application or whatever else there is to offer
npm run electron-dev
```
### Available Scripts
In the project directory, you mostly using these:
### `npm start`
Runs the **web application** in development mode.<br/>
Running on http://localhost:3000
### `npm run build`
Build the **web application** for production to the `build` folder.
### `npm run electron-dev`
Runs both the web application and desktop application in development mode with hot reload feature.<br/>
**This is important since desktop application in development mode needs web application running.**
### `npm run electron-pack`
Build the **desktop application** for distribution or whatever.
**Setting for Windows 32bit and 64bit. Configuration in package.json needed for other platform**
