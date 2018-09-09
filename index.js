const path = require('path');
const fs = require('fs');
const exiftool = require('node-exiftool');

const exifProcess = new exiftool.ExiftoolProcess();

const imagesDir = path.resolve(__dirname, 'images/');

const imageFilePath = (imageName) => path.join(imagesDir, imageName);

/**
 * Object containing the date that will get replaced
 * To see what data you can replace use exifProcess.readMetadata(pathToImage: string, ['-File:all'])
 */
const dataToReplace = {
	ModifyDate: '',
	CreateDate: '',
	DateTimeOriginal: '',
}

/**
 * Starting date that gets modified while the app is running for each next image file.
 */
const currentDate = {
	year: 2018,
	month: 5,
	day: 11,
	hour: 8,
	minute: 0,
	second: 0,
}

/**
 * @param {Date} date
 * @returns {string} 'YYYY:MM:DD HH:mm:ss'
 */
const formatExifDate = date => {
	let year = "" + date.getFullYear();
	let month = "" + (date.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
	let day = "" + date.getDate(); if (day.length == 1) { day = "0" + day; }
	let hour = "" + date.getHours(); if (hour.length == 1) { hour = "0" + hour; }
	let minute = "" + date.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
	let second = "" + date.getSeconds(); if (second.length == 1) { second = "0" + second; }
	return year + ":" + month + ":" + day + " " + hour + ":" + minute + ":" + second;
}

const generateNextDate = () => {
	const date = new Date(
		currentDate.year, currentDate.month - 1, currentDate.day,
		currentDate.hour, currentDate.minute, currentDate.second
	);
	if (++currentDate.second >= 60) {
		currentDate.second = 0;
		currentDate.minute++;
	}
	if (currentDate.minute >= 60) {
		currentDate.minute = 0;
		currentDate.hour++;
	}
	return formatExifDate(date);
}


/**
 * By default filenames are sorted like: ['img_1', 'img_10', 'img_2', 'img_3', ...]
 * This function will sort the array properly like: ['img_1', 'img_2', ..., 'img_10']
 */
const fileNamesNaturalSort = (a, b) => {
	return (Number(a.match(/(\d+)/g)[0]) - Number((b.match(/(\d+)/g)[0])));
}

const getImages = () => new Promise((resolve, reject) => {
	fs.readdir(imagesDir, (error, files) => {
		if (error) reject(error);
		resolve(files.sort(fileNamesNaturalSort));
	})
});

const replaceDates = (exifProcess, imagesArray, index) => new Promise((resolve, reject) => {
	dataToReplace.DateTimeOriginal = dataToReplace.CreateDate = dataToReplace.ModifyDate = generateNextDate();
	exifProcess.writeMetadata(imageFilePath(imagesArray[index]), dataToReplace, ['overwrite_original'])
		.then(() => {
			index++;
			console.log(`Done: ${index} of ${imagesArray.length}`);
			if (imagesArray.length === index) {
				resolve();
			} else {
				replaceDates(exifProcess, imagesArray, index).then(resolve).catch(reject);
			}
		})
		.catch(reject);
});

exifProcess.open()
	.then(getImages)
	// .then((imagesArray) => exifProcess.readMetadata(imagesArray[0], ['-File:all'])) // read data of first file
	// .then(console.log) // log the data to the console
	.then((imagesArray) => replaceDates(exifProcess, imagesArray, 0)) // This will write exif data to your files.
	.then(() => exifProcess.close())
	.then(() => console.log('ALL DONE!'))
	.catch(console.error);
