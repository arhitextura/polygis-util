import { DefaultValues as dV } from "../modules/DefaultValues";
import { Interpolation2D } from "../modules/Interpolation";
import { Helmert2D } from "../modules/Helmert2D";
import { StereoNEFiLa } from "../modules/StereoNEFiLa";
export class StereoToETRS89 {
    private phi: number;
    private la: number;
    private stereoType: number;
    private East: number;
    private North: number;
    private nameGrid: string = dV.NameFilegrd_R;

    constructor(East: number, North: number, stereo30or70: number = 70) {
        this.stereoType = stereo30or70;
        this.East = East;
        this.North = North;
        if (this.stereoType == 70) {
            this.nameGrid = dV.NameFilegrd_R;
            this.DoTransformation();
            let H2D: Helmert2D = new Helmert2D(
                dV.tE_St70_OS,
                dV.tN_St70_OS,
                dV.dm_St70_OS,
                dV.Rz_St70_OS
            );
            let Helmert2DLatLon = H2D.DoTransformation(this.East, this.North);
            this.East = Helmert2DLatLon.Eastt;
            this.North = Helmert2DLatLon.Northt;
        }
        if (this.stereoType == 30) {
            this.nameGrid = dV.NameFilegrd_B;
            this.DoTransformation();
            let H2D: Helmert2D = new Helmert2D(
                dV.tE_St30_OS,
                dV.tN_St30_OS,
                dV.Rz_St30_OS,
                dV.dm_St30_OS
            );
            let Helmert2DLatLon = H2D.DoTransformation(this.East, this.North);
            this.East = Helmert2DLatLon.Eastt;
            this.North = Helmert2DLatLon.Northt;
        }
        let stNEFiLA: StereoNEFiLa = new StereoNEFiLa(
            dV.A_ETRS89,
            dV.INV_F_ETRS89
        );
        let FiLa = stNEFiLA.DoConversion2(this.North, this.East);
        this.phi = FiLa.Fi;
        this.la = FiLa.La;
        this.phi = (this.phi * 180) / Math.PI;
        this.la = (this.la * 180) / Math.PI;
    }
    get Phi(): number {
        return this.phi;
    }
    get La(): number {
        return this.la;
    }
    DoTransformation() {
        try {
            let interpolation2D: Interpolation2D = new Interpolation2D(
                this.East,
                this.North,
                this.nameGrid
            );
            this.East = this.East - interpolation2D.ShiftValueE;
            this.North = this.North - interpolation2D.ShiftValueN;
        } catch (error) {
            return error;
        }
    }
}
