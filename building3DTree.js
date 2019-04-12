function buildThree_Y(vz, lz, rz, vx, lx, rx, vy, ly, ry, array, fn){
    if (ly == ry){
        if (lx == rx && lz == rz){
            t[vz][vx][vy] = array[lz][lx][ly];
        }
        if (lx == rx && lz != rz){
            t[vz][vx][vy] = fn(t[2 * vz][vx][vy], t[2 * vz + 1][vx][vy]);
        }
        if (lx != rx && lz == rz){
            t[vz][vx][vy] = fn(t[vz][2 * vx][vy], t[vz][2 * vx + 1][vy]);
        }
        if (lx != rx && lz != rz){
            t[vz][vx][vy] = fn(
                fn(t[2 * vz][2 * vx][vy], t[2 * vz + 1][2 * vx][vy]),
                fn(t[2 * vz][2 * vx + 1][vy], t[2 * vz + 1][2 * vx + 1][vy]));
            return;
        }
    }else{
        // if (ry > ly){
        //     let vmiddleY = Math.floor((ly + ry) / 2);
        //     buildThree_Y(vz, lz, rz, vx, lx, rx,2 * vy, ly, vmiddleY, array, fn);
        //     buildThree_Y(vz, lz, rz, vx, lx, rx,2 * vy + 1, vmiddleY + 1, ry, array, fn);
        // }
        // t[vz][vx][vy] = fn(t[vz][vx][2 * vy], t[vz][vx][2 * vy + 1]);
        let vmiddleY = Math.floor((ly + ry) / 2);
        if (vmiddleY == -1){ return; }                            //CHEAT!!!
        buildThree_Y(vz, lz, rz, vx, lx, rx,2 * vy, ly, vmiddleY, array, fn);
        buildThree_Y(vz, lz, rz, vx, lx, rx,2 * vy + 1, vmiddleY + 1, ry, array, fn);
        t[vz][vx][vy] = fn(t[vz][vx][2 * vy], t[vz][vx][2 * vy + 1]);
    }
}

function buildThree_X(vz, lz, rz, vx, lx, rx, array, fn){
    if (lx != rx){
        let vmiddleX = Math.floor(lx + (rx - lx) / 2);
        buildThree_X(vz, lz, rz, 2 * vx, lx, vmiddleX, array, fn);
        buildThree_X(vz, lz, rz, 2 * vx + 1, vmiddleX + 1, rx, array, fn);
    }
    buildThree_Y(vz, lz, rz, vx, lx, rx, 1, 0, array[0][0].length - 1, array, fn);           //ry = 1
}

function buildThree_Z(vz, lz, rz, array, fn){
    if (lz != rz){
        let vmiddleZ = Math.floor(lz + (rz - lz) / 2);
        buildThree_Z(2 * vz, lz, vmiddleZ, array, fn);
        buildThree_Z(2 * vz + 1, vmiddleZ + 1, rz, array, fn);
    }
    buildThree_X(vz, lz, rz, 1, 0, array[0].length - 1, array, fn);       //rx = 3
}

function sum_z(vx, vy, vz, start, end, lz, rz, N, array, fn){     //z
    if (rz < start || end < lz) { return N; }

    if (start >= lz && end <= rz){
        return t[vx][vy][vz];
    }
    let mid = Math.floor(start + (end - start) / 2);
    let p1 = sum_z(vx, vy, 2 * vz, start, mid, lz, rz, N, array, fn);
    let p2 = sum_z(vx, vy, 2 * vz + 1, mid + 1, end, lz, rz, N, array, fn);
    let result = fn(p1, p2);
    return fn(N, result);
}

function sum_y(vx, vy, start, end, ly, ry, lz, rz, N, array, fn){     //y, z
    if (ry < start || end < ly) { return N; }

    if(start >= ly && end <= ry)
    {
        return sum_z(vx, vy, 1, 0, array[0][0].length - 1, lz, rz, N, array, fn);            //end 1
    }
    let mid = Math.floor(start + (end - start) / 2);
    let p1 = sum_y(vx, 2 * vy, start, mid, ly, ry, lz, rz, N, array, fn);
    let p2 = sum_y(vx, 2 * vy + 1, mid + 1, end, ly, ry, lz, rz, N, array, fn);
    let result = fn(p1, p2);
    return fn(N, result);
}

function sum_x(vx, start, end, lx, rx, ly, ry, lz, rz, N, array, fn){     //y, x, z
    if (rx < start || end < lx) { return N; }

    if(lx <= start && end <= rx)
    {
        return sum_y(vx, 1,  0, array[0].length - 1, ly, ry, lz, rz, N, array, fn);       //end = 3
    }
    let mid = Math.floor(start + (end - start) / 2);
    let p1 = sum_x(2 * vx, start, mid, lx, rx, ly, ry, lz, rz, N, array, fn);
    let p2 = sum_x(2 * vx  + 1, mid + 1, end, lx, rx, ly, ry, lz, rz, N, array, fn);
    let result = fn(p1, p2);
    return fn(N, result);
}