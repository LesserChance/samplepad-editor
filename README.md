# SamplePad Kit Editor
![](https://img.shields.io/github/v/release/lesserchance/samplepad-editor?include_prereleases)
![](https://img.shields.io/github/downloads/lesserchance/samplepad-editor/total)

## Getting SamplePad Kit Editor
SamplePad Kit Editor is released via the GitHub [releases](https://github.com/LesserChance/samplepad-editor/releases) page.

The current version is v.4
([Download v.4 for Mac](https://github.com/LesserChance/samplepad-editor/releases/download/v0.4/SamplePad.Kit.Editor-0.4.0-mac.zip) or [Download v.4 for PC](https://github.com/LesserChance/samplepad-editor/releases/download/v0.4/SamplePad.Kit.Editor.Setup.0.4.0.exe))

## Overview
SamplePad Kit Editor is an application that allows you to create and edit custom drum kits for the [Alesis SamplePad Pro](https://www.alesis.com/products/view2/samplepad-pro) directly on your Mac or PC. It uses an intuitive drap and drop interface to quickly and easily create custom drum kits. All pad parameters are available to edit, and it's significantly easier than scrolling through all the details on the SamplePad itself.

<img src="https://raw.githubusercontent.com/LesserChance/samplepad-editor/master/docs/SamplePad%20Kit%20Editor%20v2.png" alt="v.1 screenshot" width="400">

## How to use SamplePad Kit Editor
### Getting Started
1. Open SamplePad Kit Editor
1. Insert your SamplePad SD card into your computer
1. Click the "Load SD Card" button and select the root directory of the SD card

This will load any existing samples and kits on the SD card for you to edit. It's generally best to start with a blank SD card, as that allows for better filename organization (see "importing samples" below.)

### Importing Samples
Imported samples are automatically formatted as appropriate (16bit, 44.1k 8-character wav.) After importing samples through SamplePad Kit Editor you'll still see the original file name (in the case that its greater than 8 characters) allowing for better, more intuitive sample organization.
1. Click import samples at the bottom of the sample section
1. Select one or more .wav files, or a directory
1. If a directory is selected all wav files located within it (or any sub directories) will be imported

### Editing a Kit
1. Select a kit from the dropdown to edit an existing kit. You can also import a kit from an existing `.kit` not on the SD card, or create a kit from scratch
1. Search through samples on the left, and drag them on to an individual pad to set that pad's sample
1. Tweak pad parameters by twisting knobs (click, hold, and drag an icon up and down to adjust values)
1. Change mute groups by selecting 1 of 16 possible groups
1. Access Layer B sample and velocity parameters by clicking on the dropdown icon on the right

Once you're satisfied, save your kit. Saving it as a new kit will create a new `.kit` file and not affect the original. Put it into your SamplePad and try it out!

## Helping Out
### Testing
Samplepad Kit Editor is currently prerelease. I've only been able to test on my own SampleRack so I'm not sure if the `.kit` file format differs on other machines or firmware versions. If you have a SamplePad, Samplepad Pro, or SampleRack, please let me know if you try it out and experience any issues. Make sure to back up your SD card just in case!

I'd also love to know if everything works fine for you. You can contact me through my [email on github](https://github.com/LesserChance). 

### Compiling
Want to build the app yourself?

```
git clone https://github.com/LesserChance/samplepad-editor.git
cd samplepad-editor
yarn install
yarn run electron-dev
```
