/*---------------------------------------------------------------------------
author: ROMPOS
owner: Centrul National de Cartografiere
source: https://rompos.ro/index.php/informatii-tehnice/transdatro/send/2-software/52-transdatro-cod-sursa-v1-04
translated to javascript by Arh. Mihalcea Bogdan Daniel
----------------------------------------------------------------------------*/

import fs from "fs";
import path from "path";
//const util = require("util");
import { DoBSInterpolation } from "./BSplineInterpolation";
export class Interpolation1D {
    private phi: number;
    private la: number;
    fileName: string;
    private shiftValue1: number = 0;

    private nc: number[] = new Array(17);
    private ff: number[] = new Array(17);
    constructor(cphi: number, cla: number, cFileName: string) {
        this.phi = cphi;
        this.la = cla;
        this.fileName = cFileName;
    }
    get ShiftValue() {
        return this.shiftValue1;
    }
    get GetFF() {
        return this.ff;
    }
    get GetNC() {
        return this.nc;
    }
    /**
     * Reads Binary File
     * @param start Starting point from binary GRD file
     * @returns A value read from specified GRD file
     */
    readFP(start: number): number {
        let a, b, c, d, e, f, g, h;
        try {
            let binaryFile = fs.readFileSync(
                //TODO - MAKE THIS REFERABLE TO THE NEEDED GRC FILE
                path.join(__dirname, "../gis_files/", this.fileName)
            );

            binaryFile = binaryFile.slice(start, start + 8);
            a = binaryFile.readInt8(0);
            b = binaryFile.readInt8(1);
            c = binaryFile.readInt8(2);
            d = binaryFile.readInt8(3);
            e = binaryFile.readInt8(4);
            f = binaryFile.readInt8(5);
            g = binaryFile.readInt8(6);
            h = binaryFile.readInt8(7);
            return Buffer.from([h, g, f, e, d, c, b, a]).readDoubleBE();
        } catch (err) {
            throw err;
        }
    }

    LoadArrays() {
        let xk: number, yk: number; // xk - East, yk - North
        let nrjx: number, nodcolx: number, nodliny: number;
        let minE: number,
            maxE: number,
            minN: number,
            maxN: number,
            stepE: number,
            stepN: number;

        minE = this.readFP(0);
        maxE = this.readFP(8);
        minN = this.readFP(16);
        maxN = this.readFP(24);
        stepE = this.readFP(32);
        stepN = this.readFP(40);
        nrjx = Math.round((maxE - minE) / stepE + 1);
        if (
            this.la <= minE + stepE ||
            this.la >= maxE - stepE ||
            this.phi <= minN + stepN ||
            this.phi >= maxN - stepN
        ) {
            throw new Error("OUTSIDE BORDER");
        }
        nodcolx = Math.abs(Math.round((this.la - minE) / stepE));
        nodliny = Math.abs(Math.round((this.phi - minN) / stepN));
        xk = minE + nodcolx * stepE;
        yk = minN + nodliny * stepN;
        //Relative coornates of point x
        xk = (this.la - xk) / stepE;
        yk = (this.phi - yk) / stepN;

        //{Parameters of bicubic spline surface}
        this.ff[1] = 1;
        this.ff[2] = xk;
        this.ff[3] = xk * xk;
        this.ff[4] = xk * xk * xk;
        this.ff[5] = yk;
        this.ff[6] = xk * yk;
        this.ff[7] = xk * xk * yk;
        this.ff[8] = xk * xk * xk * yk;
        this.ff[9] = yk * yk;
        this.ff[10] = xk * yk * yk;
        this.ff[11] = xk * xk * yk * yk;
        this.ff[12] = xk * xk * xk * yk * yk;
        this.ff[13] = yk * yk * yk;
        this.ff[14] = xk * yk * yk * yk;
        this.ff[15] = xk * xk * yk * yk * yk;
        this.ff[16] = xk * xk * xk * yk * yk * yk;

        //{Positions in grid file}
        this.nc[6] = nodliny * nrjx + nodcolx + 1;
        this.nc[1] = (nodliny - 1) * nrjx + nodcolx;
        this.nc[2] = (nodliny - 1) * nrjx + nodcolx + 1;
        this.nc[3] = (nodliny - 1) * nrjx + nodcolx + 2;
        this.nc[4] = (nodliny - 1) * nrjx + nodcolx + 3;
        this.nc[5] = nodliny * nrjx + nodcolx;
        this.nc[7] = nodliny * nrjx + nodcolx + 2;
        this.nc[8] = nodliny * nrjx + nodcolx + 3;
        this.nc[9] = (nodliny + 1) * nrjx + nodcolx;
        this.nc[10] = (nodliny + 1) * nrjx + nodcolx + 1;
        this.nc[11] = (nodliny + 1) * nrjx + nodcolx + 2;
        this.nc[12] = (nodliny + 1) * nrjx + nodcolx + 3;
        this.nc[13] = (nodliny + 2) * nrjx + nodcolx;
        this.nc[14] = (nodliny + 2) * nrjx + nodcolx + 1;
        this.nc[15] = (nodliny + 2) * nrjx + nodcolx + 2;
        this.nc[16] = (nodliny + 2) * nrjx + nodcolx + 3;
    }

    DoInterpolation1D() {
        let az = new Array(17);
        let value = 0;
        try {
            this.LoadArrays();
            for (let ii = 1; ii <= 16; ii++) {
                value = this.readFP(this.nc[ii] * 8 - 8 + 48);
                if (Math.round(value) == 999) {
                    throw new Error("Outside Border");
                }
                az[ii] = value;
            }
            this.shiftValue1 = DoBSInterpolation(this.ff, az);
        } catch (er) {
            return er;
        }
    }
}
export class Interpolation2D extends Interpolation1D {
    private shiftValueE: number = 0;
    private shiftValueN: number = 0;
    constructor(cEast: number, cNorth: number, cFileName: string) {
        super(cNorth, cEast, cFileName);
        this.fileName = cFileName;
        this.DoInterpolation2D();
    }
    get ShiftValueE() {
        return this.shiftValueE;
    }
    get ShiftValueN() {
        return this.shiftValueN;
    }
    DoInterpolation2D() {
        let ax: number[] = new Array(17);
        let ay: number[] = new Array(17);
        let value: number = 0;
        try {
            this.LoadArrays();
            for (let ii = 1; ii <= 16; ii++) {
                value = this.readFP(super.GetNC[ii] * 16 - 16 + 48);
                if (Math.round(value) == 999) {
                    throw new Error("Outside border.");
                }
                ax[ii] = value;
                value = this.readFP(super.GetNC[ii] * 16 - 8 + 48);
                if (Math.round(value) == 999) {
                    throw new Error("Outside border.");
                }
                ay[ii] = value;
            }
        } catch (error) {
            throw error;
        }
        this.shiftValueE = DoBSInterpolation(this.GetFF, ax);
        this.shiftValueN = DoBSInterpolation(this.GetFF, ay);
    }
}
