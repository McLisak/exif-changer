# EXIF DATE CHANGER

This tool was made to quickly change exif creation dates of many images.

If you want to create an album on Google Photos which doesn't support sorting images by the filename _(in 2018)_ then You might also want to use it. It can be used to change any exif metadata of your image.

There is a lot of tools available to change images metadata, but not many of them can change each value to be different.

## Installation

* **Install [Node.js](https://nodejs.org)**
* **The main dependency [ExifTool](https://www.sno.phy.queensu.ca/~phil/exiftool/). Install it on your machine before you proceed. This is because ExifTool process gets spawned by `node-exiftool`**
* Download or clone the repository.
* Run `npm install`.
* Create `'images'` directory in the root directory - this is where the app is looking for image files.
* **COPY** your images into it. **ALWAYS BACK UP YOUR FILES**.
* Read `index.js` file before you run the app.

## Usage

In the `index.js` file you will find the `currentDate` object where you can specify starting date. The app will go through all your images in the `images` directory - alphabetically, including numbers in file names - and replace the creation date, increasing the time by one second for each image.

To run the app you only need to run `npm start`.

You can use the `ExifTool + node-exiftool` to change other exif metadata than date. If you want to do that - please follow the [`node-exiftool`](https://www.npmjs.com/package/node-exiftool) documentation and try playing around yourself :)

___

Mail me if you need any help - I'll try my best to do so.