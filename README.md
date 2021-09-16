# polygis  

## Description

This package makes conversions between the listed cooridnate systems:
ETRS89 -> Stereo 70
ETRS89 -> Stereo 30
Stere 70 -> ETRS89
Stere 30 -> ETRS89

Notice:  ETRS89 conversion are from radians not degrees.

## Usage  


Installation:  

``` javascript  
npm install polygis;
```

JavaScript:  

``` javascript  
const polygis = require("polygis");

let newCoordinates = polygis.ConvertETRS89ToStereo70(46, 25);
console.log(newCoordinates);
//Outputs to: { North: 500031.19039881293, East: 500120.22355099773, type: 70 }

```

TypeScript:  

``` javascript  
import {* as polygis} from "polygis";
```
