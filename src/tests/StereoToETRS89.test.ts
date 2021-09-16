import { StereoToETRS89 } from "../modules/StereoToETRS89";
import {
    ConvertStereoToETRS89,
    ConvertETRS89ToStereo70,
    ETRS89Coordinates,
    StereoCoordinates,
} from "../modules/FunctionStereoToETRS89";

test("STEREO -> ETRS90: Should retun a object type of ETRS89Coordinates:", () => {
    let convertedCoordinates: ETRS89Coordinates = ConvertStereoToETRS89(
        500000,
        500000
    );
    console.log(convertedCoordinates);
    expect(convertedCoordinates.phi).toBeCloseTo(46, 1);
});

test("ETRS89 -> STEREO: Should retun a object type of ETRS89Coordinates:", () => {
    let convertedCoordinates: StereoCoordinates = ConvertETRS89ToStereo70(
        45.9997182158556,
        24.998446047221098
    );
    console.log(convertedCoordinates);
    expect(convertedCoordinates.East).toBeCloseTo(500000, 1);
});
