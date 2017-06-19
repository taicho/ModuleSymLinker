# ModuleSymLinker
A tool for easily creating a sym link to a node_modules folder of your choosing. Originally created for use with Google Drive.

## Installation

```npm i -g modulesymlinker```

## Usage

Simply go to the root directory of your project where package.json resides and run modulesymlinker. This will scan to find the package.json then create a sym link called "node_modules" in the directory and create a corresponding directory in your OS' home directory (/{HomeDirectory}/NodeModuleArchive/{ProjectName}) automagically. This will prevent Google Drive from trying to backup the node_modules directory.

## Options
* No option
   * This will create a node_modules sym link in the current folder and create a corresponding node_modules directory in your NodeModuleArchive directory with the same name as the current directory.
* --autoscan
   * This will scan for package.json in the current directory and any subdirectories creating the sym link and corresponding directories in NodeModuleArchive along the way.
* --destination
   * This allows you to specify an absolute path of where you want your "NodeModuleArchive" to exist.

## License 
MIT
