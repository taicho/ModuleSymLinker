#!/usr/bin/env node
const path = require('path');
const os = require('os')
const fs = require('fs');
function getLastPathName(base)
{
	const pathSplit = base.split(path.sep);
	return pathSplit[pathSplit.length - 1];
}
const defaultSourceDirectoryBase = path.join(os.homedir(), "NodeModuleArchive");
const defaultSourceDirectory = path.join(defaultSourceDirectoryBase, getLastPathName(process.cwd()));

function getArgs() {
	const result = {};
	const argArray = process.argv.slice(2);
	for (var i = 0, len = argArray.length; i < len; i++) {
		var value = argArray[i].toLowerCase();
		switch (value) {
			case "--destination":
				result["destination"] = argArray[i + 1];
				continue;
			case "--autoscan":
				result["autoscan"] = true;
				continue;
		}
	}
	return result;
}

function getAllPackagePaths(startDirectory, fileArray)
{
	if(!fileArray)
	{
		fileArray = [];
	}
	startDirectory = path.resolve(startDirectory);
	let results = fs.readdirSync(startDirectory);
	results.forEach((diskPath)=>{
		let resolvedPath = path.join(startDirectory,diskPath);
		if(fs.lstatSync(resolvedPath).isDirectory())
		{
			getAllPackagePaths(resolvedPath,fileArray);
		}
		else if(diskPath.toLowerCase() === 'package.json')
		{
			fileArray.push(startDirectory);
		}
	});
	return fileArray;
}

function mkdirRecursive(targetDir) {
	targetDir.split(path.sep).forEach((dir, index, splits) => {
		const parent = splits.slice(0, index).join(path.sep);
		const dirPath = path.resolve(parent, dir);
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath);
		}
	});
}


function createLink(targetDirectory, sourceDirectory) {
	sourceDirectory = path.join(sourceDirectory, 'node_modules');
	
	if (!fs.existsSync(sourceDirectory)) {
		mkdirRecursive(sourceDirectory);
		console.log(`Created ${sourceDirectory}.`);
	}
	const resolvedTargetDirectory = path.resolve(targetDirectory)
	targetDirectory = path.join(resolvedTargetDirectory, "node_modules");
	if (!fs.existsSync(targetDirectory)) {
		fs.symlinkSync(sourceDirectory, targetDirectory, 'dir');
		console.log(`Sym Link Created in ${resolvedTargetDirectory}`);
	} else {
		console.log(`node_modules already exists in ${resolvedTargetDirectory}.`);
	}
}

const args = getArgs();
if (args.autoscan) {
	const scanResults = getAllPackagePaths('./');
	scanResults.forEach((result)=>{
		let pathName = getLastPathName(result);
		let source = args.destination ? path.join(args.destination,pathName) : path.join(defaultSourceDirectoryBase,pathName);
		createLink(result,source);
	});

} else {
	let directory = args.destination ? args.destination : defaultSourceDirectory;
	createLink("./", directory);
}