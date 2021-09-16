import { DefaultValues as dV } from "./DefaultValues";
import { Interpolation2D } from "./Interpolation";
import { Helmert2D } from "./Helmert2D";
import { StereoNEFiLa } from "./StereoNEFiLa";
import { StereoFiLaNE } from "./StereoFiLaNE";

export interface ETRS89Coordinates {
    phi: number;
    la: number;
}

export interface StereoCoordinates {
    North: number;
    East: number;
    type: number;
}
function Transformation(East: number, North: number, nameGrid: string): void {
    try {
        let interpolation2D: Interpolation2D = new Interpolation2D(
            East,
            North,
            nameGrid
        );
        East = East - interpolation2D.ShiftValueE;
        North = North - interpolation2D.ShiftValueN;
    } catch (error) {
        throw error;
    }
}

/**
 * Handles Stereo 70 or 30 transformation to ETRS89 Radians
 * @param East The east coordinate
 * @param North The north coordinate
 * @param stereo30or70 Choose between 30 or 70 stereo system
 * @returns ETRS89Coordinates with phi and la
 *
 */
export function ConvertStereoToETRS89(
    pEast: number,
    pNorth: number,
    stereo30or70: number = 70
): ETRS89Coordinates {
    let nameGrid: string = dV.NameFilegrd_R;
    if (stereo30or70 == 70) {
        Transformation(pEast, pNorth, nameGrid);
        let H2D: Helmert2D = new Helmert2D(
            dV.tE_St70_OS,
            dV.tN_St70_OS,
            dV.dm_St70_OS,
            dV.Rz_St70_OS
        );
        let Helmert2DLatLon = H2D.DoTransformation(pEast, pNorth);
        pEast = Helmert2DLatLon.Eastt;
        pNorth = Helmert2DLatLon.Northt;
    }
    if (stereo30or70 == 30) {
        nameGrid = dV.NameFilegrd_B;
        Transformation(pEast, pNorth, nameGrid);
        let H2D: Helmert2D = new Helmert2D(
            dV.tE_St30_OS,
            dV.tN_St30_OS,
            dV.Rz_St30_OS,
            dV.dm_St30_OS
        );
        let Helmert2DLatLon = H2D.DoTransformation(pEast, pNorth);
        pEast = Helmert2DLatLon.Eastt;
        pNorth = Helmert2DLatLon.Northt;
    }
    let stNEFiLA: StereoNEFiLa = new StereoNEFiLa(dV.A_ETRS89, dV.INV_F_ETRS89);
    let FiLa = stNEFiLA.DoConversion2(pNorth, pEast);
    return { phi: (FiLa.Fi * 180) / Math.PI, la: (FiLa.La * 180) / Math.PI };
}

/**
 * Handles ETRS89 transformation to Stereo 70 or 30 Radians
 * @param phi The east coordinate
 * @param la The north coordinate
 * @param stereo30or70 Choose between 30 or 70 stereo system
 * @returns StereoCoordinates with North and East
 *
 */
export function ConvertETRS89ToStereo70(
    phi: number,
    la: number,
    type70or30: number = 70
): StereoCoordinates {
    let EastS: number = 0;
    let NorthS: number = 0;
    let nameGrid: string = dV.NameFilegrd_R;
    phi = (phi * Math.PI) / 180;
    la = (la * Math.PI) / 180;
    let result: StereoCoordinates = { North: 0, East: 0, type: type70or30 };
    let stFiLaNE = new StereoFiLaNE(dV.A_ETRS89, dV.INV_F_ETRS89);
    let conversionValues = stFiLaNE.DoConversion1(phi, la);
    NorthS = conversionValues.North;
    EastS = conversionValues.East;

    if (type70or30 == 70) {
        let H2D = new Helmert2D(
            dV.tE_OS_St70,
            dV.tN_OS_St70,
            dV.dm_OS_St70,
            dV.Rz_OS_St70
        );
        let Helm2DLatLon = H2D.DoTransformation(EastS, NorthS);
        result.East = Helm2DLatLon.Eastt;
        result.North = Helm2DLatLon.Northt;
    }
    if (type70or30 == 30) {
        let H2D = new Helmert2D(
            dV.tE_OS_St30,
            dV.tN_OS_St30,
            dV.dm_OS_St30,
            dV.Rz_OS_St30
        );
        let Helm2DLatLon = H2D.DoTransformation(EastS, NorthS);
        result.East = Helm2DLatLon.Eastt;
        result.North = Helm2DLatLon.Northt;
        nameGrid = dV.NameFilegrd_B;
    }
    try {
        let interpolation2D: Interpolation2D = new Interpolation2D(
            result.East,
            result.North,
            nameGrid
        );
        result.East += interpolation2D.ShiftValueE;
        result.North += interpolation2D.ShiftValueE;

        return result;
    } catch (error) {
        throw error;
    }
}
