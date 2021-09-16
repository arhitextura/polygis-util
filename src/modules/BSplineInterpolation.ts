/*---------------------------------------------------------------------------
author: ROMPOS
owner: Centrul National de Cartografiere
source: https://rompos.ro/index.php/informatii-tehnice/transdatro/send/2-software/52-transdatro-cod-sursa-v1-04
translated to javascript by Arh. Mihalcea Bogdan Daniel
----------------------------------------------------------------------------*/

export function DoBSInterpolation(ff: number[], az: number[]): number {
    let cf: number[] = new Array(17);
    //#region Array Calculations

    cf[0] = 0;
    cf[1] = az[6];
    cf[2] = az[7];
    cf[3] = az[10];
    cf[4] = az[11];

    //{Derivatives in the East-direction and the North-direction}
    cf[5] = (-az[8] + 4 * az[7] - 3 * az[6]) / 2;
    cf[6] = (3 * az[7] - 4 * az[6] + az[5]) / 2;
    cf[7] = (-az[12] + 4 * az[11] - 3 * az[10]) / 2;
    cf[8] = (3 * az[11] - 4 * az[10] + az[9]) / 2;
    cf[9] = (-az[14] + 4 * az[10] - 3 * az[6]) / 2;
    cf[10] = (-az[15] + 4 * az[11] - 3 * az[7]) / 2;
    cf[11] = (3 * az[10] - 4 * az[6] + az[2]) / 2;
    cf[12] = (3 * az[11] - 4 * az[7] + az[3]) / 2;

    //{Equations for the cross derivative}
    cf[13] = (az[1] + az[11] - (az[3] + az[9])) / 4;
    cf[14] = (az[2] + az[12] - (az[4] + az[10])) / 4;
    cf[15] = (az[5] + az[15] - (az[7] + az[13])) / 4;
    cf[16] = (az[6] + az[16] - (az[8] + az[14])) / 4;

    //{Determining the 16 unknown coefficients of the interpolated surface}
    az[1] = cf[1];
    az[2] = cf[5];
    az[3] = -3 * cf[1] + 3 * cf[2] - 2 * cf[5] - cf[6];
    az[4] = 2 * cf[1] - 2 * cf[2] + cf[5] + cf[6];
    az[5] = cf[9];
    az[6] = cf[13];
    az[7] = -3 * cf[9] + 3 * cf[10] - 2 * cf[13] - cf[14];
    az[8] = 2 * cf[9] - 2 * cf[10] + cf[13] + cf[14];
    az[9] = -3 * cf[1] + 3 * cf[3] - 2 * cf[9] - cf[11];
    az[10] = -3 * cf[5] + 3 * cf[7] - 2 * cf[13] - cf[15];
    az[11] =
        9 * cf[1] -
        9 * cf[2] -
        9 * cf[3] +
        9 * cf[4] +
        6 * cf[5] +
        3 * cf[6] -
        6 * cf[7] -
        3 * cf[8] +
        6 * cf[9] -
        6 * cf[10] +
        3 * cf[11] -
        3 * cf[12] +
        4 * cf[13] +
        2 * cf[14] +
        2 * cf[15] +
        cf[16];
    az[12] =
        -6 * cf[1] +
        6 * cf[2] +
        6 * cf[3] -
        6 * cf[4] -
        3 * cf[5] -
        3 * cf[6] +
        3 * cf[7] +
        3 * cf[8] -
        4 * cf[9] +
        4 * cf[10] -
        2 * cf[11] +
        2 * cf[12] -
        2 * cf[13] -
        2 * cf[14] -
        cf[15] -
        cf[16];
    az[13] = 2 * cf[1] - 2 * cf[3] + cf[9] + cf[11];
    az[14] = 2 * cf[5] - 2 * cf[7] + cf[13] + cf[15];
    az[15] =
        -6 * cf[1] +
        6 * cf[2] +
        6 * cf[3] -
        6 * cf[4] -
        4 * cf[5] -
        2 * cf[6] +
        4 * cf[7] +
        2 * cf[8] -
        3 * cf[9] +
        3 * cf[10] -
        3 * cf[11] +
        3 * cf[12] -
        2 * cf[13] -
        cf[14] -
        2 * cf[15] -
        cf[16];
    az[16] =
        4 * cf[1] -
        4 * cf[2] -
        4 * cf[3] +
        4 * cf[4] +
        2 * cf[5] +
        2 * cf[6] -
        2 * cf[7] -
        2 * cf[8] +
        2 * cf[9] -
        2 * cf[10] +
        2 * cf[11] -
        2 * cf[12] +
        cf[13] +
        cf[14] +
        cf[15] +
        cf[16];
    //#endregion
    let shiftValue: number = 0;
    for (let i = 1; i < cf.length; i++) {
        shiftValue = shiftValue + az[i] * ff[i];
    }
    return shiftValue;
}
